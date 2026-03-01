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
  Trophy,
  Crown,
  X,
  Check,
  Ban,
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

const tierLabels: Record<string, string> = {
  main: "Principal",
  gold: "Ouro",
  silver: "Prata",
  bronze: "Bronze",
};

export default function BrandDashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"campaigns" | "sponsorships">("campaigns");
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
  const [sponsorForm, setSponsorForm] = useState({
    tournamentId: "",
    tier: "gold" as string,
    gcoinContribution: 0,
    logoUrl: "",
    message: "",
    productPrizes: [] as Array<{ name: string; description: string; image: string; forPlacement: number }>,
  });

  const utils = trpc.useUtils();
  const campaignsQuery = trpc.brand.myCampaigns.useQuery();
  const sponsorshipsQuery = trpc.brand.mySponsorships.useQuery();
  const sportsQuery = trpc.social.getSports.useQuery();
  const balanceQuery = trpc.gcoin.balance.useQuery();
  const tournamentsQuery = trpc.tournament.list.useQuery({ limit: 50 });

  const createCampaign = trpc.brand.createCampaign.useMutation({
    onSuccess: () => {
      setShowCreateModal(false);
      resetForm();
      utils.brand.myCampaigns.invalidate();
      utils.gcoin.balance.invalidate();
    },
  });

  const updateCampaign = trpc.brand.updateCampaign.useMutation({
    onSuccess: () => utils.brand.myCampaigns.invalidate(),
  });

  const buyGcoins = trpc.brand.buyGcoins.useMutation({
    onSuccess: () => utils.gcoin.balance.invalidate(),
  });

  const sponsorTournament = trpc.brand.sponsorTournament.useMutation({
    onSuccess: () => {
      setShowSponsorModal(false);
      resetSponsorForm();
      utils.brand.mySponsorships.invalidate();
      utils.gcoin.balance.invalidate();
    },
  });

  const cancelSponsorship = trpc.brand.cancelSponsorship.useMutation({
    onSuccess: () => {
      utils.brand.mySponsorships.invalidate();
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

  const resetSponsorForm = () => {
    setSponsorForm({
      tournamentId: "",
      tier: "gold",
      gcoinContribution: 0,
      logoUrl: "",
      message: "",
      productPrizes: [],
    });
  };

  const handleCreate = () => {
    createCampaign.mutate({
      name: formData.name,
      description: formData.description || undefined,
      type: formData.type as any,
      placement: formData.placement as any,
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

  const handleSponsor = () => {
    sponsorTournament.mutate({
      tournamentId: sponsorForm.tournamentId,
      tier: sponsorForm.tier as any,
      gcoinContribution: sponsorForm.gcoinContribution,
      logoUrl: sponsorForm.logoUrl || undefined,
      message: sponsorForm.message || undefined,
      productPrizes: sponsorForm.productPrizes.length > 0
        ? sponsorForm.productPrizes.map(p => ({
            name: p.name,
            description: p.description || undefined,
            image: p.image || undefined,
            forPlacement: p.forPlacement,
          }))
        : undefined,
    });
  };

  const handleImageUpload = (setter: (url: string) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const addProductPrize = () => {
    setSponsorForm(prev => ({
      ...prev,
      productPrizes: [...prev.productPrizes, { name: "", description: "", image: "", forPlacement: 1 }],
    }));
  };

  const removeProductPrize = (index: number) => {
    setSponsorForm(prev => ({
      ...prev,
      productPrizes: prev.productPrizes.filter((_, i) => i !== index),
    }));
  };

  const updateProductPrize = (index: number, field: string, value: string | number) => {
    setSponsorForm(prev => ({
      ...prev,
      productPrizes: prev.productPrizes.map((p, i) => i === index ? { ...p, [field]: value } : p),
    }));
  };

  const campaigns = campaignsQuery.data ?? [];
  const sponsorships = sponsorshipsQuery.data ?? [];
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
            Gerencie campanhas, patrocinios e premiacoes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSponsorModal(true)}>
            <Trophy className="w-4 h-4" />
            Patrocinar Torneio
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Nova Campanha
          </Button>
        </div>
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
              {(balanceQuery.data?.total ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Use GCoins para patrocinar torneios e criar campanhas de recompensa
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "campaigns"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Megaphone className="w-4 h-4 inline mr-1.5" />
          Campanhas ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab("sponsorships")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "sponsorships"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Trophy className="w-4 h-4 inline mr-1.5" />
          Patrocinios ({sponsorships.length})
        </button>
      </div>

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div>
          {campaigns.length === 0 && (
            <Card className="text-center py-12">
              <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhuma campanha ainda</h3>
              <p className="text-sm text-slate-500 mb-4">Crie sua primeira campanha para comecar a divulgar sua marca</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                Criar Campanha
              </Button>
            </Card>
          )}

          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const ctr = campaign.impressions && campaign.impressions > 0
                ? (((campaign.clicks ?? 0) / campaign.impressions) * 100).toFixed(1)
                : "0.0";

              return (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {campaign.imageUrl && (
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={campaign.imageUrl} alt={campaign.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 truncate">{campaign.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={statusColors[campaign.status ?? "pending"]}>
                              {statusLabels[campaign.status ?? "pending"]}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {campaignTypeLabels[campaign.type]} &middot; {placementLabels[campaign.placement]}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {campaign.status === "active" && (
                            <button
                              onClick={() => updateCampaign.mutate({ id: campaign.id, status: "paused" })}
                              className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Pausar"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          )}
                          {campaign.status === "paused" && (
                            <button
                              onClick={() => updateCampaign.mutate({ id: campaign.id, status: "active" })}
                              className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                              title="Ativar"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => updateCampaign.mutate({ id: campaign.id, status: "completed" })}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Encerrar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
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
                        {(campaign.type === "product_giveaway" || campaign.type === "gcoin_reward") && (
                          <span className="flex items-center gap-1">
                            <Gift className="w-3.5 h-3.5" />
                            {campaign.currentRedemptions ?? 0}{campaign.maxRedemptions ? `/${campaign.maxRedemptions}` : ""} resgates
                          </span>
                        )}
                        {Number(campaign.budget ?? 0) > 0 && (
                          <span className="flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" />
                            {Number(campaign.spent ?? 0).toLocaleString("pt-BR")}/{Number(campaign.budget).toLocaleString("pt-BR")} GCoins
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
      )}

      {/* Sponsorships Tab */}
      {activeTab === "sponsorships" && (
        <div>
          {sponsorships.length === 0 && (
            <Card className="text-center py-12">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum patrocinio ainda</h3>
              <p className="text-sm text-slate-500 mb-4">Patrocine torneios para promover sua marca e premiar atletas</p>
              <Button onClick={() => setShowSponsorModal(true)}>
                <Trophy className="w-4 h-4" />
                Patrocinar Torneio
              </Button>
            </Card>
          )}

          <div className="space-y-4">
            {sponsorships.map((sp) => (
              <Card key={sp.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {sp.tournament?.name ?? "Torneio"}
                      </h3>
                      <Badge variant={statusColors[sp.status ?? "pending"]}>
                        {statusLabels[sp.status ?? "pending"]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-amber-500" />
                        Tier: {tierLabels[sp.tier]}
                      </span>
                      {sp.tournament?.sport && (
                        <span>{sp.tournament.sport.icon} {sp.tournament.sport.name}</span>
                      )}
                      {Number(sp.gcoinContribution ?? 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          {Number(sp.gcoinContribution).toLocaleString("pt-BR")} GCoins
                        </span>
                      )}
                      {sp.prizes && sp.prizes.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5" />
                          {sp.prizes.length} premios
                        </span>
                      )}
                    </div>
                  </div>
                  {(sp.status === "pending" || sp.status === "active") &&
                    sp.tournament?.status !== "in_progress" &&
                    sp.tournament?.status !== "completed" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelSponsorship.mutate({ sponsorshipId: sp.id })}
                      loading={cancelSponsorship.isPending}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); }}
        title="Nova Campanha"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Campanha *</label>
            <input type="text" value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Ex: Lancamento Linha Esportiva"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descricao</label>
            <textarea value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descreva sua campanha..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none resize-none" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
              <select value={formData.type}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none">
                {Object.entries(campaignTypeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Posicionamento *</label>
              <select value={formData.placement}
                onChange={(e) => setFormData((p) => ({ ...p, placement: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none">
                {Object.entries(placementLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Imagem</label>
              <div className="flex items-center gap-3">
                {formData.imageUrl && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <Button variant="outline" size="sm"
                  onClick={() => handleImageUpload((url) => setFormData(p => ({ ...p, imageUrl: url })))}>
                  <ImageIcon className="w-4 h-4" />
                  {formData.imageUrl ? "Trocar" : "Upload"}
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link de Destino</label>
              <input type="text" value={formData.linkUrl}
                onChange={(e) => setFormData((p) => ({ ...p, linkUrl: e.target.value }))}
                placeholder="https://suamarca.com.br"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Esporte Alvo (opcional)</label>
            <select value={formData.targetSportId}
              onChange={(e) => setFormData((p) => ({ ...p, targetSportId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none">
              <option value="">Todos os esportes</option>
              {sportsQuery.data?.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
            </select>
          </div>
          {formData.type === "product_giveaway" && (
            <div className="p-4 bg-amber-50 rounded-xl space-y-3">
              <h4 className="text-sm font-semibold text-amber-800">Dados do Produto</h4>
              <input type="text" value={formData.productName}
                onChange={(e) => setFormData((p) => ({ ...p, productName: e.target.value }))}
                placeholder="Nome do produto"
                className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white outline-none" />
              <textarea value={formData.productDescription}
                onChange={(e) => setFormData((p) => ({ ...p, productDescription: e.target.value }))}
                placeholder="Descricao do produto"
                className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white outline-none resize-none" rows={2} />
              <input type="number" value={formData.maxRedemptions}
                onChange={(e) => setFormData((p) => ({ ...p, maxRedemptions: Number(e.target.value) }))}
                placeholder="Quantidade disponivel" min={1}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white outline-none" />
            </div>
          )}
          {formData.type === "gcoin_reward" && (
            <div className="p-4 bg-blue-50 rounded-xl space-y-3">
              <h4 className="text-sm font-semibold text-blue-800">Recompensa GCoins</h4>
              <input type="number" value={formData.gcoinRewardAmount}
                onChange={(e) => setFormData((p) => ({ ...p, gcoinRewardAmount: Number(e.target.value) }))}
                placeholder="GCoins por usuario" min={1}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white outline-none" />
              <input type="number" value={formData.maxRedemptions}
                onChange={(e) => setFormData((p) => ({ ...p, maxRedemptions: Number(e.target.value) }))}
                placeholder="Limite de resgates" min={1}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white outline-none" />
              {formData.gcoinRewardAmount > 0 && formData.maxRedemptions > 0 && (
                <p className="text-xs text-blue-600">
                  Total: {(formData.gcoinRewardAmount * formData.maxRedemptions).toLocaleString("pt-BR")} GCoins serao debitados do seu saldo
                </p>
              )}
            </div>
          )}
          {createCampaign.error && <p className="text-sm text-red-600">{createCampaign.error.message}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setShowCreateModal(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!formData.name.trim() || createCampaign.isPending} loading={createCampaign.isPending}>
              Criar Campanha
            </Button>
          </div>
        </div>
      </Modal>

      {/* Sponsor Tournament Modal */}
      <Modal
        isOpen={showSponsorModal}
        onClose={() => { setShowSponsorModal(false); resetSponsorForm(); }}
        title="Patrocinar Torneio"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Torneio *</label>
            <select value={sponsorForm.tournamentId}
              onChange={(e) => setSponsorForm((p) => ({ ...p, tournamentId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none">
              <option value="">Selecione um torneio</option>
              {(tournamentsQuery.data?.items ?? [])
                .filter(t => t.status !== "completed" && t.status !== "cancelled")
                .map((t) => <option key={t.id} value={t.id}>{t.name} ({t.sport?.name})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nivel de Patrocinio *</label>
            <div className="grid grid-cols-4 gap-2">
              {(["main", "gold", "silver", "bronze"] as const).map((tier) => {
                const tierIcons = { main: Crown, gold: Trophy, silver: Trophy, bronze: Trophy };
                const tierColors = { main: "border-amber-400 bg-amber-50 text-amber-700", gold: "border-yellow-400 bg-yellow-50 text-yellow-700", silver: "border-slate-300 bg-slate-50 text-slate-600", bronze: "border-orange-300 bg-orange-50 text-orange-600" };
                const TierIcon = tierIcons[tier];
                return (
                  <button key={tier}
                    onClick={() => setSponsorForm(p => ({ ...p, tier }))}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${sponsorForm.tier === tier ? tierColors[tier] + " ring-2 ring-offset-1 ring-blue-400" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                    <TierIcon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-semibold">{tierLabels[tier]}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contribuicao em GCoins</label>
            <input type="number" value={sponsorForm.gcoinContribution}
              onChange={(e) => setSponsorForm((p) => ({ ...p, gcoinContribution: Number(e.target.value) }))}
              placeholder="Ex: 5000" min={0}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none" />
            {sponsorForm.gcoinContribution > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                Distribuicao: 60% 1o lugar ({Math.floor(sponsorForm.gcoinContribution * 0.6)} GCoins) | 30% 2o lugar ({Math.floor(sponsorForm.gcoinContribution * 0.3)} GCoins) | 10% 3o lugar ({Math.floor(sponsorForm.gcoinContribution * 0.1)} GCoins)
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Logo da Marca</label>
            <div className="flex items-center gap-3">
              {sponsorForm.logoUrl && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sponsorForm.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              )}
              <Button variant="outline" size="sm"
                onClick={() => handleImageUpload((url) => setSponsorForm(p => ({ ...p, logoUrl: url })))}>
                <ImageIcon className="w-4 h-4" />
                {sponsorForm.logoUrl ? "Trocar" : "Upload"}
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem (opcional)</label>
            <input type="text" value={sponsorForm.message}
              onChange={(e) => setSponsorForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="Ex: Orgulho de apoiar o esporte!"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-300 outline-none" />
          </div>
          {/* Product Prizes */}
          <div className="p-4 bg-amber-50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-amber-800">Premios em Produto (opcional)</h4>
              <Button variant="ghost" size="sm" onClick={addProductPrize}>
                <Plus className="w-3 h-3" /> Adicionar
              </Button>
            </div>
            {sponsorForm.productPrizes.map((p, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <input type="text" value={p.name}
                    onChange={(e) => updateProductPrize(i, "name", e.target.value)}
                    placeholder="Nome do produto" className="w-full px-2 py-1.5 border border-amber-200 rounded text-sm bg-white outline-none" />
                  <div className="flex gap-2">
                    <input type="text" value={p.description}
                      onChange={(e) => updateProductPrize(i, "description", e.target.value)}
                      placeholder="Descricao" className="flex-1 px-2 py-1.5 border border-amber-200 rounded text-sm bg-white outline-none" />
                    <select value={p.forPlacement}
                      onChange={(e) => updateProductPrize(i, "forPlacement", Number(e.target.value))}
                      className="w-28 px-2 py-1.5 border border-amber-200 rounded text-sm bg-white outline-none">
                      <option value={1}>1o lugar</option>
                      <option value={2}>2o lugar</option>
                      <option value={3}>3o lugar</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => removeProductPrize(i)} className="p-1 text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {sponsorTournament.error && <p className="text-sm text-red-600">{sponsorTournament.error.message}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setShowSponsorModal(false); resetSponsorForm(); }}>Cancelar</Button>
            <Button onClick={handleSponsor}
              disabled={!sponsorForm.tournamentId || (sponsorForm.gcoinContribution === 0 && sponsorForm.productPrizes.length === 0) || sponsorTournament.isPending}
              loading={sponsorTournament.isPending}>
              <Trophy className="w-4 h-4" />
              Patrocinar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
