// ============================================
// Gift System — Mock Data
// ============================================

export interface GiftType {
  id: string;
  emoji: string;
  name: string;
  cost: number;
  /** Display label for cost (e.g. "1K GC") */
  costLabel: string;
}

export const GIFT_TYPES: GiftType[] = [
  { id: "palma", emoji: "\u{1F44F}", name: "Palma", cost: 5, costLabel: "5 GC" },
  { id: "fogo", emoji: "\u{1F525}", name: "Fogo", cost: 20, costLabel: "20 GC" },
  { id: "raio", emoji: "\u26A1", name: "Raio", cost: 50, costLabel: "50 GC" },
  { id: "trofeu", emoji: "\u{1F3C6}", name: "Trofeu", cost: 100, costLabel: "100 GC" },
  { id: "diamante", emoji: "\u{1F48E}", name: "Diamante", cost: 250, costLabel: "250 GC" },
  { id: "coroa", emoji: "\u{1F451}", name: "Coroa", cost: 500, costLabel: "500 GC" },
  { id: "estrela", emoji: "\u{1F31F}", name: "Estrela", cost: 1000, costLabel: "1K GC" },
  { id: "personalizado", emoji: "\u{1F3AF}", name: "Person.", cost: 0, costLabel: "Custom" },
];

export interface GiftRecord {
  id: string;
  giftTypeId: string;
  senderUserId: string;
  senderName: string;
  senderImage: string | null;
  receiverUserId: string;
  receiverName: string;
  postId: string | null;
  message: string | null;
  amount: number;
  createdAt: Date;
}

export const MOCK_GIFT_HISTORY: GiftRecord[] = [
  {
    id: "g1",
    giftTypeId: "fogo",
    senderUserId: "u1",
    senderName: "Pedro Silva",
    senderImage: null,
    receiverUserId: "u2",
    receiverName: "Ana Costa",
    postId: "p1",
    message: "Treino insano!",
    amount: 20,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "g2",
    giftTypeId: "trofeu",
    senderUserId: "u3",
    senderName: "Lucas Mendes",
    senderImage: null,
    receiverUserId: "u2",
    receiverName: "Ana Costa",
    postId: "p1",
    message: null,
    amount: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "g3",
    giftTypeId: "diamante",
    senderUserId: "u1",
    senderName: "Pedro Silva",
    senderImage: null,
    receiverUserId: "u2",
    receiverName: "Ana Costa",
    postId: "p2",
    message: "Voce eh craque!",
    amount: 250,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "g4",
    giftTypeId: "coroa",
    senderUserId: "u4",
    senderName: "Julia Ramos",
    senderImage: null,
    receiverUserId: "u2",
    receiverName: "Ana Costa",
    postId: null,
    message: "Top demais!",
    amount: 500,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "g5",
    giftTypeId: "palma",
    senderUserId: "u5",
    senderName: "Carlos Oliveira",
    senderImage: null,
    receiverUserId: "u2",
    receiverName: "Ana Costa",
    postId: "p3",
    message: null,
    amount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

export interface TopFan {
  userId: string;
  name: string;
  image: string | null;
  totalGCoins: number;
}

export const MOCK_TOP_FANS: TopFan[] = [
  { userId: "u1", name: "Pedro Silva", image: null, totalGCoins: 2340 },
  { userId: "u3", name: "Ana Costa", image: null, totalGCoins: 1890 },
  { userId: "u6", name: "Lucas Mendes", image: null, totalGCoins: 1230 },
  { userId: "u4", name: "Julia Ramos", image: null, totalGCoins: 980 },
  { userId: "u5", name: "Carlos Oliveira", image: null, totalGCoins: 750 },
  { userId: "u7", name: "Maria Santos", image: null, totalGCoins: 600 },
];

/**
 * Returns the fan tier based on total GCoins given lifetime.
 */
export function getFanTier(totalGCoins: number): { emoji: string; label: string } | null {
  if (totalGCoins >= 5000) return { emoji: "\u{1F48E}", label: "Diamond" };
  if (totalGCoins >= 2000) return { emoji: "\u{1F947}", label: "Gold" };
  if (totalGCoins >= 500) return { emoji: "\u{1F948}", label: "Silver" };
  if (totalGCoins >= 100) return { emoji: "\u{1F949}", label: "Bronze" };
  return null;
}

/**
 * Returns a GiftType by id.
 */
export function getGiftTypeById(id: string): GiftType | undefined {
  return GIFT_TYPES.find((g) => g.id === id);
}
