// ============================================
// Sportio - Application Constants
// ============================================

export const SITE_NAME = "Sportio";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

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
  // Traditional Sports
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
    id: "padel",
    name: "Padel",
    icon: "Racquet",
    color: "text-blue-500",
    description: "Esporte de raquete em quadra fechada com paredes de vidro.",
  },
  {
    id: "volei",
    name: "Volei",
    icon: "Circle",
    color: "text-red-500",
    description: "Volei de quadra. Monte seu time e participe de torneios.",
  },
  {
    id: "volei-de-praia",
    name: "Volei de Praia",
    icon: "Waves",
    color: "text-orange-500",
    description: "Volei jogado na areia. Duplas competitivas e recreativas.",
  },
  {
    id: "basquete",
    name: "Basquete",
    icon: "Target",
    color: "text-orange-500",
    description: "Basquete 5x5 e 3x3. Das quadras de rua aos ginasios.",
  },
  {
    id: "tenis",
    name: "Tenis",
    icon: "Trophy",
    color: "text-lime-500",
    description: "Tenis de quadra. Singles ou duplas, encontre adversarios do seu nivel.",
  },
  {
    id: "futsal",
    name: "Futsal",
    icon: "Goal",
    color: "text-cyan-500",
    description: "Futebol de salao. Velocidade e tecnica em quadra reduzida.",
  },
  {
    id: "handebol",
    name: "Handebol",
    icon: "Hand",
    color: "text-purple-500",
    description: "Handebol de quadra. Forca, velocidade e estrategia em equipe.",
  },
  {
    id: "natacao",
    name: "Natacao",
    icon: "Waves",
    color: "text-sky-500",
    description: "Natacao em piscina. Melhore seus tempos e participe de competicoes.",
  },
  {
    id: "corrida",
    name: "Corrida",
    icon: "Timer",
    color: "text-pink-500",
    description: "Corrida de rua e trail. Acompanhe seus tempos e evolua constantemente.",
  },
  {
    id: "ciclismo",
    name: "Ciclismo",
    icon: "Bike",
    color: "text-teal-500",
    description: "Ciclismo de estrada e mountain bike. Rotas, pedais em grupo e competicoes.",
  },
  {
    id: "jiu-jitsu",
    name: "Jiu-Jitsu",
    icon: "Swords",
    color: "text-slate-700",
    description: "Jiu-Jitsu Brasileiro (BJJ). A arte suave nas academias e competicoes.",
  },
  {
    id: "muay-thai",
    name: "Muay Thai",
    icon: "Swords",
    color: "text-red-600",
    description: "Arte marcial tailandesa. Treinos, lutas e evolucao constante.",
  },
  {
    id: "crossfit",
    name: "CrossFit",
    icon: "Dumbbell",
    color: "text-violet-500",
    description: "Treinamento funcional de alta intensidade. Desafie seus limites.",
  },
  {
    id: "surf",
    name: "Surf",
    icon: "Waves",
    color: "text-cyan-600",
    description: "Surf e bodyboard. Conecte-se com a comunidade das ondas.",
  },
  {
    id: "skate",
    name: "Skate",
    icon: "Zap",
    color: "text-gray-400",
    description: "Skate street e park. Mostre suas manobras e conecte-se com a cena.",
  },
  {
    id: "tenis-de-mesa",
    name: "Tenis de Mesa",
    icon: "Racquet",
    color: "text-rose-500",
    description: "Pingue-pongue competitivo. Reflexo e precisao na mesa.",
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "Racquet",
    color: "text-green-600",
    description: "Badminton indoor. Velocidade e agilidade com a peteca.",
  },
  {
    id: "rugby",
    name: "Rugby",
    icon: "Swords",
    color: "text-amber-800",
    description: "Rugby sevens e XV. Forca, uniao e espirito de equipe.",
  },

  // Games / E-Sports
  {
    id: "league-of-legends",
    name: "League of Legends",
    icon: "Gamepad2",
    color: "text-blue-800",
    description: "O MOBA mais jogado do mundo. Monte seu time e domine o Rift.",
  },
  {
    id: "counter-strike",
    name: "Counter-Strike",
    icon: "Gamepad2",
    color: "text-orange-600",
    description: "O FPS tatico mais competitivo. Estrategia e mira precisa.",
  },
  {
    id: "valorant",
    name: "Valorant",
    icon: "Gamepad2",
    color: "text-red-600",
    description: "FPS tatico com agentes unicos. Habilidade e trabalho em equipe.",
  },
  {
    id: "fortnite",
    name: "Fortnite",
    icon: "Gamepad2",
    color: "text-violet-500",
    description: "Battle Royale com construcao. Criatividade e sobrevivencia.",
  },
  {
    id: "fifa-ea-fc",
    name: "FIFA / EA FC",
    icon: "Gamepad2",
    color: "text-green-600",
    description: "O simulador de futebol mais popular. Torneios online e presenciais.",
  },
  {
    id: "free-fire",
    name: "Free Fire",
    icon: "Gamepad2",
    color: "text-amber-500",
    description: "Battle Royale mobile. Competicoes acessiveis para todos.",
  },
  {
    id: "dota-2",
    name: "Dota 2",
    icon: "Gamepad2",
    color: "text-red-700",
    description: "MOBA de estrategia profunda. Torneios com as maiores premiacoes do mundo.",
  },
  {
    id: "rocket-league",
    name: "Rocket League",
    icon: "Gamepad2",
    color: "text-blue-600",
    description: "Futebol com carros. Acrobacias aereas e gols espetaculares.",
  },

  // Card / Table Games
  {
    id: "truco",
    name: "Truco",
    icon: "Spade",
    color: "text-red-600",
    description: "O jogo de cartas mais brasileiro. Blefe, estrategia e muita diversao.",
  },
  {
    id: "poker",
    name: "Poker",
    icon: "Spade",
    color: "text-emerald-600",
    description: "O jogo de cartas mais famoso do mundo. Torneios e cash games.",
  },
  {
    id: "xadrez",
    name: "Xadrez",
    icon: "Crown",
    color: "text-slate-700",
    description: "O jogo de estrategia milenar. Desafie sua mente em cada partida.",
  },
  {
    id: "damas",
    name: "Damas",
    icon: "Grid",
    color: "text-amber-900",
    description: "Jogo de tabuleiro classico. Estrategia e raciocinio logico.",
  },
  {
    id: "sinuca-bilhar",
    name: "Sinuca/Bilhar",
    icon: "Circle",
    color: "text-green-800",
    description: "Precisao e tecnica no pano verde. Torneios e partidas casuais.",
  },
  {
    id: "domino",
    name: "Domino",
    icon: "Dice",
    color: "text-gray-600",
    description: "Jogo de mesa tradicional. Estrategia com pecas numeradas.",
  },
  {
    id: "buraco",
    name: "Buraco",
    icon: "Spade",
    color: "text-violet-500",
    description: "Jogo de cartas em duplas. Canastras e estrategia com seu parceiro.",
  },
  {
    id: "uno",
    name: "Uno",
    icon: "Palette",
    color: "text-red-600",
    description: "O jogo de cartas colorido mais divertido. Competicoes e diversao garantida.",
  },

  // Additional Sports
  {
    id: "futevolei",
    name: "Futevolei",
    icon: "Flame",
    color: "text-orange-600",
    description: "A mistura perfeita de futebol e volei. Habilidade e estilo na rede.",
  },
  {
    id: "golfe",
    name: "Golfe",
    icon: "Flag",
    color: "text-green-600",
    description: "Precisao e elegancia nos campos. Torneios e rodadas entre amigos.",
  },
  {
    id: "atletismo",
    name: "Atletismo",
    icon: "Timer",
    color: "text-red-600",
    description: "Provas de pista e campo. Velocidade, resistencia e forca.",
  },
  {
    id: "boxe",
    name: "Boxe",
    icon: "Swords",
    color: "text-red-700",
    description: "A nobre arte. Treinos, lutas e superacao no ringue.",
  },
  {
    id: "escalada",
    name: "Escalada",
    icon: "Mountain",
    color: "text-amber-900",
    description: "Escalada indoor e outdoor. Supere obstaculos e alcance o topo.",
  },
  {
    id: "remo",
    name: "Remo",
    icon: "Waves",
    color: "text-blue-800",
    description: "Esporte aquatico de forca e sincronia. Competicoes e treinos em equipe.",
  },
  {
    id: "polo-aquatico",
    name: "Polo Aquatico",
    icon: "Waves",
    color: "text-sky-600",
    description: "Esporte aquatico de equipe. Natacao, forca e estrategia na piscina.",
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
  athletes: "Milhares",
  tournaments: "Centenas",
  totalAthletes: "Milhares",
  sports: "40+",
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
      "Compita em torneios, ganhe GCoins com vitorias e transforme seu talento esportivo em renda real via PIX.",
    icon: "Users",
    href: "/athletes",
    color: "text-emerald-500",
  },
  {
    id: "organizers",
    name: "Organizadores",
    description:
      "Crie torneios, gerencie inscricoes e brackets. Lucre organizando eventos esportivos profissionais.",
    icon: "CalendarDays",
    href: "/organizers",
    color: "text-blue-500",
  },
  {
    id: "brands",
    name: "Marcas e Patrocinadores",
    description:
      "Patrocine atletas e torneios, de produtos como premio, compre GCoins e aumente a visibilidade da sua marca.",
    icon: "Building2",
    href: "/brands",
    color: "text-purple-500",
  },
  {
    id: "trainers",
    name: "Treinadores",
    description:
      "Conecte-se com atletas, organize treinos e campeonatos. Aumente sua renda e visibilidade como treinador.",
    icon: "ShieldCheck",
    href: "/register?persona=trainer",
    color: "text-amber-500",
  },
  {
    id: "referees",
    name: "Arbitros",
    description:
      "Seja escalado para partidas e torneios, construa sua reputacao e ganhe por arbitrar eventos.",
    icon: "ShieldCheck",
    href: "/referees",
    color: "text-slate-500",
  },
  {
    id: "fans",
    name: "Fas e Comunidade",
    description:
      "Qualquer pessoa pode acompanhar torneios ao vivo, dar palpites com GCoins e interagir com a comunidade. Basta se cadastrar!",
    icon: "Heart",
    href: "/fans",
    color: "text-red-500",
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
