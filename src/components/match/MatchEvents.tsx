"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MatchEvent } from "@/lib/mock/match-data";

const eventIcons: Record<MatchEvent["type"], string> = {
  goal: "\u26BD",
  yellow_card: "\uD83D\uDFE8",
  red_card: "\uD83D\uDFE5",
  substitution: "\uD83D\uDD04",
  var: "\uD83D\uDCFA",
};

const eventLabels: Record<MatchEvent["type"], string> = {
  goal: "Gol",
  yellow_card: "Cartao Amarelo",
  red_card: "Cartao Vermelho",
  substitution: "Substituicao",
  var: "VAR",
};

interface MatchEventsProps {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
}

export function MatchEvents({ events, homeTeamName, awayTeamName }: MatchEventsProps) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Eventos</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-slate-700/50" />

        <div className="space-y-2">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl relative",
                event.type === "goal" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-800/50"
              )}
            >
              {/* Minute badge */}
              <div className="w-[46px] shrink-0 flex items-center justify-center">
                <span
                  className={cn(
                    "text-xs font-mono font-bold px-2 py-1 rounded-md",
                    event.type === "goal"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-700 text-slate-300"
                  )}
                >
                  {event.minute}&apos;
                </span>
              </div>

              {/* Icon */}
              <span className="text-lg leading-none mt-0.5">{eventIcons[event.type]}</span>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-200">{event.playerName}</span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {event.team === "home" ? homeTeamName : awayTeamName}
                  </span>
                </div>
                {event.type === "substitution" && event.playerOut && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Saiu: <span className="text-slate-300">{event.playerOut}</span>
                  </p>
                )}
                {event.description && (
                  <p className="text-xs text-slate-400 mt-0.5">{event.description}</p>
                )}
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {eventLabels[event.type]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
