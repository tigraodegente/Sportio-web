// Mock data for Live Match page — Flamengo vs Palmeiras

export interface MatchTeam {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
}

export interface MatchEvent {
  id: string;
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "var";
  minute: number;
  team: "home" | "away";
  playerName: string;
  playerOut?: string;
  description?: string;
}

export interface MatchStat {
  label: string;
  home: number;
  away: number;
  format?: "percent" | "number";
}

export interface MomentumPoint {
  minute: number;
  value: number; // -100 (away dominant) to +100 (home dominant)
}

export interface OddOption {
  id: string;
  label: string;
  odds: number;
  previousOdds?: number;
  suspended?: boolean;
}

export interface BettingMarket {
  id: string;
  name: string;
  options: OddOption[];
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isVip?: boolean;
  isSuper?: boolean;
}

export interface ActiveBet {
  id: string;
  market: string;
  selection: string;
  odds: number;
  stake: number;
  potentialWin: number;
  status: "pending" | "winning" | "losing";
  cashOutValue?: number;
}

export interface LiveMatchData {
  id: string;
  competition: string;
  round: string;
  status: "live" | "halftime" | "finished" | "not_started";
  minute: number;
  period: "1T" | "2T" | "INT" | "PRO";
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  stats: MatchStat[];
  momentum: MomentumPoint[];
  markets: BettingMarket[];
  chat: ChatMessage[];
  activeBets: ActiveBet[];
}

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------
const flamengo: MatchTeam = {
  id: "flamengo",
  name: "Flamengo",
  shortName: "FLA",
  logo: "/teams/flamengo.png",
  color: "#E32636",
};

const palmeiras: MatchTeam = {
  id: "palmeiras",
  name: "Palmeiras",
  shortName: "PAL",
  logo: "/teams/palmeiras.png",
  color: "#006437",
};

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
const events: MatchEvent[] = [
  {
    id: "evt-1",
    type: "goal",
    minute: 12,
    team: "home",
    playerName: "Pedro",
    description: "Chute de dentro da area apos cruzamento de Everton Ribeiro",
  },
  {
    id: "evt-2",
    type: "yellow_card",
    minute: 23,
    team: "away",
    playerName: "Zé Rafael",
  },
  {
    id: "evt-3",
    type: "goal",
    minute: 35,
    team: "away",
    playerName: "Endrick",
    description: "Golaço de fora da area no canto esquerdo",
  },
  {
    id: "evt-4",
    type: "yellow_card",
    minute: 41,
    team: "home",
    playerName: "Gerson",
  },
  {
    id: "evt-5",
    type: "substitution",
    minute: 46,
    team: "away",
    playerName: "Dudu",
    playerOut: "Rony",
  },
  {
    id: "evt-6",
    type: "goal",
    minute: 58,
    team: "home",
    playerName: "Gabigol",
    description: "Penalti convertido com categoria",
  },
  {
    id: "evt-7",
    type: "var",
    minute: 56,
    team: "home",
    playerName: "Arbitragem",
    description: "Penalti confirmado apos revisao do VAR",
  },
];

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
const stats: MatchStat[] = [
  { label: "Posse de bola", home: 52, away: 48, format: "percent" },
  { label: "Finalizações", home: 14, away: 9 },
  { label: "Finalizações no gol", home: 6, away: 3 },
  { label: "Escanteios", home: 7, away: 4 },
  { label: "Faltas", home: 12, away: 15 },
  { label: "Impedimentos", home: 2, away: 3 },
  { label: "Passes", home: 387, away: 354 },
  { label: "Precisao de passes", home: 85, away: 82, format: "percent" },
];

// ---------------------------------------------------------------------------
// Momentum graph data
// ---------------------------------------------------------------------------
const momentum: MomentumPoint[] = [
  { minute: 0, value: 0 },
  { minute: 3, value: 15 },
  { minute: 6, value: 30 },
  { minute: 9, value: 45 },
  { minute: 12, value: 80 }, // goal
  { minute: 15, value: 60 },
  { minute: 18, value: 25 },
  { minute: 21, value: -10 },
  { minute: 24, value: -35 },
  { minute: 27, value: -50 },
  { minute: 30, value: -40 },
  { minute: 33, value: -65 },
  { minute: 35, value: -85 }, // away goal
  { minute: 38, value: -45 },
  { minute: 41, value: -20 },
  { minute: 45, value: 5 },
  { minute: 48, value: 20 },
  { minute: 51, value: 35 },
  { minute: 54, value: 50 },
  { minute: 56, value: 70 }, // VAR
  { minute: 58, value: 90 }, // penalty goal
  { minute: 60, value: 65 },
  { minute: 63, value: 40 },
  { minute: 67, value: 30 },
];

// ---------------------------------------------------------------------------
// Betting markets
// ---------------------------------------------------------------------------
const markets: BettingMarket[] = [
  {
    id: "1x2",
    name: "Resultado Final",
    options: [
      { id: "1x2-home", label: "Flamengo", odds: 1.65, previousOdds: 1.72 },
      { id: "1x2-draw", label: "Empate", odds: 3.80, previousOdds: 3.75 },
      { id: "1x2-away", label: "Palmeiras", odds: 4.50, previousOdds: 4.20 },
    ],
  },
  {
    id: "btts",
    name: "Ambas Marcam",
    options: [
      { id: "btts-yes", label: "Sim", odds: 1.25, previousOdds: 1.30 },
      { id: "btts-no", label: "Não", odds: 3.50, previousOdds: 3.40 },
    ],
  },
  {
    id: "total",
    name: "Total de Gols",
    options: [
      { id: "total-over", label: "Mais de 2.5", odds: 1.45, previousOdds: 1.50 },
      { id: "total-under", label: "Menos de 2.5", odds: 2.60, previousOdds: 2.50 },
      { id: "total-over35", label: "Mais de 3.5", odds: 2.10, previousOdds: 2.00 },
      { id: "total-under35", label: "Menos de 3.5", odds: 1.70, previousOdds: 1.75 },
    ],
  },
  {
    id: "next-goal",
    name: "Próximo Gol",
    options: [
      { id: "ng-home", label: "Flamengo", odds: 1.85 },
      { id: "ng-away", label: "Palmeiras", odds: 2.80 },
      { id: "ng-none", label: "Nenhum", odds: 5.50 },
    ],
  },
  {
    id: "handicap",
    name: "Handicap",
    options: [
      { id: "hc-home-1", label: "Flamengo -1", odds: 2.90, previousOdds: 3.10 },
      { id: "hc-away-1", label: "Palmeiras +1", odds: 1.40, previousOdds: 1.35 },
    ],
  },
  {
    id: "exact-score",
    name: "Resultado Exato",
    options: [
      { id: "es-2-1", label: "2 x 1", odds: 5.50 },
      { id: "es-3-1", label: "3 x 1", odds: 8.00 },
      { id: "es-2-2", label: "2 x 2", odds: 7.00 },
      { id: "es-3-2", label: "3 x 2", odds: 12.00 },
      { id: "es-1-2", label: "1 x 2", odds: 14.00 },
      { id: "es-2-3", label: "2 x 3", odds: 22.00 },
    ],
  },
  {
    id: "scorer",
    name: "Jogador Marca",
    options: [
      { id: "sc-pedro", label: "Pedro", odds: 2.50 },
      { id: "sc-gabigol", label: "Gabigol", odds: 2.80 },
      { id: "sc-arrascaeta", label: "Arrascaeta", odds: 3.50 },
      { id: "sc-endrick", label: "Endrick", odds: 3.00 },
      { id: "sc-dudu", label: "Dudu", odds: 4.00 },
      { id: "sc-veiga", label: "Raphael Veiga", odds: 3.80 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Chat messages
// ---------------------------------------------------------------------------
const chat: ChatMessage[] = [
  { id: "c1", username: "FlaRaça10", message: "GOLAÇO DO GABIGOL! ELE É DEMAIS!", timestamp: "67:12", isVip: true },
  { id: "c2", username: "Verdão_SP", message: "Juiz ladrão, aquele penalti não existiu", timestamp: "67:08" },
  { id: "c3", username: "CRFsempre", message: "2x1 MENGÃO! VAMOS VIRAR ISSO!", timestamp: "67:05", isVip: true },
  { id: "c4", username: "BetMaster99", message: "Coloquei 500 GC no Fla, bora!", timestamp: "66:55" },
  { id: "c5", username: "Palmeirense_", message: "Calma galera, ainda da tempo", timestamp: "66:42" },
  { id: "c6", username: "EsporteTotal", message: "Jogo tá muito bom! Nível de final", timestamp: "66:30", isSuper: true },
  { id: "c7", username: "MaravilhaSRN", message: "Pedro tá jogando demais hoje", timestamp: "66:15" },
  { id: "c8", username: "VerdãoNação", message: "Dudu vai resolver, confia", timestamp: "65:58" },
  { id: "c9", username: "FutAnalyst", message: "XG do Fla: 2.1 vs Palmeiras: 0.8", timestamp: "65:40", isVip: true },
  { id: "c10", username: "Apostador_BR", message: "Over 3.5 pagando 2.10, vale a pena!", timestamp: "65:22" },
  { id: "c11", username: "MengãoTV", message: "GABIGOL O HOMEM DO JOGO 🔥", timestamp: "65:10" },
  { id: "c12", username: "Torcedor_01", message: "Que jogão! Quero mais gol!", timestamp: "64:55" },
];

// ---------------------------------------------------------------------------
// Active bets (user's bets on this match)
// ---------------------------------------------------------------------------
const activeBets: ActiveBet[] = [
  {
    id: "ab-1",
    market: "Resultado Final",
    selection: "Flamengo",
    odds: 1.72,
    stake: 200,
    potentialWin: 344,
    status: "winning",
    cashOutValue: 280,
  },
  {
    id: "ab-2",
    market: "Total de Gols",
    selection: "Mais de 2.5",
    odds: 1.50,
    stake: 100,
    potentialWin: 150,
    status: "winning",
    cashOutValue: 140,
  },
  {
    id: "ab-3",
    market: "Resultado Exato",
    selection: "2 x 1",
    odds: 5.50,
    stake: 50,
    potentialWin: 275,
    status: "winning",
    cashOutValue: 180,
  },
];

// ---------------------------------------------------------------------------
// Full match object
// ---------------------------------------------------------------------------
export const mockLiveMatch: LiveMatchData = {
  id: "match-fla-pal-001",
  competition: "Brasileirão Série A",
  round: "Rodada 28",
  status: "live",
  minute: 67,
  period: "2T",
  homeTeam: flamengo,
  awayTeam: palmeiras,
  homeScore: 2,
  awayScore: 1,
  events: events.sort((a, b) => b.minute - a.minute),
  stats,
  momentum,
  markets,
  chat,
  activeBets,
};

// User balance for the bet slip
export const mockUserBalance = 2450;
