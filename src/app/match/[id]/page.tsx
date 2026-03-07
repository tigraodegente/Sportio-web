"use client";

import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs } from "@/components/ui/tabs";
import { MatchHeader } from "@/components/match/MatchHeader";
import { MatchEvents } from "@/components/match/MatchEvents";
import { MatchStats } from "@/components/match/MatchStats";
import { MomentumGraph } from "@/components/match/MomentumGraph";
import { BettingSection } from "@/components/match/BettingSection";
import { BetSlip, type BetSlipItem } from "@/components/match/BetSlip";
import { LiveChat } from "@/components/match/LiveChat";
import { ActiveBets } from "@/components/match/ActiveBets";
import { mockLiveMatch, mockUserBalance } from "@/lib/mock/match-data";

export default function MatchPage() {
  const match = mockLiveMatch;
  const [betSlipItems, setBetSlipItems] = useState<BetSlipItem[]>([]);

  const handleToggleBet = useCallback(
    (optionId: string, marketName: string, label: string, odds: number) => {
      setBetSlipItems((prev) => {
        const exists = prev.find((item) => item.id === optionId);
        if (exists) {
          return prev.filter((item) => item.id !== optionId);
        }
        return [...prev, { id: optionId, market: marketName, selection: label, odds }];
      });
    },
    []
  );

  const handleRemoveBet = useCallback((id: string) => {
    setBetSlipItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearBets = useCallback(() => {
    setBetSlipItems([]);
  }, []);

  const handleConfirmBet = useCallback((_stake: number) => {
    // In a real app, this would call a tRPC mutation
    setBetSlipItems([]);
  }, []);

  const handleCashOut = useCallback((_betId: string) => {
    // In a real app, this would call a tRPC mutation
  }, []);

  const selectedBetIds = betSlipItems.map((item) => item.id);

  // Dark theme tab variant for match page
  const matchTabs = [
    { id: "events", label: "Eventos" },
    { id: "stats", label: "Estatísticas" },
    { id: "momentum", label: "Momentum" },
  ];

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#0A1628]/90 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/bets"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </p>
            <p className="text-xs text-slate-400">{match.competition}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
        <div className="lg:flex lg:gap-6">
          {/* Left column */}
          <div className="flex-1 space-y-5 lg:space-y-6 min-w-0 pb-32 lg:pb-6">
            {/* Match header */}
            <MatchHeader
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              homeScore={match.homeScore}
              awayScore={match.awayScore}
              minute={match.minute}
              period={match.period}
              competition={match.competition}
              round={match.round}
              status={match.status}
            />

            {/* Events / Stats / Momentum tabs (mobile: stacked, desktop: tabbed) */}
            <div className="block lg:hidden space-y-5">
              <MatchEvents
                events={match.events}
                homeTeamName={match.homeTeam.name}
                awayTeamName={match.awayTeam.name}
              />
              <MatchStats
                stats={match.stats}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
              />
              <MomentumGraph
                data={match.momentum}
                currentMinute={match.minute}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
              />
            </div>

            <div className="hidden lg:block">
              <Tabs tabs={matchTabs} defaultTab="events" variant="dark">
                {(tab) => {
                  if (tab === "events") {
                    return (
                      <MatchEvents
                        events={match.events}
                        homeTeamName={match.homeTeam.name}
                        awayTeamName={match.awayTeam.name}
                      />
                    );
                  }
                  if (tab === "stats") {
                    return (
                      <MatchStats
                        stats={match.stats}
                        homeTeam={match.homeTeam}
                        awayTeam={match.awayTeam}
                      />
                    );
                  }
                  return (
                    <MomentumGraph
                      data={match.momentum}
                      currentMinute={match.minute}
                      homeTeam={match.homeTeam}
                      awayTeam={match.awayTeam}
                    />
                  );
                }}
              </Tabs>
            </div>

            {/* Betting section */}
            <BettingSection
              markets={match.markets}
              selectedBets={selectedBetIds}
              onToggleBet={handleToggleBet}
            />

            {/* Active bets */}
            <ActiveBets bets={match.activeBets} onCashOut={handleCashOut} />

            {/* Live chat */}
            <LiveChat messages={match.chat} />
          </div>

          {/* Right column: Bet Slip (desktop) */}
          <div className="hidden lg:block w-80 shrink-0">
            <BetSlip
              items={betSlipItems}
              balance={mockUserBalance}
              onRemove={handleRemoveBet}
              onClear={handleClearBets}
              onConfirm={handleConfirmBet}
            />
          </div>
        </div>
      </div>

      {/* Mobile bet slip */}
      <div className="lg:hidden">
        <BetSlip
          items={betSlipItems}
          balance={mockUserBalance}
          onRemove={handleRemoveBet}
          onClear={handleClearBets}
          onConfirm={handleConfirmBet}
        />
      </div>
    </div>
  );
}
