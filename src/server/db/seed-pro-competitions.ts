import { eq } from "drizzle-orm";
import type { DB } from "./index";
import * as schema from "./schema";

const PRO_COMPETITIONS = [
  {
    externalId: "71",
    name: "Brasileirao Serie A",
    shortName: "Serie A",
    country: "Brasil",
    season: "2026",
  },
  {
    externalId: "72",
    name: "Brasileirao Serie B",
    shortName: "Serie B",
    country: "Brasil",
    season: "2026",
  },
  {
    externalId: "73",
    name: "Copa do Brasil",
    shortName: "Copa BR",
    country: "Brasil",
    season: "2026",
  },
  {
    externalId: "13",
    name: "Copa Libertadores",
    shortName: "Libertadores",
    country: "Sul-Americano",
    season: "2026",
  },
  {
    externalId: "11",
    name: "Copa Sul-Americana",
    shortName: "Sula",
    country: "Sul-Americano",
    season: "2026",
  },
];

export async function seedProCompetitions(db: DB) {
  console.log("[INFO] Inserting pro competitions...");

  // Find the "Futebol" sport ID
  const futebolSport = await db.query.sports.findFirst({
    where: eq(schema.sports.slug, "futebol"),
  });

  await db
    .insert(schema.proCompetitions)
    .values(
      PRO_COMPETITIONS.map((comp) => ({
        externalId: comp.externalId,
        name: comp.name,
        shortName: comp.shortName,
        country: comp.country,
        season: comp.season,
        sportId: futebolSport?.id ?? null,
        logo: null,
        isActive: true,
      }))
    )
    .onConflictDoNothing();

  console.log(`  [OK] ${PRO_COMPETITIONS.length} pro competitions inserted\n`);
}
