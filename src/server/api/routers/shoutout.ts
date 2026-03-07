import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  shoutoutRequests,
  users,
  gcoinTransactions,
} from "@/server/db/schema";
import { createNotification } from "@/server/services/notification-service";

const PLATFORM_FEE_PCT = 20;

export const shoutoutRouter = createTRPCRouter({
  // Fan requests a shoutout
  requestShoutout: protectedProcedure
    .input(
      z.object({
        creatorId: z.string().uuid(),
        message: z.string().min(10).max(500),
        gcoinAmount: z.number().int().positive().min(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const fanId = ctx.session.user.id;

      if (fanId === input.creatorId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Você não pode pedir um shoutout para si mesmo" });
      }

      // Check balance
      const fan = await ctx.db.query.users.findFirst({
        where: eq(users.id, fanId),
        columns: { gcoinsReal: true, gcoinsGamification: true, name: true },
      });

      const totalBalance = Number(fan?.gcoinsReal ?? 0) + Number(fan?.gcoinsGamification ?? 0);
      if (totalBalance < input.gcoinAmount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente de GCoins" });
      }

      // Deduct GCoins (held in escrow)
      let remaining = input.gcoinAmount;
      const gamBalance = Number(fan?.gcoinsGamification ?? 0);
      if (gamBalance > 0) {
        const fromGam = Math.min(gamBalance, remaining);
        await ctx.db
          .update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} - ${fromGam}` })
          .where(eq(users.id, fanId));
        remaining -= fromGam;
      }
      if (remaining > 0) {
        await ctx.db
          .update(users)
          .set({ gcoinsReal: sql`${users.gcoinsReal} - ${remaining}` })
          .where(eq(users.id, fanId));
      }

      // Create shoutout request with 7-day deadline
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);

      const [request] = await ctx.db
        .insert(shoutoutRequests)
        .values({
          fanId,
          creatorId: input.creatorId,
          message: input.message,
          gcoinAmount: input.gcoinAmount,
          deadline,
        })
        .returning();

      // Log escrow transaction
      await ctx.db.insert(gcoinTransactions).values({
        userId: fanId,
        type: "real",
        category: "transfer",
        amount: (-input.gcoinAmount).toString(),
        description: "Shoutout solicitado (em custódia)",
        referenceId: request!.id,
        referenceType: "shoutout" as any,
      });

      // Notify creator
      createNotification({
        userId: input.creatorId,
        type: "social",
        title: "Novo pedido de shoutout!",
        message: `${fan?.name ?? "Alguém"} pediu um shoutout por ${input.gcoinAmount} GCoins`,
        data: { requestId: request!.id, gcoinAmount: input.gcoinAmount },
      }).catch(() => {});

      return request;
    }),

  // Creator sees pending requests
  listRequests: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "accepted", "completed", "cancelled", "expired"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(shoutoutRequests.creatorId, ctx.session.user.id)];
      if (input.status) {
        conditions.push(eq(shoutoutRequests.status, input.status));
      }

      return ctx.db.query.shoutoutRequests.findMany({
        where: and(...conditions),
        with: {
          fan: { columns: { id: true, name: true, image: true } },
        },
        orderBy: [desc(shoutoutRequests.createdAt)],
      });
    }),

  // Creator accepts request
  acceptRequest: protectedProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(shoutoutRequests)
        .set({ status: "accepted", updatedAt: new Date() })
        .where(
          and(
            eq(shoutoutRequests.id, input.requestId),
            eq(shoutoutRequests.creatorId, ctx.session.user.id),
            eq(shoutoutRequests.status, "pending")
          )
        )
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Solicitação não encontrada ou já processada" });
      }

      // Notify fan
      createNotification({
        userId: updated.fanId,
        type: "social",
        title: "Shoutout aceito!",
        message: "O criador aceitou seu pedido de shoutout. O vídeo será enviado em breve!",
        data: { requestId: updated.id },
      }).catch(() => {});

      return updated;
    }),

  // Creator uploads video and completes shoutout
  completeShoutout: protectedProcedure
    .input(
      z.object({
        requestId: z.string().uuid(),
        videoUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.shoutoutRequests.findFirst({
        where: and(
          eq(shoutoutRequests.id, input.requestId),
          eq(shoutoutRequests.creatorId, ctx.session.user.id)
        ),
      });

      if (!request) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Solicitação não encontrada" });
      }

      if (request.status !== "accepted" && request.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Solicitação não pode ser completada neste status" });
      }

      // Update request
      const [updated] = await ctx.db
        .update(shoutoutRequests)
        .set({
          status: "completed",
          videoUrl: input.videoUrl,
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(shoutoutRequests.id, input.requestId))
        .returning();

      // Release escrowed GCoins to creator (minus fee)
      const creatorAmount = Math.floor(request.gcoinAmount * (100 - PLATFORM_FEE_PCT) / 100);
      await ctx.db
        .update(users)
        .set({ gcoinsReal: sql`${users.gcoinsReal} + ${creatorAmount}` })
        .where(eq(users.id, ctx.session.user.id));

      // Log transaction
      await ctx.db.insert(gcoinTransactions).values({
        userId: ctx.session.user.id,
        type: "real",
        category: "transfer",
        amount: creatorAmount.toString(),
        description: "Shoutout concluído - pagamento liberado",
        referenceId: updated!.id,
        referenceType: "shoutout" as any,
      });

      // Notify fan
      createNotification({
        userId: request.fanId,
        type: "social",
        title: "Seu shoutout está pronto!",
        message: "O criador enviou seu vídeo personalizado. Confira agora!",
        data: { requestId: updated!.id, videoUrl: input.videoUrl },
      }).catch(() => {});

      return updated;
    }),

  // Cancel shoutout and refund
  cancelShoutout: protectedProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.shoutoutRequests.findFirst({
        where: eq(shoutoutRequests.id, input.requestId),
      });

      if (!request) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Solicitação não encontrada" });
      }

      // Only the fan or creator can cancel, and only if not completed
      const userId = ctx.session.user.id;
      if (userId !== request.fanId && userId !== request.creatorId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Sem permissão para cancelar" });
      }

      if (request.status === "completed") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Shoutout já foi concluído" });
      }

      if (request.status === "cancelled") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Shoutout já foi cancelado" });
      }

      // Update status
      const [updated] = await ctx.db
        .update(shoutoutRequests)
        .set({
          status: "cancelled",
          cancelledAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(shoutoutRequests.id, input.requestId))
        .returning();

      // Refund GCoins to fan
      await ctx.db
        .update(users)
        .set({ gcoinsReal: sql`${users.gcoinsReal} + ${request.gcoinAmount}` })
        .where(eq(users.id, request.fanId));

      // Log refund transaction
      await ctx.db.insert(gcoinTransactions).values({
        userId: request.fanId,
        type: "real",
        category: "transfer",
        amount: request.gcoinAmount.toString(),
        description: "Shoutout cancelado - reembolso",
        referenceId: updated!.id,
        referenceType: "shoutout" as any,
      });

      // Notify the other party
      const notifyUserId = userId === request.fanId ? request.creatorId : request.fanId;
      createNotification({
        userId: notifyUserId,
        type: "social",
        title: "Shoutout cancelado",
        message: "O pedido de shoutout foi cancelado e os GCoins foram reembolsados.",
        data: { requestId: updated!.id },
      }).catch(() => {});

      return { success: true };
    }),
});
