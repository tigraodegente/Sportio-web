"use client";

import { useState } from "react";
import {
  BarChart3,
  Plus,
  Eye,
  MousePointerClick,
  Gift,
  Coins,
  Pause,
  Play,
  Trash2,
  ImageIcon,
  ExternalLink,
  Megaphone,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { Modal } from "@/components/ui/modal";
import { trpc } from "@/lib/trpc";

const campaignTypeLabels: Record<string, string> = {
  banner: "Banner",
  product_giveaway: "Sorteio de Produto",
  gcoin_reward: "Recompensa GCoins",
  tournament_sponsor: "Patrocinio Torneio",
  challenge_sponsor: "Patrocinio Desafio",
};

const placementLabels: Record<string, string> = {
  feed_banner: "Banner no Feed",
  sidebar: "Sidebar",
  tournament_sponsor: "Torneio",
  profile_banner: "Banner de Perfil",
  challenge_sponsor: "Desafio",
  post_promoted: "Post Promovido",
};

const statusColors: Record<string, "success" | "info" | "danger" | "default"> = {
  active: "success",
  pending: "info",
  paused: "default",
  completed: "default",
  rejected: "danger",
};

const statusLabels: Record<string, string> = {
  active: "Ativa",
  pending: "Pendente",
  paused: "Pausada",
  completed: "Finalizada",
  rejected: "Rejeitada",
};

export default function BrandDashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "banner" as string,
    placement: "feed_banner" as string,
    budget: 0,
    imageUrl: "",
    linkUrl: "",
    targetSportId: "",
    productName: "",
    productDescription: "",
    gcoinRewardAmount: 0,
    maxRedemptions: 0,
  });

  const utils = trpc.useUtils();
  const campaignsQuery = trpc.brand.myCampaigns.useQuery();
  const sportsQuery = trpc.social.getSports.useQuery();
  const balanceQuery = trpc.gcoin.balance.useQuery();

  const createCampaign = trpc.brand.createCampaign.useMutation({
    onSuccess: () => {
      setShowCreateModal(false);
      resetForm();
      utils.brand.myCampaigns.invalidate();
    },
  });

  const updateCampaign = trpc.brand.updateCampaign.useMutation({
    onSuccess: () => {
      utils.brand.myCampaigns.invalidate();
    },
  });

  const buyGcoins = trpc.brand.buyGcoins.useMutation({
    onSuccess: () => {
      utils.gcoin.balance.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "banner",
      placement: "feed_banner",
      budget: 0,
      imageUrl: "",
      linkUrl: "",
      targetSportId: "",
      productName: "",
      productDescription: "",
      gcoinRewardAmount: 0,
      maxRedemptions: 0,
    });
  };

  const handleCreate = () => {
    createCampaign.mutate({
      name: formData.name,
      description: formData.description || undefined,
      type: formData.type as "banner" | "product_giveaway" | "gcoin_reward" | "tournament_sponsor" | "challenge_sponsor",
      placement: formData.placement as "feed_banner" | "sidebar" | "tournament_sponsor" | "profile_banner" | "challenge_sponsor" | "post_promoted",
      budget: formData.budget,
      imageUrl: formData.imageUrl || undefined,
      linkUrl: formData.linkUrl || undefined,
      targetSportId: formData.targetSportId || undefined,
      productName: formData.productName || undefined,
      productDescription: formData.productDescription || undefined,
      gcoinRewardAmount: formData.gcoinRewardAmount || undefined,
      maxRedemptions: formData.maxRedemptions || undefined,
    });
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const campaigns = campaignsQuery.data ?? [];
  const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions ?? 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks ?? 0), 0);
  const totalRedemptions = campaigns.reduce((sum, c) => sum + (c.redemptions?.length ?? 0), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  if (campaignsQuery.isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Painel da Marca
          </h1>
          <p className="text-slate-500 mt-0.5">
            Gerencie suas campanhas e patrocinios
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Nova Campanha
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Campanhas Ativas"
          value={activeCampaigns}
          icon={<Megaphone className="w-5 h-5" />}
          changeType="positive"
        />
        <StatsCard
          title="Impressoes"
          value={totalImpressions.toLocaleString("pt-BR")}
          icon={<Eye className="w-5 h-5" />}
          changeType="neutral"
        />
        <StatsCard
          title="Cliques"
          value={totalClicks.toLocaleString("pt-BR")}
          icon={<MousePointerClick className="w-5 h-5" />}
          changeType="positive"
        />
        <StatsCard
          title="Resgates"
          value={totalRedemptions.toLocaleString("pt-BR")}
          icon={<Gift className="w-5 h-5" />}
          changeType="positive"
        />
      </div>

      {/* GCoins Section */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Saldo GCoins</p>
            <p className="text-2xl font-bold text-slate-900">
              {(balanceQuery.data?.total ?? 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => buyGcoins.mutate({ amount: 1000 })}
            loading={buyGcoins.isPending}
          >
            <Coins className="w-4 h-4" />
            Comprar 1.000 GCoins
          </Button>
        </div>
      </Card>

      {/* Campaigns List */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Minhas Campanhas</h2>

        {campaigns.length === 0 && (
          <Card className="text-center py-12">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Nenhuma campanha ainda
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Crie sua primeira campanha para comecar a divulgar sua marca
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              Criar Campanha
            </Button>
          </Card>
        )}

        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const ctr =
              campaign.impressions && campaign.impressions > 0
                ? (((campaign.clicks ?? 0) / campaign.impressions) * 100).toFixed(1)
                : "0.0";

            return (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {/* Campaign Image */}
                  {campaign.imageUrl && (
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={campaign.imageUrl}
                        alt={campaign.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Campaign Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 truncate">
                          {campaign.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={statusColors[campaign.status ?? "pending"]}>
                            {statusLabels[campaign.status ?? "pending"]}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {campaignTypeLabels[campaign.type]} &middot;{" "}
                            {placementLabels[campaign.placement]}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        {campaign.status === "active" && (
                          <button
                            onClick={() =>
                              updateCampaign.mutate({
                                id: campaign.id,
                                status: "paused",
                              })
                            }
                            className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Pausar"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        )}
                        {campaign.status === "paused" && (
                          <button
                            onClick={() =>
                              updateCampaign.mutate({
                                id: campaign.id,
                                status: "active",
                              })
                            }
                            className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                            title="Ativar"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            updateCampaign.mutate({
                              id: campaign.id,
                              status: "completed",
                            })
                          }
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Encerrar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {(campaign.impressions ?? 0).toLocaleString("pt-BR")} impressoes
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="w-3.5 h-3.5" />
                        {(campaign.clicks ?? 0).toLocaleString("pt-BR")} cliques
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5" />
                        CTR: {ctr}%
                      </span>
                      {campaign.type === "product_giveaway" ||
                      campaign.type === "gcoin_reward" ? (
                        <span className="flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5" />
                          {campaign.currentRedemptions ?? 0}
                          {campaign.maxRedemptions
                            ? `/${campaign.maxRedemptions}`
                            : ""}{" "}
                          resgates
                        </span>
                      ) : null}
                      {campaign.targetSport && (
                        <span>
                          {campaign.targetSport.icon} {campaign.targetSport.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create Campaign Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Nova Campanha"
        size="lg"
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome da Campanha *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Ex: Lancamento Linha Esportiva"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descricao
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Descreva sua campanha..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none resize-none"
              rows={2}
            />
          </div>

          {/* Type and Placement */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tipo *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, type: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none"
              >
                {Object.entries(campaignTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Posicionamento *
              </label>
              <select
                value={formData.placement}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, placement: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none"
              >
                {Object.entries(placementLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Orcamento (GCoins)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) =>
                setFormData((p) => ({ ...p, budget: Number(e.target.value) }))
              }
              placeholder="0"
              min={0}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Imagem da Campanha
            </label>
            <div className="flex items-center gap-3">
              {formData.imageUrl ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
              <Button variant="outline" size="sm" onClick={handleImageUpload}>
                <ImageIcon className="w-4 h-4" />
                {formData.imageUrl ? "Trocar" : "Upload"}
              </Button>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Link de Destino
            </label>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={formData.linkUrl}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, linkUrl: e.target.value }))
                }
                placeholder="https://suamarca.com.br"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none"
              />
            </div>
          </div>

          {/* Target Sport */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Esporte Alvo (opcional)
            </label>
            <select
              value={formData.targetSportId}
              onChange={(e) =>
                setFormData((p) => ({ ...p, targetSportId: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none"
            >
              <option value="">Todos os esportes</option>
              {sportsQuery.data?.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.icon} {sport.name}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional: Product fields */}
          {formData.type === "product_giveaway" && (
            <div className="p-4 bg-amber-50 rounded-xl space-y-3">
              <h4 className="text-sm font-semibold text-amber-800">
                Dados do Produto
              </h4>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, productName: e.target.value }))
                }
                placeholder="Nome do produto"
                className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-300 outline-none bg-white"
              />
              <textarea
                value={formData.productDescription}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    productDescription: e.target.value,
                  }))
                }
                placeholder="Descricao do produto"
                className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-300 outline-none bg-white resize-none"
                rows={2}
              />
              <input
                type="number"
                value={formData.maxRedemptions}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    maxRedemptions: Number(e.target.value),
                  }))
                }
                placeholder="Quantidade disponivel"
                min={1}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-300 outline-none bg-white"
              />
            </div>
          )}

          {/* Conditional: GCoin reward fields */}
          {formData.type === "gcoin_reward" && (
            <div className="p-4 bg-blue-50 rounded-xl space-y-3">
              <h4 className="text-sm font-semibold text-blue-800">
                Recompensa GCoins
              </h4>
              <input
                type="number"
                value={formData.gcoinRewardAmount}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    gcoinRewardAmount: Number(e.target.value),
                  }))
                }
                placeholder="GCoins por usuario"
                min={1}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none bg-white"
              />
              <input
                type="number"
                value={formData.maxRedemptions}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    maxRedemptions: Number(e.target.value),
                  }))
                }
                placeholder="Limite de resgates"
                min={1}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none bg-white"
              />
            </div>
          )}

          {/* Error */}
          {createCampaign.error && (
            <p className="text-sm text-red-600">
              {createCampaign.error.message}
            </p>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.name.trim() || createCampaign.isPending}
              loading={createCampaign.isPending}
            >
              Criar Campanha
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
