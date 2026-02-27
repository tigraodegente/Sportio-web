"use client";

import { MapPin, Calendar, Star, Coins, Edit3, Instagram, Twitter, Trophy, Zap, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import Link from "next/link";

const profile = {
  name: "Lucas Mendes",
  bio: "Atleta de Beach Tennis e CrossFit. Apaixonado por esporte e competicao. Nivel A em Beach Tennis, B em CrossFit.",
  city: "Sao Paulo, SP",
  joinedAt: "Jan 2024",
  isPro: true,
  isVerified: true,
  level: 15,
  xp: 4850,
  roles: ["Atleta", "Palpiteiro"],
  sports: [
    { name: "Beach Tennis", level: "A", rating: 1850, wins: 28, losses: 7 },
    { name: "CrossFit", level: "B", rating: 1420, wins: 12, losses: 5 },
    { name: "Corrida", level: "C", rating: 1100, wins: 3, losses: 2 },
  ],
  social: { instagram: "lucasmendes", twitter: "lucasmendes", youtube: null },
  stats: { followers: 1240, following: 380, tournaments: 47, gcoins: 12500 },
};

const achievements = [
  { id: "1", title: "Primeira Vitoria", description: "Ganhou seu primeiro torneio", icon: "🏆", date: "Fev 2024" },
  { id: "2", title: "Sequencia de 5", description: "5 vitorias consecutivas", icon: "🔥", date: "Mar 2024" },
  { id: "3", title: "Top 100", description: "Entrou no ranking Top 100", icon: "⭐", date: "Jun 2024" },
  { id: "4", title: "Palpiteiro Expert", description: "Acertou 50 palpites", icon: "🎯", date: "Ago 2024" },
  { id: "5", title: "1000 GCoins", description: "Acumulou 1000 GCoins", icon: "💰", date: "Out 2024" },
  { id: "6", title: "Social Star", description: "100 seguidores", icon: "⭐", date: "Dez 2024" },
];

const recentResults = [
  { tournament: "Copa Beach Tennis SP", placement: 1, prize: 2500, date: "15 Mar" },
  { tournament: "Liga CrossFit Brasil", placement: 3, prize: 500, date: "10 Mar" },
  { tournament: "Beach Tennis Open", placement: 2, prize: 1000, date: "1 Mar" },
  { tournament: "Corrida 10K Sportio", placement: 12, prize: 0, date: "20 Fev" },
];

function getLevelGradient(level: string) {
  if (level === "A") return "from-amber-400 via-yellow-300 to-amber-500";
  if (level === "B") return "from-emerald-400 via-emerald-300 to-emerald-500";
  return "from-slate-400 via-slate-300 to-slate-500";
}

function getWinRate(wins: number, losses: number) {
  return Math.round((wins / (wins + losses)) * 100);
}

export default function ProfilePage() {
  const xpPercent = Math.round((profile.xp / 6000) * 100);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        {/* Gradient banner with decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900">
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
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-300" />
            <Avatar name={profile.name} size="xl" className="relative ring-4 ring-white shadow-xl" />
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
              {profile.roles.map((role) => (
                <Badge key={role} variant="default">{role}</Badge>
              ))}
            </div>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{profile.bio}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                </span>
                {profile.city}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                </span>
                Membro desde {profile.joinedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-100">
                  <Star className="w-3.5 h-3.5 text-emerald-600" />
                </span>
                <span className="font-semibold text-emerald-700">Nivel {profile.level}</span>
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
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">{profile.stats.followers.toLocaleString()}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Seguidores</p>
          </div>
          <div className="text-center group cursor-pointer rounded-xl py-2 transition-all duration-200 hover:bg-slate-50">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">{profile.stats.following}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Seguindo</p>
          </div>
          <div className="text-center group cursor-pointer rounded-xl py-2 transition-all duration-200 hover:bg-slate-50">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">{profile.stats.tournaments}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Torneios</p>
          </div>
          <div className="text-center group cursor-pointer rounded-xl py-2 transition-all duration-200 hover:bg-amber-50/80">
            <p className="text-xl sm:text-2xl font-extrabold text-amber-600 flex items-center justify-center gap-1.5">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 animate-coin-bounce">
                <Coins className="w-4 h-4 text-amber-600" />
              </span>
              {profile.stats.gcoins.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">GCoins</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-3 mt-4">
          {profile.social.instagram && (
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-slate-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>
          )}
          {profile.social.twitter && (
            <a
              href="#"
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
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-100">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
            </span>
            <CardTitle>Progresso</CardTitle>
          </div>
          <span className="text-sm font-semibold text-slate-500">
            Nivel {profile.level} <ChevronRight className="w-3.5 h-3.5 inline" /> {profile.level + 1}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Level start icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/25 flex-shrink-0">
            {profile.level}
          </div>

          {/* Progress bar */}
          <div className="flex-1 relative">
            <div className="w-full bg-slate-200/80 rounded-full h-5 overflow-hidden">
              <div
                className="relative bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 rounded-full h-5 transition-all duration-1000 ease-out"
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
            {profile.level + 1}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-2 text-center">{profile.xp.toLocaleString()} / 6,000 XP</p>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "sports", label: "Esportes" },
          { id: "results", label: "Resultados" },
          { id: "achievements", label: "Conquistas" },
        ]}
      >
        {(tab) => (
          <>
            {tab === "sports" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.sports.map((sport) => {
                  const winRate = getWinRate(sport.wins, sport.losses);
                  const total = sport.wins + sport.losses;
                  const winWidth = (sport.wins / total) * 100;
                  const lossWidth = (sport.losses / total) * 100;

                  return (
                    <Card key={sport.name} hover className="relative overflow-hidden pt-0">
                      {/* Gradient accent bar based on level */}
                      <div className={`h-1.5 bg-gradient-to-r ${getLevelGradient(sport.level)} -mx-5 sm:-mx-6 mb-5`} />

                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">{sport.name}</h3>
                        <Badge
                          variant={sport.level === "A" ? "accent" : sport.level === "B" ? "primary" : "default"}
                          className={
                            sport.level === "A"
                              ? "shadow-sm shadow-amber-200/50"
                              : sport.level === "B"
                              ? "shadow-sm shadow-emerald-200/50"
                              : ""
                          }
                        >
                          Nivel {sport.level}
                        </Badge>
                      </div>

                      {/* Rating - larger with ELO label */}
                      <div className="text-center mb-4 py-3 rounded-xl bg-slate-50/80">
                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{sport.rating}</p>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">ELO Rating</p>
                      </div>

                      {/* Win/Loss mini bar chart */}
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-green-600">{sport.wins}V</span>
                          <span className="font-semibold text-slate-500">{winRate}%</span>
                          <span className="font-bold text-red-500">{sport.losses}D</span>
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

            {tab === "results" && (
              <Card>
                <div className="divide-y divide-slate-100">
                  {recentResults.map((result, i) => (
                    <div key={i} className="flex items-center justify-between py-4 group hover:bg-slate-50/50 -mx-5 sm:-mx-6 px-5 sm:px-6 transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        {/* Larger placement medals */}
                        {result.placement <= 3 ? (
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-2xl text-2xl ${
                              result.placement === 1
                                ? "bg-gradient-to-br from-amber-100 to-yellow-50 shadow-sm shadow-amber-200/50"
                                : result.placement === 2
                                ? "bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm shadow-slate-200/50"
                                : "bg-gradient-to-br from-orange-100 to-amber-50 shadow-sm shadow-orange-200/50"
                            }`}
                          >
                            {result.placement === 1 ? "🥇" : result.placement === 2 ? "🥈" : "🥉"}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 font-bold text-sm">
                            #{result.placement}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{result.tournament}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{result.date}</p>
                        </div>
                      </div>
                      {result.prize > 0 && (
                        <span className="flex items-center gap-1.5 text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl">
                          <span className="animate-coin-bounce inline-flex">
                            <Coins className="w-4 h-4" />
                          </span>
                          {result.prize.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {tab === "achievements" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((a) => (
                  <Card key={a.id} hover className="group">
                    <div className="flex items-center gap-4">
                      {/* Icon with glow effect and scale on hover */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                          <span className="text-3xl animate-glow-pulse">{a.icon}</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-200">{a.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{a.date}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
