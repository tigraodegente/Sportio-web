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
import { gamificationRouter } from "./routers/gamification";
import { sportRouter } from "./routers/sport";
import { creatorRouter } from "./routers/creator";
import { subscriptionRouter } from "./routers/subscription";
import { giftRouter } from "./routers/gift";
import { shoutoutRouter } from "./routers/shoutout";
import { affiliateRouter } from "./routers/affiliate";
import { proSportsRouter } from "./routers/pro-sports";
import { proBettingRouter } from "./routers/pro-betting";
import { favoritesRouter } from "./routers/favorites";

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
  gamification: gamificationRouter,
  sport: sportRouter,
  creator: creatorRouter,
  subscription: subscriptionRouter,
  gift: giftRouter,
  shoutout: shoutoutRouter,
  affiliate: affiliateRouter,
  proSports: proSportsRouter,
  proBetting: proBettingRouter,
  favorites: favoritesRouter,
});

export type AppRouter = typeof appRouter;
