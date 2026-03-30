// Conversation state manager
// Uses in-memory Map with DB persistence for user linking
import { whatsappConfig } from "../config";
import type { ConversationState, UserSession } from "../types";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// In-memory session store (swap for Redis in production)
const sessions = new Map<string, UserSession>();

export class SessionManager {
  // Get or create session for a phone number
  getSession(phone: string): UserSession {
    const existing = sessions.get(phone);

    if (existing) {
      // Check timeout
      const elapsed = Date.now() - existing.lastActivity;
      if (elapsed > whatsappConfig.bot.sessionTimeout) {
        // Session expired, reset state but keep user binding
        existing.state = "main_menu";
        existing.stateData = {};
        existing.menuRetries = 0;
      }
      existing.lastActivity = Date.now();
      return existing;
    }

    // New session
    const session: UserSession = {
      phone,
      userId: undefined,
      state: "idle",
      stateData: {},
      lastActivity: Date.now(),
      menuRetries: 0,
      language: "pt",
    };

    sessions.set(phone, session);
    return session;
  }

  // Update session state
  setState(phone: string, state: ConversationState, data?: Record<string, unknown>): void {
    const session = this.getSession(phone);
    session.state = state;
    if (data !== undefined) {
      session.stateData = data;
    }
    session.lastActivity = Date.now();
    session.menuRetries = 0;
  }

  // Update state data without changing state
  updateData(phone: string, data: Record<string, unknown>): void {
    const session = this.getSession(phone);
    session.stateData = { ...session.stateData, ...data };
    session.lastActivity = Date.now();
  }

  // Link phone to user ID
  setUserId(phone: string, userId: string): void {
    const session = this.getSession(phone);
    session.userId = userId;
  }

  // Get user ID for phone
  getUserId(phone: string): string | undefined {
    return sessions.get(phone)?.userId;
  }

  // Find user in DB by phone number
  async findUserByPhone(phone: string): Promise<{ id: string; name: string } | null> {
    // Normalize phone: try with and without country code
    const phoneCandidates = [phone, `+${phone}`, phone.replace(/^\+/, "")];

    for (const candidate of phoneCandidates) {
      const user = await db.query.users.findFirst({
        where: eq(users.phone, candidate),
        columns: { id: true, name: true },
      });
      if (user) return user;
    }

    return null;
  }

  // Link phone to DB user (save phone number)
  async linkPhoneToUser(phone: string, userId: string): Promise<void> {
    this.setUserId(phone, userId);
    await db
      .update(users)
      .set({ phone, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Increment menu retry counter
  incrementRetries(phone: string): number {
    const session = this.getSession(phone);
    session.menuRetries += 1;
    return session.menuRetries;
  }

  // Reset to main menu
  resetToMenu(phone: string): void {
    this.setState(phone, "main_menu", {});
  }

  // Get all active sessions (for broadcasting)
  getAllSessions(): Map<string, UserSession> {
    return sessions;
  }

  // Get session count
  getActiveCount(): number {
    return sessions.size;
  }

  // Clean up expired sessions
  cleanupExpired(): number {
    const now = Date.now();
    const timeout = whatsappConfig.bot.sessionTimeout;
    let cleaned = 0;

    for (const [phone, session] of sessions) {
      if (now - session.lastActivity > timeout * 3) {
        sessions.delete(phone);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Singleton
export const sessionManager = new SessionManager();
