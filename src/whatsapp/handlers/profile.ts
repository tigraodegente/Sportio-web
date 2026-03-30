// Profile handler - view, edit profile
import type { IncomingMessage } from "../types";
import { sessionManager } from "../services/session-manager";
import { whatsapp } from "../services/whatsapp-client";
import { menus } from "../services/menu-builder";
import { db } from "@/server/db";
import { users, followers } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

export async function handleProfile(
  phone: string,
  _message: IncomingMessage,
  action: string
): Promise<void> {
  const session = sessionManager.getSession(phone);
  const userId = session.userId!;

  // Show profile
  if (action === "show_profile" || action === "profile_view") {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        roles: true,
        sports: { with: { sport: true } },
      },
    });

    if (!user) {
      await whatsapp.sendText(phone, "Perfil nao encontrado.");
      return;
    }

    // Get follower counts
    const followersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(followers)
      .where(eq(followers.followingId, userId));

    const followingCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(followers)
      .where(eq(followers.followerId, userId));

    await whatsapp.sendMessage(
      phone,
      menus.profileView({
        name: user.name,
        city: user.city ?? undefined,
        level: user.level ?? 1,
        xp: user.xp ?? 0,
        roles: user.roles?.map((r: { role: string }) => r.role) ?? ["fan"],
        sports: user.sports?.map((s: { sport?: { name: string } | null }) => s.sport?.name ?? "").filter(Boolean) ?? [],
        gcoinsReal: Number(user.gcoinsReal ?? 0),
        gcoinsGamification: Number(user.gcoinsGamification ?? 0),
        followersCount: Number(followersCount[0]?.count ?? 0),
        followingCount: Number(followingCount[0]?.count ?? 0),
      })
    );
    return;
  }

  // Edit profile
  if (action === "profile_edit") {
    sessionManager.setState(phone, "profile_edit", { step: "choose" });

    await whatsapp.sendList(
      phone,
      "O que voce quer editar?",
      "Escolher campo",
      [
        {
          title: "Editar perfil",
          rows: [
            { id: "edit_name", title: "Nome", description: "Alterar seu nome" },
            { id: "edit_city", title: "Cidade", description: "Alterar sua cidade" },
            { id: "edit_bio", title: "Bio", description: "Alterar sua bio" },
            { id: "edit_instagram", title: "Instagram", description: "Adicionar @ do Instagram" },
          ],
        },
      ],
      "EDITAR PERFIL"
    );
    return;
  }

  // Edit field
  if (session.state === "profile_edit") {
    const data = session.stateData;

    if (data.step === "choose") {
      const fieldMap: Record<string, { field: string; prompt: string }> = {
        edit_name: { field: "name", prompt: "Digite seu novo nome:" },
        edit_city: { field: "city", prompt: "Digite sua cidade:" },
        edit_bio: { field: "bio", prompt: "Digite sua nova bio:" },
        edit_instagram: { field: "instagram", prompt: "Digite seu @ do Instagram:" },
      };

      const selected = fieldMap[action];
      if (!selected) {
        await whatsapp.sendText(phone, "Opcao invalida.");
        return;
      }

      sessionManager.updateData(phone, { step: "input", field: selected.field });
      await whatsapp.sendText(phone, selected.prompt);
      return;
    }

    if (data.step === "input") {
      const field = data.field as string;
      const value = action.trim();

      const updateData: Record<string, unknown> = { [field]: value, updatedAt: new Date() };
      await db.update(users).set(updateData).where(eq(users.id, userId));

      sessionManager.resetToMenu(phone);

      await whatsapp.sendButtons(phone, `${field === "name" ? "Nome" : field === "city" ? "Cidade" : field === "bio" ? "Bio" : "Instagram"} atualizado(a)!`, [
        { id: "profile_view", title: "Ver perfil" },
        { id: "profile_edit", title: "Editar mais" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }
  }

  // Achievements
  if (action === "profile_achievements") {
    const userAchievements = await db.query.userAchievements?.findMany({
      where: eq((await import("@/server/db/schema")).userAchievements.userId, userId),
      with: { achievement: true },
      limit: 10,
    });

    if (!userAchievements || userAchievements.length === 0) {
      await whatsapp.sendButtons(phone, "Voce ainda nao tem conquistas. Continue jogando!", [
        { id: "menu_tournaments", title: "Ver torneios" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    let text = "*CONQUISTAS*\n\n";
    for (const ua of userAchievements) {
      text += `${ua.achievement?.name ?? "Conquista"}\n`;
      text += `${ua.achievement?.description ?? ""}\n\n`;
    }

    await whatsapp.sendButtons(phone, text, [
      { id: "profile_view", title: "Ver perfil" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Default
  await handleProfile(phone, _message, "show_profile");
}
