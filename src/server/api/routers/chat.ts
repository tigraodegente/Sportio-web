import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { chatRooms, chatMembers, chatMessages } from "@/server/db/schema";

export const chatRouter = createTRPCRouter({
  // My rooms
  myRooms: protectedProcedure.query(async ({ ctx }) => {
    const memberships = await ctx.db.query.chatMembers.findMany({
      where: eq(chatMembers.userId, ctx.session.user.id),
      with: {
        room: {
          with: {
            members: { with: { user: true } },
            messages: {
              limit: 1,
              orderBy: [desc(chatMessages.createdAt)],
            },
          },
        },
      },
    });
    return memberships.map((m) => m.room);
  }),

  // Get room messages
  messages: protectedProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.query.chatMessages.findMany({
        where: eq(chatMessages.roomId, input.roomId),
        with: { sender: true },
        orderBy: [desc(chatMessages.createdAt)],
        limit: input.limit + 1,
      });

      let nextCursor: string | undefined;
      if (results.length > input.limit) {
        const next = results.pop()!;
        nextCursor = next.id;
      }

      return { items: results.reverse(), nextCursor };
    }),

  // Send message
  sendMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        content: z.string().min(1).max(5000),
        images: z.array(z.string().url()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [message] = await ctx.db
        .insert(chatMessages)
        .values({
          roomId: input.roomId,
          senderId: ctx.session.user.id,
          content: input.content,
          images: input.images,
        })
        .returning();
      return message;
    }),

  // Create DM room
  createDM: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [room] = await ctx.db
        .insert(chatRooms)
        .values({ isGroup: false })
        .returning();

      await ctx.db.insert(chatMembers).values([
        { roomId: room.id, userId: ctx.session.user.id },
        { roomId: room.id, userId: input.userId },
      ]);

      return room;
    }),

  // Create group
  createGroup: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        memberIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [room] = await ctx.db
        .insert(chatRooms)
        .values({ name: input.name, isGroup: true })
        .returning();

      const members = [ctx.session.user.id, ...input.memberIds].map((userId) => ({
        roomId: room.id,
        userId,
      }));

      await ctx.db.insert(chatMembers).values(members);
      return room;
    }),
});
