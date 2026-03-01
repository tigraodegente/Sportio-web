"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, Rss } from "lucide-react";
import { FeedPost, CreatePostForm, FeedFilters, FeedSidebar } from "@/components/feed";
import { SponsorBanner } from "@/components/ads/sponsor-banner";
import { trpc } from "@/lib/trpc";

export default function SocialPage() {
  const [selectedSportId, setSelectedSportId] = useState<string | undefined>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Get current user session
  const userQuery = trpc.user.me.useQuery(undefined, {
    retry: false,
  });
  const currentUser = userQuery.data;

  // Infinite feed query
  const feedQuery = trpc.social.feed.useInfiniteQuery(
    {
      sportId: selectedSportId,
      limit: 15,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const allPosts = feedQuery.data?.pages.flatMap((page) => page.items) ?? [];

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target?.isIntersecting && feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
        feedQuery.fetchNextPage();
      }
    },
    [feedQuery]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-6">
        {/* Main Feed Column */}
        <div className="flex-1 min-w-0 max-w-2xl space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Feed</h1>
            <p className="text-slate-500 mt-0.5">
              Veja o que está acontecendo no mundo esportivo
            </p>
          </div>

          {/* Sport Filters */}
          <FeedFilters
            selectedSportId={selectedSportId}
            onSportChange={setSelectedSportId}
          />

          {/* Create Post */}
          <CreatePostForm
            currentUser={currentUser ? { id: currentUser.id, name: currentUser.name, image: currentUser.image } : undefined}
            onPostCreated={() => feedQuery.refetch()}
          />

          {/* Feed Posts */}
          {feedQuery.isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse"
                >
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                      <div className="h-3 w-20 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                  </div>
                  <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div className="h-8 w-16 bg-slate-100 rounded-xl" />
                    <div className="h-8 w-16 bg-slate-100 rounded-xl" />
                    <div className="h-8 w-24 bg-slate-100 rounded-xl ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {allPosts.length === 0 && !feedQuery.isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Rss className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Nenhuma publicação ainda
              </h3>
              <p className="text-sm text-slate-500 max-w-md">
                {selectedSportId
                  ? "Nenhuma publicação encontrada para este esporte. Tente outro filtro ou seja o primeiro a publicar!"
                  : "Seja o primeiro a compartilhar algo com a comunidade esportiva!"}
              </p>
            </div>
          )}

          {allPosts.map((post, index) => (
            <div key={post.id}>
              <FeedPost
                post={post}
                currentUserId={currentUser?.id}
                onPostDeleted={() => feedQuery.refetch()}
              />
              {/* Show sponsor banner after every 5th post */}
              {(index + 1) % 5 === 0 && (
                <div className="mt-6">
                  <SponsorBanner placement="feed_banner" sportId={selectedSportId} />
                </div>
              )}
            </div>
          ))}

          {/* Load More Trigger */}
          <div ref={loadMoreRef} className="py-4">
            {feedQuery.isFetchingNextPage && (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            )}
            {!feedQuery.hasNextPage && allPosts.length > 0 && (
              <p className="text-center text-sm text-slate-400">
                Você viu todas as publicações
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-6">
            <FeedSidebar currentUserId={currentUser?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
