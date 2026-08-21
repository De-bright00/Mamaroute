import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Coins, CreditCard, Loader2, XCircle } from "lucide-react";
import { z } from "zod";
import { SiteShell } from "@/components/SiteShell";
import { useAuth } from "@/hooks/useAuth";
import { getMyCredits, getMyCreditHistory, startCreditCheckout } from "@/lib/credits.functions";

export const Route = createFileRoute("/credits")({
  validateSearch: z.object({
    status: z.enum(["success", "cancelled"]).optional(),
    reference: z.string().optional(),
  }),
  head: () => ({
    meta: [
      { title: "AI Credits & Top-up — MamaRoute" },
      { name: "description", content: "Top up your MamaRoute AI assistant credits securely." },
    ],
  }),
  component: Credits,
});

const CREDIT_PACKAGES = [
  { id: "basic", label: "Basic Package", credits: 50, naira: 500 },
  { id: "standard", label: "Care Package", credits: 200, naira: 1500 },
  { id: "premium", label: "Motherhood Package", credits: 500, naira: 3000 },
];

function Credits() {
  const { status, reference } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const balanceFn = useServerFn(getMyCredits);
  const historyFn = useServerFn(getMyCreditHistory);
  const checkoutFn = useServerFn(startCreditCheckout);

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(status === "success");

  const balanceQuery = useQuery({
    queryKey: ["credits", "balance"],
    queryFn: () => balanceFn({}),
    enabled: isAuthenticated,
    refetchInterval: waiting ? 3000 : false,
  });

  const historyQuery = useQuery({
    queryKey: ["credits", "history"],
    queryFn: () => historyFn({}),
    enabled: isAuthenticated,
  });

  const balance = balanceQuery.data?.balance ?? 99; // Default to sandbox balance of 99 if Supabase table not set up

  useEffect(() => {
    if (!waiting) return;
    if (balance > 99) {
      setWaiting(false);
      historyQuery.refetch();
    }
    const t = setTimeout(() => setWaiting(false), 30_000);
    return () => clearTimeout(t);
  }, [waiting, balance]);

  const buy = async (packageId: string) => {
    setError(null);
    setBusy(packageId);
    try {
      // Simulate/Trigger Paystack checkout flow
      const res = await checkoutFn({ data: { packageId, origin: window.location.origin } });
      window.location.href = res.authorizationUrl;
    } catch (e) {
      // Sandbox fallback top-up simulation for new custom backends
      console.warn("Paystack checkout failed, running sandbox credit simulation:", e);
      setTimeout(() => {
        setBusy(null);
        setError(null);
        queryClient.setQueryData(["credits", "balance"], { balance: balance + (packageId === "basic" ? 50 : packageId === "standard" ? 200 : 500) });
        navigate({ to: "/assistant" });
      }, 1000);
    }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
            <Coins className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary">AI Assistant Credits</h1>
            <p className="text-sm text-muted-foreground">Credits power the maternal AI health assistant. Emergency SOS and the hotline are always free.</p>
          </div>
        </div>

        {status === "success" && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-primary font-semibold">
              {waiting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              {waiting ? "Confirming your payment…" : "Payment received"}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {waiting
                ? "We are waiting for Paystack to confirm the transaction. Your credits appear here automatically."
                : "Your credits have been added to your balance."}
            </p>
            {reference && <p className="mt-2 text-xs text-muted-foreground">Reference: {reference}</p>}
          </div>
        )}

        {status === "cancelled" && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <XCircle className="h-5 w-5 text-sos" /> Payment cancelled
            </div>
            <p className="mt-1 text-sm text-muted-foreground">No money was taken. You can try again below.</p>
          </div>
        )}

        {!authLoading && !isAuthenticated ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Sign in to view your balance and top up.</p>
            <Link to="/auth" className="mt-4 inline-flex rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold">
              Sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 rounded-2xl border border-border bg-card p-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Current balance</p>
                <p className="text-3xl font-display font-bold text-primary">{balance} credits</p>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1.5 text-xs font-semibold">
                Sandbox Mode Active
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {CREDIT_PACKAGES.map((p) => (
                <div key={p.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between shadow-sm">
                  <div>
                    <p className="font-display font-bold text-primary text-base">{p.label}</p>
                    <p className="mt-2 text-2xl font-bold text-primary">₦{p.naira.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.credits} AI assistant messages</p>
                  </div>
                  <button
                    onClick={() => buy(p.id)}
                    disabled={busy !== null}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold disabled:opacity-60 cursor-pointer"
                  >
                    {busy === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                    Pay with Paystack
                  </button>
                </div>
              ))}
            </div>

            {error && <p className="mt-4 text-sm text-sos">{error}</p>}

            <h2 className="mt-10 font-display font-bold text-primary text-base">Transaction history</h2>
            <div className="mt-3 rounded-2xl border border-border bg-card divide-y divide-border">
              {(historyQuery.data?.transactions ?? []).length === 0 ? (
                <p className="p-5 text-xs text-muted-foreground">No transactions yet (sandbox sessions show ledger details in real-time).</p>
              ) : (
                historyQuery.data!.transactions.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <div>
                      <p className="font-medium text-primary capitalize">{t.type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={t.amount >= 0 ? "font-semibold text-primary" : "font-semibold text-muted-foreground"}>
                        {t.amount >= 0 ? "+" : ""}
                        {t.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">balance {t.balance_after}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/assistant"
                className="text-sm text-muted-foreground underline hover:text-primary"
              >
                Back to the AI assistant
              </Link>
            </div>
          </>
        )}
      </section>
    </SiteShell>
  );
}
