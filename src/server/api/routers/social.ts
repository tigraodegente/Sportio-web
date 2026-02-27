import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { posts, comments, likes } from "@/server/db/schema";

export const socialRouter = createTRPCRouter({
  // Feed
  feed: publicProcedure
    .input(
      z.object({
        sportId: z.string().uuid().optional(),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(posts.isPublished, true)];
      if (input.sportId) conditions.push(eq(posts.sportId, input.sportId));

      const results = await ctx.db.query.posts.findMany({
        where: and(...conditions),
        with: {
          user: true,
          comments: {
            limit: 3,
            orderBy: [desc(comments.createdAt)],
            with: { user: true },
          },
        },
        orderBy: [desc(posts.createdAt)],
        limit: input.limit + 1,
      });

      let nextCursor: string | undefined;
      if (results.length > input.limit) {
        const next = results.pop()!;
        nextCursor = next.id;
      }

      return { items: results, nextCursor };
    }),

  // Create post
  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(2000),
        images: z.array(z.string().url()).optional(),
        sportId: z.string().uuid().optional(),
        tournamentId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .insert(posts)
        .values({
          userId: ctx.session.user.id,
          content: input.content,
          images: input.images,
          sportId: input.sportId,
          tournamentId: input.tournamentId,
        })
        .returning();
      return post;
    }),

  // Delete post
  deletePost: protectedProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(posts)
        .where(and(eq(posts.id, input.postId), eq(posts.userId, ctx.session.user.id)));
      return { success: true };
    }),

  // Add comment
  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
        content: z.string().min(1).max(1000),
        parentId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [comment] = await ctx.db
        .insert(comments)
        .values({
          postId: input.postId,
          userId: ctx.session.user.id,
          content: input.content,
          parentId: input.parentId,
        })
        .returning();

      // Increment comments count
      await ctx.db
        .update(posts)
        .set({ commentsCount: sql`${posts.commentsCount} + 1` })
        .where(eq(posts.id, input.postId));

      return comment;
    }),

  // Toggle like
  toggleLike: protectedProcedure
    .input(
      z.object({
        postId: z.string().uuid().optional(),
        commentId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.db.query.likes.findFirst({
        where: and(
          eq(likes.userId, ctx.session.user.id),
          input.postId ? eq(likes.postId, input.postId) : eq(likes.commentId, input.commentId!)
        ),
      });

      if (existingLike) {
        await ctx.db.delete(likes).where(eq(likes.id, existingLike.id));
        if (input.postId) {
          await ctx.db
            .update(posts)
            .set({ likesCount: sql`${posts.likesCount} - 1` })
            .where(eq(posts.id, input.postId));
        }
        return { liked: false };
      }

      await ctx.db.insert(likes).values({
        userId: ctx.session.user.id,
        postId: input.postId,
        commentId: input.commentId,
      });
      if (input.postId) {
        await ctx.db
          .update(posts)
          .set({ likesCount: sql`${posts.likesCount} + 1` })
          .where(eq(posts.id, input.postId));
      }
      return { liked: true };
    }),

  // Get comments for post
  getComments: publicProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.comments.findMany({
        where: eq(comments.postId, input.postId),
        with: { user: true },
        orderBy: [desc(comments.createdAt)],
      });
    }),
});
