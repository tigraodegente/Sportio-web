"use client";

import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CreatorProfile } from "@/lib/types/creator";

interface CreatorBannerProps {
  creator: CreatorProfile;
  isOwner?: boolean;
}

export function CreatorBanner({ creator, isOwner }: CreatorBannerProps) {
  return (
    <div className="relative w-full h-48 sm:h-64 lg:h-72 overflow-hidden rounded-b-2xl sm:rounded-b-3xl">
      {/* Banner image or gradient fallback */}
      {creator.bannerImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={creator.bannerImage}
          alt={`Banner de ${creator.name}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400" />
      )}

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Sponsor badge */}
      {creator.sponsor && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
          {creator.sponsor.logoUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={creator.sponsor.logoUrl}
              alt={creator.sponsor.name}
              className="w-5 h-5 rounded-full object-contain"
            />
          )}
          <span className="text-xs font-semibold text-slate-700">
            Patrocinado por: {creator.sponsor.name}
          </span>
        </div>
      )}

      {/* Edit button (owner only) */}
      {isOwner && (
        <div className="absolute top-4 left-4">
          <Button size="sm" variant="secondary" className="gap-1.5 bg-white/90 text-slate-700 hover:bg-white backdrop-blur-sm">
            <Edit3 className="w-3.5 h-3.5" />
            Editar Banner
          </Button>
        </div>
      )}
    </div>
  );
}
