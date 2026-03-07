"use client";

import Link from "next/link";
import { MapPin, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { TournamentPreview } from "@/lib/mock/home-data";

interface TournamentCardProps {
  tournament: TournamentPreview;
  className?: string;
}

export function TournamentCard({ tournament, className }: TournamentCardProps) {
  const spotsPercentage = ((tournament.totalSpots - tournament.spotsLeft) / tournament.totalSpots) * 100;
  const almostFull = spotsPercentage >= 75;

  return (
    <div
      className={cn(
        "flex-shrink-0 w-[280px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <Badge variant={almostFull ? "danger" : "primary"} className="text-[10px]">
          {tournament.sport}
        </Badge>
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <MapPin className="w-3 h-3" />
          {tournament.distance < 10
            ? `${tournament.distance.toFixed(1)}km`
            : `${Math.round(tournament.distance)}km`}
        </span>
      </div>

      <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">{tournament.name}</h3>
      <p className="text-xs text-slate-500 mb-3">{tournament.location}, {tournament.city}</p>

      <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(tournament.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {tournament.spotsLeft} vagas
        </span>
      </div>

      <div className="mb-3">
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              almostFull ? "bg-red-500" : "bg-blue-500"
            )}
            style={{ width: `${spotsPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-900">{formatCurrency(tournament.price)}</span>
        <Link href={`/tournaments/${tournament.id}`}>
          <Button size="sm" className="text-xs px-3 py-1.5">Inscrever</Button>
        </Link>
      </div>
    </div>
  );
}
