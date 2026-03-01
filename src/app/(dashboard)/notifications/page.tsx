"use client";

import { useState } from "react";
import { Bell, Trophy, Coins, MessageSquare, Target, Users, CheckCheck, Swords, Calendar, PartyPopper, BellRing, Loader2, Heart, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; iconColor: string; iconRing: string }> = {
  match_result: { icon: Swords, iconColor: "text-red-600 bg-red-100", iconRing: "ring-red-50" },
  tournament_invite: { icon: Trophy, iconColor: "text-blue-600 bg-blue-100", iconRing: "ring-blue-50" },
  bet_result: { icon: Target, iconColor: "text-green-600 bg-green-100", iconRing: "ring-green-50" },
  challenge_complete: { icon: Calendar, iconColor: "text-orange-600 bg-orange-100", iconRing: "ring-orange-50" },
  follow: { icon: Users, iconColor: "text-blue-600 bg-blue-100", iconRing: "ring-blue-50" },
  comment: { icon: MessageSquare, iconColor: "text-purple-600 bg-purple-100", iconRing: "ring-purple-50" },
  like: { icon: Heart, iconColor: "text-pink-600 bg-pink-100", iconRing: "ring-pink-50" },
  system: { icon: Bell, iconColor: "text-slate-600 bg-slate-100", iconRing: "ring-slate-50" },
  gcoin_received: { icon: Coins, iconColor: "text-amber-600 bg-amber-100", iconRing: "ring-amber-50" },
};

function getTimeGroup(date: Date): "today" | "yesterday" | "earlier" {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 24) return "today";
  if (hours < 48) return "yesterday";
  return "earlier";
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

const timeGroupLabels: Record<string, string> = {
  today: "Hoje",
  yesterday: "Ontem",
  earlier: "Anteriores",
};

export default function NotificationsPage() {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const notifications = trpc.notification.list.useQuery({
    unreadOnly: showUnreadOnly,
    limit: 50,
  });
  const unreadCount = trpc.notification.unreadCount.useQuery();

  const markRead = trpc.notification.markRead.useMutation({
    onSuccess: () => {
      notifications.refetch();
      unreadCount.refetch();
    },
  });
  const markAllRead = trpc.notification.markAllRead.useMutation({
    onSuccess: () => {
      notifications.refetch();
      unreadCount.refetch();
    },
  });

  const notifs = notifications.data ?? [];
  const unread = unreadCount.data ?? 0;
  const allRead = unread === 0;

  // Group notifications by time period
  const groups = notifs.reduce<Record<string, typeof notifs>>((acc, notif) => {
    const group = getTimeGroup(new Date(notif.createdAt));
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});

  const groupOrder = ["today", "yesterday", "earlier"];

  if (notifications.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
            <BellRing className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notificacoes</h1>
            <p className="text-sm text-slate-500">
              {unread > 0 ? (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  {unread} nao lidas
                </span>
              ) : (
                "Tudo em dia!"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={cn("shadow-sm gap-1.5", showUnreadOnly && "bg-blue-50 border-blue-200")}
          >
            {showUnreadOnly ? "Todas" : "Nao lidas"}
          </Button>
          {unread > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="shadow-sm gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-blue-600" />
              Marcar todas
            </Button>
          )}
        </div>
      </div>

      {/* All-read celebration state */}
      {allRead && !showUnreadOnly && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-green-50 to-teal-50 border border-blue-100">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center flex-shrink-0">
            <PartyPopper className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900">Tudo em dia!</p>
            <p className="text-xs text-blue-600 mt-0.5">Você leu todas as suas notificações. Continue assim!</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {notifs.length === 0 && !notifications.isLoading && (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">
            {showUnreadOnly ? "Nenhuma notificacao nao lida" : "Nenhuma notificacao ainda"}
          </p>
        </div>
      )}

      {/* Grouped Notifications */}
      {groupOrder.map((groupKey) => {
        const groupNotifs = groups[groupKey];
        if (!groupNotifs || groupNotifs.length === 0) return null;

        return (
          <div key={groupKey} className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {timeGroupLabels[groupKey]}
              </h3>
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400 bg-slate-50 rounded-full px-2 py-0.5 border border-slate-100">
                {groupNotifs.length}
              </span>
            </div>

            {/* Notification Cards */}
            <Card className="overflow-hidden p-0 sm:p-0">
              <div className="divide-y divide-slate-100">
                {groupNotifs.map((notif) => {
                  const config = typeConfig[notif.type] ?? typeConfig.system;
                  const Icon = config.icon;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (!notif.isRead) markRead.mutate({ id: notif.id });
                      }}
                      className={cn(
                        "flex items-start gap-4 p-4 sm:p-5 transition-all duration-300 cursor-pointer group",
                        !notif.isRead
                          ? "bg-gradient-to-r from-blue-50/60 via-white to-white border-l-[3px] border-l-blue-500 shadow-sm"
                          : "bg-white hover:bg-slate-50/50 border-l-[3px] border-l-transparent"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ring-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md",
                        config.iconColor,
                        config.iconRing
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={cn(
                              "text-sm font-semibold",
                              !notif.isRead ? "text-slate-900" : "text-slate-700"
                            )}>
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <span className="relative flex-shrink-0">
                                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full block" />
                                <span className="absolute inset-0 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping opacity-40" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5 whitespace-nowrap flex-shrink-0">
                            {formatTimeAgo(new Date(notif.createdAt))}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm mt-1 leading-relaxed",
                          !notif.isRead ? "text-slate-600" : "text-slate-500"
                        )}>
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
