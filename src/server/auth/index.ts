// Authentication for WhatsApp-first platform
// Users are authenticated via phone number (WhatsApp identity)
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * Find user by phone number
 */
export async function findUserByPhone(phone: string) {
  const candidates = [phone, `+${phone}`, phone.replace(/^\+/, "")];

  for (const candidate of candidates) {
    const user = await db.query.users.findFirst({
      where: eq(users.phone, candidate),
    });
    if (user) return user;
  }

  return null;
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

/**
 * Verify password (for email-based login if needed)
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
