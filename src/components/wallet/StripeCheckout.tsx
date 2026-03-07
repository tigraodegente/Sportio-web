"use client";

import { useState } from "react";
import { GCOIN_PACKAGES } from "@/server/lib/stripe-packages";

type CheckoutMode = "card" | "pix";

interface PixData {
  pixQrCode: string | null;
  pixQrCodeUrl: string | null;
  expiresAt: number | null;
}

export function StripeCheckout() {
  const [loading, setLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<CheckoutMode>("card");
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(packageId: string) {
    setLoading(packageId);
    setError(null);
    setPixData(null);

    try {
      if (mode === "card") {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageId }),
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      } else {
        // PIX flow
        const res = await fetch("/api/stripe/pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageId }),
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        setPixData({
          pixQrCode: data.pixQrCode,
          pixQrCodeUrl: data.pixQrCodeUrl,
          expiresAt: data.expiresAt,
        });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(null);
    }
  }

  // Show PIX QR code if generated
  if (pixData) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-700 bg-gray-800 p-6">
        <h3 className="text-lg font-bold text-white">Pague com PIX</h3>
        {pixData.pixQrCodeUrl && (
          <img
            src={pixData.pixQrCodeUrl}
            alt="PIX QR Code"
            className="h-48 w-48 rounded-lg bg-white p-2"
          />
        )}
        {pixData.pixQrCode && (
          <div className="w-full">
            <p className="mb-1 text-xs text-gray-400">Codigo PIX (copiar e colar):</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={pixData.pixQrCode}
                className="flex-1 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-xs text-gray-300"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pixData.pixQrCode!);
                }}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-500"
              >
                Copiar
              </button>
            </div>
          </div>
        )}
        {pixData.expiresAt && (
          <p className="text-xs text-gray-500">
            Expira em {new Date(pixData.expiresAt * 1000).toLocaleTimeString("pt-BR")}
          </p>
        )}
        <button
          onClick={() => setPixData(null)}
          className="text-sm text-gray-400 underline hover:text-gray-300"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment mode toggle */}
      <div className="flex gap-2 rounded-lg bg-gray-800 p-1">
        <button
          onClick={() => setMode("card")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === "card"
              ? "bg-emerald-600 text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Cartao / Boleto
        </button>
        <button
          onClick={() => setMode("pix")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === "pix"
              ? "bg-emerald-600 text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          PIX
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Package grid */}
      <div className="grid grid-cols-2 gap-3">
        {GCOIN_PACKAGES.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => handleCheckout(pkg.id)}
            disabled={loading !== null}
            className="relative flex flex-col items-center gap-2 rounded-xl border-2 border-gray-700 bg-gray-800 p-4 transition hover:border-emerald-500 hover:bg-gray-750 disabled:opacity-50"
          >
            {"badge" in pkg && pkg.badge && (
              <span className="absolute -top-2 right-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {pkg.badge}
              </span>
            )}
            <span className="text-2xl font-bold text-white">
              {pkg.gcoins.toLocaleString("pt-BR")}
            </span>
            <span className="text-xs text-gray-400">GCoins</span>
            <span className="mt-1 text-lg font-semibold text-emerald-400">
              R$ {pkg.priceBrl.toFixed(2).replace(".", ",")}
            </span>
            {loading === pkg.id && (
              <span className="text-xs text-gray-400">
                {mode === "card" ? "Redirecionando..." : "Gerando PIX..."}
              </span>
            )}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-500">
        {mode === "card"
          ? "Voce sera redirecionado para o checkout seguro do Stripe"
          : "Um QR Code PIX sera gerado para pagamento instantaneo"}
      </p>
    </div>
  );
}
