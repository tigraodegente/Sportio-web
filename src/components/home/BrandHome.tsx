"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye,
  MousePointer,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Pause,
  Edit3,
  FileText,
  Users,
  BarChart3,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { SectionHeader } from "./SectionHeader";
import {
  mockCampaigns,
  mockSponsorableAthletes,
  mockROIData,
} from "@/lib/mock/home-data";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const campaignStatusConfig = {
  active: { label: "Ativa", variant: "success" as const },
  paused: { label: "Pausada", variant: "accent" as const },
  completed: { label: "Concluída", variant: "default" as const },
};

export function BrandHome() {
  const totalImpressions = mockCampaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = mockCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const totalSpend = mockCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;

  return (
    <div className="space-y-8">
      {/* Campaign Metrics */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3 }}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatsCard
            title="Impressões"
            value={totalImpressions.toLocaleString("pt-BR")}
            change="▲ 12% vs mês anterior"
            changeType="positive"
            icon={<Eye className="w-5 h-5" />}
          />
          <StatsCard
            title="Cliques"
            value={totalClicks.toLocaleString("pt-BR")}
            change="▲ 8% vs mês anterior"
            changeType="positive"
            icon={<MousePointer className="w-5 h-5" />}
          />
          <StatsCard
            title="CTR Médio"
            value={`${avgCTR.toFixed(2)}%`}
            change="▲ 0.3pp vs mês anterior"
            changeType="positive"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            title="CPC Médio"
            value={formatCurrency(avgCPC)}
            change="▼ 5% vs mês anterior"
            changeType="positive"
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>
      </motion.section>

      {/* Active Campaigns */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.1 }}>
        <SectionHeader title="Campanhas Ativas" href="/brand" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockCampaigns.map((campaign) => {
            const config = campaignStatusConfig[campaign.status];
            return (
              <div
                key={campaign.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{campaign.name}</h3>
                  <Badge variant={config.variant} className="text-[10px] flex-shrink-0">{config.label}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 rounded-lg bg-slate-50">
                    <p className="text-[10px] text-slate-400">Impressões</p>
                    <p className="text-xs font-bold text-slate-900">{(campaign.impressions / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-50">
                    <p className="text-[10px] text-slate-400">Cliques</p>
                    <p className="text-xs font-bold text-slate-900">{(campaign.clicks / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-50">
                    <p className="text-[10px] text-slate-400">CTR</p>
                    <p className="text-xs font-bold text-slate-900">{campaign.ctr.toFixed(2)}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Investido: <span className="font-semibold text-slate-700">{formatCurrency(campaign.spend)}</span>
                  </span>
                  <div className="flex gap-1.5">
                    {campaign.status === "active" && (
                      <Button size="sm" variant="ghost" className="text-[10px] px-2 py-1 text-amber-600 hover:bg-amber-50">
                        <Pause className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-[10px] px-2 py-1">
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-[10px] px-2 py-1">
                      <FileText className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Create Campaign CTA */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.15 }}>
        <Link
          href="/brand/campaigns/create"
          className="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/50 p-6 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Criar Campanha</p>
            <p className="text-xs text-purple-500">Alcance milhares de atletas e fãs</p>
          </div>
        </Link>
      </motion.section>

      {/* Athlete Marketplace Preview */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.2 }}>
        <SectionHeader title="Marketplace de Atletas" href="/brand/athletes" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockSponsorableAthletes.map((athlete) => (
            <div
              key={athlete.id}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={athlete.name} src={athlete.image} size="md" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{athlete.name}</h3>
                  <span className="text-xs text-slate-500">{athlete.sport}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-slate-50">
                  <p className="text-[10px] text-slate-400">Seguidores</p>
                  <p className="text-xs font-bold text-slate-900">{(athlete.followers / 1000).toFixed(1)}K</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50">
                  <p className="text-[10px] text-slate-400">Engajamento</p>
                  <p className="text-xs font-bold text-slate-900">{athlete.engagementRate}%</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50">
                  <p className="text-[10px] text-slate-400">CPM</p>
                  <p className="text-xs font-bold text-slate-900">{formatCurrency(athlete.cpm)}</p>
                </div>
              </div>

              <Link href={`/brand/athletes/${athlete.id}`}>
                <Button size="sm" className="w-full text-xs">
                  Patrocinar — {formatCurrency(athlete.monthlyPrice)}/mês
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ROI Summary Chart */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.3 }}>
        <SectionHeader title="ROI - Investimento vs Retorno" href="/brand" linkText="Relatório Completo" />
        <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockROIData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [formatCurrency(value as number), ""]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="spend"
                  name="Investido"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ fill: "#f59e0b", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="returns"
                  name="Retorno"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
