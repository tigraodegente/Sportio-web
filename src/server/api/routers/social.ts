import { z } from "zod";
import { eq, desc, and, sql, lt } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure, rateLimitedProcedure } from "../trpc";
import { posts, comments, likes, users, sports, followers } from "@/server/db/schema";
import { notifyComment, notifyLike } from "@/server/services/notification-service";

export const socialRouter = createTRPCRouter({
  // Feed with cursor-based pagination
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
      if (input.cursor) conditions.push(lt(posts.id, input.cursor));

      const results = await ctx.db.query.posts.findMany({
        where: and(...conditions),
        with: {
          user: true,
          sport: true,
          comments: {
            limit: 3,
            orderBy: [desc(comments.createdAt)],
            with: { user: true },
          },
          likes: true,
        },
        orderBy: [desc(posts.createdAt)],
        limit: input.limit + 1,
      });

      let nextCursor: string | undefined;
      if (results.length > input.limit) {
        const next = results.pop()!;
        nextCursor = next.id;
      }

      // Add isLiked flag for the current user
      const userId = ctx.session?.user?.id;
      const items = results.map((post) => ({
        ...post,
        isLiked: userId ? post.likes.some((l) => l.userId === userId) : false,
        likes: undefined, // Don't send all likes to client
      }));

      return { items, nextCursor };
    }),

  // Get single post
  getPost: publicProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.postId),
        with: {
          user: true,
          sport: true,
          comments: {
            orderBy: [desc(comments.createdAt)],
            with: { user: true },
          },
          likes: true,
        },
      });

      if (!post) return null;

      const userId = ctx.session?.user?.id;
      return {
        ...post,
        isLiked: userId ? post.likes.some((l) => l.userId === userId) : false,
        likes: undefined,
      };
    }),

  // Create post
  createPost: rateLimitedProcedure({ key: "social.createPost", maxRequests: 10 })
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

  // Edit post
  editPost: protectedProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
        content: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(posts)
        .set({ content: input.content, updatedAt: new Date() })
        .where(and(eq(posts.id, input.postId), eq(posts.userId, ctx.session.user.id)))
        .returning();
      return updated;
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
  addComment: rateLimitedProcedure({ key: "social.addComment", maxRequests: 20 })
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

      // Return comment with user
      const commentWithUser = await ctx.db.query.comments.findFirst({
        where: eq(comments.id, comment!.id),
        with: { user: true },
      });

      // Notify post owner about the comment
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.postId),
        columns: { userId: true },
      });
      if (post && post.userId !== ctx.session.user.id) {
        const commenter = await ctx.db.query.users.findFirst({
          where: eq(users.id, ctx.session.user.id),
          columns: { name: true },
        });
        notifyComment(post.userId, commenter?.name ?? "Alguem", input.postId).catch(() => {});
      }

      return commentWithUser;
    }),

  // Delete comment
  deleteComment: protectedProcedure
    .input(z.object({ commentId: z.string().uuid(), postId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(comments)
        .where(and(eq(comments.id, input.commentId), eq(comments.userId, ctx.session.user.id)));

      await ctx.db
        .update(posts)
        .set({ commentsCount: sql`GREATEST(${posts.commentsCount} - 1, 0)` })
        .where(eq(posts.id, input.postId));

      return { success: true };
    }),

  // Toggle like
  toggleLike: rateLimitedProcedure({ key: "social.toggleLike", maxRequests: 30 })
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
            .set({ likesCount: sql`GREATEST(${posts.likesCount} - 1, 0)` })
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

        // Notify post owner about the like
        const post = await ctx.db.query.posts.findFirst({
          where: eq(posts.id, input.postId),
          columns: { userId: true },
        });
        if (post && post.userId !== ctx.session.user.id) {
          const liker = await ctx.db.query.users.findFirst({
            where: eq(users.id, ctx.session.user.id),
            columns: { name: true },
          });
          notifyLike(post.userId, liker?.name ?? "Alguem", input.postId).catch(() => {});
        }
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

  // Get available sports for filter
  getSports: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.sports.findMany({
      where: eq(sports.isActive, true),
      orderBy: [sports.name],
    });
  }),

  // Get suggested users to follow
  suggestedUsers: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(5) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Get users the current user already follows
      const following = await ctx.db.query.followers.findMany({
        where: eq(followers.followerId, userId),
      });
      const followingIds = following.map((f) => f.followingId);
      followingIds.push(userId); // Exclude self

      // Get users not yet followed
      const suggested = await ctx.db.query.users.findMany({
        where: followingIds.length > 0
          ? and(sql`${users.id} NOT IN (${sql.join(followingIds.map(id => sql`${id}`), sql`, `)})`)
          : undefined,
        limit: input.limit,
        columns: {
          id: true,
          name: true,
          image: true,
          bio: true,
          city: true,
        },
      });

      return suggested;
    }),

  // Get trending posts (most liked in last 7 days)
  trending: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(5) }))
    .query(async ({ ctx, input }) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return ctx.db.query.posts.findMany({
        where: and(
          eq(posts.isPublished, true),
          sql`${posts.createdAt} >= ${sevenDaysAgo}`
        ),
        with: {
          user: { columns: { id: true, name: true, image: true } },
          sport: true,
        },
        orderBy: [desc(posts.likesCount)],
        limit: input.limit,
      });
    }),
});
