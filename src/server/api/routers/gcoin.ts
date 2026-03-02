import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { gcoinTransactions, users } from "@/server/db/schema";
import { notifyGcoinReceived } from "@/server/services/notification-service";
import { claimDailyBonus, getLevelInfo, getRatingTier } from "@/server/services/gamification";

export const gcoinRouter = createTRPCRouter({
  // Get balance
  balance: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: { gcoinsReal: true, gcoinsGamification: true },
    });
    return {
      real: Number(user?.gcoinsReal ?? 0),
      gamification: Number(user?.gcoinsGamification ?? 0),
      total: Number(user?.gcoinsReal ?? 0) + Number(user?.gcoinsGamification ?? 0),
    };
  }),

  // Transaction history
  history: protectedProcedure
    .input(
      z.object({
        type: z.enum(["real", "gamification"]).optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(gcoinTransactions.userId, ctx.session.user.id)];
      if (input.type) conditions.push(eq(gcoinTransactions.type, input.type));

      const results = await ctx.db.query.gcoinTransactions.findMany({
        where: and(...conditions),
        orderBy: [desc(gcoinTransactions.createdAt)],
        limit: input.limit + 1,
      });

      let nextCursor: string | undefined;
      if (results.length > input.limit) {
        const next = results.pop()!;
        nextCursor = next.id;
      }

      return { items: results, nextCursor };
    }),

  // Transfer GCoins to another user
  transfer: protectedProcedure
    .input(
      z.object({
        toUserId: z.string().uuid(),
        amount: z.number().positive(),
        type: z.enum(["real", "gamification"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sender = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });

      if (!sender) throw new Error("Usuário não encontrado");

      const balance = input.type === "real"
        ? Number(sender.gcoinsReal)
        : Number(sender.gcoinsGamification);

      if (balance < input.amount) {
        throw new Error("Saldo insuficiente de GCoins");
      }

      const balanceField = input.type === "real" ? "gcoinsReal" : "gcoinsGamification";

      // Debit sender
      await ctx.db
        .update(users)
        .set({
          [balanceField]: sql`${users[balanceField]} - ${input.amount}`,
        })
        .where(eq(users.id, ctx.session.user.id));

      // Credit receiver
      await ctx.db
        .update(users)
        .set({
          [balanceField]: sql`${users[balanceField]} + ${input.amount}`,
        })
        .where(eq(users.id, input.toUserId));

      // Log transactions
      await ctx.db.insert(gcoinTransactions).values([
        {
          userId: ctx.session.user.id,
          type: input.type,
          category: "transfer",
          amount: (-input.amount).toString(),
          description: `Transferência enviada`,
          referenceId: input.toUserId,
          referenceType: "user",
        },
        {
          userId: input.toUserId,
          type: input.type,
          category: "transfer",
          amount: input.amount.toString(),
          description: `Transferência recebida`,
          referenceId: ctx.session.user.id,
          referenceType: "user",
        },
      ]);

      // Notify recipient
      notifyGcoinReceived(input.toUserId, input.amount, sender.name).catch(() => {});

      return { success: true };
    }),

  // Summary stats
  summary: protectedProcedure.query(async ({ ctx }) => {
    const txs = await ctx.db.query.gcoinTransactions.findMany({
      where: eq(gcoinTransactions.userId, ctx.session.user.id),
      orderBy: [desc(gcoinTransactions.createdAt)],
      limit: 100,
    });

    let totalEarned = 0;
    let totalSpent = 0;
    for (const tx of txs) {
      const amount = Number(tx.amount);
      if (amount > 0) totalEarned += amount;
      else totalSpent += Math.abs(amount);
    }

    return { totalEarned, totalSpent, transactionCount: txs.length };
  }),

  // Claim daily login bonus
  claimDailyBonus: protectedProcedure.mutation(async ({ ctx }) => {
    return claimDailyBonus(ctx.session.user.id);
  }),

  // Get XP/Level progression info
  levelInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: { xp: true, level: true },
    });
    return getLevelInfo(user?.xp ?? 0);
  }),
});
