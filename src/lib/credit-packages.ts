// Client-safe catalogue of credit packages (display only).
// Pricing is re-validated server-side before any payment is created.
export type CreditPackage = {
  id: string;
  label: string;
  /** Price in naira. */
  naira: number;
  credits: number;
};

export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "starter", label: "Starter pack", naira: 1000, credits: 50 },
];

export function getPackage(id: string): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((p) => p.id === id);
}

export const LOW_BALANCE_THRESHOLD = 5;
