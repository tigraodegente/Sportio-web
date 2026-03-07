import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { sports } from "@/server/db/schema";

export const sportRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const allSports = await ctx.db.query.sports.findMany({
      where: eq(sports.isActive, true),
      orderBy: (sports, { asc }) => [asc(sports.name)],
    });
    return allSports;
  }),
});
