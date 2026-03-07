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

// ==================== API-FOOTBALL IMPLEMENTATION ====================

// API-Football response types (v3)
interface ApiFootballResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: Record<string, string> | string[];
  results: number;
  paging: { current: number; total: number };
  response: T[];
}

interface ApiFixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: { first: number | null; second: number | null };
    venue: { id: number | null; name: string; city: string };
    status: {
      long: string;
      short: string; // "NS" | "1H" | "HT" | "2H" | "ET" | "P" | "FT" | "AET" | "PEN" | "BT" | "SUSP" | "INT" | "PST" | "CANC" | "ABD" | "AWD" | "WO" | "LIVE"
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

interface ApiFixtureEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: string; // "Goal" | "Card" | "subst" | "Var"
  detail: string; // "Normal Goal" | "Penalty" | "Own Goal" | "Yellow Card" | "Red Card" | "Substitution 1" | etc.
  comments: string | null;
}

interface ApiFixtureStatistic {
  team: { id: number; name: string; logo: string };
  statistics: Array<{
    type: string; // "Shots on Goal" | "Shots off Goal" | "Total Shots" | "Ball Possession" | "Corner Kicks" | "Fouls" | etc.
    value: number | string | null;
  }>;
}

interface ApiLeague {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
  seasons: Array<{
    year: number;
    start: string;
    end: string;
    current: boolean;
  }>;
}

interface ApiTeam {
  team: {
    id: number;
    name: string;
    code: string | null;
    country: string;
    founded: number | null;
    national: boolean;
    logo: string;
  };
  venue: {
    id: number | null;
    name: string;
    address: string | null;
    city: string;
    capacity: number | null;
    surface: string | null;
    image: string | null;
  };
}

interface ApiOdds {
  league: { id: number; name: string; country: string; logo: string; season: number };
  fixture: { id: number; timezone: string; date: string; timestamp: number };
  update: string;
  bookmakers: Array<{
    id: number;
    name: string;
    bets: Array<{
      id: number;
      name: string; // "Match Winner" | "Home/Away" | "Goals Over/Under" | "Both Teams Score" | etc.
      values: Array<{
        value: string;
        odd: string;
      }>;
    }>;
  }>;
}

// In-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  invalidate(pattern: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(pattern)) {
        this.store.delete(key);
      }
    }
  }
}

// Cache TTLs
const CACHE_TTL = {
  LIVE_MATCHES: 5 * 60 * 1000,      // 5 minutes
  MATCH_DETAILS: 2 * 60 * 1000,     // 2 minutes (can change quickly during live)
  COMPETITIONS: 60 * 60 * 1000,      // 1 hour
  TEAMS: 60 * 60 * 1000,            // 1 hour
  ODDS: 5 * 60 * 1000,              // 5 minutes
  SEARCH: 30 * 60 * 1000,           // 30 minutes
} as const;

// Map API-Football fixture status codes to our status type
function mapFixtureStatus(
  statusShort: string
): MatchDetail["status"] {
  switch (statusShort) {
    // Live statuses
    case "1H":
    case "HT":
    case "2H":
    case "ET":
    case "P":
    case "BT":
    case "LIVE":
    case "INT":
      return "live";
    // Completed statuses
    case "FT":
    case "AET":
    case "PEN":
    case "AWD":
    case "WO":
      return "completed";
    // Postponed
    case "PST":
    case "SUSP":
      return "postponed";
    // Cancelled
    case "CANC":
    case "ABD":
      return "cancelled";
    // Not started / scheduled
    case "TBD":
    case "NS":
    default:
      return "scheduled";
  }
}

// Map API-Football event type/detail to our event type
function mapEventType(
  type: string,
  detail: string
): MatchEvent["type"] {
  const typeLower = type.toLowerCase();
  const detailLower = detail.toLowerCase();

  if (typeLower === "goal") return "goal";
  if (typeLower === "card" && detailLower.includes("yellow")) return "yellow_card";
  if (typeLower === "card" && detailLower.includes("red")) return "red_card";
  if (typeLower === "subst") return "substitution";
  if (typeLower === "var") return "var";

  // Fallback — treat unknown types as VAR (least impactful)
  return "var";
}

// Extract a stat value by type name from the API-Football statistics array
function extractStat(
  stats: Array<{ type: string; value: number | string | null }>,
  statType: string
): number {
  const entry = stats.find(
    (s) => s.type.toLowerCase() === statType.toLowerCase()
  );
  if (!entry || entry.value === null) return 0;
  if (typeof entry.value === "number") return entry.value;
  // Handle "52%" -> 52
  const parsed = parseInt(String(entry.value).replace("%", ""), 10);
  return isNaN(parsed) ? 0 : parsed;
}

export class ApiFootballProvider implements SportsDataProvider {
  private apiKey: string;
  private baseUrl: string;
  private cache = new MemoryCache();

  constructor(apiKey: string, host?: string) {
    this.apiKey = apiKey;
    this.baseUrl = `https://${host || "v3.football.api-sports.io"}`;
  }

  // Core fetch method with error handling
  private async apiFetch<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<ApiFootballResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url.toString(), {
      headers: {
        "x-apisports-key": this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API-Football request failed: ${response.status} ${response.statusText} for ${endpoint}`
      );
    }

    const data = (await response.json()) as ApiFootballResponse<T>;

    // Check for API-level errors
    const errors = data.errors;
    if (errors) {
      const errorMessages = Array.isArray(errors)
        ? errors
        : Object.values(errors);
      if (errorMessages.length > 0) {
        throw new Error(
          `API-Football error: ${errorMessages.join(", ")}`
        );
      }
    }

    return data;
  }

  // Map an API fixture to a partial team (minimal info from fixture response)
  private fixtureTeamToTeam(
    apiTeam: { id: number; name: string; logo: string },
    winner: boolean | null
  ): Team {
    return {
      externalId: String(apiTeam.id),
      name: apiTeam.name,
      shortName: apiTeam.name.substring(0, 3).toUpperCase(),
      logo: apiTeam.logo,
      country: "",
      city: "",
      founded: 0,
      venue: "",
    };
  }

  // Map a full API fixture + events + stats to our MatchDetail
  private mapFixtureToMatch(
    fixture: ApiFixture,
    events: ApiFixtureEvent[] = [],
    stats: ApiFixtureStatistic[] = []
  ): MatchDetail {
    const mappedEvents: MatchEvent[] = events.map((e) => ({
      minute: e.time.elapsed + (e.time.extra ?? 0),
      type: mapEventType(e.type, e.detail),
      player: e.player.name,
      team: e.team.name,
      detail: e.detail,
    }));

    let matchStats: MatchStats | null = null;
    if (stats.length === 2) {
      const homeStats = stats[0]!.statistics;
      const awayStats = stats[1]!.statistics;
      matchStats = {
        homePossession: extractStat(homeStats, "Ball Possession"),
        awayPossession: extractStat(awayStats, "Ball Possession"),
        homeShots: extractStat(homeStats, "Total Shots"),
        awayShots: extractStat(awayStats, "Total Shots"),
        homeShotsOnTarget: extractStat(homeStats, "Shots on Goal"),
        awayShotsOnTarget: extractStat(awayStats, "Shots on Goal"),
        homeCorners: extractStat(homeStats, "Corner Kicks"),
        awayCorners: extractStat(awayStats, "Corner Kicks"),
        homeFouls: extractStat(homeStats, "Fouls"),
        awayFouls: extractStat(awayStats, "Fouls"),
      };
    }

    return {
      externalId: String(fixture.fixture.id),
      competitionId: String(fixture.league.id),
      homeTeam: this.fixtureTeamToTeam(
        fixture.teams.home,
        fixture.teams.home.winner
      ),
      awayTeam: this.fixtureTeamToTeam(
        fixture.teams.away,
        fixture.teams.away.winner
      ),
      status: mapFixtureStatus(fixture.fixture.status.short),
      homeScore: fixture.goals.home,
      awayScore: fixture.goals.away,
      round: fixture.league.round,
      kickoffAt: new Date(fixture.fixture.date),
      venue: fixture.fixture.venue.name || "",
      events: mappedEvents,
      stats: matchStats,
    };
  }

  // ==================== SportsDataProvider methods ====================

  async getCompetitions(sportId?: string): Promise<Competition[]> {
    const cacheKey = `competitions:${sportId || "all"}`;
    const cached = this.cache.get<Competition[]>(cacheKey);
    if (cached) return cached;

    // API-Football is football-only, so sportId is ignored but kept for interface compatibility
    const data = await this.apiFetch<ApiLeague>("/leagues", {
      current: "true",
    });

    const competitions: Competition[] = data.response.map((item) => {
      const currentSeason = item.seasons.find((s) => s.current);
      return {
        externalId: String(item.league.id),
        name: item.league.name,
        shortName: item.league.name.substring(0, 20),
        logo: item.league.logo,
        country: item.country.name,
        season: currentSeason
          ? String(currentSeason.year)
          : new Date().getFullYear().toString(),
      };
    });

    this.cache.set(cacheKey, competitions, CACHE_TTL.COMPETITIONS);
    return competitions;
  }

  async getLiveMatches(): Promise<MatchDetail[]> {
    const cacheKey = "live-matches";
    const cached = this.cache.get<MatchDetail[]>(cacheKey);
    if (cached) return cached;

    const data = await this.apiFetch<ApiFixture>("/fixtures", {
      live: "all",
    });

    const matches = data.response.map((fixture) =>
      this.mapFixtureToMatch(fixture)
    );

    this.cache.set(cacheKey, matches, CACHE_TTL.LIVE_MATCHES);
    return matches;
  }

  async getMatchDetails(externalId: string): Promise<MatchDetail | null> {
    const cacheKey = `match:${externalId}`;
    const cached = this.cache.get<MatchDetail>(cacheKey);
    if (cached) return cached;

    // Fetch fixture, events, and statistics in parallel
    const [fixtureData, eventsData, statsData] = await Promise.all([
      this.apiFetch<ApiFixture>("/fixtures", { id: externalId }),
      this.apiFetch<ApiFixtureEvent>("/fixtures/events", {
        fixture: externalId,
      }),
      this.apiFetch<ApiFixtureStatistic>("/fixtures/statistics", {
        fixture: externalId,
      }),
    ]);

    if (fixtureData.results === 0 || !fixtureData.response[0]) {
      return null;
    }

    const match = this.mapFixtureToMatch(
      fixtureData.response[0],
      eventsData.response,
      statsData.response
    );

    this.cache.set(cacheKey, match, CACHE_TTL.MATCH_DETAILS);
    return match;
  }

  async getMatchOdds(externalId: string): Promise<Odds[]> {
    const cacheKey = `odds:${externalId}`;
    const cached = this.cache.get<Odds[]>(cacheKey);
    if (cached) return cached;

    const data = await this.apiFetch<ApiOdds>("/odds", {
      fixture: externalId,
    });

    const odds: Odds[] = [];

    if (data.response.length > 0 && data.response[0]!.bookmakers.length > 0) {
      // Use the first bookmaker's odds
      const bookmaker = data.response[0]!.bookmakers[0]!;

      for (const bet of bookmaker.bets) {
        // Normalize market type name
        const marketType = bet.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_|_$/g, "");

        for (const value of bet.values) {
          odds.push({
            marketType,
            selection: value.value.toLowerCase(),
            odds: parseFloat(value.odd),
          });
        }
      }
    }

    this.cache.set(cacheKey, odds, CACHE_TTL.ODDS);
    return odds;
  }

  async getTeam(externalId: string): Promise<Team | null> {
    const cacheKey = `team:${externalId}`;
    const cached = this.cache.get<Team>(cacheKey);
    if (cached) return cached;

    const data = await this.apiFetch<ApiTeam>("/teams", {
      id: externalId,
    });

    if (data.results === 0 || !data.response[0]) {
      return null;
    }

    const apiTeam = data.response[0];
    const team: Team = {
      externalId: String(apiTeam.team.id),
      name: apiTeam.team.name,
      shortName: apiTeam.team.code || apiTeam.team.name.substring(0, 3).toUpperCase(),
      logo: apiTeam.team.logo,
      country: apiTeam.team.country,
      city: apiTeam.venue.city || "",
      founded: apiTeam.team.founded ?? 0,
      venue: apiTeam.venue.name || "",
    };

    this.cache.set(cacheKey, team, CACHE_TTL.TEAMS);
    return team;
  }

  async searchTeams(query: string): Promise<Team[]> {
    const cacheKey = `search-teams:${query.toLowerCase()}`;
    const cached = this.cache.get<Team[]>(cacheKey);
    if (cached) return cached;

    const data = await this.apiFetch<ApiTeam>("/teams", {
      search: query,
    });

    const teams: Team[] = data.response.map((apiTeam) => ({
      externalId: String(apiTeam.team.id),
      name: apiTeam.team.name,
      shortName: apiTeam.team.code || apiTeam.team.name.substring(0, 3).toUpperCase(),
      logo: apiTeam.team.logo,
      country: apiTeam.team.country,
      city: apiTeam.venue.city || "",
      founded: apiTeam.team.founded ?? 0,
      venue: apiTeam.venue.name || "",
    }));

    this.cache.set(cacheKey, teams, CACHE_TTL.SEARCH);
    return teams;
  }

  // ==================== Bulk fetch methods for cron sync ====================

  /**
   * Fetch all fixtures for a given date (YYYY-MM-DD).
   * Used by the cron sync route to pull today's matches.
   */
  async getFixturesByDate(date: string): Promise<MatchDetail[]> {
    const data = await this.apiFetch<ApiFixture>("/fixtures", { date });

    // For each fixture, we only have basic data. Events/stats are fetched individually
    // during sync if the match is live or completed.
    return data.response.map((fixture) => this.mapFixtureToMatch(fixture));
  }

  /**
   * Fetch fixtures for a specific league and season.
   */
  async getFixturesByLeague(
    leagueId: string,
    season: string
  ): Promise<MatchDetail[]> {
    const data = await this.apiFetch<ApiFixture>("/fixtures", {
      league: leagueId,
      season,
    });

    return data.response.map((fixture) => this.mapFixtureToMatch(fixture));
  }

  /**
   * Fetch full team details by API-Football team ID.
   * Returns the raw API response for DB syncing.
   */
  async getTeamFull(teamId: string): Promise<ApiTeam | null> {
    const data = await this.apiFetch<ApiTeam>("/teams", { id: teamId });
    return data.response[0] ?? null;
  }
}

// Factory function
export function createSportsDataProvider(): SportsDataProvider {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (apiKey) {
    const host = process.env.API_FOOTBALL_HOST || "v3.football.api-sports.io";
    return new ApiFootballProvider(apiKey, host);
  }
  return new MockSportsDataProvider();
}

// Export mock data for seeding
export { BRASILEIRAO_TEAMS, MOCK_COMPETITIONS, generateMockMatches, generateMockOdds };
