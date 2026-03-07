"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Sport {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
}

const TOP_SPORTS_SLUGS = [
  "futebol",
  "beach-tennis",
  "corrida",
  "crossfit",
  "volei",
  "basquete",
  "futevolei",
  "league-of-legends",
];

interface StepSportsProps {
  sports: Sport[];
  selectedSports: string[];
  onToggle: (sportId: string) => void;
}

export function StepSports({ sports, selectedSports, onToggle }: StepSportsProps) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const topSports = sports.filter((s) => TOP_SPORTS_SLUGS.includes(s.slug));
  const otherSports = sports.filter((s) => !TOP_SPORTS_SLUGS.includes(s.slug));

  const filteredTop = search
    ? topSports.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      )
    : topSports;

  const filteredOther = search
    ? otherSports.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      )
    : otherSports;

  const showOtherSection = showAll || search.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
        Quais esportes?
      </h2>
      <p className="text-slate-500 mb-4 text-center text-sm">
        Escolha os esportes que voce pratica ou acompanha
      </p>

      <div className="mb-4">
        <Input
          placeholder="Buscar esporte..."
          icon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
        {filteredTop.map((sport) => {
          const isSelected = selectedSports.includes(sport.id);
          return (
            <motion.button
              key={sport.id}
              type="button"
              whileTap={{ scale: 0.93 }}
              onClick={() => onToggle(sport.id)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center",
                isSelected
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10"
                  : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-600"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-2.5 h-2.5 text-white" />
                </motion.div>
              )}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: sport.color ?? "#64748b" }}
              >
                {sport.name.charAt(0)}
              </div>
              <span className="text-[11px] font-medium leading-tight">
                {sport.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {!search && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {showAll ? (
            <>
              Mostrar menos <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Ver todos os {sports.length} esportes{" "}
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      <AnimatePresence>
        {showOtherSection && filteredOther.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
              {filteredOther.map((sport) => {
                const isSelected = selectedSports.includes(sport.id);
                return (
                  <motion.button
                    key={sport.id}
                    type="button"
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onToggle(sport.id)}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all text-center",
                      isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10"
                        : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-600"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: sport.color ?? "#64748b" }}
                    >
                      {sport.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-medium leading-tight">
                      {sport.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedSports.length > 0 && (
        <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mt-3 text-center font-medium">
          {selectedSports.length} esporte{selectedSports.length > 1 ? "s" : ""}{" "}
          selecionado{selectedSports.length > 1 ? "s" : ""}
        </p>
      )}
    </motion.div>
  );
}
