"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  PersonStanding,
  Trophy,
  Megaphone,
  Tv,
  Target,
  Flag,
  Check,
} from "lucide-react";

export type PersonaId = "athlete" | "organizer" | "brand" | "fan" | "bettor" | "referee";

interface Persona {
  id: PersonaId;
  label: string;
  description: string;
  icon: typeof PersonStanding;
  emoji: string;
}

const personas: Persona[] = [
  {
    id: "athlete",
    label: "Quero competir e ganhar",
    description: "Atleta",
    icon: PersonStanding,
    emoji: "\u{1F3C3}",
  },
  {
    id: "organizer",
    label: "Quero organizar torneios",
    description: "Organizador",
    icon: Trophy,
    emoji: "\u{1F3C6}",
  },
  {
    id: "brand",
    label: "Quero patrocinar atletas",
    description: "Marca",
    icon: Megaphone,
    emoji: "\u{1F4E2}",
  },
  {
    id: "fan",
    label: "Quero acompanhar e torcer",
    description: "Fa",
    icon: Tv,
    emoji: "\u{1F4FA}",
  },
  {
    id: "bettor",
    label: "Quero apostar com GCoins",
    description: "Apostador",
    icon: Target,
    emoji: "\u{1F3AF}",
  },
  {
    id: "referee",
    label: "Quero arbitrar partidas",
    description: "Arbitro",
    icon: Flag,
    emoji: "\u{1F3C1}",
  },
];

interface StepPersonaProps {
  selectedPersonas: PersonaId[];
  onToggle: (id: PersonaId) => void;
}

export function StepPersona({ selectedPersonas, onToggle }: StepPersonaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
        O que te traz ao Sportio?
      </h2>
      <p className="text-slate-500 mb-6 text-center text-sm">
        Selecione um ou mais perfis. Voce pode alterar depois.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {personas.map((persona) => {
          const isSelected = selectedPersonas.includes(persona.id);
          const Icon = persona.icon;

          return (
            <motion.button
              key={persona.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(persona.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center",
                isSelected
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/10 ring-1 ring-blue-600/20"
                  : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-600"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
              <span className="text-2xl">{persona.emoji}</span>
              <Icon className="w-6 h-6" />
              <span className="text-sm font-semibold leading-tight">
                {persona.label}
              </span>
              <span className="text-xs opacity-70">{persona.description}</span>
            </motion.button>
          );
        })}
      </div>

      {selectedPersonas.length === 0 && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-4 text-center font-medium">
          Selecione pelo menos um perfil para continuar
        </p>
      )}
    </motion.div>
  );
}

export { personas };
