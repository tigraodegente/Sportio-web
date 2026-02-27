// ============================================
// Sportio - Application Constants
// ============================================

export const SITE_NAME = "Sportio";

export const SITE_URL = "https://sportio.com";

export const SITE_DESCRIPTION =
  "A plataforma completa para o universo esportivo. Conecte-se com atletas, organize torneios, conquiste GCoins e viva o esporte como nunca antes.";

// ============================================
// Sports
// ============================================

export interface Sport {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const SPORTS: Sport[] = [
  {
    id: "futebol",
    name: "Futebol",
    icon: "Goal",
    color: "text-emerald-500",
    description: "O esporte mais popular do Brasil. Participe de peladas, campeonatos e muito mais.",
  },
  {
    id: "beach-tennis",
    name: "Beach Tennis",
    icon: "Sun",
    color: "text-amber-500",
    description: "O esporte que mais cresce no Brasil. Encontre parceiros e torneios na areia.",
  },
  {
    id: "corrida",
    name: "Corrida",
    icon: "Timer",
    color: "text-blue-500",
    description: "De corridas de rua a maratonas. Acompanhe seus tempos e evolua constantemente.",
  },
  {
    id: "crossfit",
    name: "CrossFit",
    icon: "Dumbbell",
    color: "text-red-500",
    description: "Desafie seus limites com WODs, competições e comunidade fitness.",
  },
  {
    id: "volei",
    name: "Vôlei",
    icon: "Circle",
    color: "text-yellow-500",
    description: "Quadra ou praia, monte seu time e participe de torneios de vôlei.",
  },
  {
    id: "futevolei",
    name: "Futevôlei",
    icon: "Flame",
    color: "text-orange-500",
    description: "A mistura perfeita de futebol e vôlei. Habilidade e estilo na rede.",
  },
  {
    id: "esports",
    name: "E-Sports",
    icon: "Gamepad2",
    color: "text-purple-500",
    description: "Competições de jogos eletrônicos. Monte seu squad e domine os campeonatos.",
  },
  {
    id: "basquete",
    name: "Basquete",
    icon: "Target",
    color: "text-orange-600",
    description: "Das quadras de rua aos ginásios. Encontre partidas e torneios de basquete.",
  },
  {
    id: "natacao",
    name: "Natação",
    icon: "Waves",
    color: "text-cyan-500",
    description: "Melhore seus tempos, participe de competições e conecte-se com nadadores.",
  },
  {
    id: "tenis",
    name: "Tênis",
    icon: "Trophy",
    color: "text-lime-500",
    description: "Singles ou duplas. Encontre adversários do seu nível e suba no ranking.",
  },
  {
    id: "skate",
    name: "Skate",
    icon: "Zap",
    color: "text-pink-500",
    description: "Street, park ou vert. Conecte-se com a comunidade e mostre suas manobras.",
  },
  {
    id: "lutas",
    name: "Lutas",
    icon: "Swords",
    color: "text-red-600",
    description: "MMA, Jiu-Jitsu, Boxe e mais. Encontre academias, eventos e adversários.",
  },
  {
    id: "ciclismo",
    name: "Ciclismo",
    icon: "Bike",
    color: "text-teal-500",
    description: "Road, MTB ou gravel. Rotas, pedais em grupo e competições ciclísticas.",
  },
];

// ============================================
// Platform Stats
// ============================================

export interface Stats {
  athletes: string;
  tournaments: string;
  totalAthletes: string;
  sports: string;
}

export const STATS: Stats = {
  athletes: "12.500+",
  tournaments: "850",
  totalAthletes: "500k+",
  sports: "13",
};

// ============================================
// User Types
// ============================================

export interface UserType {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export const USER_TYPES: UserType[] = [
  {
    id: "athletes",
    name: "Atletas",
    description:
      "Crie seu perfil esportivo, acompanhe estatísticas, conquiste GCoins e conecte-se com outros atletas.",
    icon: "Users",
    href: "/athletes",
    color: "text-emerald-500",
  },
  {
    id: "organizers",
    name: "Organizadores",
    description:
      "Crie e gerencie torneios, controle inscrições, brackets e resultados em uma plataforma completa.",
    icon: "CalendarDays",
    href: "/organizers",
    color: "text-blue-500",
  },
  {
    id: "brands",
    name: "Marcas",
    description:
      "Patrocine eventos, conecte-se com atletas e aumente a visibilidade da sua marca no esporte.",
    icon: "Building2",
    href: "/brands",
    color: "text-purple-500",
  },
  {
    id: "fans",
    name: "Fãs",
    description:
      "Acompanhe seus atletas favoritos, torneios ao vivo e interaja com a comunidade esportiva.",
    icon: "Heart",
    href: "/fans",
    color: "text-red-500",
  },
  {
    id: "bettors",
    name: "Palpiteiros",
    description:
      "Use seus GCoins para dar palpites em torneios, desafios e competições. Diversão garantida!",
    icon: "TrendingUp",
    href: "/bettors",
    color: "text-amber-500",
  },
  {
    id: "referees",
    name: "Árbitros",
    description:
      "Cadastre-se como árbitro, seja escalado para partidas e torneios, e construa sua reputação.",
    icon: "ShieldCheck",
    href: "/referees",
    color: "text-slate-500",
  },
];

// ============================================
// Navigation Links
// ============================================

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Esportes", href: "/sports" },
  { label: "Torneios", href: "/tournaments" },
  { label: "Atletas", href: "/athletes" },
  { label: "GCoins", href: "/gcoins" },
  { label: "Para Organizadores", href: "/organizers" },
  { label: "Para Marcas", href: "/brands" },
  { label: "Blog", href: "/blog" },
];
