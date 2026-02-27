"use client";

import { Bell, Trophy, Coins, MessageSquare, Target, Users, CheckCheck, Swords, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: "1",
    type: "tournament",
    title: "Inscricao Confirmada",
    message: "Sua inscricao na Copa Beach Tennis SP foi confirmada. O torneio comeca em 3 dias!",
    icon: Trophy,
    iconColor: "text-emerald-600 bg-emerald-100",
    time: "5min",
    isRead: false,
  },
  {
    id: "2",
    type: "gcoin",
    title: "GCoins Recebidos",
    message: "Voce recebeu 2.500 GCoins como premio do torneio Beach Tennis Open.",
    icon: Coins,
    iconColor: "text-amber-600 bg-amber-100",
    time: "1h",
    isRead: false,
  },
  {
    id: "3",
    type: "social",
    title: "Novo Seguidor",
    message: "Rafael Costa comecou a seguir voce.",
    icon: Users,
    iconColor: "text-blue-600 bg-blue-100",
    time: "2h",
    isRead: false,
  },
  {
    id: "4",
    type: "bet",
    title: "Palpite Ganho!",
    message: "Seu palpite na partida Lucas vs Andre foi correto! Voce ganhou 180 GCoins.",
    icon: Target,
    iconColor: "text-green-600 bg-green-100",
    time: "3h",
    isRead: true,
  },
  {
    id: "5",
    type: "chat",
    title: "Nova Mensagem",
    message: "Rafael Costa: Bora treinar amanha?",
    icon: MessageSquare,
    iconColor: "text-purple-600 bg-purple-100",
    time: "4h",
    isRead: true,
  },
  {
    id: "6",
    type: "tournament",
    title: "Torneio Proximo",
    message: "O torneio Liga CrossFit Brasil comeca amanha. Nao esqueca de fazer check-in!",
    icon: Calendar,
    iconColor: "text-orange-600 bg-orange-100",
    time: "6h",
    isRead: true,
  },
  {
    id: "7",
    type: "match",
    title: "Partida Agendada",
    message: "Sua proxima partida contra Andre Santos esta agendada para amanha as 15h.",
    icon: Swords,
    iconColor: "text-red-600 bg-red-100",
    time: "8h",
    isRead: true,
  },
  {
    id: "8",
    type: "system",
    title: "Nivel Atualizado",
    message: "Parabens! Voce subiu para o Nivel 15. Continue jogando para desbloquear mais recompensas!",
    icon: Bell,
    iconColor: "text-slate-600 bg-slate-100",
    time: "1d",
    isRead: true,
  },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notificacoes</h1>
          <p className="text-slate-500">
            {unreadCount > 0 ? `${unreadCount} nao lidas` : "Tudo em dia!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm">
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <Card>
        <div className="divide-y divide-slate-100">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 p-4 transition-colors cursor-pointer hover:bg-slate-50",
                  !notif.isRead && "bg-emerald-50/50"
                )}
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", notif.iconColor)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm font-medium", !notif.isRead ? "text-slate-900" : "text-slate-700")}>
                      {notif.title}
                    </p>
                    {!notif.isRead && <span className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
