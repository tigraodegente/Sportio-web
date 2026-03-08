"use client";

import { useState } from "react";
import { Calculator, Coins, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const sports = [
  { value: "futebol", label: "Futebol", baseCoins: 400 },
  { value: "beach-tennis", label: "Beach Tennis", baseCoins: 300 },
  { value: "padel", label: "Padel", baseCoins: 320 },
  { value: "volei", label: "Volei", baseCoins: 350 },
  { value: "corrida", label: "Corrida", baseCoins: 500 },
  { value: "futevolei", label: "Futevolei", baseCoins: 380 },
  { value: "crossfit", label: "CrossFit", baseCoins: 450 },
  { value: "natacao", label: "Natacao", baseCoins: 420 },
];

const levels = [
  { value: "amador", label: "Amador", multiplier: 1 },
  { value: "intermediario", label: "Intermediario", multiplier: 1.8 },
  { value: "avancado", label: "Avancado", multiplier: 3 },
];

const GCOIN_VALUE = 0.05;

function calculateMonthlyCoins(
  sportValue: string,
  levelValue: string,
  frequency: number
): number {
  const sport = sports.find((s) => s.value === sportValue);
  const level = levels.find((l) => l.value === levelValue);
  if (!sport || !level) return 0;

  // Base coins is for 1x/week. Scale linearly with frequency.
  const rawCoins = sport.baseCoins * frequency * level.multiplier;
  return Math.round(rawCoins);
}

export default function GCoinCalculator() {
  const [sport, setSport] = useState("futebol");
  const [level, setLevel] = useState("amador");
  const [frequency, setFrequency] = useState(3);
  const [result, setResult] = useState<{
    coins: number;
    value: number;
  } | null>(null);

  function handleCalculate() {
    const coins = calculateMonthlyCoins(sport, level, frequency);
    const value = coins * GCOIN_VALUE;
    setResult({ coins, value });
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Calculator className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Calculadora de GCoins
        </h3>
      </div>

      <div className="space-y-5">
        {/* Sport Select */}
        <div>
          <label
            htmlFor="calc-sport"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Esporte
          </label>
          <select
            id="calc-sport"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            {sports.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Level Select */}
        <div>
          <label
            htmlFor="calc-level"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Nivel
          </label>
          <select
            id="calc-level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            {levels.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Frequency Slider */}
        <div>
          <label
            htmlFor="calc-frequency"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Frequencia semanal:{" "}
            <span className="font-bold text-blue-600">
              {frequency}x por semana
            </span>
          </label>
          <input
            id="calc-frequency"
            type="range"
            min={1}
            max={7}
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-100 accent-blue-600"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>1x</span>
            <span>4x</span>
            <span>7x</span>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
        >
          <Calculator className="h-5 w-5" />
          Calcular
        </button>
      </div>

      {/* Result */}
      <div
        className={cn(
          "mt-6 overflow-hidden rounded-xl border transition-all duration-500",
          result
            ? "max-h-60 border-blue-200 bg-gradient-to-br from-blue-50 to-white opacity-100"
            : "max-h-0 border-transparent opacity-0"
        )}
      >
        {result && (
          <div className="p-5">
            <p className="mb-3 text-sm font-medium text-blue-600">
              Estimativa Mensal
            </p>
            <div className="flex items-end gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {result.coins.toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="text-sm text-gray-500">GCoins Reais</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">
                    R${" "}
                    {result.value.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Valor estimado</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
