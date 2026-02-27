import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  console.log("🌱 Seeding database...\n");

  // Seed Sports
  console.log("⚽ Inserting sports...");
  const sportsData = [
    { name: "Futebol", slug: "futebol", icon: "⚽", color: "#22c55e", description: "O esporte mais popular do Brasil" },
    { name: "Beach Tennis", slug: "beach-tennis", icon: "🎾", color: "#f59e0b", description: "Tênis de praia, esporte que mais cresce no Brasil" },
    { name: "Padel", slug: "padel", icon: "🏓", color: "#3b82f6", description: "Esporte de raquete em quadra fechada" },
    { name: "Vôlei", slug: "volei", icon: "🏐", color: "#ef4444", description: "Vôlei de quadra" },
    { name: "Vôlei de Praia", slug: "volei-de-praia", icon: "🏖️", color: "#f97316", description: "Vôlei jogado na areia" },
    { name: "Basquete", slug: "basquete", icon: "🏀", color: "#f97316", description: "Basquete 5x5 e 3x3" },
    { name: "Tênis", slug: "tenis", icon: "🎾", color: "#84cc16", description: "Tênis de quadra" },
    { name: "Futsal", slug: "futsal", icon: "⚽", color: "#06b6d4", description: "Futebol de salão" },
    { name: "Handebol", slug: "handebol", icon: "🤾", color: "#8b5cf6", description: "Handebol de quadra" },
    { name: "Natação", slug: "natacao", icon: "🏊", color: "#0ea5e9", description: "Natação em piscina" },
    { name: "Corrida", slug: "corrida", icon: "🏃", color: "#ec4899", description: "Corrida de rua e trail" },
    { name: "Ciclismo", slug: "ciclismo", icon: "🚴", color: "#14b8a6", description: "Ciclismo de estrada e mountain bike" },
    { name: "Jiu-Jitsu", slug: "jiu-jitsu", icon: "🥋", color: "#1e293b", description: "Jiu-Jitsu Brasileiro (BJJ)" },
    { name: "Muay Thai", slug: "muay-thai", icon: "🥊", color: "#dc2626", description: "Arte marcial tailandesa" },
    { name: "CrossFit", slug: "crossfit", icon: "🏋️", color: "#7c3aed", description: "Treinamento funcional de alta intensidade" },
    { name: "Surf", slug: "surf", icon: "🏄", color: "#0891b2", description: "Surf e bodyboard" },
    { name: "Skate", slug: "skate", icon: "🛹", color: "#a3a3a3", description: "Skate street e park" },
    { name: "Tênis de Mesa", slug: "tenis-de-mesa", icon: "🏓", color: "#e11d48", description: "Pingue-pongue competitivo" },
    { name: "Badminton", slug: "badminton", icon: "🏸", color: "#16a34a", description: "Badminton indoor" },
    { name: "Rugby", slug: "rugby", icon: "🏉", color: "#92400e", description: "Rugby sevens e XV" },
  ];

  await db.insert(schema.sports).values(sportsData).onConflictDoNothing();
  console.log(`  ✅ ${sportsData.length} sports inserted\n`);

  console.log("🎉 Seed completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
