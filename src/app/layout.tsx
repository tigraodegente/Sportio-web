import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "@/lib/trpc-provider";
import { GiftProvider } from "@/contexts/GiftContext";
import { LayoutWrapper } from "@/components/shared/layout-wrapper";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sportio - Transforme Esporte em Renda Real",
    template: "%s | Sportio",
  },
  description:
    "A plataforma esportiva que transforma paixão em lucro real. Junte-se a mais de 12.500 atletas que já estão ganhando com GCoins.",
  keywords: [
    "esporte",
    "torneios",
    "GCoins",
    "futebol",
    "beach tennis",
    "corrida",
    "crossfit",
    "ganhar dinheiro esporte",
    "apostas esportivas",
    "plataforma esportiva",
  ],
  authors: [{ name: "Sportio" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Sportio",
    title: "Sportio - Transforme Esporte em Renda Real",
    description:
      "A plataforma esportiva que transforma paixão em lucro real. Junte-se a mais de 12.500 atletas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sportio - Transforme Esporte em Renda Real",
    description:
      "A plataforma esportiva que transforma paixão em lucro real.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <SessionProvider>
          <TRPCProvider>
            <GiftProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
              <Toaster richColors position="top-right" />
            </GiftProvider>
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
