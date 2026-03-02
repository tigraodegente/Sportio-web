"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

interface FeedFiltersProps {
  selectedSportId?: string;
  onSportChange: (id: string | undefined) => void; // eslint-disable-line no-unused-vars
}

export function FeedFilters({ selectedSportId, onSportChange }: FeedFiltersProps) {
  const sportsQuery = trpc.social.getSports.useQuery();

  return (
    <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
      <button
        onClick={() => onSportChange(undefined)}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-all duration-200",
          !selectedSportId
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        Todos
      </button>

      {sportsQuery.isLoading &&
        [1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-9 w-24 bg-slate-200/50 rounded-lg animate-pulse"
          />
        ))}

      {sportsQuery.data?.map((sport) => (
        <button
          key={sport.id}
          onClick={() => onSportChange(sport.id === selectedSportId ? undefined : sport.id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-all duration-200",
            selectedSportId === sport.id
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          {sport.icon && <span className="text-sm">{sport.icon}</span>}
          {sport.name}
        </button>
      ))}
    </div>
  );
}
