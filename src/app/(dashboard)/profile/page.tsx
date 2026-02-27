"use client";

import { Trophy, MapPin, Calendar, Star, Users, Coins, Edit3, Instagram, Twitter, Youtube, Target, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import { StatsCard } from "@/components/ui/stats-card";
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

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-emerald-600 to-emerald-800" />
        <div className="relative pt-16 flex flex-col sm:flex-row gap-4 items-start">
          <Avatar name={profile.name} size="xl" className="ring-4 ring-white" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
              {profile.isVerified && <Badge variant="primary">Verificado</Badge>}
              {profile.isPro && <Badge variant="accent">PRO</Badge>}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.roles.map((role) => (
                <Badge key={role} variant="default">{role}</Badge>
              ))}
            </div>
            <p className="text-sm text-slate-600 mt-2">{profile.bio}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {profile.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Membro desde {profile.joinedAt}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" /> Nivel {profile.level}
              </span>
            </div>
          </div>
          <Link href="/settings">
            <Button variant="outline" size="sm">
              <Edit3 className="w-4 h-4" />
              Editar Perfil
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{profile.stats.followers.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Seguidores</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{profile.stats.following}</p>
            <p className="text-xs text-slate-500">Seguindo</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{profile.stats.tournaments}</p>
            <p className="text-xs text-slate-500">Torneios</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-amber-600">{profile.stats.gcoins.toLocaleString()}</p>
            <p className="text-xs text-slate-500">GCoins</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-3 mt-4">
          {profile.social.instagram && (
            <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {profile.social.twitter && (
            <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          )}
        </div>
      </Card>

      {/* XP Progress */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Progresso</CardTitle>
          <span className="text-sm text-slate-500">Nivel {profile.level} → {profile.level + 1}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full h-3" style={{ width: "72%" }} />
        </div>
        <p className="text-xs text-slate-500 mt-1">{profile.xp} / 6000 XP</p>
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
              <div className="grid sm:grid-cols-3 gap-4">
                {profile.sports.map((sport) => (
                  <Card key={sport.name} hover>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">{sport.name}</h3>
                      <Badge variant={sport.level === "A" ? "accent" : sport.level === "B" ? "primary" : "default"}>
                        Nivel {sport.level}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-2">{sport.rating}</p>
                    <p className="text-xs text-slate-500">Rating ELO</p>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-green-600">{sport.wins}V</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-600">{sport.losses}D</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-600">
                          {((sport.wins / (sport.wins + sport.losses)) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {tab === "results" && (
              <Card>
                <div className="divide-y divide-slate-100">
                  {recentResults.map((result, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {result.placement === 1 ? "🥇" : result.placement === 2 ? "🥈" : result.placement === 3 ? "🥉" : `#${result.placement}`}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{result.tournament}</p>
                          <p className="text-xs text-slate-500">{result.date}</p>
                        </div>
                      </div>
                      {result.prize > 0 && (
                        <span className="text-sm font-semibold text-amber-600 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" />
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
                  <Card key={a.id} hover>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{a.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900">{a.title}</p>
                        <p className="text-xs text-slate-500">{a.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{a.date}</p>
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
