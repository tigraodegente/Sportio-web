// GCoin packages for purchase
// This file is safe to import from both server and client components
// (no Stripe SDK dependency)

export const GCOIN_PACKAGES = [
  { id: "gcoin_100", gcoins: 100, priceBrl: 10.0, label: "100 GCoins" },
  {
    id: "gcoin_500",
    gcoins: 500,
    priceBrl: 45.0,
    label: "500 GCoins",
    badge: "Popular" as const,
  },
  {
    id: "gcoin_1000",
    gcoins: 1000,
    priceBrl: 80.0,
    label: "1.000 GCoins",
    badge: "Melhor custo" as const,
  },
  { id: "gcoin_5000", gcoins: 5000, priceBrl: 350.0, label: "5.000 GCoins" },
] as const;

export type GcoinPackage = (typeof GCOIN_PACKAGES)[number];
export type GcoinPackageId = GcoinPackage["id"];
