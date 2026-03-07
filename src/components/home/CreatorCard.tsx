"use client";

import Link from "next/link";
import { CheckCircle2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CreatorPreview } from "@/lib/mock/home-data";

interface CreatorCardProps {
  creator: CreatorPreview;
  className?: string;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function CreatorCard({ creator, className }: CreatorCardProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 w-[220px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm text-center transition-all hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex justify-center mb-3">
        <Avatar src={creator.image} name={creator.name} size="lg" />
      </div>

      <div className="flex items-center justify-center gap-1 mb-1">
        <h3 className="text-sm font-bold text-slate-900 truncate">{creator.name}</h3>
        {creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
      </div>

      <Badge variant="default" className="text-[10px] mb-3">{creator.sport}</Badge>

      <div className="flex items-center justify-center gap-3 mb-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {formatCount(creator.followers)}
        </span>
        <span>{formatCount(creator.subscribers)} assinantes</span>
      </div>

      <div className="flex gap-2">
        <Link href={`/athletes/${creator.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs">
            Seguir
          </Button>
        </Link>
        <Link href={`/athletes/${creator.id}`} className="flex-1">
          <Button size="sm" className="w-full text-xs">
            R${creator.subscriptionPrice.toFixed(0)}/mês
          </Button>
        </Link>
      </div>
    </div>
  );
}
