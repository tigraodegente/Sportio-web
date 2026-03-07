// Abstract interface for sports data providers
export interface Competition {
  externalId: string;
  name: string;
  shortName: string;
  logo: string | null;
  country: string;
  season: string;
}

export interface Team {
  externalId: string;
  name: string;
  shortName: string;
  logo: string | null;
  country: string;
  city: string;
  founded: number;
  venue: string;
}

export interface MatchDetail {
  externalId: string;
  competitionId: string;
  homeTeam: Team;
  awayTeam: Team;
  status: "scheduled" | "live" | "completed" | "postponed" | "cancelled";
  homeScore: number | null;
  awayScore: number | null;
  round: string;
  kickoffAt: Date;
  venue: string;
  events: MatchEvent[];
  stats: MatchStats | null;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "var";
  player: string;
  team: string;
  detail?: string;
}

export interface MatchStats {
  homePossession: number;
  awayPossession: number;
  homeShots: number;
  awayShots: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeCorners: number;
  awayCorners: number;
  homeFouls: number;
  awayFouls: number;
}

export interface Odds {
  marketType: string;
  selection: string;
  odds: number;
}

export interface SportsDataProvider {
  getCompetitions(sportId?: string): Promise<Competition[]>;
  getLiveMatches(): Promise<MatchDetail[]>;
  getMatchDetails(externalId: string): Promise<MatchDetail | null>;
  getMatchOdds(externalId: string): Promise<Odds[]>;
  getTeam(externalId: string): Promise<Team | null>;
  searchTeams(query: string): Promise<Team[]>;
}

// ==================== MOCK DATA ====================

const BRASILEIRAO_TEAMS: Team[] = [
  { externalId: "flamengo", name: "Flamengo", shortName: "FLA", logo: null, country: "Brasil", city: "Rio de Janeiro", founded: 1895, venue: "Maracana" },
  { externalId: "palmeiras", name: "Palmeiras", shortName: "PAL", logo: null, country: "Brasil", city: "Sao Paulo", founded: 1914, venue: "Allianz Parque" },
  { externalId: "corinthians", name: "Corinthians", shortName: "COR", logo: null, country: "Brasil", city: "Sao Paulo", founded: 1910, venue: "Neo Quimica Arena" },
  { externalId: "saopaulo", name: "Sao Paulo", shortName: "SAO", logo: null, country: "Brasil", city: "Sao Paulo", founded: 1930, venue: "Morumbis" },
  { externalId: "santos", name: "Santos", shortName: "SAN", logo: null, country: "Brasil", city: "Santos", founded: 1912, venue: "Vila Belmiro" },
  { externalId: "gremio", name: "Gremio", shortName: "GRE", logo: null, country: "Brasil", city: "Porto Alegre", founded: 1903, venue: "Arena do Gremio" },
  { externalId: "internacional", name: "Internacional", shortName: "INT", logo: null, country: "Brasil", city: "Porto Alegre", founded: 1909, venue: "Beira-Rio" },
  { externalId: "atleticomg", name: "Atletico-MG", shortName: "CAM", logo: null, country: "Brasil", city: "Belo Horizonte", founded: 1908, venue: "Arena MRV" },
  { externalId: "cruzeiro", name: "Cruzeiro", shortName: "CRU", logo: null, country: "Brasil", city: "Belo Horizonte", founded: 1921, venue: "Mineirao" },
  { externalId: "botafogo", name: "Botafogo", shortName: "BOT", logo: null, country: "Brasil", city: "Rio de Janeiro", founded: 1904, venue: "Nilton Santos" },
  { externalId: "fluminense", name: "Fluminense", shortName: "FLU", logo: null, country: "Brasil", city: "Rio de Janeiro", founded: 1902, venue: "Maracana" },
  { externalId: "vasco", name: "Vasco", shortName: "VAS", logo: null, country: "Brasil", city: "Rio de Janeiro", founded: 1898, venue: "Sao Januario" },
  { externalId: "bahia", name: "Bahia", shortName: "BAH", logo: null, country: "Brasil", city: "Salvador", founded: 1931, venue: "Arena Fonte Nova" },
  { externalId: "fortaleza", name: "Fortaleza", shortName: "FOR", logo: null, country: "Brasil", city: "Fortaleza", founded: 1918, venue: "Arena Castelao" },
  { externalId: "athleticopr", name: "Athletico-PR", shortName: "CAP", logo: null, country: "Brasil", city: "Curitiba", founded: 1924, venue: "Ligga Arena" },
  { externalId: "bragantino", name: "Red Bull Bragantino", shortName: "RBB", logo: null, country: "Brasil", city: "Braganca Paulista", founded: 1928, venue: "Nabi Abi Chedid" },
  { externalId: "juventude", name: "Juventude", shortName: "JUV", logo: null, country: "Brasil", city: "Caxias do Sul", founded: 1913, venue: "Alfredo Jaconi" },
  { externalId: "cuiaba", name: "Cuiaba", shortName: "CUI", logo: null, country: "Brasil", city: "Cuiaba", founded: 2001, venue: "Arena Pantanal" },
  { externalId: "vitoria", name: "Vitoria", shortName: "VIT", logo: null, country: "Brasil", city: "Salvador", founded: 1899, venue: "Barradao" },
  { externalId: "sport", name: "Sport", shortName: "SPT", logo: null, country: "Brasil", city: "Recife", founded: 1905, venue: "Ilha do Retiro" },
];

const MOCK_COMPETITIONS: Competition[] = [
  {
    externalId: "brasileirao-a",
    name: "Brasileirao Serie A",
    shortName: "Serie A",
    logo: null,
    country: "Brasil",
    season: "2026",
  },
  {
    externalId: "copa-do-brasil",
    name: "Copa do Brasil",
    shortName: "Copa BR",
    logo: null,
    country: "Brasil",
    season: "2026",
  },
];

function generateMockMatches(): MatchDetail[] {
  const now = new Date();
  const matches: MatchDetail[] = [];

  // 2 live matches
  matches.push({
    externalId: "match-live-1",
    competitionId: "brasileirao-a",
    homeTeam: BRASILEIRAO_TEAMS[0]!, // Flamengo
    awayTeam: BRASILEIRAO_TEAMS[1]!, // Palmeiras
    status: "live",
    homeScore: 2,
    awayScore: 1,
    round: "Rodada 5",
    kickoffAt: new Date(now.getTime() - 60 * 60 * 1000), // started 1h ago
    venue: "Maracana",
    events: [
      { minute: 12, type: "goal", player: "Gabriel Barbosa", team: "Flamengo" },
      { minute: 34, type: "goal", player: "Endrick", team: "Palmeiras" },
      { minute: 55, type: "yellow_card", player: "Gustavo Gomez", team: "Palmeiras" },
      { minute: 67, type: "goal", player: "De Arrascaeta", team: "Flamengo" },
    ],
    stats: {
      homePossession: 52,
      awayPossession: 48,
      homeShots: 14,
      awayShots: 9,
      homeShotsOnTarget: 6,
      awayShotsOnTarget: 3,
      homeCorners: 5,
      awayCorners: 3,
      homeFouls: 11,
      awayFouls: 14,
    },
  });

  matches.push({
    externalId: "match-live-2",
    competitionId: "brasileirao-a",
    homeTeam: BRASILEIRAO_TEAMS[2]!, // Corinthians
    awayTeam: BRASILEIRAO_TEAMS[3]!, // Sao Paulo
    status: "live",
    homeScore: 0,
    awayScore: 0,
    round: "Rodada 5",
    kickoffAt: new Date(now.getTime() - 30 * 60 * 1000), // started 30min ago
    venue: "Neo Quimica Arena",
    events: [
      { minute: 18, type: "yellow_card", player: "Renato Augusto", team: "Corinthians" },
    ],
    stats: {
      homePossession: 45,
      awayPossession: 55,
      homeShots: 3,
      awayShots: 7,
      homeShotsOnTarget: 1,
      awayShotsOnTarget: 3,
      homeCorners: 2,
      awayCorners: 4,
      homeFouls: 8,
      awayFouls: 6,
    },
  });

  // 10 upcoming matches
  for (let i = 0; i < 10; i++) {
    const homeIdx = i * 2;
    const awayIdx = i * 2 + 1;
    if (homeIdx >= BRASILEIRAO_TEAMS.length || awayIdx >= BRASILEIRAO_TEAMS.length) break;

    const kickoff = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);

    matches.push({
      externalId: `match-scheduled-${i + 1}`,
      competitionId: "brasileirao-a",
      homeTeam: BRASILEIRAO_TEAMS[homeIdx]!,
      awayTeam: BRASILEIRAO_TEAMS[awayIdx]!,
      status: "scheduled",
      homeScore: null,
      awayScore: null,
      round: "Rodada 6",
      kickoffAt: kickoff,
      venue: BRASILEIRAO_TEAMS[homeIdx]!.venue,
      events: [],
      stats: null,
    });
  }

  return matches;
}

function generateMockOdds(matchExternalId: string): Odds[] {
  // Deterministic but varied odds based on match ID
  const seed = matchExternalId.length;
  const homeOdds = 1.5 + (seed % 10) * 0.15;
  const drawOdds = 3.0 + (seed % 5) * 0.2;
  const awayOdds = 2.0 + (seed % 8) * 0.25;

  return [
    // Match winner market
    { marketType: "match_winner", selection: "home", odds: Number(homeOdds.toFixed(2)) },
    { marketType: "match_winner", selection: "draw", odds: Number(drawOdds.toFixed(2)) },
    { marketType: "match_winner", selection: "away", odds: Number(awayOdds.toFixed(2)) },
    // Both teams score
    { marketType: "both_score", selection: "yes", odds: 1.85 },
    { marketType: "both_score", selection: "no", odds: 1.95 },
    // Over/under 2.5
    { marketType: "over_under_2_5", selection: "over", odds: 2.1 },
    { marketType: "over_under_2_5", selection: "under", odds: 1.75 },
  ];
}

// ==================== MOCK IMPLEMENTATION ====================

class MockSportsDataProvider implements SportsDataProvider {
  private matches = generateMockMatches();

  async getCompetitions(): Promise<Competition[]> {
    return MOCK_COMPETITIONS;
  }

  async getLiveMatches(): Promise<MatchDetail[]> {
    return this.matches.filter((m) => m.status === "live");
  }

  async getMatchDetails(externalId: string): Promise<MatchDetail | null> {
    return this.matches.find((m) => m.externalId === externalId) ?? null;
  }

  async getMatchOdds(externalId: string): Promise<Odds[]> {
    return generateMockOdds(externalId);
  }

  async getTeam(externalId: string): Promise<Team | null> {
    return BRASILEIRAO_TEAMS.find((t) => t.externalId === externalId) ?? null;
  }

  async searchTeams(query: string): Promise<Team[]> {
    const q = query.toLowerCase();
    return BRASILEIRAO_TEAMS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q)
    );
  }
}

// Factory function
export function createSportsDataProvider(): SportsDataProvider {
  // Future: if (process.env.API_FOOTBALL_KEY) return new ApiFootballProvider(key);
  return new MockSportsDataProvider();
}

// Export mock data for seeding
export { BRASILEIRAO_TEAMS, MOCK_COMPETITIONS, generateMockMatches, generateMockOdds };
