import { db } from "../src/server/db";
import { proMatchOdds } from "../src/server/db/schema";
import { generateMockOdds } from "../src/server/services/sports-data";

const MARKET_MAP: Record<string, "1x2" | "over_under" | "btts"> = {
  match_winner: "1x2",
  both_score: "btts",
  over_under_2_5: "over_under",
};

async function main() {
  const matches = await db.query.proMatches.findMany();
  console.log(`Found ${matches.length} matches`);

  let count = 0;
  for (const match of matches) {
    if (!match.externalId) continue;
    const odds = generateMockOdds(match.externalId);
    for (const odd of odds) {
      const mappedType = MARKET_MAP[odd.marketType] ?? "1x2";
      await db
        .insert(proMatchOdds)
        .values({
          matchId: match.id,
          marketType: mappedType,
          selection: odd.selection,
          oddsDecimal: odd.odds.toString(),
          isActive: true,
        })
        .onConflictDoNothing();
      count++;
    }
  }
  console.log(`Inserted ${count} odds records`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
