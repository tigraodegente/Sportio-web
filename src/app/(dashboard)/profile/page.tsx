"use client";

import { MapPin, Calendar, Star, Coins, Edit3, Instagram, Twitter, Trophy, Zap, TrendingUp, ChevronRight, Loader2, AlertCircle, CheckCircle, Lock, Target, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

const ROLE_LABELS: Record<string, string> = {
  athlete: "Atleta",
  organizer: "Organizador",
  brand: "Marca",
  fan: "Fã",
  bettor: "Palpiteiro",
  referee: "Árbitro",
  trainer: "Treinador",
  nutritionist: "Nutricionista",
  photographer: "Fotógrafo",
  arena_owner: "Dono de Arena",
  admin: "Admin",
};

function getLevelGradient(level: string | null) {
  if (level === "A") return "from-amber-400 via-yellow-300 to-amber-500";
  if (level === "B") return "from-blue-400 via-blue-300 to-blue-500";
  return "from-slate-400 via-slate-300 to-slate-500";
}

function getWinRate(wins: number, losses: number) {
  const total = wins + losses;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

function formatDate(date: Date | string) {
  const d = new Date(date);
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ProfilePage() {
  const user = trpc.user.me.useQuery();
  const followCounts = trpc.user.getFollowCounts.useQuery(
    { userId: user.data?.id ?? "" },
    { enabled: !!user.data?.id }
  );
  const achievementsQuery = trpc.gamification.achievements.useQuery({});
  const missionsQuery = trpc.gamification.myMissions.useQuery();

  if (user.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (user.error || !user.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-slate-600 font-medium">Erro ao carregar perfil</p>
        <Button variant="outline" size="sm" onClick={() => user.refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const profile = user.data;
  const xp = profile.xp ?? 0;
  const level = profile.level ?? 1;
  const xpPercent = Math.round((xp / 6000) * 100);
  const gcoinsReal = Number(profile.gcoinsReal ?? 0);
  const gcoinsGamification = Number(profile.gcoinsGamification ?? 0);
  const totalGcoins = Math.round(gcoinsReal + gcoinsGamification);
  const location = [profile.city, profile.state].filter(Boolean).join(", ");
  const followersCount = followCounts.data?.followers ?? 0;
  const followingCount = followCounts.data?.following ?? 0;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        {/* Gradient banner with decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
          {/* Large circle blur top-right */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          {/* Smaller circle blur */}
          <div className="absolute top-4 right-1/3 w-20 h-20 bg-white/5 rounded-full blur-xl" />
          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/20 to-transparent" />
        </div>

        <div className="relative pt-20 flex flex-col sm:flex-row gap-4 items-start">
          {/* Avatar with glow ring effect */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-300" />
            <Avatar src={profile.image} name={profile.name} size="xl" className="relative ring-4 ring-white shadow-xl" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{profile.name}</h1>
              {profile.isVerified && <Badge variant="primary">Verificado</Badge>}
              {profile.isPro && (
                <Badge variant="accent" className="shadow-sm shadow-amber-200/50">
                  <Zap className="w-3 h-3" />
                  PRO
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {profile.roles.map((r) => (
                <Badge key={r.id} variant="default">{ROLE_LABELS[r.role] ?? r.role}</Badge>
              ))}
            </div>
            {profile.bio && (
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{profile.bio}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
              {location && (
                <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  </span>
                  {location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                </span>
                Membro desde {formatDate(profile.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100">
                  <Star className="w-3.5 h-3.5 text-blue-600" />
                </span>
                <span className="font-semibold text-blue-700">Nivel {level}</span>
              </span>
            </div>
          </div>

          <Link href="/settings">
            <Button variant="outline" size="sm" className="group">
              <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
              Editar Perfil
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="text-center group cursor-pointer rounded-xl py-2 transition-all duration-200 hover:bg-slate-50">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
              {followCounts.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin inline" />
              ) : (
                followersCount.toLocaleString()
              )}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Seguidores</p>
          </div>
          <div className="text-center group cursor-pointer rounded-xl py-2 transition-all duration-200 hover:bg-slate-50">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
              {followCounts.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin inline" />
              ) : (
                followingCount.toLocaleString()
              )}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Seguindo</p>
          </div>
          <div className="text-center group cursor-pointer rounded-xl py-2 transition-all duration-200 hover:bg-slate-50">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">{profile.sports.length}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Esportes</p>
          </div>
          <div className="text-center group cursor-pointer rounded-xl py-2 transition-all duration-200 hover:bg-amber-50/80">
            <p className="text-xl sm:text-2xl font-extrabold text-amber-600 flex items-center justify-center gap-1.5">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 animate-coin-bounce">
                <Coins className="w-4 h-4 text-amber-600" />
              </span>
              {totalGcoins.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">GCoins</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-3 mt-4">
          {profile.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-slate-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>
          )}
          {profile.twitter && (
            <a
              href={`https://twitter.com/${profile.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-slate-400 hover:bg-gradient-to-br hover:from-blue-400 hover:to-blue-600 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              <Twitter className="w-4.5 h-4.5" />
            </a>
          )}
        </div>
      </Card>

      {/* XP Progress */}
      <Card className="relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-100">
              <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
            </span>
            <CardTitle>Progresso</CardTitle>
          </div>
          <span className="text-sm font-semibold text-slate-500">
            Nivel {level} <ChevronRight className="w-3.5 h-3.5 inline" /> {level + 1}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Level start icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex-shrink-0">
            {level}
          </div>

          {/* Progress bar */}
          <div className="flex-1 relative">
            <div className="w-full bg-slate-200/80 rounded-full h-5 overflow-hidden">
              <div
                className="relative bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full h-5 transition-all duration-1000 ease-out"
                style={{ width: `${xpPercent}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-bar" />
                </div>
              </div>
              {/* Percentage text overlay */}
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
                {xpPercent}%
              </span>
            </div>
          </div>

          {/* Level end icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-500 font-bold text-sm border-2 border-dashed border-slate-300 flex-shrink-0">
            {level + 1}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-2 text-center">{xp.toLocaleString()} / 6,000 XP</p>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "sports", label: "Esportes" },
          { id: "achievements", label: "Conquistas" },
          { id: "missions", label: "Missoes" },
        ]}
      >
        {(tab) => (
          <>
            {tab === "sports" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.sports.length === 0 && (
                  <div className="col-span-full text-center py-8 text-slate-400">
                    <Trophy className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium">Nenhum esporte adicionado ainda</p>
                    <p className="text-sm mt-1">Adicione seus esportes nas configuracoes</p>
                  </div>
                )}
                {profile.sports.map((us) => {
                  const sportName = us.sport?.name ?? "Esporte";
                  const sportLevel = us.level ?? "C";
                  const wins = us.wins ?? 0;
                  const losses = us.losses ?? 0;
                  const rating = Number(us.rating ?? 1000);
                  const winRate = getWinRate(wins, losses);
                  const total = wins + losses;
                  const winWidth = total > 0 ? (wins / total) * 100 : 50;
                  const lossWidth = total > 0 ? (losses / total) * 100 : 50;

                  return (
                    <Card key={us.id} hover className="relative overflow-hidden pt-0">
                      {/* Gradient accent bar based on level */}
                      <div className={`h-1.5 bg-gradient-to-r ${getLevelGradient(sportLevel)} -mx-5 sm:-mx-6 mb-5`} />

                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">{sportName}</h3>
                        <Badge
                          variant={sportLevel === "A" ? "accent" : sportLevel === "B" ? "primary" : "default"}
                          className={
                            sportLevel === "A"
                              ? "shadow-sm shadow-amber-200/50"
                              : sportLevel === "B"
                              ? "shadow-sm shadow-blue-200/50"
                              : ""
                          }
                        >
                          Nivel {sportLevel}
                        </Badge>
                      </div>

                      {/* Rating - larger with ELO label */}
                      <div className="text-center mb-4 py-3 rounded-xl bg-slate-50/80">
                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{rating}</p>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">ELO Rating</p>
                      </div>

                      {/* Win/Loss mini bar chart */}
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-green-600">{wins}V</span>
                          <span className="font-semibold text-slate-500">{winRate}%</span>
                          <span className="font-bold text-red-500">{losses}D</span>
                        </div>
                        {/* Bar chart visual */}
                        <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-500 rounded-l-full transition-all duration-500"
                            style={{ width: `${winWidth}%` }}
                          />
                          <div
                            className="bg-gradient-to-r from-red-400 to-red-500 rounded-r-full transition-all duration-500"
                            style={{ width: `${lossWidth}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {tab === "achievements" && (
              <div className="space-y-4">
                {achievementsQuery.isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-500">
                        {(achievementsQuery.data ?? []).filter(a => a.completed).length} de {(achievementsQuery.data ?? []).length} desbloqueadas
                      </p>
                      <Link href="/achievements">
                        <Button variant="outline" size="sm">
                          Ver todas <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(achievementsQuery.data ?? []).filter(a => a.completed).slice(0, 6).map(a => (
                        <Card key={a.id} className="flex items-center gap-3 py-3 border-green-200 bg-green-50/50">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 truncate">{a.name}</p>
                            <p className="text-xs text-slate-500 truncate">{a.description}</p>
                          </div>
                        </Card>
                      ))}
                      {(achievementsQuery.data ?? []).filter(a => !a.completed).slice(0, 3).map(a => (
                        <Card key={a.id} className="flex items-center gap-3 py-3 opacity-60">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0">
                            <Lock className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 truncate">{a.name}</p>
                            <p className="text-xs text-slate-500">{a.progress}/{a.target}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                    {(achievementsQuery.data ?? []).length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <Medal className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p className="font-medium">Nenhuma conquista disponivel</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {tab === "missions" && (
              <div className="space-y-4">
                {missionsQuery.isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-500">
                        {(missionsQuery.data ?? []).filter(m => m.completedAt).length} de {(missionsQuery.data ?? []).length} concluidas
                      </p>
                      <Link href="/missions">
                        <Button variant="outline" size="sm">
                          Ver todas <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {(missionsQuery.data ?? []).slice(0, 5).map(um => {
                        const mission = um.mission;
                        if (!mission) return null;
                        const req = mission.requirement as { count: number };
                        const pct = Math.min(((um.progress ?? 0) / (req?.count ?? 1)) * 100, 100);
                        return (
                          <Card key={um.id} className={`flex items-center gap-3 py-3 ${um.completedAt ? "border-green-200 bg-green-50/50" : ""}`}>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 ${um.completedAt ? "bg-green-100" : "bg-blue-100"}`}>
                              {um.completedAt ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Target className="w-5 h-5 text-blue-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-slate-900">{mission.name}</p>
                              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full ${um.completedAt ? "bg-green-500" : "bg-blue-500"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-slate-500 flex-shrink-0">{um.progress ?? 0}/{req?.count ?? 1}</span>
                          </Card>
                        );
                      })}
                    </div>
                    {(missionsQuery.data ?? []).length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <Target className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p className="font-medium">Nenhuma missao ativa</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
