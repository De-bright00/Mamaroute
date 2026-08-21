// Server-only helpers for the AI credit system.
// Package pricing is resolved here so the client can never dictate credits-per-naira.
export { CREDIT_PACKAGES, getPackage } from "./credit-packages";
export type { CreditPackage } from "./credit-packages";



const PAYSTACK_API = "https://api.paystack.co";

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");
  return key;
}

export async function paystackInitialize(input: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<{ authorizationUrl: string; reference: string }> {
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  const json = (await res.json()) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; reference?: string };
  };

  if (!res.ok || !json.status || !json.data?.authorization_url) {
    console.error("[paystack] initialize failed", res.status, json.message);
    throw new Error("Could not start the payment. Please try again.");
  }

  return {
    authorizationUrl: json.data.authorization_url,
    reference: json.data.reference ?? input.reference,
  };
}

export async function paystackVerify(reference: string): Promise<{
  ok: boolean;
  amountKobo: number;
  currency: string;
  metadata: Record<string, unknown>;
  email: string | null;
}> {
  const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
  });
  const json = (await res.json()) as {
    status?: boolean;
    data?: {
      status?: string;
      amount?: number;
      currency?: string;
      metadata?: Record<string, unknown>;
      customer?: { email?: string };
    };
  };

  return {
    ok: Boolean(json.status) && json.data?.status === "success",
    amountKobo: json.data?.amount ?? 0,
    currency: json.data?.currency ?? "",
    metadata: json.data?.metadata ?? {},
    email: json.data?.customer?.email ?? null,
  };
}

/** Constant-time-ish comparison of hex signatures. */
export function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function paystackSignature(rawBody: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secretKey()),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
