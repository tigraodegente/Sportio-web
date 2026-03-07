"use client";

import { useState } from "react";
import { CreatorBanner } from "@/components/creator/CreatorBanner";
import { CreatorHeader } from "@/components/creator/CreatorHeader";
import { CreatorTabs } from "@/components/creator/CreatorTabs";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { GiftPickerModal } from "@/components/creator/GiftPickerModal";
import { PostsTab } from "@/components/creator/tabs/PostsTab";
import { StatsTab } from "@/components/creator/tabs/StatsTab";
import { EquipmentTab } from "@/components/creator/tabs/EquipmentTab";
import { ExclusiveTab } from "@/components/creator/tabs/ExclusiveTab";
import { Trophy, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  MOCK_CREATOR,
  MOCK_TIERS,
  MOCK_POSTS,
  MOCK_STATS,
  MOCK_EQUIPMENT,
  MOCK_FANS,
  MOCK_GIFTS,
} from "@/lib/mock/creator-data";

// Placeholder tabs for Torneios and Conquistas
function TorneiosTab() {
  const tournaments = [
    { name: "Circuito Carioca BT 2026", result: "Campea", date: "Mar 2026", sport: "Beach Tennis" },
    { name: "Meia Maratona do Rio", result: "3o Lugar", date: "Jan 2026", sport: "Corrida" },
    { name: "Open de Beach Tennis - Barra", result: "Campea", date: "Dez 2025", sport: "Beach Tennis" },
    { name: "10K Night Run SP", result: "1o Lugar", date: "Nov 2025", sport: "Corrida" },
    { name: "Copa Litoranea BT", result: "Vice-Campea", date: "Out 2025", sport: "Beach Tennis" },
    { name: "Maratona de Sao Paulo", result: "5o Lugar", date: "Set 2025", sport: "Corrida" },
  ];

  return (
    <div className="space-y-3">
      {tournaments.map((t, i) => (
        <Card key={i} className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{t.name}</p>
            <p className="text-xs text-slate-500">{t.sport} &middot; {t.date}</p>
          </div>
          <Badge variant={t.result.includes("Campea") ? "success" : t.result.includes("Vice") ? "primary" : "default"}>
            {t.result}
          </Badge>
        </Card>
      ))}
    </div>
  );
}

function ConquistasTab() {
  const achievements = [
    { name: "Maratonista", description: "Completou uma maratona (42K)", emoji: "\uD83C\uDFC5", date: "Set 2025" },
    { name: "100 Vitorias", description: "Venceu 100 partidas de BT", emoji: "\uD83C\uDFC6", date: "Nov 2025" },
    { name: "Streak 10", description: "10 vitorias consecutivas", emoji: "\uD83D\uDD25", date: "Jan 2026" },
    { name: "Top 20 Ranking", description: "Entrou no top 20 do ranking estadual", emoji: "\u2B50", date: "Fev 2026" },
    { name: "1000 Km", description: "Correu 1000 km na plataforma", emoji: "\uD83D\uDEB4", date: "Mar 2026" },
    { name: "Criador Popular", description: "Atingiu 10K seguidores", emoji: "\uD83D\uDC8E", date: "Fev 2026" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {achievements.map((a, i) => (
        <Card key={i} className="flex items-start gap-3">
          <span className="text-3xl">{a.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900">{a.name}</p>
              <Award className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
            <p className="text-[10px] text-slate-400 mt-1">{a.date}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function AthleteProfilePage() {
  const [giftModalOpen, setGiftModalOpen] = useState(false);

  const creator = MOCK_CREATOR;

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Banner */}
      <CreatorBanner creator={creator} />

      {/* Header */}
      <CreatorHeader
        creator={creator}
        tiers={MOCK_TIERS}
        onGiftClick={() => setGiftModalOpen(true)}
      />

      {/* Main content with sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1 min-w-0">
            <CreatorTabs>
              {(tab) => {
                switch (tab) {
                  case "posts":
                    return <PostsTab posts={MOCK_POSTS} creator={creator} />;
                  case "stats":
                    return <StatsTab stats={MOCK_STATS} />;
                  case "torneios":
                    return <TorneiosTab />;
                  case "exclusivo":
                    return <ExclusiveTab posts={MOCK_POSTS} tiers={MOCK_TIERS} />;
                  case "conquistas":
                    return <ConquistasTab />;
                  case "equipamento":
                    return <EquipmentTab products={MOCK_EQUIPMENT} creator={creator} />;
                  default:
                    return null;
                }
              }}
            </CreatorTabs>
          </div>

          {/* Sidebar (desktop) */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <CreatorSidebar tiers={MOCK_TIERS} fans={MOCK_FANS} />
            </div>
          </div>
        </div>
      </div>

      {/* Gift Picker Modal */}
      <GiftPickerModal
        isOpen={giftModalOpen}
        onClose={() => setGiftModalOpen(false)}
        gifts={MOCK_GIFTS}
        recipientName={creator.name}
      />
    </main>
  );
}
