import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  affiliateProducts,
  userRoles,
} from "@/server/db/schema";

export const affiliateRouter = createTRPCRouter({
  // Creator adds affiliate product
  addProduct: protectedProcedure
    .input(
      z.object({
        productName: z.string().min(1).max(255),
        productUrl: z.string().url(),
        imageUrl: z.string().url().optional(),
        priceCents: z.number().int().positive(),
        commissionPct: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate user is a creator
      const role = await ctx.db.query.userRoles.findFirst({
        where: and(
          eq(userRoles.userId, ctx.session.user.id),
          eq(userRoles.role, "athlete")
        ),
      });

      if (!role) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas criadores (atletas) podem adicionar produtos",
        });
      }

      const [product] = await ctx.db
        .insert(affiliateProducts)
        .values({
          creatorId: ctx.session.user.id,
          productName: input.productName,
          productUrl: input.productUrl,
          imageUrl: input.imageUrl,
          priceCents: input.priceCents,
          commissionPct: input.commissionPct.toString(),
        })
        .returning();

      return product;
    }),

  // Remove product (soft delete)
  removeProduct: protectedProcedure
    .input(z.object({ productId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(affiliateProducts)
        .set({ isActive: false, updatedAt: new Date() })
        .where(
          and(
            eq(affiliateProducts.id, input.productId),
            eq(affiliateProducts.creatorId, ctx.session.user.id)
          )
        )
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Produto não encontrado" });
      }

      return { success: true };
    }),

  // List creator's products (public)
  listProducts: publicProcedure
    .input(z.object({ creatorId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.affiliateProducts.findMany({
        where: and(
          eq(affiliateProducts.creatorId, input.creatorId),
          eq(affiliateProducts.isActive, true)
        ),
        orderBy: [desc(affiliateProducts.createdAt)],
      });
    }),

  // Track affiliate click
  trackClick: publicProcedure
    .input(z.object({ productId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(affiliateProducts)
        .set({ clicks: sql`${affiliateProducts.clicks} + 1` })
        .where(eq(affiliateProducts.id, input.productId));

      return { success: true };
    }),

  // Track purchase (webhook or manual)
  trackPurchase: protectedProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        purchaseAmount: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.query.affiliateProducts.findFirst({
        where: eq(affiliateProducts.id, input.productId),
      });

      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Produto não encontrado" });
      }

      // Only the creator can record purchases for their products
      if (product.creatorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Sem permissão" });
      }

      await ctx.db
        .update(affiliateProducts)
        .set({
          purchases: sql`${affiliateProducts.purchases} + 1`,
          totalRevenue: sql`${affiliateProducts.totalRevenue} + ${input.purchaseAmount}`,
          updatedAt: new Date(),
        })
        .where(eq(affiliateProducts.id, input.productId));

      return { success: true };
    }),
});
