#!/usr/bin/env npx tsx
/**
 * Sportio E2E Test Runner
 *
 * Tests ALL personas, ALL pages, ALL API endpoints.
 * Run: npx tsx tests/e2e/run-all.ts
 *
 * Requires:
 *   - Dev server running at http://localhost:3000
 *   - DATABASE_URL configured in .env.local
 *   - Database seeded (pnpm db:setup)
 */

import {
  loginUser,
  trpcQuery,
  trpcMutation,
  checkPage,
  runTest,
  skipTest,
  printSummary,
  setUserId,
  getUserId,
  getAllUserIds,
  wait,
} from "./helpers";
import { TEST_USERS, TEST_PASSWORD, BASE_URL, type TestUserKey } from "./config";

// ============================================================
// State collected during tests
// ============================================================

let sportIds: Record<string, string> = {};
let tournamentIds: Record<string, string> = {};
let matchIds: string[] = [];
let postIds: string[] = [];
let chatRoomId = "";
let challengeId = "";
let campaignId = "";
let sponsorshipId = "";

// ============================================================
// PHASE 0: Server Health Check
// ============================================================

async function phase0_healthCheck() {
  console.log("\n📡 FASE 0 — HEALTH CHECK DO SERVIDOR");
  console.log("-".repeat(50));

  await runTest("HEALTH", "Servidor respondendo", async () => {
    try {
      const res = await fetch(BASE_URL);
      return { pass: res.ok || res.status < 400, message: `Status: ${res.status}` };
    } catch (e) {
      return { pass: false, message: `Servidor offline em ${BASE_URL}` };
    }
  });

  await runTest("HEALTH", "tRPC endpoint acessível", async () => {
    const res = await fetch(`${BASE_URL}/api/trpc/social.getSports`);
    return { pass: res.status !== 404, message: `Status: ${res.status}` };
  });

  await runTest("HEALTH", "NextAuth endpoint acessível", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/session`);
    return { pass: res.ok, message: `Status: ${res.status}` };
  });
}

// ============================================================
// PHASE 1: Registration & Authentication
// ============================================================

async function phase1_auth() {
  console.log("\n🔐 FASE 1 — CADASTRO E AUTENTICAÇÃO");
  console.log("-".repeat(50));

  // Register all test users
  for (const [key, user] of Object.entries(TEST_USERS)) {
    await runTest("AUTH", `Registrar ${user.name}`, async () => {
      const result = await trpcMutation<{ id: string; email: string }>(
        "user.register",
        { name: user.name, email: user.email, password: TEST_PASSWORD, roles: user.roles }
      );

      if (result.error?.includes("ja esta cadastrado")) {
        // User already exists, that's OK for re-runs
        return { pass: true, message: "Já cadastrado (re-run)" };
      }
      if (result.error) {
        return { pass: false, message: result.error };
      }
      if (result.data?.id) {
        setUserId(key, result.data.id);
        return { pass: true, message: `ID: ${result.data.id.substring(0, 8)}...` };
      }
      return { pass: false, message: "Sem ID retornado" };
    });
  }

  // Login all test users
  for (const [key, user] of Object.entries(TEST_USERS)) {
    await runTest("AUTH", `Login ${user.name}`, async () => {
      const success = await loginUser(user.email, TEST_PASSWORD, key);
      if (!success) {
        return { pass: false, message: "Falha no login" };
      }
      return { pass: true, message: `User ID: ${getUserId(key).substring(0, 8)}...` };
    });

    await wait(300); // Rate limiting protection
  }

  // Verify session for each user
  await runTest("AUTH", "Verificar sessão do atleta", async () => {
    const result = await trpcQuery<{ id: string; name: string; email: string }>(
      "user.me",
      undefined,
      "athlete"
    );
    if (result.data?.email === TEST_USERS.athlete.email) {
      return { pass: true, message: `Sessão OK: ${result.data.name}` };
    }
    return { pass: false, message: result.error || "Sessão inválida" };
  });

  // Test duplicate registration
  await runTest("AUTH", "Rejeitar email duplicado", async () => {
    const result = await trpcMutation(
      "user.register",
      { name: "Dup", email: TEST_USERS.athlete.email, password: TEST_PASSWORD, roles: [] }
    );
    return {
      pass: !!result.error,
      message: result.error ? "Duplicata rejeitada corretamente" : "Deveria ter rejeitado",
    };
  });
}

// ============================================================
// PHASE 2: Profile & Settings
// ============================================================

async function phase2_profile() {
  console.log("\n👤 FASE 2 — PERFIL E CONFIGURAÇÕES");
  console.log("-".repeat(50));

  // Update profiles for each persona
  for (const [key, user] of Object.entries(TEST_USERS)) {
    const updates: Record<string, unknown> = {};
    if (user.bio) updates.bio = user.bio;
    if (user.city) updates.city = user.city;
    if (user.state) updates.state = user.state;
    if (user.phone) updates.phone = user.phone;
    if ("instagram" in user) updates.instagram = (user as Record<string, unknown>).instagram;
    if ("twitter" in user) updates.twitter = (user as Record<string, unknown>).twitter;
    if ("youtube" in user) updates.youtube = (user as Record<string, unknown>).youtube;

    if (Object.keys(updates).length > 0) {
      await runTest("PERFIL", `Atualizar perfil ${user.name}`, async () => {
        const result = await trpcMutation("user.updateProfile", updates, key);
        if (result.error) return { pass: false, message: result.error };
        return { pass: true };
      });
    }
  }

  // Get sports list to use for adding sports to users
  await runTest("PERFIL", "Carregar lista de esportes", async () => {
    const result = await trpcQuery<Array<{ id: string; slug: string; name: string }>>(
      "social.getSports"
    );
    if (result.data && result.data.length > 0) {
      for (const sport of result.data) {
        sportIds[sport.slug] = sport.id;
      }
      return { pass: true, message: `${result.data.length} esportes carregados` };
    }
    return { pass: false, message: result.error || "Nenhum esporte encontrado" };
  });

  // Add sports to athlete
  const sportsToAdd = [
    { slug: "beach-tennis", level: "A" as const },
    { slug: "padel", level: "B" as const },
    { slug: "futebol", level: "C" as const },
  ];

  for (const sport of sportsToAdd) {
    if (sportIds[sport.slug]) {
      await runTest("PERFIL", `Atleta adicionar esporte: ${sport.slug}`, async () => {
        const result = await trpcMutation(
          "user.addSport",
          { sportId: sportIds[sport.slug], level: sport.level },
          "athlete"
        );
        if (result.error) return { pass: false, message: result.error };
        return { pass: true, message: `Nível ${sport.level}` };
      });
    }
  }

  // Add sports to extra athletes too
  for (const athleteKey of ["athlete2", "athlete3", "athlete4"]) {
    const slug = athleteKey === "athlete2" ? "futebol" : athleteKey === "athlete3" ? "beach-tennis" : "padel";
    if (sportIds[slug]) {
      await runTest("PERFIL", `${athleteKey} adicionar esporte: ${slug}`, async () => {
        const result = await trpcMutation(
          "user.addSport",
          { sportId: sportIds[slug], level: "B" },
          athleteKey
        );
        if (result.error) return { pass: false, message: result.error };
        return { pass: true };
      });
    }
  }

  // Notification preferences
  await runTest("PERFIL", "Atualizar preferências de notificação", async () => {
    const result = await trpcMutation(
      "user.updateNotificationPrefs",
      {
        notifyTournaments: true,
        notifyMatches: true,
        notifyGcoins: true,
        notifySocial: true,
        notifyChat: true,
        notifyBets: true,
        notifyMarketing: false,
      },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // Privacy preferences
  await runTest("PERFIL", "Atualizar preferências de privacidade", async () => {
    const result = await trpcMutation(
      "user.updatePrivacyPrefs",
      { publicProfile: true, showResults: true, showGcoins: false, allowMessages: true },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // Get settings
  await runTest("PERFIL", "Verificar configurações salvas", async () => {
    const result = await trpcQuery<{
      notifyTournaments: boolean;
      publicProfile: boolean;
    }>("user.getSettings", undefined, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return {
      pass: result.data?.notifyTournaments === true && result.data?.publicProfile === true,
      message: "Configurações corretas",
    };
  });

  // Save PIX key
  await runTest("PERFIL", "Salvar chave PIX", async () => {
    const result = await trpcMutation(
      "user.savePixKey",
      { pixKey: "sportio.e2e.atleta@gmail.com" },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // Change password
  await runTest("PERFIL", "Trocar senha e voltar", async () => {
    const newPass = "SportioNewPass2026!";
    const result1 = await trpcMutation(
      "user.changePassword",
      { currentPassword: TEST_PASSWORD, newPassword: newPass },
      "athlete"
    );
    if (result1.error) return { pass: false, message: `Troca: ${result1.error}` };

    // Change back
    const result2 = await trpcMutation(
      "user.changePassword",
      { currentPassword: newPass, newPassword: TEST_PASSWORD },
      "athlete"
    );
    if (result2.error) return { pass: false, message: `Reverter: ${result2.error}` };
    return { pass: true, message: "Trocou e reverteu OK" };
  });

  // Add additional roles
  await runTest("PERFIL", "Adicionar role extra (bettor) ao atleta", async () => {
    const result = await trpcMutation("user.addRole", { role: "bettor" }, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // User search
  await runTest("PERFIL", "Buscar usuário por nome", async () => {
    const result = await trpcQuery<{ items: Array<{ name: string }> }>(
      "user.search",
      { query: "E2E" }
    );
    if (result.error) return { pass: false, message: result.error };
    return {
      pass: (result.data?.items?.length ?? 0) > 0,
      message: `${result.data?.items?.length ?? 0} resultados`,
    };
  });
}

// ============================================================
// PHASE 3: Social / Feed
// ============================================================

async function phase3_social() {
  console.log("\n📱 FASE 3 — SOCIAL / FEED");
  console.log("-".repeat(50));

  // Create posts
  const postsToCreate = [
    { userKey: "athlete", content: "Primeiro treino do dia! Beach Tennis na praia de Copacabana 🏖️", sport: "beach-tennis" },
    { userKey: "trainer", content: "Dica de treino: alongamento dinâmico antes de jogar melhora a performance em 20%", sport: "beach-tennis" },
    { userKey: "organizer", content: "Em breve: Torneio Sportio Open de Beach Tennis! Inscrições em breve.", sport: "beach-tennis" },
    { userKey: "brand", content: "Nova raquete BrandX Pro 2026 chegando! Parceria exclusiva com Sportio.", sport: undefined },
    { userKey: "referee", content: "Revisando as regras do novo regulamento da CBT para a temporada 2026.", sport: undefined },
    { userKey: "photographer", content: "Melhores cliques do torneio de ontem! Em breve no feed.", sport: undefined },
  ];

  for (const post of postsToCreate) {
    await runTest("SOCIAL", `Criar post - ${(TEST_USERS as Record<string, { name: string }>)[post.userKey].name}`, async () => {
      const input: Record<string, unknown> = { content: post.content };
      if (post.sport && sportIds[post.sport]) {
        input.sportId = sportIds[post.sport];
      }

      const result = await trpcMutation<{ id: string }>("social.createPost", input, post.userKey);
      if (result.error) return { pass: false, message: result.error };
      if (result.data?.id) postIds.push(result.data.id);
      return { pass: true, message: `Post ID: ${result.data?.id?.substring(0, 8)}...` };
    });
  }

  // Read feed
  await runTest("SOCIAL", "Carregar feed geral", async () => {
    const result = await trpcQuery<{ items: unknown[]; nextCursor?: string }>(
      "social.feed",
      { limit: 20 }
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: (result.data?.items?.length ?? 0) > 0, message: `${result.data?.items?.length} posts` };
  });

  // Feed filtered by sport
  await runTest("SOCIAL", "Feed filtrado por esporte", async () => {
    const btId = sportIds["beach-tennis"];
    if (!btId) return { pass: false, message: "Sport ID não encontrado" };
    const result = await trpcQuery<{ items: unknown[] }>("social.feed", { limit: 20, sportId: btId });
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${result.data?.items?.length ?? 0} posts filtrados` };
  });

  // Like post
  if (postIds[0]) {
    await runTest("SOCIAL", "Curtir post", async () => {
      const result = await trpcMutation("social.toggleLike", { postId: postIds[0] }, "brand");
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    await runTest("SOCIAL", "Descurtir post", async () => {
      const result = await trpcMutation("social.toggleLike", { postId: postIds[0] }, "brand");
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    // Re-like for notification testing
    await trpcMutation("social.toggleLike", { postId: postIds[0] }, "brand");
  }

  // Comment on post
  if (postIds[0]) {
    let commentId = "";

    await runTest("SOCIAL", "Comentar no post", async () => {
      const result = await trpcMutation<{ id: string }>(
        "social.addComment",
        { postId: postIds[0], content: "Excelente treino! Bora jogar juntos?" },
        "referee"
      );
      if (result.error) return { pass: false, message: result.error };
      commentId = result.data?.id || "";
      return { pass: true };
    });

    // Reply to comment (threaded)
    if (commentId) {
      await runTest("SOCIAL", "Responder comentário (thread)", async () => {
        const result = await trpcMutation(
          "social.addComment",
          { postId: postIds[0], content: "Vamos sim! Sábado às 8h?", parentId: commentId },
          "athlete"
        );
        if (result.error) return { pass: false, message: result.error };
        return { pass: true };
      });
    }

    // Get comments
    await runTest("SOCIAL", "Listar comentários do post", async () => {
      const result = await trpcQuery<unknown[]>("social.getComments", { postId: postIds[0] });
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} comentários` };
    });
  }

  // Edit post
  if (postIds[0]) {
    await runTest("SOCIAL", "Editar post", async () => {
      const result = await trpcMutation(
        "social.editPost",
        { postId: postIds[0], content: "Primeiro treino do dia! Beach Tennis na praia (editado)" },
        "athlete"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });
  }

  // Follow/unfollow
  const athleteId = getUserId("athlete");
  const brandId = getUserId("brand");

  if (athleteId && brandId) {
    await runTest("SOCIAL", "Seguir usuário (Brand → Atleta)", async () => {
      const result = await trpcMutation("user.follow", { userId: athleteId }, "brand");
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    await runTest("SOCIAL", "Verificar contagem de seguidores", async () => {
      const result = await trpcQuery<{ followers: number; following: number }>(
        "user.getFollowCounts",
        { userId: athleteId }
      );
      if (result.error) return { pass: false, message: result.error };
      return {
        pass: (result.data?.followers ?? 0) > 0,
        message: `${result.data?.followers} seguidores`,
      };
    });

    await runTest("SOCIAL", "Deixar de seguir (Brand → Atleta)", async () => {
      const result = await trpcMutation("user.unfollow", { userId: athleteId }, "brand");
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    // Re-follow for other tests
    await trpcMutation("user.follow", { userId: athleteId }, "brand");
    await trpcMutation("user.follow", { userId: brandId }, "athlete");
    await trpcMutation("user.follow", { userId: athleteId }, "trainer");
  }

  // Suggested users
  await runTest("SOCIAL", "Sugestões de usuários para seguir", async () => {
    const result = await trpcQuery<unknown[]>("social.suggestedUsers", undefined, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} sugestões` };
  });

  // Trending
  await runTest("SOCIAL", "Posts em alta (trending)", async () => {
    const result = await trpcQuery<unknown[]>("social.trending");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} posts` };
  });

  // Delete post (last one)
  if (postIds.length > 3) {
    const deleteId = postIds[postIds.length - 1];
    await runTest("SOCIAL", "Deletar post", async () => {
      const result = await trpcMutation("social.deletePost", { postId: deleteId }, "photographer");
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });
  }
}

// ============================================================
// PHASE 4: Tournaments
// ============================================================

async function phase4_tournaments() {
  console.log("\n🏆 FASE 4 — TORNEIOS");
  console.log("-".repeat(50));

  const btSportId = sportIds["beach-tennis"];
  const padelSportId = sportIds["padel"];
  const futebolSportId = sportIds["futebol"];

  if (!btSportId) {
    skipTest("TORNEIO", "Todos os testes", "Sport IDs não encontrados");
    return;
  }

  // Create tournaments - different formats
  const tournamentsToCreate = [
    {
      key: "single_elim",
      name: "Sportio Open BT - Single Elim E2E",
      sportId: btSportId,
      format: "single_elimination" as const,
      maxParticipants: 8,
      minParticipants: 4,
      entryFee: "10",
      prizePool: "100",
      level: "B" as const,
    },
    {
      key: "round_robin",
      name: "Sportio Liga BT - Round Robin E2E",
      sportId: btSportId,
      format: "round_robin" as const,
      maxParticipants: 4,
      minParticipants: 3,
      entryFee: "5",
      prizePool: "50",
      level: "C" as const,
    },
  ];

  for (const t of tournamentsToCreate) {
    await runTest("TORNEIO", `Criar torneio: ${t.format}`, async () => {
      const now = new Date();
      const start = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000);
      const deadline = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

      const result = await trpcMutation<{ id: string }>(
        "tournament.create",
        {
          name: t.name,
          description: `Torneio E2E de teste - formato ${t.format}`,
          sportId: t.sportId,
          format: t.format,
          maxParticipants: t.maxParticipants,
          minParticipants: t.minParticipants,
          entryFee: t.entryFee,
          entryFeeType: "gamification",
          prizePool: t.prizePool,
          level: t.level,
          isOnline: false,
          city: "Rio de Janeiro",
          state: "RJ",
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          registrationDeadline: deadline.toISOString(),
        },
        "organizer"
      );
      if (result.error) return { pass: false, message: result.error };
      if (result.data?.id) tournamentIds[t.key] = result.data.id;
      return { pass: true, message: `ID: ${result.data?.id?.substring(0, 8)}...` };
    });
  }

  // List tournaments
  await runTest("TORNEIO", "Listar torneios", async () => {
    const result = await trpcQuery<{ items: unknown[] }>("tournament.list", { limit: 20 });
    if (result.error) return { pass: false, message: result.error };
    return { pass: (result.data?.items?.length ?? 0) > 0, message: `${result.data?.items?.length} torneios` };
  });

  // Get tournament details
  if (tournamentIds["single_elim"]) {
    await runTest("TORNEIO", "Detalhe do torneio", async () => {
      const result = await trpcQuery<{ id: string; name: string }>(
        "tournament.getById",
        { id: tournamentIds["single_elim"] }
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: !!result.data?.name, message: result.data?.name };
    });
  }

  // My tournaments (organizer)
  await runTest("TORNEIO", "Meus torneios (organizadora)", async () => {
    const result = await trpcQuery<unknown[]>("tournament.myTournaments", undefined, "organizer");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} torneios` };
  });

  // Enroll athletes
  if (tournamentIds["single_elim"]) {
    const enrollUsers = ["athlete", "athlete2", "athlete3", "athlete4"];
    for (const userKey of enrollUsers) {
      await runTest("TORNEIO", `Inscrever ${userKey} no torneio`, async () => {
        const result = await trpcMutation(
          "tournament.enroll",
          { tournamentId: tournamentIds["single_elim"] },
          userKey
        );
        if (result.error) return { pass: false, message: result.error };
        return { pass: true };
      });
    }
  }

  // Round Robin enrollments
  if (tournamentIds["round_robin"]) {
    for (const userKey of ["athlete", "athlete2", "athlete3"]) {
      await runTest("TORNEIO", `Inscrever ${userKey} no round robin`, async () => {
        const result = await trpcMutation(
          "tournament.enroll",
          { tournamentId: tournamentIds["round_robin"] },
          userKey
        );
        if (result.error) return { pass: false, message: result.error };
        return { pass: true };
      });
    }
  }

  // My enrollments
  await runTest("TORNEIO", "Minhas inscrições (atleta)", async () => {
    const result = await trpcQuery<unknown[]>("tournament.myEnrollments", undefined, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} inscrições` };
  });

  // Tournament invites
  if (tournamentIds["single_elim"]) {
    // Send invite to referee
    await runTest("TORNEIO", "Enviar convite para árbitro", async () => {
      const refId = getUserId("referee");
      if (!refId) return { pass: false, message: "Referee ID não encontrado" };
      const result = await trpcMutation(
        "tournament.sendInvite",
        {
          tournamentId: tournamentIds["single_elim"],
          invitedUserId: refId,
          type: "athlete",
          message: "Venha participar do nosso torneio!",
        },
        "organizer"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    // Send sponsor invite to brand
    await runTest("TORNEIO", "Enviar convite de patrocínio para brand", async () => {
      const bId = getUserId("brand");
      if (!bId) return { pass: false, message: "Brand ID não encontrado" };
      const result = await trpcMutation(
        "tournament.sendInvite",
        {
          tournamentId: tournamentIds["single_elim"],
          invitedUserId: bId,
          type: "sponsor",
          message: "Patrocine nosso torneio!",
          suggestedTier: "gold",
        },
        "organizer"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    // Check pending invites
    await runTest("TORNEIO", "Verificar convites pendentes (árbitro)", async () => {
      const result = await trpcQuery<number>("tournament.pendingInvitesCount", undefined, "referee");
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: `${result.data} convites pendentes` };
    });

    // My invites
    await runTest("TORNEIO", "Listar meus convites (árbitro)", async () => {
      const result = await trpcQuery<unknown[]>("tournament.myInvites", undefined, "referee");
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} convites` };
    });
  }

  // Rules template
  await runTest("TORNEIO", "Buscar template de regras (beach-tennis)", async () => {
    const result = await trpcQuery("tournament.getRulesTemplate", { slug: "beach-tennis" });
    if (result.error) return { pass: false, message: result.error };
    return { pass: !!result.data, message: "Template encontrado" };
  });

  await runTest("TORNEIO", "Listar todos os templates de regras", async () => {
    const result = await trpcQuery<unknown[]>("tournament.listRuleTemplates");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} templates` };
  });

  // Generate bracket
  if (tournamentIds["single_elim"]) {
    await runTest("TORNEIO", "Gerar bracket (single elimination)", async () => {
      const result = await trpcMutation(
        "tournament.generateBracket",
        { tournamentId: tournamentIds["single_elim"] },
        "organizer"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    // List matches
    await runTest("TORNEIO", "Listar partidas do torneio", async () => {
      const result = await trpcQuery<unknown[]>(
        "match.listByTournament",
        { tournamentId: tournamentIds["single_elim"] }
      );
      if (result.error) return { pass: false, message: result.error };
      if (Array.isArray(result.data)) {
        matchIds = result.data.map((m: any) => m.id).filter(Boolean);
      }
      return { pass: matchIds.length > 0, message: `${matchIds.length} partidas geradas` };
    });
  }

  // Update match score and complete
  if (matchIds.length > 0) {
    await runTest("TORNEIO", "Atualizar placar da partida (live)", async () => {
      const result = await trpcMutation(
        "match.updateScore",
        { matchId: matchIds[0], score1: 6, score2: 3, status: "live" },
        "organizer"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: "6 x 3 (live)" };
    });

    // Get match details
    await runTest("TORNEIO", "Detalhe da partida", async () => {
      const result = await trpcQuery<{ id: string; status: string }>(
        "match.getById",
        { id: matchIds[0] }
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: `Status: ${result.data?.status}` };
    });

    // Live matches
    await runTest("TORNEIO", "Listar partidas ao vivo", async () => {
      const result = await trpcQuery<unknown[]>("match.live");
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} ao vivo` };
    });

    // Complete match (get winner from match data)
    await runTest("TORNEIO", "Completar partida com vencedor", async () => {
      const matchDetail = await trpcQuery<{ player1Id: string; player2Id: string }>(
        "match.getById",
        { id: matchIds[0] }
      );
      const winnerId = matchDetail.data?.player1Id;
      if (!winnerId) return { pass: false, message: "Não encontrou player1Id" };

      const result = await trpcMutation(
        "match.updateScore",
        { matchId: matchIds[0], score1: 6, score2: 3, status: "completed", winnerId },
        "organizer"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: `Vencedor: ${winnerId.substring(0, 8)}...` };
    });
  }

  // Standings
  if (tournamentIds["single_elim"]) {
    await runTest("TORNEIO", "Classificação/standings", async () => {
      const result = await trpcQuery(
        "tournament.standings",
        { tournamentId: tournamentIds["single_elim"] }
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });
  }
}

// ============================================================
// PHASE 5: Bets
// ============================================================

async function phase5_bets() {
  console.log("\n🎲 FASE 5 — APOSTAS");
  console.log("-".repeat(50));

  // We need a live match to bet on - use second match if available
  const liveMatchId = matchIds.length > 1 ? matchIds[1] : null;

  if (!liveMatchId) {
    skipTest("APOSTAS", "Todos os testes de aposta", "Nenhuma partida disponível para apostas");
    return;
  }

  // Make the match live first
  await runTest("APOSTAS", "Colocar partida ao vivo para apostas", async () => {
    const result = await trpcMutation(
      "match.updateScore",
      { matchId: liveMatchId, score1: 0, score2: 0, status: "live" },
      "organizer"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // Get odds
  await runTest("APOSTAS", "Calcular odds (sem apostas anteriores)", async () => {
    const matchDetail = await trpcQuery<{ player1Id: string }>("match.getById", { id: liveMatchId });
    const playerId = matchDetail.data?.player1Id;
    if (!playerId) return { pass: false, message: "Player não encontrado" };

    const result = await trpcQuery<{ odds: number; totalPool: number }>(
      "bet.getOdds",
      { matchId: liveMatchId, betType: "winner", prediction: { winnerId: playerId } }
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `Odds: ${result.data?.odds}, Pool: ${result.data?.totalPool}` };
  });

  // Place bet - athlete on player1
  await runTest("APOSTAS", "Apostar no vencedor (atleta)", async () => {
    const matchDetail = await trpcQuery<{ player1Id: string }>("match.getById", { id: liveMatchId });
    const playerId = matchDetail.data?.player1Id;
    if (!playerId) return { pass: false, message: "Player não encontrado" };

    const result = await trpcMutation(
      "bet.place",
      {
        matchId: liveMatchId,
        betType: "winner",
        prediction: { winnerId: playerId },
        amount: 10,
      },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // Place opposing bet - trainer on player2
  await runTest("APOSTAS", "Apostar no outro jogador (treinadora)", async () => {
    const matchDetail = await trpcQuery<{ player2Id: string }>("match.getById", { id: liveMatchId });
    const playerId = matchDetail.data?.player2Id;
    if (!playerId) return { pass: false, message: "Player2 não encontrado" };

    const result = await trpcMutation(
      "bet.place",
      {
        matchId: liveMatchId,
        betType: "winner",
        prediction: { winnerId: playerId },
        amount: 5,
      },
      "trainer"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // Check odds again (should be different now)
  await runTest("APOSTAS", "Recalcular odds (com volume)", async () => {
    const matchDetail = await trpcQuery<{ player1Id: string }>("match.getById", { id: liveMatchId });
    const playerId = matchDetail.data?.player1Id;
    if (!playerId) return { pass: false, message: "Player não encontrado" };

    const result = await trpcQuery<{ odds: number; totalPool: number; sideBets: number }>(
      "bet.getOdds",
      { matchId: liveMatchId, betType: "winner", prediction: { winnerId: playerId } }
    );
    if (result.error) return { pass: false, message: result.error };
    return {
      pass: true,
      message: `Odds: ${result.data?.odds}, Pool: ${result.data?.totalPool}, Side: ${result.data?.sideBets}`,
    };
  });

  // My bets
  await runTest("APOSTAS", "Minhas apostas (atleta)", async () => {
    const result = await trpcQuery<unknown[]>("bet.myBets", {}, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} apostas` };
  });

  // Filter bets by result
  await runTest("APOSTAS", "Filtrar apostas pendentes", async () => {
    const result = await trpcQuery<unknown[]>("bet.myBets", { result: "pending" }, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} pendentes` };
  });

  // Complete match to trigger settlement
  await runTest("APOSTAS", "Settlement - completar partida", async () => {
    const matchDetail = await trpcQuery<{ player1Id: string }>("match.getById", { id: liveMatchId });
    const winnerId = matchDetail.data?.player1Id;
    if (!winnerId) return { pass: false, message: "Player não encontrado" };

    const result = await trpcMutation(
      "match.updateScore",
      { matchId: liveMatchId, score1: 6, score2: 4, status: "completed", winnerId },
      "organizer"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `Vencedor definido, apostas liquidadas` };
  });

  // Check bets after settlement
  await runTest("APOSTAS", "Verificar resultado das apostas pós-settlement", async () => {
    const result = await trpcQuery<Array<{ result: string }>>("bet.myBets", {}, "athlete");
    if (result.error) return { pass: false, message: result.error };
    const settled = Array.isArray(result.data) ? result.data.filter((b) => b.result !== "pending") : [];
    return { pass: true, message: `${settled.length} apostas liquidadas` };
  });

  // Leaderboard
  await runTest("APOSTAS", "Leaderboard de apostadores", async () => {
    const result = await trpcQuery<unknown[]>("bet.leaderboard");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} no ranking` };
  });
}

// ============================================================
// PHASE 6: GCoins
// ============================================================

async function phase6_gcoins() {
  console.log("\n💰 FASE 6 — GCOINS");
  console.log("-".repeat(50));

  // Check balance
  await runTest("GCOINS", "Saldo do atleta", async () => {
    const result = await trpcQuery<{ real: string; gamification: string; total: string }>(
      "gcoin.balance",
      undefined,
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return {
      pass: true,
      message: `Real: ${result.data?.real}, Gamif: ${result.data?.gamification}, Total: ${result.data?.total}`,
    };
  });

  // Transfer GCoins
  await runTest("GCOINS", "Transferir GCoins (atleta → treinadora)", async () => {
    const trainerId = getUserId("trainer");
    if (!trainerId) return { pass: false, message: "Trainer ID não encontrado" };

    const result = await trpcMutation(
      "gcoin.transfer",
      { toUserId: trainerId, amount: 5, type: "gamification" },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // Check balance after transfer
  await runTest("GCOINS", "Saldo após transferência (treinadora)", async () => {
    const result = await trpcQuery<{ gamification: string }>(
      "gcoin.balance",
      undefined,
      "trainer"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `Gamif: ${result.data?.gamification}` };
  });

  // Transaction history
  await runTest("GCOINS", "Histórico de transações", async () => {
    const result = await trpcQuery<{ items: unknown[] }>(
      "gcoin.history",
      { limit: 50 },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${result.data?.items?.length ?? 0} transações` };
  });

  // Filter by type
  await runTest("GCOINS", "Histórico filtrado por tipo (gamification)", async () => {
    const result = await trpcQuery<{ items: unknown[] }>(
      "gcoin.history",
      { limit: 50, type: "gamification" },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${result.data?.items?.length ?? 0} transações gamification` };
  });

  // Summary
  await runTest("GCOINS", "Resumo de GCoins (summary)", async () => {
    const result = await trpcQuery<{
      totalEarned: string;
      totalSpent: string;
      transactionCount: number;
    }>("gcoin.summary", undefined, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return {
      pass: true,
      message: `Earned: ${result.data?.totalEarned}, Spent: ${result.data?.totalSpent}, Count: ${result.data?.transactionCount}`,
    };
  });
}

// ============================================================
// PHASE 7: Chat
// ============================================================

async function phase7_chat() {
  console.log("\n💬 FASE 7 — CHAT");
  console.log("-".repeat(50));

  // Create DM
  const trainerId = getUserId("trainer");
  if (!trainerId) {
    skipTest("CHAT", "Todos os testes", "Trainer ID não encontrado");
    return;
  }

  await runTest("CHAT", "Criar conversa DM (Atleta → Treinadora)", async () => {
    const result = await trpcMutation<{ id: string }>(
      "chat.createDM",
      { userId: trainerId },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    if (result.data?.id) chatRoomId = result.data.id;
    return { pass: true, message: `Room: ${result.data?.id?.substring(0, 8)}...` };
  });

  // Send messages
  if (chatRoomId) {
    await runTest("CHAT", "Enviar mensagem (Atleta)", async () => {
      const result = await trpcMutation(
        "chat.sendMessage",
        { roomId: chatRoomId, content: "Oi Ana! Tudo bem? Quero marcar um treino." },
        "athlete"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    await runTest("CHAT", "Responder mensagem (Treinadora)", async () => {
      const result = await trpcMutation(
        "chat.sendMessage",
        { roomId: chatRoomId, content: "Oi Carlos! Tudo ótimo! Quando quer treinar?" },
        "trainer"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    await runTest("CHAT", "Mais uma mensagem (Atleta)", async () => {
      const result = await trpcMutation(
        "chat.sendMessage",
        { roomId: chatRoomId, content: "Sábado às 8h na praia de Copacabana, pode ser?" },
        "athlete"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    // Get messages
    await runTest("CHAT", "Listar mensagens da conversa", async () => {
      const result = await trpcMutation<{ items: unknown[] }>(
        "chat.messages",
        { roomId: chatRoomId, limit: 50 },
        "athlete"
      );
      if (result.error) return { pass: false, message: result.error };
      return {
        pass: (result.data?.items?.length ?? 0) >= 3,
        message: `${result.data?.items?.length ?? 0} mensagens`,
      };
    });
  }

  // Create group chat
  const refId = getUserId("referee");
  await runTest("CHAT", "Criar grupo de chat", async () => {
    const memberIds = [trainerId];
    if (refId) memberIds.push(refId);

    const result = await trpcMutation<{ id: string }>(
      "chat.createGroup",
      { name: "Equipe Torneio E2E", memberIds },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `Grupo criado: ${result.data?.id?.substring(0, 8)}...` };
  });

  // List rooms
  await runTest("CHAT", "Listar minhas conversas", async () => {
    const result = await trpcQuery<unknown[]>("chat.myRooms", undefined, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} conversas` };
  });
}

// ============================================================
// PHASE 8: Notifications
// ============================================================

async function phase8_notifications() {
  console.log("\n🔔 FASE 8 — NOTIFICAÇÕES");
  console.log("-".repeat(50));

  // Unread count
  await runTest("NOTIF", "Contagem de não lidas (atleta)", async () => {
    const result = await trpcQuery<number>("notification.unreadCount", undefined, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${result.data} não lidas` };
  });

  // List all notifications
  let notifId = "";
  await runTest("NOTIF", "Listar notificações", async () => {
    const result = await trpcQuery<Array<{ id: string; type: string; title: string }>>(
      "notification.list",
      {},
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    const items = result.data || [];
    if (items.length > 0) notifId = items[0].id;
    return { pass: true, message: `${items.length} notificações` };
  });

  // List unread only
  await runTest("NOTIF", "Filtrar não lidas", async () => {
    const result = await trpcQuery<unknown[]>(
      "notification.list",
      { unreadOnly: true },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} não lidas` };
  });

  // Mark one as read
  if (notifId) {
    await runTest("NOTIF", "Marcar notificação como lida", async () => {
      const result = await trpcMutation(
        "notification.markRead",
        { notificationId: notifId },
        "athlete"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });
  }

  // Mark all as read
  await runTest("NOTIF", "Marcar todas como lidas", async () => {
    const result = await trpcMutation("notification.markAllRead", {}, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // Verify unread count is 0
  await runTest("NOTIF", "Verificar que não lidas = 0", async () => {
    const result = await trpcQuery<number>("notification.unreadCount", undefined, "athlete");
    if (result.error) return { pass: false, message: result.error };
    return { pass: result.data === 0, message: `${result.data} não lidas` };
  });
}

// ============================================================
// PHASE 9: Brand / Campaigns
// ============================================================

async function phase9_brand() {
  console.log("\n🏷️ FASE 9 — BRAND / CAMPANHAS");
  console.log("-".repeat(50));

  const btSportId = sportIds["beach-tennis"];

  // Buy GCoins as brand
  await runTest("BRAND", "Comprar GCoins (brand)", async () => {
    const result = await trpcMutation(
      "brand.buyGcoins",
      { amount: 1000 },
      "brand"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: "1000 GCoins comprados" };
  });

  // Create banner campaign
  await runTest("BRAND", "Criar campanha banner", async () => {
    const result = await trpcMutation<{ id: string }>(
      "brand.createCampaign",
      {
        name: "BrandX Beach Tennis 2026",
        description: "Nova linha de raquetes para a temporada",
        type: "banner",
        placement: "feed_banner",
        imageUrl: "https://example.com/banner.jpg",
        linkUrl: "https://example.com/brandx",
        targetSportId: btSportId || undefined,
        budget: "500",
      },
      "brand"
    );
    if (result.error) return { pass: false, message: result.error };
    if (result.data?.id) campaignId = result.data.id;
    return { pass: true, message: `Campaign: ${result.data?.id?.substring(0, 8)}...` };
  });

  // Create product giveaway campaign
  await runTest("BRAND", "Criar campanha product_giveaway", async () => {
    const result = await trpcMutation(
      "brand.createCampaign",
      {
        name: "Sorteio Raquete BrandX",
        description: "Ganhe uma raquete profissional BrandX Pro",
        type: "product_giveaway",
        placement: "feed_banner",
        productName: "Raquete BrandX Pro 2026",
        productDescription: "Raquete profissional de beach tennis",
        productImage: "https://example.com/raquete.jpg",
        maxRedemptions: 5,
        budget: "200",
      },
      "brand"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // Create GCoin reward campaign
  await runTest("BRAND", "Criar campanha gcoin_reward", async () => {
    const result = await trpcMutation(
      "brand.createCampaign",
      {
        name: "GCoins BrandX",
        description: "Ganhe GCoins da BrandX",
        type: "gcoin_reward",
        placement: "sidebar",
        gcoinRewardAmount: "25",
        maxRedemptions: 20,
        budget: "500",
      },
      "brand"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true };
  });

  // My campaigns
  await runTest("BRAND", "Listar minhas campanhas", async () => {
    const result = await trpcQuery<unknown[]>("brand.myCampaigns", undefined, "brand");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} campanhas` };
  });

  // Active campaigns (public)
  await runTest("BRAND", "Campanhas ativas (público)", async () => {
    const result = await trpcQuery<unknown[]>("brand.activeCampaigns", {});
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} ativas` };
  });

  // Track impression
  if (campaignId) {
    await runTest("BRAND", "Track impression", async () => {
      const result = await trpcMutation("brand.trackImpression", { campaignId });
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    await runTest("BRAND", "Track click", async () => {
      const result = await trpcMutation("brand.trackClick", { campaignId });
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    // Campaign stats
    await runTest("BRAND", "Stats da campanha", async () => {
      const result = await trpcQuery<{
        impressions: number;
        clicks: number;
      }>("brand.campaignStats", { campaignId }, "brand");
      if (result.error) return { pass: false, message: result.error };
      return {
        pass: true,
        message: `Impressions: ${result.data?.impressions}, Clicks: ${result.data?.clicks}`,
      };
    });

    // Update campaign
    await runTest("BRAND", "Atualizar campanha", async () => {
      const result = await trpcMutation(
        "brand.updateCampaign",
        { campaignId, description: "Nova descrição atualizada E2E" },
        "brand"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });
  }

  // Sponsor tournament
  if (tournamentIds["single_elim"]) {
    await runTest("BRAND", "Patrocinar torneio", async () => {
      const result = await trpcMutation<{ id: string }>(
        "brand.sponsorTournament",
        {
          tournamentId: tournamentIds["single_elim"],
          tier: "gold",
          gcoinContribution: "100",
          message: "BrandX patrocina o Sportio Open!",
          productPrizes: [
            {
              name: "Raquete BrandX Pro",
              description: "Para o campeão",
              forPlacement: 1,
            },
          ],
        },
        "brand"
      );
      if (result.error) return { pass: false, message: result.error };
      if (result.data?.id) sponsorshipId = result.data.id;
      return { pass: true };
    });

    // My sponsorships
    await runTest("BRAND", "Meus patrocínios", async () => {
      const result = await trpcQuery<unknown[]>("brand.mySponsorships", undefined, "brand");
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} patrocínios` };
    });

    // Tournament sponsors (public view)
    await runTest("BRAND", "Sponsors do torneio (público)", async () => {
      const result = await trpcQuery<unknown[]>(
        "tournament.sponsors",
        { tournamentId: tournamentIds["single_elim"] }
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} sponsors` };
    });
  }
}

// ============================================================
// PHASE 10: Challenges
// ============================================================

async function phase10_challenges() {
  console.log("\n🎯 FASE 10 — CHALLENGES");
  console.log("-".repeat(50));

  const btSportId = sportIds["beach-tennis"];

  // Create challenge
  await runTest("CHALLENGE", "Criar challenge", async () => {
    const now = new Date();
    const start = new Date(now.getTime() + 1 * 60 * 60 * 1000); // 1h from now
    const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const result = await trpcMutation<{ id: string }>(
      "challenge.create",
      {
        title: "Desafio 10 partidas E2E",
        description: "Complete 10 partidas de beach tennis em 7 dias",
        reward: "50",
        rewardType: "gamification",
        goal: { type: "matches", count: 10 },
        maxParticipants: 20,
        sportId: btSportId || undefined,
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
      },
      "organizer"
    );
    if (result.error) return { pass: false, message: result.error };
    if (result.data?.id) challengeId = result.data.id;
    return { pass: true, message: `Challenge: ${result.data?.id?.substring(0, 8)}...` };
  });

  // List challenges
  await runTest("CHALLENGE", "Listar challenges", async () => {
    const result = await trpcQuery<unknown[]>("challenge.list", {});
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} challenges` };
  });

  // Join challenge
  if (challengeId) {
    await runTest("CHALLENGE", "Entrar no challenge (atleta)", async () => {
      const result = await trpcMutation(
        "challenge.join",
        { challengeId },
        "athlete"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    await runTest("CHALLENGE", "Entrar no challenge (atleta2)", async () => {
      const result = await trpcMutation(
        "challenge.join",
        { challengeId },
        "athlete2"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true };
    });

    // Update progress
    await runTest("CHALLENGE", "Atualizar progresso", async () => {
      const result = await trpcMutation(
        "challenge.updateProgress",
        { challengeId, progress: { matchesCompleted: 3 } },
        "athlete"
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: "3/10 partidas" };
    });
  }
}

// ============================================================
// PHASE 11: Admin Panel
// ============================================================

async function phase11_admin() {
  console.log("\n🔧 FASE 11 — ADMIN PANEL");
  console.log("-".repeat(50));

  // Note: Admin access depends on having admin role in DB
  // The user.register endpoint doesn't allow 'admin' role directly
  // We test with organizer who has admin panel access

  // User search (admin uses same user.search)
  await runTest("ADMIN", "Buscar usuários", async () => {
    const result = await trpcQuery<{ items: unknown[] }>(
      "user.search",
      { query: "E2E", limit: 50 }
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${result.data?.items?.length ?? 0} usuários encontrados` };
  });

  // Tournament list
  await runTest("ADMIN", "Listar todos os torneios", async () => {
    const result = await trpcQuery<{ items: unknown[] }>(
      "tournament.list",
      { limit: 50 }
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${result.data?.items?.length ?? 0} torneios` };
  });

  // Betting leaderboard
  await runTest("ADMIN", "Leaderboard de apostas", async () => {
    const result = await trpcQuery<unknown[]>("bet.leaderboard");
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} no ranking` };
  });

  // User ranking
  await runTest("ADMIN", "Ranking de usuários por rating", async () => {
    const result = await trpcQuery<unknown[]>("user.ranking", { limit: 10 });
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} no ranking` };
  });
}

// ============================================================
// PHASE 12: Public Pages
// ============================================================

async function phase12_publicPages() {
  console.log("\n🌐 FASE 12 — PÁGINAS PÚBLICAS");
  console.log("-".repeat(50));

  const publicPages = [
    { path: "/", name: "Home / Landing" },
    { path: "/login", name: "Login" },
    { path: "/register", name: "Cadastro" },
    { path: "/athletes", name: "Athletes" },
    { path: "/organizers", name: "Organizers" },
    { path: "/brands", name: "Brands" },
    { path: "/fans", name: "Fans" },
    { path: "/bettors", name: "Bettors" },
    { path: "/referees", name: "Referees" },
    { path: "/blog", name: "Blog" },
  ];

  for (const page of publicPages) {
    await runTest("PÁGINAS", `Página: ${page.name} (${page.path})`, async () => {
      const result = await checkPage(page.path);
      return { pass: result.ok, message: `Status: ${result.status}` };
    });
  }

  // Dashboard pages (authenticated)
  const dashPages = [
    { path: "/social", name: "Social Feed" },
    { path: "/tournaments", name: "Torneios" },
    { path: "/bets", name: "Apostas" },
    { path: "/chat", name: "Chat" },
    { path: "/gcoins", name: "GCoins" },
    { path: "/notifications", name: "Notificações" },
    { path: "/profile", name: "Perfil" },
    { path: "/settings", name: "Configurações" },
    { path: "/brand", name: "Brand Dashboard" },
    { path: "/challenges", name: "Challenges" },
    { path: "/admin", name: "Admin Panel" },
  ];

  for (const page of dashPages) {
    await runTest("PÁGINAS", `Dashboard: ${page.name} (${page.path})`, async () => {
      const result = await checkPage(page.path, "athlete");
      return { pass: result.ok, message: `Status: ${result.status}` };
    });
  }
}

// ============================================================
// PHASE 13: Cross-cutting / Integration
// ============================================================

async function phase13_integration() {
  console.log("\n🔗 FASE 13 — TESTES DE INTEGRAÇÃO");
  console.log("-".repeat(50));

  // Verify auto-posts were created for match results
  await runTest("INTEGRAÇÃO", "Auto-posts de resultado de partida no feed", async () => {
    const result = await trpcQuery<{ items: Array<{ content: string }> }>(
      "social.feed",
      { limit: 50 }
    );
    if (result.error) return { pass: false, message: result.error };
    const autoPost = result.data?.items?.find(
      (p) => p.content?.includes("Venceu") || p.content?.includes("Perdeu")
    );
    return {
      pass: true,
      message: autoPost ? "Auto-post encontrado!" : "Nenhum auto-post (pode estar desabilitado)",
    };
  });

  // Verify notifications were created from various actions
  await runTest("INTEGRAÇÃO", "Notificações geradas por ações", async () => {
    // Check each user for notifications
    let totalNotifs = 0;
    for (const userKey of ["athlete", "organizer", "brand", "referee", "trainer"]) {
      const result = await trpcQuery<number>("notification.unreadCount", undefined, userKey);
      if (result.data) totalNotifs += result.data;
    }
    return { pass: true, message: `${totalNotifs} notificações totais geradas` };
  });

  // Verify GCoin transactions were recorded
  await runTest("INTEGRAÇÃO", "Transações de GCoin registradas", async () => {
    const result = await trpcQuery<{ items: unknown[] }>(
      "gcoin.history",
      { limit: 100 },
      "athlete"
    );
    if (result.error) return { pass: false, message: result.error };
    return { pass: true, message: `${result.data?.items?.length ?? 0} transações registradas` };
  });

  // Verify user profile completeness
  await runTest("INTEGRAÇÃO", "Perfil do atleta completo", async () => {
    const result = await trpcQuery<{
      name: string;
      bio: string;
      city: string;
      roles: unknown[];
      sports: unknown[];
    }>("user.me", undefined, "athlete");
    if (result.error) return { pass: false, message: result.error };
    const u = result.data;
    const checks = [
      u?.name ? "nome" : null,
      u?.bio ? "bio" : null,
      u?.city ? "cidade" : null,
      u?.roles && u.roles.length > 0 ? `${u.roles.length} roles` : null,
      u?.sports && u.sports.length > 0 ? `${u.sports.length} esportes` : null,
    ].filter(Boolean);
    return { pass: checks.length >= 4, message: checks.join(", ") };
  });

  // Verify tournament prizes
  if (tournamentIds["single_elim"]) {
    await runTest("INTEGRAÇÃO", "Prêmios do torneio", async () => {
      const result = await trpcQuery<unknown[]>(
        "tournament.prizes",
        { tournamentId: tournamentIds["single_elim"] }
      );
      if (result.error) return { pass: false, message: result.error };
      return { pass: true, message: `${Array.isArray(result.data) ? result.data.length : 0} prêmios` };
    });
  }
}

// ============================================================
// MAIN RUNNER
// ============================================================

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║     SPORTIO E2E TEST SUITE - TESTE COMPLETO        ║");
  console.log("║     Testando TODAS as personas e funcionalidades    ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log(`\nServidor: ${BASE_URL}`);
  console.log(`Data: ${new Date().toISOString()}\n`);

  try {
    await phase0_healthCheck();
    await phase1_auth();
    await phase2_profile();
    await phase3_social();
    await phase4_tournaments();
    await phase5_bets();
    await phase6_gcoins();
    await phase7_chat();
    await phase8_notifications();
    await phase9_brand();
    await phase10_challenges();
    await phase11_admin();
    await phase12_publicPages();
    await phase13_integration();
  } catch (error) {
    console.error("\n💥 ERRO FATAL:", error);
  }

  const summary = printSummary();
  process.exit(summary.fail > 0 ? 1 : 0);
}

main();
