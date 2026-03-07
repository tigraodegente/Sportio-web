// Mock data for persona-specific home pages

export interface LiveMatch {
  id: string;
  homeTeam: { name: string; logo: string; score: number };
  awayTeam: { name: string; logo: string; score: number };
  sport: string;
  competition: string;
  minute: number;
  status: "live" | "upcoming" | "finished";
  startTime: string;
  odds?: { home: number; draw: number; away: number };
}

export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  sport: string;
  progress: number;
  target: number;
  unit: string;
  prize: number;
  participants: number;
  endsAt: string;
}

export interface TournamentPreview {
  id: string;
  name: string;
  sport: string;
  date: string;
  location: string;
  city: string;
  price: number;
  spotsLeft: number;
  totalSpots: number;
  distance: number;
  image?: string;
}

export interface FeedActivity {
  id: string;
  user: { name: string; image: string | null; verified: boolean };
  sport: string;
  type: "run" | "match" | "achievement" | "training" | "post";
  content: string;
  details?: { distance?: string; time?: string; pace?: string; score?: string };
  likes: number;
  comments: number;
  gifts: number;
  timeAgo: string;
  sponsored?: boolean;
}

export interface ActiveBet {
  id: string;
  match: string;
  selection: string;
  amount: number;
  odds: number;
  potentialReturn: number;
  status: "winning" | "pending" | "losing";
  canCashOut: boolean;
  cashOutValue?: number;
}

export interface CreatorPreview {
  id: string;
  name: string;
  image: string | null;
  sport: string;
  followers: number;
  subscribers: number;
  subscriptionPrice: number;
  verified: boolean;
}

export interface TournamentManaged {
  id: string;
  name: string;
  sport: string;
  status: "active" | "upcoming" | "completed";
  checkedIn: number;
  totalParticipants: number;
  nextMatch?: string;
  revenue: number;
}

export interface PendingEnrollment {
  id: string;
  athleteName: string;
  athleteImage: string | null;
  tournamentName: string;
  requestedAt: string;
}

export interface OrganizerEvent {
  id: string;
  type: "enrollment" | "result" | "payment" | "review";
  description: string;
  timeAgo: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  image?: string;
}

export interface SponsorableAthlete {
  id: string;
  name: string;
  image: string | null;
  sport: string;
  followers: number;
  engagementRate: number;
  cpm: number;
  monthlyPrice: number;
}

// --- Mock Data ---

export const mockLiveMatches: LiveMatch[] = [
  {
    id: "m1",
    homeTeam: { name: "Flamengo", logo: "🔴⚫", score: 2 },
    awayTeam: { name: "Palmeiras", logo: "🟢⚪", score: 1 },
    sport: "Futebol",
    competition: "Brasileirão Série A",
    minute: 67,
    status: "live",
    startTime: "2026-03-07T20:00:00",
    odds: { home: 1.45, draw: 4.2, away: 5.8 },
  },
  {
    id: "m2",
    homeTeam: { name: "Corinthians", logo: "⚫⚪", score: 0 },
    awayTeam: { name: "São Paulo", logo: "🔴⚪⚫", score: 0 },
    sport: "Futebol",
    competition: "Brasileirão Série A",
    minute: 23,
    status: "live",
    startTime: "2026-03-07T20:00:00",
    odds: { home: 2.1, draw: 3.3, away: 3.5 },
  },
  {
    id: "m3",
    homeTeam: { name: "Grêmio", logo: "🔵⚫⚪", score: 3 },
    awayTeam: { name: "Internacional", logo: "🔴⚪", score: 2 },
    sport: "Futebol",
    competition: "Brasileirão Série A",
    minute: 82,
    status: "live",
    startTime: "2026-03-07T18:30:00",
    odds: { home: 1.25, draw: 6.0, away: 9.0 },
  },
  {
    id: "m4",
    homeTeam: { name: "Carlos Silva", logo: "🎾", score: 6 },
    awayTeam: { name: "João Santos", logo: "🎾", score: 4 },
    sport: "Beach Tennis",
    competition: "BT Open São Paulo",
    minute: 45,
    status: "live",
    startTime: "2026-03-07T16:00:00",
    odds: { home: 1.6, draw: 0, away: 2.3 },
  },
  {
    id: "m5",
    homeTeam: { name: "Botafogo", logo: "⚫⚪", score: 0 },
    awayTeam: { name: "Fluminense", logo: "🟢🔴⚪", score: 0 },
    sport: "Futebol",
    competition: "Brasileirão Série A",
    minute: 0,
    status: "upcoming",
    startTime: "2026-03-08T16:00:00",
    odds: { home: 2.5, draw: 3.2, away: 2.8 },
  },
];

export const mockChallenges: ChallengeData[] = [
  {
    id: "ch1",
    title: "Corra 50km este mês",
    description: "Complete 50km de corrida em março",
    sport: "Corrida",
    progress: 31,
    target: 50,
    unit: "km",
    prize: 500,
    participants: 1247,
    endsAt: "2026-03-31",
  },
  {
    id: "ch2",
    title: "10 treinos de CrossFit",
    description: "Complete 10 treinos de CrossFit",
    sport: "CrossFit",
    progress: 7,
    target: 10,
    unit: "treinos",
    prize: 300,
    participants: 892,
    endsAt: "2026-03-31",
  },
  {
    id: "ch3",
    title: "Nade 5km esta semana",
    description: "Complete 5km de natação",
    sport: "Natação",
    progress: 2.3,
    target: 5,
    unit: "km",
    prize: 200,
    participants: 456,
    endsAt: "2026-03-14",
  },
];

export const mockNearbyTournaments: TournamentPreview[] = [
  {
    id: "t1",
    name: "Copa Beach Tennis SP",
    sport: "Beach Tennis",
    date: "2026-03-15",
    location: "Arena Beach Club",
    city: "São Paulo",
    price: 120,
    spotsLeft: 8,
    totalSpots: 32,
    distance: 2.3,
  },
  {
    id: "t2",
    name: "Torneio CrossFit Games SP",
    sport: "CrossFit",
    date: "2026-03-22",
    location: "Box CrossFit Vila Mariana",
    city: "São Paulo",
    price: 80,
    spotsLeft: 15,
    totalSpots: 40,
    distance: 4.1,
  },
  {
    id: "t3",
    name: "Corrida Noturna 10K",
    sport: "Corrida",
    date: "2026-03-29",
    location: "Parque Ibirapuera",
    city: "São Paulo",
    price: 60,
    spotsLeft: 150,
    totalSpots: 500,
    distance: 1.5,
  },
  {
    id: "t4",
    name: "Liga de Futevôlei",
    sport: "Futevôlei",
    date: "2026-04-05",
    location: "Praia de Santos",
    city: "Santos",
    price: 50,
    spotsLeft: 6,
    totalSpots: 16,
    distance: 72,
  },
];

export const mockFeedActivities: FeedActivity[] = [
  {
    id: "f1",
    user: { name: "Rafael Costa", image: null, verified: true },
    sport: "Corrida",
    type: "run",
    content: "Treino matinal concluído! Nada como começar o dia com uma corrida.",
    details: { distance: "8.2km", time: "42:15", pace: "5:09/km" },
    likes: 24,
    comments: 5,
    gifts: 2,
    timeAgo: "15min",
  },
  {
    id: "f2",
    user: { name: "Ana Oliveira", image: null, verified: false },
    sport: "Beach Tennis",
    type: "match",
    content: "Vitória no torneio regional! 6x4, 6x2. Rumo à final!",
    details: { score: "6x4, 6x2" },
    likes: 47,
    comments: 12,
    gifts: 5,
    timeAgo: "1h",
  },
  {
    id: "f3",
    user: { name: "Pedro Almeida", image: null, verified: true },
    sport: "CrossFit",
    type: "training",
    content: "WOD do dia: Fran em 4:32. PR! Cada dia mais forte.",
    likes: 38,
    comments: 8,
    gifts: 3,
    timeAgo: "2h",
  },
  {
    id: "f4",
    user: { name: "Sportio Premium", image: null, verified: true },
    sport: "Beach Tennis",
    type: "post",
    content: "Inscrições abertas para a Copa SP de Beach Tennis! Garanta já sua vaga com 20% de desconto usando GCoins.",
    likes: 156,
    comments: 23,
    gifts: 0,
    timeAgo: "3h",
    sponsored: true,
  },
  {
    id: "f5",
    user: { name: "Maria Santos", image: null, verified: false },
    sport: "Natação",
    type: "achievement",
    content: "Conquistei a medalha de Sereia de Prata! 100km nadados este ano.",
    likes: 92,
    comments: 15,
    gifts: 8,
    timeAgo: "4h",
  },
  {
    id: "f6",
    user: { name: "Lucas Ferreira", image: null, verified: true },
    sport: "Futebol",
    type: "match",
    content: "Mais uma vitória com o time! 3x1 contra o rival. Hat-trick!",
    details: { score: "3x1" },
    likes: 63,
    comments: 18,
    gifts: 4,
    timeAgo: "5h",
  },
];

export const mockActiveBets: ActiveBet[] = [
  {
    id: "b1",
    match: "Flamengo vs Palmeiras",
    selection: "Flamengo vence",
    amount: 50,
    odds: 1.45,
    potentialReturn: 72.5,
    status: "winning",
    canCashOut: true,
    cashOutValue: 65,
  },
  {
    id: "b2",
    match: "Corinthians vs São Paulo",
    selection: "Empate",
    amount: 30,
    odds: 3.3,
    potentialReturn: 99,
    status: "pending",
    canCashOut: true,
    cashOutValue: 28,
  },
  {
    id: "b3",
    match: "Grêmio vs Internacional",
    selection: "Internacional vence",
    amount: 40,
    odds: 3.5,
    potentialReturn: 140,
    status: "losing",
    canCashOut: false,
  },
];

export const mockCreators: CreatorPreview[] = [
  {
    id: "cr1",
    name: "Rafael Costa",
    image: null,
    sport: "Corrida",
    followers: 45200,
    subscribers: 1230,
    subscriptionPrice: 19.9,
    verified: true,
  },
  {
    id: "cr2",
    name: "Ana Oliveira",
    image: null,
    sport: "Beach Tennis",
    followers: 32100,
    subscribers: 890,
    subscriptionPrice: 29.9,
    verified: true,
  },
  {
    id: "cr3",
    name: "Pedro Almeida",
    image: null,
    sport: "CrossFit",
    followers: 28700,
    subscribers: 650,
    subscriptionPrice: 14.9,
    verified: true,
  },
  {
    id: "cr4",
    name: "Juliana Lima",
    image: null,
    sport: "Natação",
    followers: 19500,
    subscribers: 420,
    subscriptionPrice: 24.9,
    verified: false,
  },
];

export const mockManagedTournaments: TournamentManaged[] = [
  {
    id: "tm1",
    name: "Copa Beach Tennis SP - Etapa 3",
    sport: "Beach Tennis",
    status: "active",
    checkedIn: 28,
    totalParticipants: 32,
    nextMatch: "Semifinal 1 - 14:30",
    revenue: 3840,
  },
  {
    id: "tm2",
    name: "Liga CrossFit Primavera",
    sport: "CrossFit",
    status: "active",
    checkedIn: 35,
    totalParticipants: 40,
    nextMatch: "WOD 3 - 15:00",
    revenue: 3200,
  },
  {
    id: "tm3",
    name: "Torneio de Futevôlei Santos",
    sport: "Futevôlei",
    status: "upcoming",
    checkedIn: 0,
    totalParticipants: 16,
    revenue: 800,
  },
];

export const mockPendingEnrollments: PendingEnrollment[] = [
  {
    id: "pe1",
    athleteName: "Carlos Mendes",
    athleteImage: null,
    tournamentName: "Copa Beach Tennis SP",
    requestedAt: "2h atrás",
  },
  {
    id: "pe2",
    athleteName: "Fernanda Souza",
    athleteImage: null,
    tournamentName: "Copa Beach Tennis SP",
    requestedAt: "3h atrás",
  },
  {
    id: "pe3",
    athleteName: "Ricardo Lima",
    athleteImage: null,
    tournamentName: "Liga CrossFit Primavera",
    requestedAt: "5h atrás",
  },
];

export const mockOrganizerEvents: OrganizerEvent[] = [
  { id: "oe1", type: "enrollment", description: "Carlos Mendes se inscreveu na Copa Beach Tennis SP", timeAgo: "2h" },
  { id: "oe2", type: "result", description: "Resultado registrado: Semifinal 1 - Rafael 6x4 João", timeAgo: "3h" },
  { id: "oe3", type: "payment", description: "Pagamento recebido: R$ 120,00 de Fernanda Souza", timeAgo: "4h" },
  { id: "oe4", type: "review", description: "Nova avaliação: Copa BT SP recebeu 5 estrelas", timeAgo: "6h" },
  { id: "oe5", type: "enrollment", description: "Ricardo Lima se inscreveu na Liga CrossFit", timeAgo: "8h" },
];

export const mockCampaigns: Campaign[] = [
  {
    id: "cp1",
    name: "Lançamento Tênis Pro X",
    status: "active",
    impressions: 145200,
    clicks: 3890,
    ctr: 2.68,
    spend: 2450,
  },
  {
    id: "cp2",
    name: "Black Friday Sportio",
    status: "paused",
    impressions: 89300,
    clicks: 2100,
    ctr: 2.35,
    spend: 1800,
  },
  {
    id: "cp3",
    name: "Copa Verão - Patrocínio",
    status: "active",
    impressions: 234500,
    clicks: 7820,
    ctr: 3.34,
    spend: 5200,
  },
];

export const mockSponsorableAthletes: SponsorableAthlete[] = [
  {
    id: "sa1",
    name: "Rafael Costa",
    image: null,
    sport: "Corrida",
    followers: 45200,
    engagementRate: 8.5,
    cpm: 12.5,
    monthlyPrice: 2500,
  },
  {
    id: "sa2",
    name: "Ana Oliveira",
    image: null,
    sport: "Beach Tennis",
    followers: 32100,
    engagementRate: 11.2,
    cpm: 9.8,
    monthlyPrice: 1800,
  },
  {
    id: "sa3",
    name: "Pedro Almeida",
    image: null,
    sport: "CrossFit",
    followers: 28700,
    engagementRate: 9.7,
    cpm: 11.3,
    monthlyPrice: 1500,
  },
];

export const mockROIData = [
  { month: "Out", spend: 1200, returns: 800 },
  { month: "Nov", spend: 2400, returns: 2100 },
  { month: "Dez", spend: 3800, returns: 4500 },
  { month: "Jan", spend: 4200, returns: 5800 },
  { month: "Fev", spend: 5100, returns: 7200 },
  { month: "Mar", spend: 5400, returns: 8100 },
];
