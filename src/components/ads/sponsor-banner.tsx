"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Gift, Coins, Trophy, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

interface SponsorBannerProps {
  placement: "feed_banner" | "sidebar" | "tournament_sponsor" | "profile_banner" | "challenge_sponsor" | "post_promoted";
  sportId?: string;
  tournamentId?: string;
  excludeIds?: string[];
  className?: string;
}

export function SponsorBanner({ placement, sportId, tournamentId, excludeIds, className }: SponsorBannerProps) {
  const trackedRef = useRef<Set<string>>(new Set());

  const campaignsQuery = trpc.brand.activeCampaigns.useQuery({
    placement,
    sportId,
    tournamentId,
    excludeIds,
    limit: placement === "tournament_sponsor" ? 5 : 1,
  });

  const trackImpression = trpc.brand.trackImpression.useMutation();
  const trackClick = trpc.brand.trackClick.useMutation();
  const redeemMutation = trpc.brand.redeem.useMutation();

  const campaigns = campaignsQuery.data ?? [];
  const campaign = campaigns[0];

  // Track impression once per campaign
  useEffect(() => {
    for (const c of campaigns) {
      if (c && !trackedRef.current.has(c.id)) {
        trackedRef.current.add(c.id);
        trackImpression.mutate({ campaignId: c.id });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns.map(c => c.id).join(",")]);

  if (!campaign) return null;

  const handleClick = (c: typeof campaign) => {
    trackClick.mutate({ campaignId: c.id });
    if (c.linkUrl) {
      window.open(c.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleRedeem = (e: React.MouseEvent, c: typeof campaign) => {
    e.stopPropagation();
    redeemMutation.mutate({ campaignId: c.id });
  };

  // Tournament sponsor layout: shows multiple sponsors
  if (placement === "tournament_sponsor" && campaigns.length > 0) {
    return (
      <div className={`rounded-xl border border-slate-100 bg-white p-4 ${className ?? ""}`}>
        <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5" />
          Patrocinadores
        </div>
        <div className="space-y-3">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-amber-100 bg-amber-50 cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => handleClick(c)}
            >
              {c.imageUrl && (
                <div className="flex-shrink-0 h-10 aspect-square rounded-lg overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.imageUrl} alt={c.name} className="w-full h-full object-contain" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{c.name}</p>
                {c.description && (
                  <p className="text-xs text-slate-500 line-clamp-1">{c.description}</p>
                )}
              </div>
              {c.linkUrl && <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isRewardType = campaign.type === "gcoin_reward" || campaign.type === "product_giveaway";

  // Sidebar layout
  if (placement === "sidebar") {
    return (
      <div
        className={`rounded-xl border border-slate-100 bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className ?? ""}`}
        onClick={() => handleClick(campaign)}
      >
        {campaign.imageUrl && (
          <div className="aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={campaign.imageUrl} alt={campaign.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-3">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            Patrocinado
          </div>
          <p className="text-sm font-semibold text-slate-900 line-clamp-1">{campaign.name}</p>
          {campaign.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{campaign.description}</p>
          )}
          {isRewardType && (
            <Button
              size="sm"
              variant="accent"
              className="w-full mt-2 text-xs"
              onClick={(e) => handleRedeem(e, campaign)}
              disabled={redeemMutation.isPending}
              loading={redeemMutation.isPending}
            >
              {campaign.type === "gcoin_reward" ? (
                <>
                  <Coins className="w-3 h-3" />
                  Ganhar {campaign.gcoinRewardAmount} GCoins
                </>
              ) : (
                <>
                  <Gift className="w-3 h-3" />
                  Resgatar Produto
                </>
              )}
            </Button>
          )}
          {redeemMutation.isSuccess && (
            <p className="text-xs text-green-600 mt-1 text-center">Resgatado!</p>
          )}
          {redeemMutation.error && (
            <p className="text-xs text-red-500 mt-1 text-center">{redeemMutation.error.message}</p>
          )}
        </div>
      </div>
    );
  }

  // Feed banner layout (default)
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className ?? ""}`}
      onClick={() => handleClick(campaign)}
    >
      <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-wider px-4 pt-3">
        Patrocinado
      </div>
      <div className="flex gap-4 p-4 pt-2">
        {campaign.imageUrl && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={campaign.imageUrl} alt={campaign.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{campaign.name}</p>
          {campaign.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{campaign.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {campaign.linkUrl && (
              <span className="flex items-center gap-1 text-xs text-blue-600">
                <ExternalLink className="w-3 h-3" />
                Saiba mais
              </span>
            )}
            {isRewardType && (
              <Button
                size="sm"
                variant="accent"
                className="text-xs"
                onClick={(e) => handleRedeem(e, campaign)}
                disabled={redeemMutation.isPending}
                loading={redeemMutation.isPending}
              >
                {campaign.type === "gcoin_reward" ? (
                  <>
                    <Coins className="w-3 h-3" />
                    Ganhar GCoins
                  </>
                ) : (
                  <>
                    <Gift className="w-3 h-3" />
                    Resgatar
                  </>
                )}
              </Button>
            )}
          </div>
          {redeemMutation.isSuccess && (
            <p className="text-xs text-green-600 mt-1">Resgatado com sucesso!</p>
          )}
          {redeemMutation.error && (
            <p className="text-xs text-red-500 mt-1">{redeemMutation.error.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Component to display tournament sponsors by tier (for tournament detail pages)
interface TournamentSponsorsProps {
  tournamentId: string;
  className?: string;
}

export function TournamentSponsors({ tournamentId, className }: TournamentSponsorsProps) {
  const sponsorsQuery = trpc.tournament.sponsors.useQuery({ tournamentId });
  const sponsors = sponsorsQuery.data ?? [];

  if (sponsors.length === 0) return null;

  const tierOrder = ["main", "gold", "silver", "bronze"] as const;
  const tierLabels: Record<string, string> = { main: "Patrocinador Principal", gold: "Ouro", silver: "Prata", bronze: "Bronze" };
  const tierStyles: Record<string, { border: string; bg: string; logoSize: string }> = {
    main: { border: "border-amber-300", bg: "bg-gradient-to-r from-amber-50 to-yellow-50", logoSize: "w-16 h-16" },
    gold: { border: "border-yellow-200", bg: "bg-yellow-50", logoSize: "w-12 h-12" },
    silver: { border: "border-slate-200", bg: "bg-slate-50", logoSize: "w-10 h-10" },
    bronze: { border: "border-orange-200", bg: "bg-orange-50", logoSize: "w-8 h-8" },
  };

  const grouped = tierOrder.reduce((acc, tier) => {
    const tierSponsors = sponsors.filter((s) => s.tier === tier);
    if (tierSponsors.length > 0) acc[tier] = tierSponsors;
    return acc;
  }, {} as Record<string, typeof sponsors>);

  return (
    <div className={`space-y-4 ${className ?? ""}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Crown className="w-4 h-4 text-amber-500" />
        Patrocinadores
      </div>
      {Object.entries(grouped).map(([tier, tierSponsors]) => {
        const style = tierStyles[tier];
        return (
          <div key={tier}>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
              {tierLabels[tier]}
            </p>
            <div className={`grid ${tier === "main" ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
              {tierSponsors.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${style.border} ${style.bg}`}
                >
                  {(s.logoUrl || s.brandUser?.image) && (
                    <div className={`${style.logoSize} rounded-lg overflow-hidden bg-white flex-shrink-0 flex items-center justify-center`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.logoUrl || s.brandUser?.image || ""}
                        alt={s.brandUser?.name ?? ""}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className={`font-semibold text-slate-900 truncate ${tier === "main" ? "text-base" : "text-sm"}`}>
                      {s.brandUser?.name ?? "Patrocinador"}
                    </p>
                    {s.message && (
                      <p className="text-xs text-slate-500 line-clamp-1">{s.message}</p>
                    )}
                    {Number(s.gcoinContribution ?? 0) > 0 && (
                      <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {Number(s.gcoinContribution).toLocaleString("pt-BR")} GCoins
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
