"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Gift, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

interface SponsorBannerProps {
  placement: "feed_banner" | "sidebar" | "tournament_sponsor" | "profile_banner" | "challenge_sponsor" | "post_promoted";
  sportId?: string;
  className?: string;
}

export function SponsorBanner({ placement, sportId, className }: SponsorBannerProps) {
  const trackedRef = useRef<Set<string>>(new Set());

  const campaignsQuery = trpc.brand.activeCampaigns.useQuery({
    placement,
    sportId,
    limit: 1,
  });

  const trackImpression = trpc.brand.trackImpression.useMutation();
  const trackClick = trpc.brand.trackClick.useMutation();
  const redeemMutation = trpc.brand.redeem.useMutation();

  const campaign = campaignsQuery.data?.[0];

  // Track impression once per campaign per render cycle
  useEffect(() => {
    if (campaign && !trackedRef.current.has(campaign.id)) {
      trackedRef.current.add(campaign.id);
      trackImpression.mutate({ campaignId: campaign.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?.id]);

  if (!campaign) return null;

  const handleClick = () => {
    trackClick.mutate({ campaignId: campaign.id });
    if (campaign.linkUrl) {
      window.open(campaign.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleRedeem = (e: React.MouseEvent) => {
    e.stopPropagation();
    redeemMutation.mutate({ campaignId: campaign.id });
  };

  const isRewardType = campaign.type === "gcoin_reward" || campaign.type === "product_giveaway";

  if (placement === "sidebar") {
    return (
      <div
        className={`rounded-xl border border-slate-100 bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className ?? ""}`}
        onClick={handleClick}
      >
        {campaign.imageUrl && (
          <div className="aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campaign.imageUrl}
              alt={campaign.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-3">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            Patrocinado
          </div>
          <p className="text-sm font-semibold text-slate-900 line-clamp-1">
            {campaign.name}
          </p>
          {campaign.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
              {campaign.description}
            </p>
          )}
          {isRewardType && (
            <Button
              size="sm"
              variant="accent"
              className="w-full mt-2 text-xs"
              onClick={handleRedeem}
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
            <p className="text-xs text-red-500 mt-1 text-center">
              {redeemMutation.error.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Feed banner layout
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className ?? ""}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-wider px-4 pt-3">
        Patrocinado
      </div>
      <div className="flex gap-4 p-4 pt-2">
        {campaign.imageUrl && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campaign.imageUrl}
              alt={campaign.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{campaign.name}</p>
          {campaign.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
              {campaign.description}
            </p>
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
                onClick={handleRedeem}
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
            <p className="text-xs text-red-500 mt-1">
              {redeemMutation.error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
