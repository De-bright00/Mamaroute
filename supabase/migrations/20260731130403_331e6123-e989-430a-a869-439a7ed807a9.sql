create table if not exists public.user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.user_credits to authenticated;
grant all on public.user_credits to service_role;

alter table public.user_credits enable row level security;

create policy "users read own balance" on public.user_credits
  for select to authenticated using (auth.uid() = user_id);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('purchase', 'usage', 'refund')),
  amount integer not null,
  balance_after integer not null,
  paystack_reference text unique,
  status text not null default 'completed' check (status in ('pending','completed','failed')),
  created_at timestamptz not null default now()
);

grant select on public.credit_transactions to authenticated;
grant all on public.credit_transactions to service_role;

alter table public.credit_transactions enable row level security;

create policy "users read own transactions" on public.credit_transactions
  for select to authenticated using (auth.uid() = user_id);

create index if not exists idx_credit_transactions_user
  on public.credit_transactions(user_id, created_at desc);

create trigger user_credits_touch_updated_at
  before update on public.user_credits
  for each row execute function public.touch_updated_at();

create or replace function public.deduct_ai_credit(p_user_id uuid, p_amount integer default 1)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_balance integer;
begin
  update public.user_credits
  set balance = balance - p_amount, updated_at = now()
  where user_id = p_user_id and balance >= p_amount
  returning balance into v_new_balance;

  if v_new_balance is null then
    raise exception 'INSUFFICIENT_CREDITS';
  end if;

  insert into public.credit_transactions (user_id, type, amount, balance_after)
  values (p_user_id, 'usage', -p_amount, v_new_balance);

  return v_new_balance;
end;
$$;

create or replace function public.add_ai_credits(
  p_user_id uuid, p_amount integer, p_paystack_reference text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_balance integer;
begin
  if exists (
    select 1 from public.credit_transactions
    where paystack_reference = p_paystack_reference
  ) then
    select balance into v_new_balance from public.user_credits where user_id = p_user_id;
    return v_new_balance;
  end if;

  insert into public.user_credits (user_id, balance)
  values (p_user_id, p_amount)
  on conflict (user_id)
  do update set balance = public.user_credits.balance + p_amount, updated_at = now()
  returning balance into v_new_balance;

  insert into public.credit_transactions (user_id, type, amount, balance_after, paystack_reference)
  values (p_user_id, 'purchase', p_amount, v_new_balance, p_paystack_reference);

  return v_new_balance;
end;
$$;

create or replace function public.refund_ai_credit(p_user_id uuid, p_amount integer default 1)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_balance integer;
begin
  update public.user_credits
  set balance = balance + p_amount, updated_at = now()
  where user_id = p_user_id
  returning balance into v_new_balance;

  if v_new_balance is null then
    insert into public.user_credits (user_id, balance)
    values (p_user_id, p_amount)
    returning balance into v_new_balance;
  end if;

  insert into public.credit_transactions (user_id, type, amount, balance_after)
  values (p_user_id, 'refund', p_amount, v_new_balance);

  return v_new_balance;
end;
$$;

revoke all on function public.deduct_ai_credit(uuid, integer) from public, anon, authenticated;
revoke all on function public.add_ai_credits(uuid, integer, text) from public, anon, authenticated;
revoke all on function public.refund_ai_credit(uuid, integer) from public, anon, authenticated;
grant execute on function public.deduct_ai_credit(uuid, integer) to service_role;
grant execute on function public.add_ai_credits(uuid, integer, text) to service_role;
grant execute on function public.refund_ai_credit(uuid, integer) to service_role;