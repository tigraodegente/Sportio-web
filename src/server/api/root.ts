import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { tournamentRouter } from "./routers/tournament";
import { matchRouter } from "./routers/match";
import { gcoinRouter } from "./routers/gcoin";
import { socialRouter } from "./routers/social";
import { betRouter } from "./routers/bet";
import { chatRouter } from "./routers/chat";
import { notificationRouter } from "./routers/notification";
import { challengeRouter } from "./routers/challenge";
import { brandRouter } from "./routers/brand";
import { paymentRouter } from "./routers/payment";

export const appRouter = createTRPCRouter({
  user: userRouter,
  tournament: tournamentRouter,
  match: matchRouter,
  gcoin: gcoinRouter,
  social: socialRouter,
  bet: betRouter,
  chat: chatRouter,
  notification: notificationRouter,
  challenge: challengeRouter,
  brand: brandRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
