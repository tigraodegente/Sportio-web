"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type LevelValue = "C" | "B" | "A";

interface SportWithLevel {
  sportId: string;
  sportName: string;
  level: LevelValue;
}

const levels: { value: LevelValue; label: string; description: string; color: string }[] = [
  {
    value: "C",
    label: "Iniciante",
    description: "Pratico por diversao",
    color: "green",
  },
  {
    value: "B",
    label: "Intermediario",
    description: "Compito em torneios locais",
    color: "yellow",
  },
  {
    value: "A",
    label: "Avancado",
    description: "Compito em nivel regional ou superior",
    color: "red",
  },
];

const levelColors = {
  C: {
    dot: "bg-green-500",
    selected: "border-green-500 bg-green-50 text-green-700",
    ring: "ring-green-500/20",
  },
  B: {
    dot: "bg-yellow-500",
    selected: "border-yellow-500 bg-yellow-50 text-yellow-700",
    ring: "ring-yellow-500/20",
  },
  A: {
    dot: "bg-red-500",
    selected: "border-red-500 bg-red-50 text-red-700",
    ring: "ring-red-500/20",
  },
};

interface StepLevelProps {
  sportsWithLevel: SportWithLevel[];
  onSetLevel: (sportId: string, level: LevelValue) => void;
}

export function StepLevel({ sportsWithLevel, onSetLevel }: StepLevelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
        Qual seu nivel?
      </h2>
      <p className="text-slate-500 mb-6 text-center text-sm">
        Defina seu nivel em cada esporte selecionado
      </p>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {sportsWithLevel.map((sport) => (
          <div key={sport.sportId} className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              {sport.sportName}
            </p>
            <div className="flex gap-2">
              {levels.map((level) => {
                const isSelected = sport.level === level.value;
                const colors = levelColors[level.value];
                return (
                  <motion.button
                    key={level.value}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSetLevel(sport.sportId, level.value)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center",
                      isSelected
                        ? `${colors.selected} shadow-md ring-1 ${colors.ring}`
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    )}
                  >
                    <div className={cn("w-3 h-3 rounded-full", colors.dot)} />
                    <span className="text-xs font-semibold">
                      {level.label}
                    </span>
                    <span className="text-[10px] opacity-70 leading-tight">
                      {level.description}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export type { SportWithLevel };
