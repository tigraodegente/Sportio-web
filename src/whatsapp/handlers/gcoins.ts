// GCoins handler - balance, buy, transfer, history
import type { IncomingMessage } from "../types";
import { sessionManager } from "../services/session-manager";
import { whatsapp } from "../services/whatsapp-client";
import { menus } from "../services/menu-builder";
import { generatePixPayload } from "../services/pix-generator";
import { db } from "@/server/db";
import { users, gcoinTransactions } from "@/server/db/schema";
import { eq, desc, sql, ilike } from "drizzle-orm";

// GCoin packages
const PACKAGES: Record<string, { gcoins: number; priceInCents: number; label: string }> = {
  buy_50: { gcoins: 50, priceInCents: 500, label: "50 GCoins - R$5,00" },
  buy_100: { gcoins: 100, priceInCents: 900, label: "100 GCoins - R$9,00 (10% off)" },
  buy_250: { gcoins: 250, priceInCents: 2000, label: "250 GCoins - R$20,00 (20% off)" },
  buy_500: { gcoins: 500, priceInCents: 4000, label: "500 GCoins - R$40,00 (20% off)" },
  buy_1000: { gcoins: 1000, priceInCents: 7500, label: "1000 GCoins - R$75,00 (25% off)" },
};

export async function handleGCoins(
  phone: string,
  _message: IncomingMessage,
  action: string
): Promise<void> {
  const session = sessionManager.getSession(phone);
  const userId = session.userId!;

  // Show balance
  if (action === "show_balance" || action === "gcoins_balance") {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { gcoinsReal: true, gcoinsGamification: true },
    });

    const real = Number(user?.gcoinsReal ?? 0);
    const gamification = Number(user?.gcoinsGamification ?? 0);

    await whatsapp.sendMessage(phone, menus.gcoinsMenu(real, gamification));
    return;
  }

  // Buy GCoins - show packages
  if (action === "gcoins_buy") {
    await whatsapp.sendMessage(phone, menus.gcoinPackages());
    return;
  }

  // Select package
  if (action.startsWith("buy_")) {
    const pkg = PACKAGES[action];
    if (!pkg) {
      await whatsapp.sendText(phone, "Pacote invalido.");
      return;
    }

    sessionManager.setState(phone, "gcoins_buy", {
      package: action,
      gcoins: pkg.gcoins,
      priceInCents: pkg.priceInCents,
    });

    const priceFormatted = (pkg.priceInCents / 100).toFixed(2).replace(".", ",");

    // Generate PIX
    const pixPayload = generatePixPayload({
      amount: pkg.priceInCents / 100,
      description: `Sportio ${pkg.gcoins} GCoins`,
      txId: `SP${userId.substring(0, 8)}${Date.now()}`,
    });

    let text = `*COMPRAR ${pkg.gcoins} GCOINS*\n\n`;
    text += `Valor: R$${priceFormatted}\n\n`;
    text += `Pague via PIX:\n\n`;
    text += `Chave PIX (copia e cola):\n`;
    text += `\`${pixPayload}\`\n\n`;
    text += `Apos o pagamento, seus GCoins serao creditados automaticamente!\n\n`;
    text += `Valido por 30 minutos.`;

    await whatsapp.sendButtons(phone, text, [
      { id: "gcoins_confirm_payment", title: "Ja paguei!" },
      { id: "gcoins_buy", title: "Outro pacote" },
      { id: "menu_main", title: "Cancelar" },
    ]);
    return;
  }

  // Confirm payment (in production, this would check with PIX provider)
  if (action === "gcoins_confirm_payment") {
    const data = session.stateData;
    const gcoins = (data.gcoins as number) ?? 0;

    if (gcoins <= 0) {
      await whatsapp.sendText(phone, "Nenhuma compra pendente.");
      return;
    }

    // In production: verify PIX payment via webhook
    // For now: credit GCoins (simulated confirmation)
    await db
      .update(users)
      .set({ gcoinsReal: sql`${users.gcoinsReal} + ${gcoins}` })
      .where(eq(users.id, userId));

    await db.insert(gcoinTransactions).values({
      userId,
      type: "real",
      category: "purchase",
      amount: gcoins.toString(),
      description: `Compra: ${gcoins} GCoins via PIX`,
    });

    sessionManager.resetToMenu(phone);

    await whatsapp.sendButtons(
      phone,
      `Pagamento confirmado!\n\n+${gcoins} GCoins adicionados ao seu saldo.\n\nObrigado!`,
      [
        { id: "gcoins_balance", title: "Ver saldo" },
        { id: "menu_main", title: "Menu principal" },
      ]
    );
    return;
  }

  // Transfer GCoins
  if (action === "gcoins_transfer") {
    sessionManager.setState(phone, "gcoins_transfer", { step: "recipient" });
    await whatsapp.sendText(phone, "Para quem voce quer transferir?\n\nDigite o nome ou numero do usuario:");
    return;
  }

  if (session.state === "gcoins_transfer") {
    const data = session.stateData;
    const step = data.step as string;

    if (step === "recipient") {
      const searchTerm = action.trim();

      // Search by name or phone
      const recipients = await db.query.users.findMany({
        where: ilike(users.name, `%${searchTerm}%`),
        columns: { id: true, name: true, city: true },
        limit: 5,
      });

      if (recipients.length === 0) {
        await whatsapp.sendButtons(phone, "Nenhum usuario encontrado.", [
          { id: "gcoins_transfer", title: "Tentar de novo" },
          { id: "menu_main", title: "Voltar" },
        ]);
        return;
      }

      if (recipients.length === 1) {
        sessionManager.updateData(phone, {
          recipientId: recipients[0]!.id,
          recipientName: recipients[0]!.name,
          step: "amount",
        });
        await whatsapp.sendText(
          phone,
          `Transferir para *${recipients[0]!.name}*\n\nQuantos GCoins? (digite o valor)`
        );
        return;
      }

      const rows = recipients.map((r) => ({
        id: `transfer_to_${r.id}`,
        title: r.name.substring(0, 24),
        description: r.city ?? "",
      }));

      sessionManager.updateData(phone, { step: "select_recipient" });

      await whatsapp.sendList(
        phone,
        "Escolha o destinatario:",
        "Escolher",
        [{ title: "Usuarios", rows }]
      );
      return;
    }

    if (step === "select_recipient" && action.startsWith("transfer_to_")) {
      const recipientId = action.replace("transfer_to_", "");
      const recipient = await db.query.users.findFirst({
        where: eq(users.id, recipientId),
        columns: { id: true, name: true },
      });

      if (!recipient) {
        await whatsapp.sendText(phone, "Usuario nao encontrado.");
        return;
      }

      sessionManager.updateData(phone, {
        recipientId: recipient.id,
        recipientName: recipient.name,
        step: "amount",
      });
      await whatsapp.sendText(phone, `Transferir para *${recipient.name}*\n\nQuantos GCoins?`);
      return;
    }

    if (step === "amount") {
      const amount = parseInt(action.trim());
      if (isNaN(amount) || amount <= 0) {
        await whatsapp.sendText(phone, "Digite um valor valido.");
        return;
      }

      // Check balance
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { gcoinsGamification: true },
      });

      if (Number(user?.gcoinsGamification ?? 0) < amount) {
        await whatsapp.sendButtons(phone, "Saldo insuficiente!", [
          { id: "gcoins_buy", title: "Comprar GCoins" },
          { id: "menu_main", title: "Voltar" },
        ]);
        return;
      }

      sessionManager.updateData(phone, { amount, step: "confirm" });
      await whatsapp.sendMessage(
        phone,
        menus.confirmAction(
          `Transferir *${amount} GCoins* para *${data.recipientName}*?\n\n(Taxa: 0 GCoins)`,
          "transfer_confirm",
          "transfer_cancel"
        )
      );
      return;
    }
  }

  // Confirm transfer
  if (action === "transfer_confirm") {
    const data = session.stateData;
    const amount = data.amount as number;
    const recipientId = data.recipientId as string;
    const recipientName = data.recipientName as string;

    // Deduct from sender
    await db
      .update(users)
      .set({ gcoinsGamification: sql`${users.gcoinsGamification} - ${amount}` })
      .where(eq(users.id, userId));

    // Add to recipient
    await db
      .update(users)
      .set({ gcoinsGamification: sql`${users.gcoinsGamification} + ${amount}` })
      .where(eq(users.id, recipientId));

    // Record transactions
    await db.insert(gcoinTransactions).values([
      {
        userId,
        type: "gamification",
        category: "transfer",
        amount: (-amount).toString(),
        description: `Transferencia para ${recipientName}`,
      },
      {
        userId: recipientId,
        type: "gamification",
        category: "transfer",
        amount: amount.toString(),
        description: `Transferencia recebida`,
      },
    ]);

    sessionManager.resetToMenu(phone);

    await whatsapp.sendButtons(
      phone,
      `Transferencia realizada!\n\n${amount} GCoins enviados para *${recipientName}*.`,
      [
        { id: "gcoins_balance", title: "Ver saldo" },
        { id: "menu_main", title: "Menu principal" },
      ]
    );

    // Notify recipient
    const recipient = await db.query.users.findFirst({
      where: eq(users.id, recipientId),
      columns: { phone: true },
    });

    if (recipient?.phone) {
      const sender = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { name: true },
      });
      await whatsapp.sendText(
        recipient.phone,
        `Voce recebeu *${amount} GCoins* de ${sender?.name ?? "alguem"}!`
      );
    }
    return;
  }

  if (action === "transfer_cancel") {
    sessionManager.resetToMenu(phone);
    await whatsapp.sendText(phone, "Transferencia cancelada.");
    await whatsapp.sendMessage(phone, menus.mainMenu());
    return;
  }

  // Transaction history
  if (action === "gcoins_history") {
    const transactions = await db.query.gcoinTransactions.findMany({
      where: eq(gcoinTransactions.userId, userId),
      orderBy: [desc(gcoinTransactions.createdAt)],
      limit: 15,
    });

    if (transactions.length === 0) {
      await whatsapp.sendButtons(phone, "Nenhuma transacao ainda.", [
        { id: "gcoins_buy", title: "Comprar GCoins" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    let text = "*HISTORICO DE GCOINS*\n\n";
    for (const tx of transactions) {
      const amount = Number(tx.amount);
      const sign = amount >= 0 ? "+" : "";
      text += `${sign}${amount.toFixed(0)} GC | ${tx.description ?? tx.category}\n`;
    }

    await whatsapp.sendButtons(phone, text, [
      { id: "gcoins_balance", title: "Ver saldo" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Default
  await handleGCoins(phone, _message, "show_balance");
}
