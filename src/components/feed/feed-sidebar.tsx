"use client";

import { TrendingUp, UserPlus, Heart, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { SponsorBanner } from "@/components/ads/sponsor-banner";
import { trpc } from "@/lib/trpc";

interface FeedSidebarProps {
  currentUserId?: string;
}

export function FeedSidebar({ currentUserId }: FeedSidebarProps) {
  const trendingQuery = trpc.social.trending.useQuery({ limit: 5 });
  const suggestedQuery = trpc.social.suggestedUsers.useQuery(
    { limit: 5 },
    { enabled: !!currentUserId }
  );

  const utils = trpc.useUtils();
  const followMutation = trpc.user.follow.useMutation({
    onSuccess: () => {
      utils.social.suggestedUsers.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      {/* Sidebar Ad */}
      <SponsorBanner placement="sidebar" />

      {/* Trending Posts */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <CardTitle className="text-base">Em alta</CardTitle>
        </div>

        {trendingQuery.isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {trendingQuery.data?.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-2">Nenhum post em alta</p>
        )}

        <div className="space-y-3">
          {trendingQuery.data?.map((post) => (
            <div key={post.id} className="flex gap-3 items-start group cursor-pointer">
              <Avatar src={post.user.image} name={post.user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {post.user.name}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Heart className="w-3 h-3" />
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <MessageCircle className="w-3 h-3" />
                    {post.commentsCount}
                  </span>
                  {post.sport && (
                    <span className="text-[10px] text-slate-400">
                      {post.sport.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Suggested Users */}
      {currentUserId && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base">Sugestões para seguir</CardTitle>
          </div>

          {suggestedQuery.isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-3 items-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                    <div className="h-2 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {suggestedQuery.data?.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-2">Nenhuma sugestão</p>
          )}

          <div className="space-y-3">
            {suggestedQuery.data?.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar src={user.image} name={user.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                  {user.city && (
                    <p className="text-xs text-slate-400 truncate">{user.city}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => followMutation.mutate({ userId: user.id })}
                  disabled={followMutation.isPending}
                  className="text-xs px-3"
                >
                  Seguir
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
