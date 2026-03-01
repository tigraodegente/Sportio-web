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

  console.log("[INFO] Seeding database...\n");

  // Seed Sports
  console.log("[INFO] Inserting sports...");
  const sportsData = [
    // Traditional Sports
    { name: "Futebol", slug: "futebol", icon: "Goal", color: "#22c55e", description: "O esporte mais popular do Brasil. Participe de peladas, campeonatos e muito mais." },
    { name: "Beach Tennis", slug: "beach-tennis", icon: "Sun", color: "#f59e0b", description: "O esporte que mais cresce no Brasil. Encontre parceiros e torneios na areia." },
    { name: "Padel", slug: "padel", icon: "Racquet", color: "#3b82f6", description: "Esporte de raquete em quadra fechada com paredes de vidro." },
    { name: "Volei", slug: "volei", icon: "Circle", color: "#ef4444", description: "Volei de quadra. Monte seu time e participe de torneios." },
    { name: "Volei de Praia", slug: "volei-de-praia", icon: "Waves", color: "#f97316", description: "Volei jogado na areia. Duplas competitivas e recreativas." },
    { name: "Basquete", slug: "basquete", icon: "Target", color: "#f97316", description: "Basquete 5x5 e 3x3. Das quadras de rua aos ginasios." },
    { name: "Tenis", slug: "tenis", icon: "Trophy", color: "#84cc16", description: "Tenis de quadra. Singles ou duplas, encontre adversarios do seu nivel." },
    { name: "Futsal", slug: "futsal", icon: "Goal", color: "#06b6d4", description: "Futebol de salao. Velocidade e tecnica em quadra reduzida." },
    { name: "Handebol", slug: "handebol", icon: "Hand", color: "#8b5cf6", description: "Handebol de quadra. Forca, velocidade e estrategia em equipe." },
    { name: "Natacao", slug: "natacao", icon: "Waves", color: "#0ea5e9", description: "Natacao em piscina. Melhore seus tempos e participe de competicoes." },
    { name: "Corrida", slug: "corrida", icon: "Timer", color: "#ec4899", description: "Corrida de rua e trail. Acompanhe seus tempos e evolua constantemente." },
    { name: "Ciclismo", slug: "ciclismo", icon: "Bike", color: "#14b8a6", description: "Ciclismo de estrada e mountain bike. Rotas, pedais em grupo e competicoes." },
    { name: "Jiu-Jitsu", slug: "jiu-jitsu", icon: "Swords", color: "#1e293b", description: "Jiu-Jitsu Brasileiro (BJJ). A arte suave nas academias e competicoes." },
    { name: "Muay Thai", slug: "muay-thai", icon: "Swords", color: "#dc2626", description: "Arte marcial tailandesa. Treinos, lutas e evolucao constante." },
    { name: "CrossFit", slug: "crossfit", icon: "Dumbbell", color: "#7c3aed", description: "Treinamento funcional de alta intensidade. Desafie seus limites." },
    { name: "Surf", slug: "surf", icon: "Waves", color: "#0891b2", description: "Surf e bodyboard. Conecte-se com a comunidade das ondas." },
    { name: "Skate", slug: "skate", icon: "Zap", color: "#a3a3a3", description: "Skate street e park. Mostre suas manobras e conecte-se com a cena." },
    { name: "Tenis de Mesa", slug: "tenis-de-mesa", icon: "Racquet", color: "#e11d48", description: "Pingue-pongue competitivo. Reflexo e precisao na mesa." },
    { name: "Badminton", slug: "badminton", icon: "Racquet", color: "#16a34a", description: "Badminton indoor. Velocidade e agilidade com a peteca." },
    { name: "Rugby", slug: "rugby", icon: "Swords", color: "#92400e", description: "Rugby sevens e XV. Forca, uniao e espirito de equipe." },

    // Games / E-Sports
    { name: "League of Legends", slug: "league-of-legends", icon: "Gamepad2", color: "#1e40af", description: "O MOBA mais jogado do mundo. Monte seu time e domine o Rift." },
    { name: "Counter-Strike", slug: "counter-strike", icon: "Gamepad2", color: "#ea580c", description: "O FPS tatico mais competitivo. Estrategia e mira precisa." },
    { name: "Valorant", slug: "valorant", icon: "Gamepad2", color: "#dc2626", description: "FPS tatico com agentes unicos. Habilidade e trabalho em equipe." },
    { name: "Fortnite", slug: "fortnite", icon: "Gamepad2", color: "#7c3aed", description: "Battle Royale com construcao. Criatividade e sobrevivencia." },
    { name: "FIFA / EA FC", slug: "fifa-ea-fc", icon: "Gamepad2", color: "#16a34a", description: "O simulador de futebol mais popular. Torneios online e presenciais." },
    { name: "Free Fire", slug: "free-fire", icon: "Gamepad2", color: "#f59e0b", description: "Battle Royale mobile. Competicoes acessiveis para todos." },
    { name: "Dota 2", slug: "dota-2", icon: "Gamepad2", color: "#b91c1c", description: "MOBA de estrategia profunda. Torneios com as maiores premiacoes do mundo." },
    { name: "Rocket League", slug: "rocket-league", icon: "Gamepad2", color: "#2563eb", description: "Futebol com carros. Acrobacias aereas e gols espetaculares." },

    // Card / Table Games
    { name: "Truco", slug: "truco", icon: "Spade", color: "#dc2626", description: "O jogo de cartas mais brasileiro. Blefe, estrategia e muita diversao." },
    { name: "Poker", slug: "poker", icon: "Spade", color: "#059669", description: "O jogo de cartas mais famoso do mundo. Torneios e cash games." },
    { name: "Xadrez", slug: "xadrez", icon: "Crown", color: "#1e293b", description: "O jogo de estrategia milenar. Desafie sua mente em cada partida." },
    { name: "Damas", slug: "damas", icon: "Grid", color: "#78350f", description: "Jogo de tabuleiro classico. Estrategia e raciocinio logico." },
    { name: "Sinuca/Bilhar", slug: "sinuca-bilhar", icon: "Circle", color: "#166534", description: "Precisao e tecnica no pano verde. Torneios e partidas casuais." },
    { name: "Domino", slug: "domino", icon: "Dice", color: "#4b5563", description: "Jogo de mesa tradicional. Estrategia com pecas numeradas." },
    { name: "Buraco", slug: "buraco", icon: "Spade", color: "#7c3aed", description: "Jogo de cartas em duplas. Canastras e estrategia com seu parceiro." },
    { name: "Uno", slug: "uno", icon: "Palette", color: "#dc2626", description: "O jogo de cartas colorido mais divertido. Competicoes e diversao garantida." },

    // Additional Sports
    { name: "Futevolei", slug: "futevolei", icon: "Flame", color: "#ea580c", description: "A mistura perfeita de futebol e volei. Habilidade e estilo na rede." },
    { name: "Golfe", slug: "golfe", icon: "Flag", color: "#16a34a", description: "Precisao e elegancia nos campos. Torneios e rodadas entre amigos." },
    { name: "Atletismo", slug: "atletismo", icon: "Timer", color: "#dc2626", description: "Provas de pista e campo. Velocidade, resistencia e forca." },
    { name: "Boxe", slug: "boxe", icon: "Swords", color: "#b91c1c", description: "A nobre arte. Treinos, lutas e superacao no ringue." },
    { name: "Escalada", slug: "escalada", icon: "Mountain", color: "#78350f", description: "Escalada indoor e outdoor. Supere obstaculos e alcance o topo." },
    { name: "Remo", slug: "remo", icon: "Waves", color: "#1e40af", description: "Esporte aquatico de forca e sincronia. Competicoes e treinos em equipe." },
    { name: "Polo Aquatico", slug: "polo-aquatico", icon: "Waves", color: "#0284c7", description: "Esporte aquatico de equipe. Natacao, forca e estrategia na piscina." },
  ];

  await db.insert(schema.sports).values(sportsData).onConflictDoNothing();
  console.log(`  [OK] ${sportsData.length} sports inserted\n`);

  console.log("[OK] Seed completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[ERROR] Seed failed:", error);
    process.exit(1);
  });
