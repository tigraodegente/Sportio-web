"use client";

import { useState } from "react";
import { Lock, Heart, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CreatorPost, SubscriptionTier } from "@/lib/mock/creator-data";
import { formatDistanceToNow } from "@/lib/utils";

interface ExclusiveTabProps {
  posts: CreatorPost[];
  tiers: SubscriptionTier[];
}

const tierFilters = ["Todos", "Fan", "VIP", "Patrono"];

export function ExclusiveTab({ posts, tiers }: ExclusiveTabProps) {
  const [activeTierFilter, setActiveTierFilter] = useState("Todos");

  const gatedPosts = posts.filter((p) => p.isGated);
  const filteredPosts =
    activeTierFilter === "Todos"
      ? gatedPosts
      : gatedPosts.filter((p) => p.requiredTier === activeTierFilter);

  return (
    <div>
      {/* Subscribe CTA */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Desbloqueie conteudo exclusivo</h3>
            <p className="text-sm text-slate-600 mt-1">
              Assine para acessar treinos completos, dicas avancadas e conteudo dos bastidores.
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {tiers.map((tier) => (
                <Button key={tier.id} variant="outline" size="sm" className="text-xs">
                  {tier.name} — R${tier.price.toFixed(2).replace(".", ",")}/mes
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Tier filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {tierFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveTierFilter(filter)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTierFilter === filter
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-500 hover:text-slate-700"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Gated posts list */}
      <div className="space-y-4">
        {filteredPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="relative overflow-hidden">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="accent" className="gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  {post.requiredTier}
                </Badge>
                <span className="text-xs text-slate-400">{formatDistanceToNow(post.createdAt)}</span>
              </div>

              {/* Blurred content */}
              <div className="relative mt-2">
                <p
                  className="text-slate-800 text-[15px] leading-relaxed select-none pointer-events-none"
                  style={{ filter: "blur(5px)" }}
                >
                  {post.content}
                </p>
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <Button variant="accent" size="sm">
                    <Lock className="w-3.5 h-3.5" />
                    Assinar para Desbloquear — R${post.tierPrice?.toFixed(2).replace(".", ",")}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 opacity-50">
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <Heart className="w-3.5 h-3.5" /> {post.likesCount}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Lock className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Nenhum conteudo exclusivo nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
