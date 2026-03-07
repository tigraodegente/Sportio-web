import { eq } from "drizzle-orm";
import type { DB } from "./index";
import * as schema from "./schema";

// Brasileirao Serie A 2026 — 20 teams
const BRASILEIRAO_TEAMS = [
  { name: "Atletico Mineiro", shortName: "CAM", city: "Belo Horizonte", venue: "Arena MRV", founded: 1908 },
  { name: "Athletico Paranaense", shortName: "CAP", city: "Curitiba", venue: "Ligga Arena", founded: 1924 },
  { name: "Bahia", shortName: "BAH", city: "Salvador", venue: "Arena Fonte Nova", founded: 1931 },
  { name: "Botafogo", shortName: "BOT", city: "Rio de Janeiro", venue: "Estadio Nilton Santos", founded: 1904 },
  { name: "Corinthians", shortName: "COR", city: "Sao Paulo", venue: "Neo Quimica Arena", founded: 1910 },
  { name: "Cruzeiro", shortName: "CRU", city: "Belo Horizonte", venue: "Mineirao", founded: 1921 },
  { name: "Cuiaba", shortName: "CUI", city: "Cuiaba", venue: "Arena Pantanal", founded: 2001 },
  { name: "Flamengo", shortName: "FLA", city: "Rio de Janeiro", venue: "Maracana", founded: 1895 },
  { name: "Fluminense", shortName: "FLU", city: "Rio de Janeiro", venue: "Maracana", founded: 1902 },
  { name: "Fortaleza", shortName: "FOR", city: "Fortaleza", venue: "Arena Castelao", founded: 1918 },
  { name: "Gremio", shortName: "GRE", city: "Porto Alegre", venue: "Arena do Gremio", founded: 1903 },
  { name: "Internacional", shortName: "INT", city: "Porto Alegre", venue: "Beira-Rio", founded: 1909 },
  { name: "Juventude", shortName: "JUV", city: "Caxias do Sul", venue: "Estadio Alfredo Jaconi", founded: 1913 },
  { name: "Palmeiras", shortName: "PAL", city: "Sao Paulo", venue: "Allianz Parque", founded: 1914 },
  { name: "Red Bull Bragantino", shortName: "RBB", city: "Braganca Paulista", venue: "Estadio Nabi Abi Chedid", founded: 1928 },
  { name: "Santos", shortName: "SAN", city: "Santos", venue: "Vila Belmiro", founded: 1912 },
  { name: "Sao Paulo", shortName: "SAO", city: "Sao Paulo", venue: "MorumBIS", founded: 1930 },
  { name: "Vasco da Gama", shortName: "VAS", city: "Rio de Janeiro", venue: "Sao Januario", founded: 1898 },
  { name: "Vitoria", shortName: "VIT", city: "Salvador", venue: "Estadio Barradao", founded: 1899 },
  { name: "Criciuma", shortName: "CRI", city: "Criciuma", venue: "Estadio Heriberto Hulse", founded: 1947 },
];

export async function seedProTeams(db: DB) {
  console.log("[INFO] Inserting Brasileirao Serie A teams...");

  // Find the "Futebol" sport ID
  const futebolSport = await db.query.sports.findFirst({
    where: eq(schema.sports.slug, "futebol"),
  });

  if (!futebolSport) {
    console.log("  [WARN] Sport 'futebol' not found — skipping pro teams seed. Run sports seed first.\n");
    return;
  }

  await db
    .insert(schema.proTeams)
    .values(
      BRASILEIRAO_TEAMS.map((team) => ({
        name: team.name,
        shortName: team.shortName,
        city: team.city,
        venue: team.venue,
        founded: team.founded,
        country: "Brasil",
        sportId: futebolSport.id,
      }))
    )
    .onConflictDoNothing();

  console.log(`  [OK] ${BRASILEIRAO_TEAMS.length} Brasileirao teams inserted\n`);
}
