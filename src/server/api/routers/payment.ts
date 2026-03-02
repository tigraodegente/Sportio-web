import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  paymentOrders,
  withdrawalRequests,
  users,
  userRoles,
  gcoinTransactions,
} from "@/server/db/schema";
import { notifyGcoinReceived } from "@/server/services/notification-service";

// GCoin price: R$ 0,10 per GCoin
const GCOIN_PRICE_BRL = 0.1;
// Minimum withdrawal: 100 GCoins
const MIN_WITHDRAWAL_GCOINS = 100;
// Withdrawal fee: 5%
const WITHDRAWAL_FEE_PCT = 0.05;

// Simulated gateway: generates a fake PIX code or card confirmation
function simulateGateway(method: string, amount: number) {
  const txId = `SIM-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  if (method === "pix") {
    // Simulated PIX QR code payload
    const pixCode = `00020126580014br.gov.bcb.pix0136${txId}5204000053039865802BR5925SPORTIO PLATAFORMA LTDA6009SAO PAULO62070503***6304`;
    return {
      gatewayId: txId,
      gatewayData: {
        pixCode,
        pixQrBase64: null, // In production, this would be a real QR code image
        expiresInMinutes: 30,
      },
    };
  }

  // Credit/debit card - auto-approve simulation
  return {
    gatewayId: txId,
    gatewayData: {
      cardLast4: "4242",
      brand: "Visa",
      installments: 1,
      authCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
    },
  };
}

export const paymentRouter = createTRPCRouter({
  // ==================== PURCHASE GCOINS ====================

  // Create a purchase order (step 1: generate payment)
  createOrder: protectedProcedure
    .input(
      z.object({
        gcoinAmount: z.number().int().positive().min(50).max(1000000),
        method: z.enum(["pix", "credit_card", "debit_card", "boleto"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const brlAmount = input.gcoinAmount * GCOIN_PRICE_BRL;
      const gateway = simulateGateway(input.method, brlAmount);

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);

      const [order] = await ctx.db
        .insert(paymentOrders)
        .values({
          id: crypto.randomUUID(),
          userId: ctx.session.user.id,
          gcoinAmount: input.gcoinAmount.toString(),
          brlAmount: brlAmount.toFixed(2),
          method: input.method,
          status: "pending",
          gatewayId: gateway.gatewayId,
          gatewayData: gateway.gatewayData,
          expiresAt,
          paidAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return {
        orderId: order.id,
        gcoinAmount: input.gcoinAmount,
        brlAmount,
        method: input.method,
        gatewayId: gateway.gatewayId,
        gatewayData: gateway.gatewayData,
        expiresAt,
      };
    }),

  // Confirm/simulate payment (step 2: process payment)
  // In production, this would be called by a webhook from the payment gateway
  confirmPayment: protectedProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.query.paymentOrders.findFirst({
        where: and(
          eq(paymentOrders.id, input.orderId),
          eq(paymentOrders.userId, ctx.session.user.id)
        ),
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Pedido nao encontrado" });
      }

      if (order.status === "completed") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Pagamento ja processado" });
      }

      if (order.status === "expired" || order.status === "failed") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Pedido expirado ou falhou" });
      }

      const gcoinAmount = Number(order.gcoinAmount);

      // Update order status
      await ctx.db
        .update(paymentOrders)
        .set({
          status: "completed",
          paidAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(paymentOrders.id, input.orderId));

      // Credit GCoins to user
      await ctx.db
        .update(users)
        .set({
          gcoinsReal: sql`${users.gcoinsReal} + ${gcoinAmount}`,
        })
        .where(eq(users.id, ctx.session.user.id));

      // Log transaction
      await ctx.db.insert(gcoinTransactions).values({
        id: crypto.randomUUID(),
        userId: ctx.session.user.id,
        type: "real",
        category: "purchase",
        amount: gcoinAmount.toString(),
        balanceAfter: null,
        description: `Compra de ${gcoinAmount} GCoins via ${order.method === "pix" ? "PIX" : order.method === "credit_card" ? "Cartao de Credito" : order.method === "debit_card" ? "Cartao de Debito" : "Boleto"}`,
        referenceId: order.id,
        referenceType: "payment_order",
        createdAt: new Date(),
      });

      // Notify user
      notifyGcoinReceived(ctx.session.user.id, gcoinAmount, "Sportio").catch(() => {});

      return {
        success: true,
        gcoinAmount,
        newBalance: null, // Client will refetch
      };
    }),

  // Quick buy: create order + auto-confirm in one step (for card payments or testing)
  quickBuy: protectedProcedure
    .input(
      z.object({
        gcoinAmount: z.number().int().positive().min(50).max(1000000),
        method: z.enum(["pix", "credit_card", "debit_card", "boleto"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const brlAmount = input.gcoinAmount * GCOIN_PRICE_BRL;
      const gateway = simulateGateway(input.method, brlAmount);

      // Create order as completed
      const [order] = await ctx.db
        .insert(paymentOrders)
        .values({
          id: crypto.randomUUID(),
          userId: ctx.session.user.id,
          gcoinAmount: input.gcoinAmount.toString(),
          brlAmount: brlAmount.toFixed(2),
          method: input.method,
          status: "completed",
          gatewayId: gateway.gatewayId,
          gatewayData: gateway.gatewayData,
          paidAt: new Date(),
          expiresAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Credit GCoins
      await ctx.db
        .update(users)
        .set({
          gcoinsReal: sql`${users.gcoinsReal} + ${input.gcoinAmount}`,
        })
        .where(eq(users.id, ctx.session.user.id));

      // Log transaction
      await ctx.db.insert(gcoinTransactions).values({
        id: crypto.randomUUID(),
        userId: ctx.session.user.id,
        type: "real",
        category: "purchase",
        amount: input.gcoinAmount.toString(),
        balanceAfter: null,
        description: `Compra de ${input.gcoinAmount} GCoins via ${input.method === "pix" ? "PIX" : input.method === "credit_card" ? "Cartao de Credito" : "Cartao de Debito"}`,
        referenceId: order.id,
        referenceType: "payment_order",
        createdAt: new Date(),
      });

      notifyGcoinReceived(ctx.session.user.id, input.gcoinAmount, "Sportio").catch(() => {});

      return {
        success: true,
        orderId: order.id,
        gcoinAmount: input.gcoinAmount,
        brlAmount,
        gatewayId: gateway.gatewayId,
      };
    }),

  // List my payment orders
  myOrders: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        status: z.enum(["pending", "processing", "completed", "failed", "refunded", "expired"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(paymentOrders.userId, ctx.session.user.id)];
      if (input.status) conditions.push(eq(paymentOrders.status, input.status));

      return ctx.db.query.paymentOrders.findMany({
        where: and(...conditions),
        orderBy: [desc(paymentOrders.createdAt)],
        limit: input.limit,
      });
    }),

  // ==================== WITHDRAWALS ====================

  // Request withdrawal (GCoins → BRL via PIX)
  requestWithdrawal: protectedProcedure
    .input(
      z.object({
        gcoinAmount: z.number().int().positive().min(MIN_WITHDRAWAL_GCOINS),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user has PIX key
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: { gcoinsReal: true, pixKey: true, name: true },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuario nao encontrado" });
      if (!user.pixKey) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cadastre uma chave PIX em Configuracoes > Pagamento antes de solicitar saque",
        });
      }

      const balance = Number(user.gcoinsReal ?? 0);
      if (balance < input.gcoinAmount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Saldo insuficiente. Saldo real: ${balance.toFixed(0)} GCoins. Solicitado: ${input.gcoinAmount} GCoins.`,
        });
      }

      const fee = Math.ceil(input.gcoinAmount * WITHDRAWAL_FEE_PCT);
      const netGcoins = input.gcoinAmount - fee;
      const brlAmount = netGcoins * GCOIN_PRICE_BRL;

      // Deduct GCoins immediately (hold)
      await ctx.db
        .update(users)
        .set({
          gcoinsReal: sql`${users.gcoinsReal} - ${input.gcoinAmount}`,
        })
        .where(eq(users.id, ctx.session.user.id));

      // Log deduction
      await ctx.db.insert(gcoinTransactions).values({
        id: crypto.randomUUID(),
        userId: ctx.session.user.id,
        type: "real",
        category: "withdrawal",
        amount: (-input.gcoinAmount).toString(),
        balanceAfter: null,
        description: `Solicitacao de saque: ${input.gcoinAmount} GCoins (taxa: ${fee} GC)`,
        referenceId: null,
        referenceType: "withdrawal",
        createdAt: new Date(),
      });

      // Create withdrawal request
      const [withdrawal] = await ctx.db
        .insert(withdrawalRequests)
        .values({
          id: crypto.randomUUID(),
          userId: ctx.session.user.id,
          gcoinAmount: input.gcoinAmount.toString(),
          brlAmount: brlAmount.toFixed(2),
          pixKey: user.pixKey,
          status: "pending",
          reviewedBy: null,
          reviewedAt: null,
          rejectionReason: null,
          processedAt: null,
          createdAt: new Date(),
        })
        .returning();

      return {
        id: withdrawal.id,
        gcoinAmount: input.gcoinAmount,
        fee,
        netGcoins,
        brlAmount,
        pixKey: user.pixKey,
        status: "pending",
      };
    }),

  // List my withdrawal requests
  myWithdrawals: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.withdrawalRequests.findMany({
        where: eq(withdrawalRequests.userId, ctx.session.user.id),
        orderBy: [desc(withdrawalRequests.createdAt)],
        limit: input.limit,
      });
    }),

  // ==================== ADMIN: MANAGE PAYMENTS ====================

  // Admin: list all payment orders
  adminListOrders: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        status: z.enum(["pending", "processing", "completed", "failed", "refunded", "expired"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check admin role
      const adminRole = await ctx.db.query.userRoles.findFirst({
        where: and(eq(userRoles.userId, ctx.session.user.id), eq(userRoles.role, "admin")),
      });
      if (!adminRole) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
      }

      const conditions = [];
      if (input.status) conditions.push(eq(paymentOrders.status, input.status));

      return ctx.db.query.paymentOrders.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: { user: { columns: { id: true, name: true, email: true } } },
        orderBy: [desc(paymentOrders.createdAt)],
        limit: input.limit,
      });
    }),

  // Admin: list all withdrawal requests
  adminListWithdrawals: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        status: z.enum(["pending", "approved", "processing", "completed", "rejected"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const adminRole = await ctx.db.query.userRoles.findFirst({
        where: and(eq(userRoles.userId, ctx.session.user.id), eq(userRoles.role, "admin")),
      });
      if (!adminRole) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
      }

      const conditions = [];
      if (input.status) conditions.push(eq(withdrawalRequests.status, input.status));

      return ctx.db.query.withdrawalRequests.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: { user: { columns: { id: true, name: true, email: true, pixKey: true } } },
        orderBy: [desc(withdrawalRequests.createdAt)],
        limit: input.limit,
      });
    }),

  // Admin: approve/reject withdrawal
  adminReviewWithdrawal: protectedProcedure
    .input(
      z.object({
        withdrawalId: z.string().uuid(),
        action: z.enum(["approve", "reject"]),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const adminRole = await ctx.db.query.userRoles.findFirst({
        where: and(eq(userRoles.userId, ctx.session.user.id), eq(userRoles.role, "admin")),
      });
      if (!adminRole) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
      }

      const withdrawal = await ctx.db.query.withdrawalRequests.findFirst({
        where: eq(withdrawalRequests.id, input.withdrawalId),
      });

      if (!withdrawal) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Solicitacao nao encontrada" });
      }

      if (withdrawal.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Solicitacao ja foi processada" });
      }

      if (input.action === "approve") {
        // Mark as approved (simulated: auto-complete)
        await ctx.db
          .update(withdrawalRequests)
          .set({
            status: "completed",
            reviewedBy: ctx.session.user.id,
            reviewedAt: new Date(),
            processedAt: new Date(),
          })
          .where(eq(withdrawalRequests.id, input.withdrawalId));

        return { success: true, action: "approved" };
      } else {
        // Reject: refund GCoins to user
        const refundAmount = Number(withdrawal.gcoinAmount);

        await ctx.db
          .update(users)
          .set({
            gcoinsReal: sql`${users.gcoinsReal} + ${refundAmount}`,
          })
          .where(eq(users.id, withdrawal.userId));

        await ctx.db.insert(gcoinTransactions).values({
          id: crypto.randomUUID(),
          userId: withdrawal.userId,
          type: "real",
          category: "withdrawal",
          amount: refundAmount.toString(),
          balanceAfter: null,
          description: `Saque rejeitado - GCoins devolvidos${input.reason ? `: ${input.reason}` : ""}`,
          referenceId: withdrawal.id,
          referenceType: "withdrawal_refund",
          createdAt: new Date(),
        });

        await ctx.db
          .update(withdrawalRequests)
          .set({
            status: "rejected",
            reviewedBy: ctx.session.user.id,
            reviewedAt: new Date(),
            rejectionReason: input.reason ?? null,
          })
          .where(eq(withdrawalRequests.id, input.withdrawalId));

        return { success: true, action: "rejected", refunded: refundAmount };
      }
    }),

  // Admin: adjust user GCoins (manual credit/debit)
  adminAdjustGcoins: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        amount: z.number().int(),
        type: z.enum(["real", "gamification"]),
        reason: z.string().min(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const adminRole = await ctx.db.query.userRoles.findFirst({
        where: and(eq(userRoles.userId, ctx.session.user.id), eq(userRoles.role, "admin")),
      });
      if (!adminRole) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
      }

      const field = input.type === "real" ? "gcoinsReal" : "gcoinsGamification";

      if (input.amount > 0) {
        await ctx.db
          .update(users)
          .set({ [field]: sql`${users[field]} + ${input.amount}` })
          .where(eq(users.id, input.userId));
      } else {
        await ctx.db
          .update(users)
          .set({ [field]: sql`GREATEST(${users[field]} + ${input.amount}, 0)` })
          .where(eq(users.id, input.userId));
      }

      await ctx.db.insert(gcoinTransactions).values({
        id: crypto.randomUUID(),
        userId: input.userId,
        type: input.type,
        category: input.amount > 0 ? "daily_bonus" : "withdrawal",
        amount: input.amount.toString(),
        balanceAfter: null,
        description: `Ajuste admin: ${input.reason}`,
        referenceId: ctx.session.user.id,
        referenceType: "admin_adjustment",
        createdAt: new Date(),
      });

      return { success: true, amount: input.amount };
    }),

  // Admin: financial summary
  adminFinancialSummary: protectedProcedure.query(async ({ ctx }) => {
    const adminRole = await ctx.db.query.userRoles.findFirst({
      where: and(eq(userRoles.userId, ctx.session.user.id), eq(userRoles.role, "admin")),
    });
    if (!adminRole) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
    }

    // Total revenue (completed orders)
    const orders = await ctx.db.query.paymentOrders.findMany({
      where: eq(paymentOrders.status, "completed"),
    });
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.brlAmount), 0);
    const totalGcoinsSold = orders.reduce((sum, o) => sum + Number(o.gcoinAmount), 0);

    // Pending withdrawals
    const pendingWithdrawals = await ctx.db.query.withdrawalRequests.findMany({
      where: eq(withdrawalRequests.status, "pending"),
    });
    const pendingWithdrawalAmount = pendingWithdrawals.reduce((sum, w) => sum + Number(w.brlAmount), 0);

    // Completed withdrawals
    const completedWithdrawals = await ctx.db.query.withdrawalRequests.findMany({
      where: eq(withdrawalRequests.status, "completed"),
    });
    const totalWithdrawn = completedWithdrawals.reduce((sum, w) => sum + Number(w.brlAmount), 0);

    return {
      totalRevenue,
      totalGcoinsSold,
      totalOrders: orders.length,
      pendingWithdrawals: pendingWithdrawals.length,
      pendingWithdrawalAmount,
      totalWithdrawn,
      completedWithdrawals: completedWithdrawals.length,
      netRevenue: totalRevenue - totalWithdrawn,
    };
  }),
});
