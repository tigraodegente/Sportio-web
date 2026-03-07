import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

// Re-export packages so server code can import from one place
export { GCOIN_PACKAGES } from "./stripe-packages";
export type { GcoinPackage, GcoinPackageId } from "./stripe-packages";
