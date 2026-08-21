import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/paystack-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const signature = request.headers.get("x-paystack-signature") ?? "";

        const { paystackSignature, safeEqualHex, paystackVerify, getPackage } = await import(
          "@/lib/credits.server"
        );

        let expected: string;
        try {
          expected = await paystackSignature(raw);
        } catch {
          return new Response("Not configured", { status: 500 });
        }
        if (!signature || !safeEqualHex(signature, expected)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: { event?: string; data?: { reference?: string } };
        try {
          event = JSON.parse(raw);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }

        if (event.event !== "charge.success" || !event.data?.reference) {
          return new Response("ignored");
        }

        const reference = event.data.reference;
        const verified = await paystackVerify(reference);
        if (!verified.ok || verified.currency !== "NGN") {
          console.error("[paystack] verification failed for", reference);
          return new Response("not verified", { status: 202 });
        }

        const userId = String(verified.metadata.user_id ?? "");
        const packageId = String(verified.metadata.package_id ?? "");
        const pkg = getPackage(packageId);
        if (!userId || !pkg || verified.amountKobo !== pkg.naira * 100) {
          console.error("[paystack] metadata/amount mismatch for", reference);
          return new Response("mismatch", { status: 202 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.rpc("add_ai_credits", {
          p_user_id: userId,
          p_amount: pkg.credits,
          p_paystack_reference: reference,
        });
        if (error) {
          console.error("[paystack] credit grant failed", error.message);
          return new Response("retry", { status: 500 });
        }

        return new Response("ok");
      },
    },
  },
});
