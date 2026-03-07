import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Configure seu perfil no Sportio",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
