import type { DB } from "./index";
import * as schema from "./schema";

const GIFT_TYPE_DEFINITIONS = [
  { name: "Palma", emoji: "👏", gcoinCost: 5, sortOrder: 1 },
  { name: "Fogo", emoji: "🔥", gcoinCost: 20, sortOrder: 2 },
  { name: "Raio", emoji: "⚡", gcoinCost: 50, sortOrder: 3 },
  { name: "Trofeu", emoji: "🏆", gcoinCost: 100, sortOrder: 4 },
  { name: "Diamante", emoji: "💎", gcoinCost: 250, sortOrder: 5 },
  { name: "Coroa", emoji: "👑", gcoinCost: 500, sortOrder: 6 },
  { name: "Estrela", emoji: "🌟", gcoinCost: 1000, sortOrder: 7 },
];

export async function seedGiftTypes(db: DB) {
  console.log("[INFO] Inserting gift types...");

  await db
    .insert(schema.giftTypes)
    .values(
      GIFT_TYPE_DEFINITIONS.map((gt) => ({
        name: gt.name,
        emoji: gt.emoji,
        gcoinCost: gt.gcoinCost,
        sortOrder: gt.sortOrder,
        isActive: true,
      }))
    )
    .onConflictDoNothing();

  console.log(`  [OK] ${GIFT_TYPE_DEFINITIONS.length} gift types inserted\n`);
}
