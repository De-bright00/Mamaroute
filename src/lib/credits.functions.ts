import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Current balance for the signed-in user. */
export const getMyCredits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", context.userId)
      .maybeSingle();
    return { balance: data?.balance ?? 0 };
  });

/** Recent ledger entries for the signed-in user. */
export const getMyCreditHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("credit_transactions")
      .select("id, type, amount, balance_after, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(20);
    return { transactions: data ?? [] };
  });

/** Start a Paystack checkout for a server-priced credit package. */
export const startCreditCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ packageId: z.string().min(1).max(50), origin: z.string().url().max(300) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { getPackage, paystackInitialize } = await import("@/lib/credits.server");
    const pkg = getPackage(data.packageId);
    if (!pkg) throw new Error("Unknown credit package");

    const email = (context.claims as { email?: string } | undefined)?.email;
    if (!email) throw new Error("Your account has no email address on file");

    const reference = `mr_${context.userId.replace(/-/g, "").slice(0, 12)}_${Date.now()}`;

    const { authorizationUrl } = await paystackInitialize({
      email,
      amountKobo: pkg.naira * 100,
      reference,
      callbackUrl: `${data.origin}/credits?status=success&reference=${reference}`,
      metadata: {
        user_id: context.userId,
        package_id: pkg.id,
        credits: pkg.credits,
        cancel_action: `${data.origin}/credits?status=cancelled`,
      },
    });

    return { authorizationUrl, reference };
  });
