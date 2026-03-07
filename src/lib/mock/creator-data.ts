// ============================================
// Mock Data for Creator Profile Page
// ============================================

export interface CreatorProfile {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  bannerImage: string | null;
  bio: string;
  location: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  sports: { id: string; name: string; icon: string }[];
  stats: {
    tournamentsWon: number;
    rating: number;
    followers: number;
    subscribers: number;
    activeFans: number;
  };
  isVerified: boolean;
  sponsor: {
    name: string;
    logoUrl: string | null;
  } | null;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  color: string;
  popular?: boolean;
}

export interface CreatorPost {
  id: string;
  content: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  giftsReceived: number;
  createdAt: Date;
  isGated: boolean;
  requiredTier: string | null;
  tierPrice: number | null;
}

export interface CreatorStat {
  sport: string;
  stats: { label: string; value: string; change?: string; changeType?: "positive" | "negative" | "neutral" }[];
  chartData: { month: string; value: number }[];
}

export interface EquipmentProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string | null;
  affiliateUrl: string;
  category: string;
}

export interface FanEntry {
  id: string;
  name: string;
  avatar: string | null;
  totalGCoins: number;
  tier: "diamond" | "gold" | "silver" | "bronze";
}

export interface GiftType {
  id: string;
  name: string;
  emoji: string;
  cost: number;
}

// --- Mock Creator Profile ---
export const MOCK_CREATOR: CreatorProfile = {
  id: "creator-maria-01",
  name: "Maria Oliveira",
  username: "mariaolive",
  avatar: null,
  bannerImage: null,
  bio: "Corredora de rua e atleta de beach tennis. 3x campeona estadual de BT. Compartilho treinos, dicas e bastidores da vida de atleta. Vem comigo!",
  location: "Rio de Janeiro, RJ",
  level: 42,
  xp: 8400,
  xpToNextLevel: 10000,
  sports: [
    { id: "corrida", name: "Corrida", icon: "running" },
    { id: "beach-tennis", name: "Beach Tennis", icon: "racquet" },
  ],
  stats: {
    tournamentsWon: 27,
    rating: 4.8,
    followers: 12400,
    subscribers: 890,
    activeFans: 234,
  },
  isVerified: true,
  sponsor: {
    name: "Nike Running",
    logoUrl: null,
  },
};

// --- Subscription Tiers ---
export const MOCK_TIERS: SubscriptionTier[] = [
  {
    id: "tier-fan",
    name: "Fan",
    price: 9.9,
    benefits: [
      "Acesso a posts exclusivos",
      "Badge de Fan no perfil",
      "Enquetes e votacoes",
      "Chat exclusivo mensal",
    ],
    color: "blue",
  },
  {
    id: "tier-vip",
    name: "VIP",
    price: 29.9,
    benefits: [
      "Tudo do plano Fan",
      "Videos de treino completos",
      "Q&A semanal ao vivo",
      "Desconto em equipamentos",
      "Acesso antecipado a conteudo",
    ],
    color: "amber",
    popular: true,
  },
  {
    id: "tier-patron",
    name: "Patrono",
    price: 99,
    benefits: [
      "Tudo do plano VIP",
      "Shoutout personalizado mensal",
      "Grupo de WhatsApp privado",
      "Convite para treinos presenciais",
      "Nome nos creditos de conteudo",
      "1-on-1 mensal de 15min",
    ],
    color: "purple",
  },
];

// --- Mock Posts ---
export const MOCK_POSTS: CreatorPost[] = [
  {
    id: "post-1",
    content: "Treino de hoje: 10km em pace 4:45! Cada dia mais perto da meia maratona. O segredo? Consistencia e descanso. Quem ai tambem esta treinando para alguma prova?",
    images: [],
    likesCount: 342,
    commentsCount: 48,
    giftsReceived: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isGated: false,
    requiredTier: null,
    tierPrice: null,
  },
  {
    id: "post-2",
    content: "CAMPEA! Ganhei o Circuito Carioca de Beach Tennis categoria A! Foi uma final insana, virei o set no tiebreak. Obrigada a todos que torceram!",
    images: [],
    likesCount: 1204,
    commentsCount: 187,
    giftsReceived: 89,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isGated: false,
    requiredTier: null,
    tierPrice: null,
  },
  {
    id: "post-3",
    content: "[EXCLUSIVO] Minha rotina completa de treino para beach tennis + corrida. Como conciliar dois esportes sem lesionar. Planilha detalhada com 12 semanas de periodizacao.",
    images: [],
    likesCount: 89,
    commentsCount: 23,
    giftsReceived: 5,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isGated: true,
    requiredTier: "Fan",
    tierPrice: 9.9,
  },
  {
    id: "post-4",
    content: "Video completo da minha preparacao fisica para o campeonato. Todos os exercicios explicados com series e repeticoes. 45min de conteudo puro!",
    images: [],
    likesCount: 156,
    commentsCount: 34,
    giftsReceived: 18,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isGated: true,
    requiredTier: "VIP",
    tierPrice: 29.9,
  },
  {
    id: "post-5",
    content: "Dica rapida: para melhorar o saque no BT, foque na rotacao do quadril, nao do braco. A forca vem do core! Amanha posto um video mostrando em camera lenta.",
    images: [],
    likesCount: 567,
    commentsCount: 72,
    giftsReceived: 25,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isGated: false,
    requiredTier: null,
    tierPrice: null,
  },
  {
    id: "post-6",
    content: "[PATRONO] Review exclusiva dos equipamentos que recebi da Nike esse mes. Unboxing + primeiras impressoes + testes em treino. Spoiler: a raquete nova e INCRIVEL.",
    images: [],
    likesCount: 45,
    commentsCount: 12,
    giftsReceived: 8,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isGated: true,
    requiredTier: "Patrono",
    tierPrice: 99,
  },
];

// --- Mock Stats ---
export const MOCK_STATS: CreatorStat[] = [
  {
    sport: "Corrida",
    stats: [
      { label: "Pace Medio", value: "4:52/km", change: "-0:08 vs mes passado", changeType: "positive" },
      { label: "Km/mes", value: "186 km", change: "+12% vs mes passado", changeType: "positive" },
      { label: "PR 5K", value: "19:42", change: "Set 2025", changeType: "neutral" },
      { label: "PR 10K", value: "41:15", change: "Nov 2025", changeType: "neutral" },
      { label: "PR 21K", value: "1:32:08", change: "Jan 2026", changeType: "neutral" },
      { label: "PR 42K", value: "3:18:45", change: "Mar 2025", changeType: "neutral" },
    ],
    chartData: [
      { month: "Abr", value: 145 },
      { month: "Mai", value: 152 },
      { month: "Jun", value: 138 },
      { month: "Jul", value: 167 },
      { month: "Ago", value: 174 },
      { month: "Set", value: 182 },
      { month: "Out", value: 156 },
      { month: "Nov", value: 170 },
      { month: "Dez", value: 148 },
      { month: "Jan", value: 175 },
      { month: "Fev", value: 180 },
      { month: "Mar", value: 186 },
    ],
  },
  {
    sport: "Beach Tennis",
    stats: [
      { label: "Ranking", value: "#12 RJ", change: "+3 posicoes", changeType: "positive" },
      { label: "V/D Ratio", value: "78%", change: "62W / 18L", changeType: "positive" },
      { label: "Rating", value: "2.847", change: "+124 pts ultimo mes", changeType: "positive" },
      { label: "Titulos", value: "27", change: "+2 em 2026", changeType: "positive" },
    ],
    chartData: [
      { month: "Abr", value: 2420 },
      { month: "Mai", value: 2480 },
      { month: "Jun", value: 2510 },
      { month: "Jul", value: 2490 },
      { month: "Ago", value: 2560 },
      { month: "Set", value: 2610 },
      { month: "Out", value: 2650 },
      { month: "Nov", value: 2700 },
      { month: "Dez", value: 2720 },
      { month: "Jan", value: 2780 },
      { month: "Fev", value: 2810 },
      { month: "Mar", value: 2847 },
    ],
  },
];

// --- Mock Equipment ---
export const MOCK_EQUIPMENT: EquipmentProduct[] = [
  {
    id: "equip-1",
    name: "Raquete Shark Pro Elite 2026",
    brand: "Shark",
    price: 899.9,
    image: null,
    affiliateUrl: "#",
    category: "Beach Tennis",
  },
  {
    id: "equip-2",
    name: "Tenis Nike Pegasus 41",
    brand: "Nike",
    price: 799.9,
    image: null,
    affiliateUrl: "#",
    category: "Corrida",
  },
  {
    id: "equip-3",
    name: "Relogio Garmin Forerunner 265",
    brand: "Garmin",
    price: 2499.9,
    image: null,
    affiliateUrl: "#",
    category: "Corrida",
  },
  {
    id: "equip-4",
    name: "Viseira Adidas Aeroready",
    brand: "Adidas",
    price: 129.9,
    image: null,
    affiliateUrl: "#",
    category: "Beach Tennis",
  },
  {
    id: "equip-5",
    name: "Bola de BT Mormaii Tour",
    brand: "Mormaii",
    price: 49.9,
    image: null,
    affiliateUrl: "#",
    category: "Beach Tennis",
  },
  {
    id: "equip-6",
    name: "Cinto de Hidratacao Camelbak",
    brand: "Camelbak",
    price: 349.9,
    image: null,
    affiliateUrl: "#",
    category: "Corrida",
  },
];

// --- Mock Fans Leaderboard ---
export const MOCK_FANS: FanEntry[] = [
  { id: "fan-1", name: "Lucas Mendes", avatar: null, totalGCoins: 45200, tier: "diamond" },
  { id: "fan-2", name: "Beatriz Costa", avatar: null, totalGCoins: 32100, tier: "diamond" },
  { id: "fan-3", name: "Rafael Silva", avatar: null, totalGCoins: 18900, tier: "gold" },
  { id: "fan-4", name: "Juliana Santos", avatar: null, totalGCoins: 12400, tier: "gold" },
  { id: "fan-5", name: "Pedro Almeida", avatar: null, totalGCoins: 8700, tier: "silver" },
  { id: "fan-6", name: "Camila Rocha", avatar: null, totalGCoins: 5200, tier: "silver" },
  { id: "fan-7", name: "Diego Ferreira", avatar: null, totalGCoins: 3100, tier: "bronze" },
  { id: "fan-8", name: "Ana Paula Lima", avatar: null, totalGCoins: 2400, tier: "bronze" },
];

// --- Gift Types ---
export const MOCK_GIFTS: GiftType[] = [
  { id: "gift-heart", name: "Coracao", emoji: "\u2764\uFE0F", cost: 10 },
  { id: "gift-fire", name: "Fogo", emoji: "\uD83D\uDD25", cost: 25 },
  { id: "gift-trophy", name: "Trofeu", emoji: "\uD83C\uDFC6", cost: 50 },
  { id: "gift-star", name: "Estrela", emoji: "\u2B50", cost: 100 },
  { id: "gift-rocket", name: "Foguete", emoji: "\uD83D\uDE80", cost: 250 },
  { id: "gift-diamond", name: "Diamante", emoji: "\uD83D\uDC8E", cost: 500 },
  { id: "gift-crown", name: "Coroa", emoji: "\uD83D\uDC51", cost: 1000 },
  { id: "gift-medal", name: "Medalha", emoji: "\uD83C\uDFC5", cost: 2500 },
];

// --- Mock Sponsors for sidebar ---
export const MOCK_SPONSORS = [
  { name: "Nike Running", logoUrl: null, category: "Calcados" },
  { name: "Shark Beach Tennis", logoUrl: null, category: "Raquetes" },
  { name: "Garmin", logoUrl: null, category: "Tecnologia" },
];
