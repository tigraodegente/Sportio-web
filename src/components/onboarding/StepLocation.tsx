"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StepLocationProps {
  city: string;
  state: string;
  onCityChange: (city: string) => void;
  onStateChange: (state: string) => void;
}

const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export function StepLocation({
  city,
  state,
  onCityChange,
  onStateChange,
}: StepLocationProps) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocalizacao nao suportada pelo navegador");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`
          );
          const data = await res.json();
          const address = data.address;

          if (address) {
            onCityChange(
              address.city || address.town || address.village || ""
            );
            // Try to extract state code from state field
            const stateCode = address.state_code?.toUpperCase() ||
              address["ISO3166-2-lvl4"]?.replace("BR-", "") || "";
            if (BRAZILIAN_STATES.includes(stateCode)) {
              onStateChange(stateCode);
            } else if (address.state) {
              onStateChange(address.state);
            }
          }
        } catch {
          setGeoError("Nao foi possivel obter a localizacao");
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setGeoError("Permissao de localizacao negada");
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
        Onde voce esta?
      </h2>
      <p className="text-slate-500 mb-6 text-center text-sm">
        Para encontrar torneios e atletas perto de voce
      </p>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full mb-6"
        onClick={handleGeolocation}
        disabled={geoLoading}
      >
        {geoLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <MapPin className="w-5 h-5" />
        )}
        {geoLoading ? "Buscando localizacao..." : "Usar minha localizacao"}
      </Button>

      {geoError && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4 text-center">
          {geoError}
        </p>
      )}

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-slate-500">
            ou digite manualmente
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Cidade"
          placeholder="Ex: Sao Paulo"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
        />
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Estado
          </label>
          <select
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            className={cn(
              "block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-colors",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
              !state && "text-slate-400"
            )}
          >
            <option value="">Selecione o estado</option>
            {BRAZILIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {city && state && (
        <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mt-4 text-center font-medium">
          {city}, {state} - Brasil
        </p>
      )}
    </motion.div>
  );
}
