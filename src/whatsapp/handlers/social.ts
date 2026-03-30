// Social feed handler - view posts, create posts, trending
import type { IncomingMessage } from "../types";
import { sessionManager } from "../services/session-manager";
import { whatsapp } from "../services/whatsapp-client";
import { menus } from "../services/menu-builder";
import { db } from "@/server/db";
import { posts, likes, comments, users } from "@/server/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function handleSocial(
  phone: string,
  message: IncomingMessage,
  action: string
): Promise<void> {
  const session = sessionManager.getSession(phone);
  const userId = session.userId!;

  // View feed
  if (action === "social_feed") {
    const feedPosts = await db.query.posts.findMany({
      with: {
        author: { columns: { name: true } },
      },
      orderBy: [desc(posts.createdAt)],
      limit: 5,
    });

    if (feedPosts.length === 0) {
      await whatsapp.sendButtons(phone, "Nenhum post no feed ainda. Seja o primeiro!", [
        { id: "social_post", title: "Criar post" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    // Get like counts
    let text = "*FEED SPORTIO*\n\n";

    for (const post of feedPosts) {
      const likeCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(likes)
        .where(eq(likes.postId, post.id));

      const commentCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(comments)
        .where(eq(comments.postId, post.id));

      text += `*${post.author?.name ?? "Anonimo"}*\n`;
      text += `${post.content?.substring(0, 150) ?? ""}\n`;
      text += `[${Number(likeCount[0]?.count ?? 0)} curtidas] [${Number(commentCount[0]?.count ?? 0)} comentarios]\n\n`;
    }

    await whatsapp.sendButtons(phone, text, [
      { id: "social_post", title: "Criar post" },
      { id: "social_trending", title: "Em alta" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Create post
  if (action === "social_post") {
    sessionManager.setState(phone, "social_create_post", {});
    await whatsapp.sendText(phone, "O que voce quer compartilhar?\n\nDigite seu post:");
    return;
  }

  // Receive post content
  if (session.state === "social_create_post") {
    const content = action.trim();
    if (content.length < 2) {
      await whatsapp.sendText(phone, "Post muito curto. Escreva algo mais:");
      return;
    }

    // Handle image posts
    let imageUrl: string | undefined;
    if (message.image?.url) {
      imageUrl = message.image.url;
    }

    await db.insert(posts).values({
      authorId: userId,
      content,
      images: imageUrl ? [imageUrl] : [],
    });

    sessionManager.resetToMenu(phone);

    await whatsapp.sendButtons(phone, "Post publicado!\n\nSeu post ja esta no feed.", [
      { id: "social_feed", title: "Ver feed" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Trending
  if (action === "social_trending") {
    const trendingPosts = await db
      .select({
        postId: likes.postId,
        count: sql<number>`count(*)`,
      })
      .from(likes)
      .groupBy(likes.postId)
      .orderBy(sql`count(*) DESC`)
      .limit(5);

    if (trendingPosts.length === 0) {
      await whatsapp.sendButtons(phone, "Nenhum post em alta ainda.", [
        { id: "social_feed", title: "Ver feed" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    let text = "*EM ALTA*\n\n";

    for (const tp of trendingPosts) {
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, tp.postId),
        with: { author: { columns: { name: true } } },
      });

      if (post) {
        text += `*${post.author?.name ?? ""}* (${tp.count} curtidas)\n`;
        text += `${post.content?.substring(0, 100) ?? ""}\n\n`;
      }
    }

    await whatsapp.sendButtons(phone, text, [
      { id: "social_feed", title: "Ver feed" },
      { id: "social_post", title: "Criar post" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Default
  await whatsapp.sendMessage(phone, menus.socialMenu());
}
