import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  gifts,
  giftTypes,
  fanBadges,
  users,
  gcoinTransactions,
} from "@/server/db/schema";
import { createNotification } from "@/server/services/notification-service";

const PLATFORM_FEE_PCT = 20; // 20% platform fee on gifts

export const giftRouter = createTRPCRouter({
  // List available gift types
  listGiftTypes: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.giftTypes.findMany({
      where: eq(giftTypes.isActive, true),
      orderBy: [giftTypes.sortOrder, giftTypes.gcoinCost],
    });
  }),

  // Send a gift
  sendGift: protectedProcedure
    .input(
      z.object({
        receiverId: z.string().uuid(),
        giftTypeId: z.string().uuid(),
        message: z.string().max(500).optional(),
        postId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const senderId = ctx.session.user.id;

      if (senderId === input.receiverId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Você não pode enviar presente para si mesmo" });
      }

      // Get gift type
      const giftType = await ctx.db.query.giftTypes.findFirst({
        where: and(eq(giftTypes.id, input.giftTypeId), eq(giftTypes.isActive, true)),
      });

      if (!giftType) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tipo de presente não encontrado" });
      }

      // Check sender balance
      const sender = await ctx.db.query.users.findFirst({
        where: eq(users.id, senderId),
        columns: { gcoinsReal: true, gcoinsGamification: true, name: true },
      });

      const totalBalance = Number(sender?.gcoinsReal ?? 0) + Number(sender?.gcoinsGamification ?? 0);
      if (totalBalance < giftType.gcoinCost) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente de GCoins" });
      }

      // Deduct from sender (prefer gamification coins)
      let remaining = giftType.gcoinCost;
      const gamBalance = Number(sender?.gcoinsGamification ?? 0);
      if (gamBalance > 0) {
        const fromGam = Math.min(gamBalance, remaining);
        await ctx.db
          .update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} - ${fromGam}` })
          .where(eq(users.id, senderId));
        remaining -= fromGam;
      }
      if (remaining > 0) {
        await ctx.db
          .update(users)
          .set({ gcoinsReal: sql`${users.gcoinsReal} - ${remaining}` })
          .where(eq(users.id, senderId));
      }

      // Credit 80% to receiver, 20% platform fee
      const receiverAmount = Math.floor(giftType.gcoinCost * (100 - PLATFORM_FEE_PCT) / 100);
      await ctx.db
        .update(users)
        .set({ gcoinsReal: sql`${users.gcoinsReal} + ${receiverAmount}` })
        .where(eq(users.id, input.receiverId));

      // Insert gift record
      const [gift] = await ctx.db
        .insert(gifts)
        .values({
          senderId,
          receiverId: input.receiverId,
          giftTypeId: input.giftTypeId,
          message: input.message,
          postId: input.postId,
          gcoinAmount: giftType.gcoinCost,
        })
        .returning();

      // Update fan badge
      const existingBadge = await ctx.db.query.fanBadges.findFirst({
        where: and(eq(fanBadges.fanId, senderId), eq(fanBadges.creatorId, input.receiverId)),
      });

      if (existingBadge) {
        await ctx.db
          .update(fanBadges)
          .set({
            totalGcoinsGiven: sql`${fanBadges.totalGcoinsGiven} + ${giftType.gcoinCost}`,
            updatedAt: new Date(),
          })
          .where(eq(fanBadges.id, existingBadge.id));
      } else {
        await ctx.db.insert(fanBadges).values({
          fanId: senderId,
          creatorId: input.receiverId,
          tier: "bronze",
          totalGcoinsGiven: giftType.gcoinCost,
        });
      }

      // Log transactions
      await ctx.db.insert(gcoinTransactions).values([
        {
          userId: senderId,
          type: "real",
          category: "transfer",
          amount: (-giftType.gcoinCost).toString(),
          description: `Presente enviado: ${giftType.name}`,
          referenceId: gift!.id,
          referenceType: "gift" as any,
        },
        {
          userId: input.receiverId,
          type: "real",
          category: "transfer",
          amount: receiverAmount.toString(),
          description: `Presente recebido: ${giftType.name}`,
          referenceId: gift!.id,
          referenceType: "gift" as any,
        },
      ]);

      // Notify receiver
      createNotification({
        userId: input.receiverId,
        type: "gcoin",
        title: `${giftType.emoji} Presente recebido!`,
        message: `${sender?.name ?? "Alguém"} enviou ${giftType.name} (${giftType.gcoinCost} GCoins)${input.message ? `: "${input.message}"` : ""}`,
        data: { giftId: gift!.id, giftTypeId: input.giftTypeId, senderId },
      }).catch(() => {});

      return gift;
    }),

  // Gift history
  getGiftHistory: protectedProcedure
    .input(
      z.object({
        type: z.enum(["sent", "received"]),
        page: z.number().int().min(0).default(0),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const condition = input.type === "sent"
        ? eq(gifts.senderId, userId)
        : eq(gifts.receiverId, userId);

      const results = await ctx.db.query.gifts.findMany({
        where: condition,
        with: {
          sender: { columns: { id: true, name: true, image: true } },
          receiver: { columns: { id: true, name: true, image: true } },
          giftType: true,
        },
        orderBy: [desc(gifts.createdAt)],
        limit: input.limit,
        offset: input.page * input.limit,
      });

      return results;
    }),

  // Top fans leaderboard for a creator
  topFans: publicProcedure
    .input(
      z.object({
        creatorId: z.string().uuid(),
        limit: z.number().int().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select({
          fanId: fanBadges.fanId,
          totalGcoinsGiven: fanBadges.totalGcoinsGiven,
          monthsSubscribed: fanBadges.monthsSubscribed,
          tier: fanBadges.tier,
        })
        .from(fanBadges)
        .where(eq(fanBadges.creatorId, input.creatorId))
        .orderBy(desc(fanBadges.totalGcoinsGiven))
        .limit(input.limit);

      // Enrich with user info
      const fanIds = results.map((r) => r.fanId);
      if (fanIds.length === 0) return [];

      const fanUsers = await ctx.db.query.users.findMany({
        where: sql`${users.id} IN (${sql.join(fanIds.map((id) => sql`${id}`), sql`, `)})`,
        columns: { id: true, name: true, image: true },
      });

      const userMap = new Map(fanUsers.map((u) => [u.id, u]));

      return results.map((r, idx) => ({
        rank: idx + 1,
        fan: userMap.get(r.fanId) ?? { id: r.fanId, name: "Usuário", image: null },
        totalGcoinsGiven: r.totalGcoinsGiven,
        monthsSubscribed: r.monthsSubscribed,
        tier: r.tier,
      }));
    }),
});
