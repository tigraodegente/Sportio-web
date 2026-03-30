// Onboarding handler - register new users via WhatsApp
import type { IncomingMessage } from "../types";
import { sessionManager } from "../services/session-manager";
import { whatsapp } from "../services/whatsapp-client";
import { menus } from "../services/menu-builder";
import { db } from "@/server/db";
import { users, userRoles, userSports, sports, userSettings } from "@/server/db/schema";
import { eq, ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function handleOnboarding(
  phone: string,
  message: IncomingMessage,
  action: string
): Promise<void> {
  const session = sessionManager.getSession(phone);

  switch (session.state) {
    case "onboarding": {
      if (action === "onboarding_start") {
        sessionManager.setState(phone, "onboarding_name", {});
        await whatsapp.sendMessage(phone, menus.askName());
      } else if (action === "onboarding_login") {
        // Try to find by phone
        const user = await sessionManager.findUserByPhone(phone);
        if (user) {
          sessionManager.setUserId(phone, user.id);
          sessionManager.setState(phone, "main_menu");
          await whatsapp.sendText(phone, `Bem-vindo de volta, ${user.name}!`);
          await whatsapp.sendMessage(phone, menus.mainMenu());
        } else {
          await whatsapp.sendText(
            phone,
            "Nao encontrei conta com esse numero. Digite seu email cadastrado:"
          );
          sessionManager.setState(phone, "onboarding", { loginByEmail: true });
        }
      } else if (action === "onboarding_info") {
        await whatsapp.sendText(
          phone,
          "*SPORTIO* e a plataforma esportiva do Brasil!\n\n" +
            "Participe de torneios de Beach Tennis, Padel, Futevolei e mais 40 esportes.\n\n" +
            "Desafie amigos, aposte com GCoins, suba no ranking e ganhe premios!\n\n" +
            "Tudo pelo WhatsApp, sem precisar baixar app."
        );
        await whatsapp.sendMessage(phone, menus.welcome());
      } else if (session.stateData.loginByEmail) {
        // User is typing their email to log in
        const email = action.trim().toLowerCase();
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
          columns: { id: true, name: true },
        });

        if (user) {
          await sessionManager.linkPhoneToUser(phone, user.id);
          sessionManager.setState(phone, "main_menu");
          await whatsapp.sendText(phone, `Pronto, ${user.name}! Seu numero foi vinculado a sua conta.`);
          await whatsapp.sendMessage(phone, menus.mainMenu());
        } else {
          await whatsapp.sendText(phone, "Email nao encontrado. Vamos criar uma conta nova?");
          await whatsapp.sendMessage(phone, menus.welcome());
          sessionManager.setState(phone, "onboarding", {});
        }
      } else {
        await whatsapp.sendMessage(phone, menus.welcome());
      }
      break;
    }

    case "onboarding_name": {
      const name = action.trim();
      if (name.length < 2) {
        await whatsapp.sendText(phone, "Nome muito curto. Digite seu nome completo:");
        return;
      }
      sessionManager.updateData(phone, { name });
      await whatsapp.sendMessage(phone, menus.askEmail());
      sessionManager.setState(phone, "onboarding_roles", { ...session.stateData, name, step: "email" });
      break;
    }

    case "onboarding_roles": {
      if (session.stateData.step === "email") {
        // Collecting email
        const email = action.trim().toLowerCase();
        if (!email.includes("@")) {
          await whatsapp.sendText(phone, "Email invalido. Digite um email valido:");
          return;
        }

        // Check if email already exists
        const existing = await db.query.users.findFirst({
          where: eq(users.email, email),
          columns: { id: true },
        });
        if (existing) {
          await whatsapp.sendText(
            phone,
            "Esse email ja esta cadastrado! Vou vincular seu numero a essa conta."
          );
          await sessionManager.linkPhoneToUser(phone, existing.id);
          sessionManager.setState(phone, "main_menu");
          await whatsapp.sendMessage(phone, menus.mainMenu());
          return;
        }

        sessionManager.updateData(phone, { email });
        sessionManager.setState(phone, "onboarding_roles", { ...session.stateData, email, step: "role" });
        await whatsapp.sendMessage(phone, menus.askRoles());
        return;
      }

      // Collecting role
      const roleMap: Record<string, string> = {
        role_athlete: "athlete",
        role_organizer: "organizer",
        role_brand: "brand",
        role_trainer: "trainer",
        role_referee: "referee",
        role_photographer: "photographer",
        role_arena_owner: "arena_owner",
      };

      const role = roleMap[action] ?? "athlete";
      sessionManager.updateData(phone, { role });
      sessionManager.setState(phone, "onboarding_sports", { ...session.stateData, role });
      await whatsapp.sendMessage(phone, menus.askSports());
      break;
    }

    case "onboarding_sports": {
      // Collecting sport
      const sportName = action.replace("sport_", "").replace(/_/g, " ");
      sessionManager.updateData(phone, { sportName });

      sessionManager.setState(phone, "onboarding_city", { ...session.stateData, sportName });
      await whatsapp.sendMessage(phone, menus.askCity());
      break;
    }

    case "onboarding_city": {
      const city = action.trim();
      const data = { ...session.stateData, city };

      // Create user account
      const name = data.name as string;
      const email = data.email as string;
      const role = (data.role as string) ?? "athlete";
      const sportName = (data.sportName as string) ?? "beach tennis";

      // Generate random password (user logs in via WhatsApp, not password)
      const password = await bcrypt.hash(`wa_${phone}_${Date.now()}`, 12);

      const [newUser] = await db
        .insert(users)
        .values({
          name,
          email,
          password,
          phone,
          city,
          country: "Brasil",
        })
        .returning();

      if (!newUser) {
        await whatsapp.sendMessage(phone, menus.error("Erro ao criar conta"));
        return;
      }

      // Add roles (fan is always added)
      const roles: Array<"athlete" | "organizer" | "brand" | "fan" | "bettor" | "referee" | "trainer" | "nutritionist" | "photographer" | "arena_owner"> = ["fan"];
      if (role !== "fan") {
        roles.push(role as typeof roles[number]);
      }
      for (const r of roles) {
        await db.insert(userRoles).values({ userId: newUser.id, role: r }).onConflictDoNothing();
      }

      // Add sport
      const sport = await db.query.sports.findFirst({
        where: ilike(sports.name, `%${sportName}%`),
        columns: { id: true },
      });
      if (sport) {
        await db.insert(userSports).values({
          userId: newUser.id,
          sportId: sport.id,
          level: "B",
        }).onConflictDoNothing();
      }

      // Create default settings
      await db.insert(userSettings).values({ userId: newUser.id }).onConflictDoNothing();

      // Link session
      sessionManager.setUserId(phone, newUser.id);
      sessionManager.setState(phone, "main_menu");

      await whatsapp.sendMessage(phone, menus.onboardingComplete(name));
      break;
    }

    default:
      await whatsapp.sendMessage(phone, menus.welcome());
      break;
  }
}
