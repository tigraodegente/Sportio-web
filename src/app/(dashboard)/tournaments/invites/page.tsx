"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Trophy,
  Calendar,
  MapPin,
  Users,
  Building2,
  Check,
  X,
  Clock,
  Loader2,
  UserPlus,
  Coins,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "--";
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
}

function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function InvitesPage() {
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  const invitesQuery = trpc.tournament.myInvites.useQuery(
    filter === "pending" ? { status: "pending" } : undefined
  );

  const respondMutation = trpc.tournament.respondToInvite.useMutation({
    onSuccess: () => {
      invitesQuery.refetch();
    },
  });

  const pendingCountQuery = trpc.tournament.pendingInvitesCount.useQuery();

  const invites = invitesQuery.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Meus Convites
                {(pendingCountQuery.data ?? 0) > 0 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold animate-pulse">
                    {pendingCountQuery.data}
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-500">Convites recebidos para torneios e patrocinios</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "pending"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {/* All read celebration */}
      {filter === "pending" && invites.length === 0 && !invitesQuery.isLoading && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center">
          <PartyPopper className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="font-semibold text-green-800">Tudo em dia!</p>
          <p className="text-sm text-green-600 mt-1">Você não tem convites pendentes.</p>
        </div>
      )}

      {/* Loading */}
      {invitesQuery.isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Invites List */}
      {invites.length > 0 && (
        <div className="space-y-4">
          {invites.map((invite) => {
            const tournament = invite.tournament;
            const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
            const isPending = invite.status === "pending" && !isExpired;

            return (
              <Card key={invite.id} className={`overflow-hidden transition-all ${isPending ? "border-blue-200 shadow-sm" : ""}`}>
                {isPending && (
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
                )}
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      invite.type === "athlete"
                        ? "bg-blue-100"
                        : "bg-amber-100"
                    }`}>
                      {invite.type === "athlete" ? (
                        <UserPlus className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Building2 className="w-6 h-6 text-amber-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={invite.type === "athlete" ? "primary" : "accent"} className="text-[10px]">
                          {invite.type === "athlete" ? "Convite Atleta" : "Convite Patrocinio"}
                        </Badge>
                        {invite.suggestedTier && (
                          <Badge variant="default" className="text-[10px]">
                            Tier: {invite.suggestedTier === "main" ? "Principal" : invite.suggestedTier === "gold" ? "Ouro" : invite.suggestedTier === "silver" ? "Prata" : "Bronze"}
                          </Badge>
                        )}
                        <span className="text-[10px] text-slate-400 ml-auto">{timeAgo(invite.createdAt)}</span>
                      </div>

                      {/* Tournament Info */}
                      <Link href={`/tournaments/${tournament?.id}`} className="group">
                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {tournament?.name ?? "Torneio"}
                        </h3>
                      </Link>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                        {tournament?.sport?.name && (
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            {tournament.sport.name}
                          </span>
                        )}
                        {tournament?.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(tournament.startDate)}
                          </span>
                        )}
                        {(tournament?.city || tournament?.isOnline) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {tournament.isOnline ? "Online" : tournament.city}
                          </span>
                        )}
                      </div>

                      {/* Organizer */}
                      <div className="flex items-center gap-2 mt-3">
                        <Avatar name={invite.invitedBy?.name ?? "Organizador"} size="sm" />
                        <span className="text-xs text-slate-500">
                          Convite de <span className="font-medium text-slate-700">{invite.invitedBy?.name ?? "Organizador"}</span>
                        </span>
                      </div>

                      {/* Message */}
                      {invite.message && (
                        <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <p className="text-sm text-slate-600 italic">&quot;{invite.message}&quot;</p>
                        </div>
                      )}

                      {/* Expiry warning */}
                      {isPending && invite.expiresAt && (
                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expira em {formatDate(invite.expiresAt)}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      {isPending ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => respondMutation.mutate({ inviteId: invite.id, response: "accepted" })}
                            loading={respondMutation.isPending}
                            disabled={respondMutation.isPending}
                            className="text-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Aceitar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => respondMutation.mutate({ inviteId: invite.id, response: "declined" })}
                            disabled={respondMutation.isPending}
                            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            Recusar
                          </Button>
                        </>
                      ) : (
                        <Badge
                          variant={
                            invite.status === "accepted" ? "success" :
                            invite.status === "declined" ? "danger" :
                            "default"
                          }
                          className="text-xs"
                        >
                          {invite.status === "accepted" ? "Aceito" :
                           invite.status === "declined" ? "Recusado" :
                           isExpired ? "Expirado" :
                           invite.status}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Success/Error feedback */}
                  {respondMutation.isSuccess && respondMutation.variables?.inviteId === invite.id && (
                    <div className="mt-3 p-2 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-xs text-green-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {respondMutation.variables.response === "accepted"
                          ? invite.type === "athlete" ? "Inscricao confirmada!" : "Patrocinio aceito! Acesse o painel de marcas para configurar."
                          : "Convite recusado."
                        }
                      </p>
                    </div>
                  )}
                  {respondMutation.error && respondMutation.variables?.inviteId === invite.id && (
                    <p className="text-xs text-red-500 mt-2">{respondMutation.error.message}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty state for "all" filter */}
      {filter === "all" && invites.length === 0 && !invitesQuery.isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum convite</h3>
          <p className="text-sm text-slate-500">Você ainda não recebeu nenhum convite para torneios.</p>
        </div>
      )}
    </div>
  );
}
