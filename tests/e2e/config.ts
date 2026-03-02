// E2E Test Configuration
// All test users, endpoints, and settings

export const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
export const TRPC_URL = `${BASE_URL}/api/trpc`;
export const AUTH_URL = `${BASE_URL}/api/auth`;

// Test password used for all test accounts
export const TEST_PASSWORD = "SportioTest2026!";

// Test users - one per persona
export const TEST_USERS = {
  athlete: {
    name: "Carlos Atleta E2E",
    email: "sportio.e2e.atleta@gmail.com",
    roles: ["athlete"],
    bio: "Atleta profissional de Beach Tennis e Padel",
    city: "Rio de Janeiro",
    state: "RJ",
    phone: "(21) 99999-0001",
    instagram: "@carlos.atleta",
    twitter: "@carlos_atleta",
  },
  organizer: {
    name: "Marina Organizadora E2E",
    email: "sportio.e2e.organizadora@gmail.com",
    roles: ["organizer"],
    bio: "Organizadora de torneios esportivos no Rio",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 99999-0002",
    instagram: "@marina.org",
  },
  brand: {
    name: "BrandX Sports E2E",
    email: "sportio.e2e.brand@gmail.com",
    roles: ["brand"],
    bio: "Marca esportiva líder em equipamentos de Beach Tennis",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 99999-0003",
    instagram: "@brandx.sports",
    youtube: "BrandXSports",
  },
  referee: {
    name: "Roberto Arbitro E2E",
    email: "sportio.e2e.arbitro@gmail.com",
    roles: ["referee"],
    bio: "Árbitro certificado CBT",
    city: "Curitiba",
    state: "PR",
    phone: "(41) 99999-0004",
  },
  trainer: {
    name: "Ana Treinadora E2E",
    email: "sportio.e2e.treinadora@gmail.com",
    roles: ["trainer"],
    bio: "Personal trainer especializada em preparação para torneios",
    city: "Belo Horizonte",
    state: "MG",
    phone: "(31) 99999-0005",
    instagram: "@ana.trainer",
  },
  nutritionist: {
    name: "Paulo Nutri E2E",
    email: "sportio.e2e.nutri@gmail.com",
    roles: ["nutritionist"],
    bio: "Nutricionista esportivo com foco em performance",
    city: "Salvador",
    state: "BA",
    phone: "(71) 99999-0006",
  },
  photographer: {
    name: "Fernanda Foto E2E",
    email: "sportio.e2e.foto@gmail.com",
    roles: ["photographer"],
    bio: "Fotógrafa esportiva profissional",
    city: "Florianópolis",
    state: "SC",
    phone: "(48) 99999-0007",
    instagram: "@fernanda.foto",
  },
  arena_owner: {
    name: "Jorge Arena E2E",
    email: "sportio.e2e.arena@gmail.com",
    roles: ["arena_owner"],
    bio: "Dono do Complexo Esportivo Arena Sul",
    city: "Porto Alegre",
    state: "RS",
    phone: "(51) 99999-0008",
  },
  admin: {
    name: "Admin Master E2E",
    email: "sportio.e2e.admin@gmail.com",
    roles: ["athlete"], // admin role added separately
    bio: "Administrador do sistema",
    city: "Brasília",
    state: "DF",
  },
  // Extra athletes for tournament testing
  athlete2: {
    name: "Lucas Jogador E2E",
    email: "sportio.e2e.atleta2@gmail.com",
    roles: ["athlete"],
    bio: "Jogador amador de futebol",
    city: "Rio de Janeiro",
    state: "RJ",
  },
  athlete3: {
    name: "Pedro Tenista E2E",
    email: "sportio.e2e.atleta3@gmail.com",
    roles: ["athlete"],
    bio: "Tenista nível B",
    city: "São Paulo",
    state: "SP",
  },
  athlete4: {
    name: "Rafael Padel E2E",
    email: "sportio.e2e.atleta4@gmail.com",
    roles: ["athlete"],
    bio: "Jogador de padel nível C",
    city: "Curitiba",
    state: "PR",
  },
} as const;

export type TestUserKey = keyof typeof TEST_USERS;

// Tournament formats to test
export const TOURNAMENT_FORMATS = [
  "single_elimination",
  "double_elimination",
  "round_robin",
  "swiss",
  "league",
] as const;

// Sports to use in tests (will be resolved to IDs at runtime)
export const TEST_SPORTS = [
  "beach-tennis",
  "padel",
  "futebol",
  "volei",
  "tenis",
] as const;
