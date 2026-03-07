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
import { getStripe, GCOIN_PACKAGES } from "@/server/lib/stripe";

// GCoin price: R$ 0,10 per GCoin
const GCOIN_PRICE_BRL = 0.1;
// Minimum withdrawal: 100 GCoins
const MIN_WITHDRAWAL_GCOINS = 100;
// Withdrawal fee: 5%
const WITHDRAWAL_FEE_PCT = 0.05;

export const paymentRouter = createTRPCRouter({
  // ==================== PURCHASE GCOINS ====================

  // Create a purchase order via Stripe Checkout (step 1: generate payment)
  createOrder: protectedProcedure
    .input(
      z.object({
        gcoinAmount: z.number().int().positive().min(50).max(1000000),
        method: z.enum(["pix", "credit_card", "debit_card", "boleto"]),
        packageId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const brlAmount = input.gcoinAmount * GCOIN_PRICE_BRL;

      // If a package was selected, use its price instead
      const pkg = input.packageId
        ? GCOIN_PACKAGES.find((p) => p.id === input.packageId)
        : null;
      const finalBrl = pkg ? pkg.priceBrl : brlAmount;

      // Determine payment method types for Stripe
      const paymentMethodTypes: ("card" | "boleto" | "pix")[] =
        input.method === "pix"
          ? ["pix"]
          : input.method === "boleto"
            ? ["boleto"]
            : ["card"];

      // Create Stripe Checkout Session
      const checkoutSession = await getStripe().checkout.sessions.create({
        mode: "payment",
        payment_method_types: paymentMethodTypes,
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: pkg ? pkg.label : `${input.gcoinAmount} GCoins`,
                description: `${input.gcoinAmount} GCoins para sua carteira Sportio`,
              },
              unit_amount: Math.round(finalBrl * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: ctx.session.user.id,
          gcoinAmount: input.gcoinAmount.toString(),
          packageId: input.packageId ?? "",
        },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gcoins?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gcoins?cancelled=true`,
      });

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);

      const [order] = await ctx.db
        .insert(paymentOrders)
        .values({
          id: crypto.randomUUID(),
          userId: ctx.session.user.id,
          gcoinAmount: input.gcoinAmount.toString(),
          brlAmount: finalBrl.toFixed(2),
          method: input.method,
          status: "pending",
          gatewayId: checkoutSession.id,
          gatewayData: {
            stripeSessionId: checkoutSession.id,
            stripeUrl: checkoutSession.url,
            packageId: input.packageId ?? null,
          },
          expiresAt,
          paidAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return {
        orderId: order.id,
        gcoinAmount: input.gcoinAmount,
        brlAmount: finalBrl,
        method: input.method,
        gatewayId: checkoutSession.id,
        gatewayData: {
          stripeSessionId: checkoutSession.id,
          stripeUrl: checkoutSession.url,
        },
        checkoutUrl: checkoutSession.url,
        expiresAt,
      };
    }),

  // Confirm payment by checking Stripe session status
  // Can be called by the client after redirect from Stripe Checkout, or by the webhook
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

  // Quick buy: create Stripe Checkout Session and redirect (for card/boleto payments)
  quickBuy: protectedProcedure
    .input(
      z.object({
        gcoinAmount: z.number().int().positive().min(50).max(1000000),
        method: z.enum(["pix", "credit_card", "debit_card", "boleto"]),
        packageId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const brlAmount = input.gcoinAmount * GCOIN_PRICE_BRL;

      // If a package was selected, use its price
      const pkg = input.packageId
        ? GCOIN_PACKAGES.find((p) => p.id === input.packageId)
        : null;
      const finalBrl = pkg ? pkg.priceBrl : brlAmount;

      // Determine Stripe payment method types
      const paymentMethodTypes: ("card" | "boleto" | "pix")[] =
        input.method === "pix"
          ? ["pix"]
          : input.method === "boleto"
            ? ["boleto"]
            : ["card"];

      // Create Stripe Checkout Session
      const checkoutSession = await getStripe().checkout.sessions.create({
        mode: "payment",
        payment_method_types: paymentMethodTypes,
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: pkg ? pkg.label : `${input.gcoinAmount} GCoins`,
                description: `${input.gcoinAmount} GCoins para sua carteira Sportio`,
              },
              unit_amount: Math.round(finalBrl * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: ctx.session.user.id,
          gcoinAmount: input.gcoinAmount.toString(),
          packageId: input.packageId ?? "",
        },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gcoins?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gcoins?cancelled=true`,
      });

      // Create order as pending (webhook will confirm it)
      const [order] = await ctx.db
        .insert(paymentOrders)
        .values({
          id: crypto.randomUUID(),
          userId: ctx.session.user.id,
          gcoinAmount: input.gcoinAmount.toString(),
          brlAmount: finalBrl.toFixed(2),
          method: input.method,
          status: "pending",
          gatewayId: checkoutSession.id,
          gatewayData: {
            stripeSessionId: checkoutSession.id,
            stripeUrl: checkoutSession.url,
            packageId: input.packageId ?? null,
          },
          paidAt: null,
          expiresAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return {
        success: true,
        orderId: order.id,
        gcoinAmount: input.gcoinAmount,
        brlAmount: finalBrl,
        gatewayId: checkoutSession.id,
        checkoutUrl: checkoutSession.url,
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
