"use client";

import { useState } from "react";
import { Bell, Trophy, Coins, MessageSquare, Target, Users, CheckCheck, Swords, Calendar, PartyPopper, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconRing: string;
  time: string;
  timeGroup: "today" | "yesterday" | "earlier";
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "tournament",
    title: "Inscricao Confirmada",
    message: "Sua inscricao na Copa Beach Tennis SP foi confirmada. O torneio comeca em 3 dias!",
    icon: Trophy,
    iconColor: "text-blue-600 bg-blue-100",
    iconRing: "ring-blue-50",
    time: "5min",
    timeGroup: "today",
    isRead: false,
  },
  {
    id: "2",
    type: "gcoin",
    title: "GCoins Recebidos",
    message: "Voce recebeu 2.500 GCoins como premio do torneio Beach Tennis Open.",
    icon: Coins,
    iconColor: "text-amber-600 bg-amber-100",
    iconRing: "ring-amber-50",
    time: "1h",
    timeGroup: "today",
    isRead: false,
  },
  {
    id: "3",
    type: "social",
    title: "Novo Seguidor",
    message: "Rafael Costa comecou a seguir voce.",
    icon: Users,
    iconColor: "text-blue-600 bg-blue-100",
    iconRing: "ring-blue-50",
    time: "2h",
    timeGroup: "today",
    isRead: false,
  },
  {
    id: "4",
    type: "bet",
    title: "Palpite Ganho!",
    message: "Seu palpite na partida Lucas vs Andre foi correto! Voce ganhou 180 GCoins.",
    icon: Target,
    iconColor: "text-green-600 bg-green-100",
    iconRing: "ring-green-50",
    time: "3h",
    timeGroup: "yesterday",
    isRead: true,
  },
  {
    id: "5",
    type: "chat",
    title: "Nova Mensagem",
    message: "Rafael Costa: Bora treinar amanha?",
    icon: MessageSquare,
    iconColor: "text-purple-600 bg-purple-100",
    iconRing: "ring-purple-50",
    time: "4h",
    timeGroup: "yesterday",
    isRead: true,
  },
  {
    id: "6",
    type: "tournament",
    title: "Torneio Proximo",
    message: "O torneio Liga CrossFit Brasil comeca amanha. Nao esqueca de fazer check-in!",
    icon: Calendar,
    iconColor: "text-orange-600 bg-orange-100",
    iconRing: "ring-orange-50",
    time: "6h",
    timeGroup: "yesterday",
    isRead: true,
  },
  {
    id: "7",
    type: "match",
    title: "Partida Agendada",
    message: "Sua proxima partida contra Andre Santos esta agendada para amanha as 15h.",
    icon: Swords,
    iconColor: "text-red-600 bg-red-100",
    iconRing: "ring-red-50",
    time: "8h",
    timeGroup: "earlier",
    isRead: true,
  },
  {
    id: "8",
    type: "system",
    title: "Nivel Atualizado",
    message: "Parabens! Voce subiu para o Nivel 15. Continue jogando para desbloquear mais recompensas!",
    icon: Bell,
    iconColor: "text-slate-600 bg-slate-100",
    iconRing: "ring-slate-50",
    time: "1d",
    timeGroup: "earlier",
    isRead: true,
  },
];

const timeGroupLabels: Record<string, string> = {
  today: "Hoje",
  yesterday: "Ontem",
  earlier: "Anteriores",
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notifications);
  const unreadCount = notifs.filter((n) => !n.isRead).length;
  const allRead = unreadCount === 0;

  const markAllAsRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  // Group notifications by time period
  const groups = notifs.reduce<Record<string, Notification[]>>((acc, notif) => {
    const group = notif.timeGroup;
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});

  const groupOrder = ["today", "yesterday", "earlier"];

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
              {unreadCount > 0 ? (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  {unreadCount} nao lidas
                </span>
              ) : (
                "Tudo em dia!"
              )}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="shadow-sm gap-1.5">
            <CheckCheck className="w-4 h-4 text-blue-600" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* All-read celebration state */}
      {allRead && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 border border-blue-100">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center flex-shrink-0">
            <PartyPopper className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900">Tudo em dia!</p>
            <p className="text-xs text-blue-600 mt-0.5">Voce leu todas as suas notificacoes. Continue assim!</p>
          </div>
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
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={cn(
                        "flex items-start gap-4 p-4 sm:p-5 transition-all duration-300 cursor-pointer group",
                        !notif.isRead
                          ? "bg-gradient-to-r from-blue-50/60 via-white to-white border-l-[3px] border-l-blue-500 shadow-sm"
                          : "bg-white hover:bg-slate-50/50 border-l-[3px] border-l-transparent"
                      )}
                    >
                      {/* Icon Container - Larger with ring decoration */}
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ring-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md",
                        notif.iconColor,
                        notif.iconRing
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
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
                          {/* Timestamp pill */}
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5 whitespace-nowrap flex-shrink-0">
                            {notif.time}
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
