// Menu templates for WhatsApp bot
import type { OutgoingMessage } from "../types";

export const menus = {
  // ==================== MAIN MENU ====================
  mainMenu(): OutgoingMessage {
    return {
      type: "list",
      header: "SPORTIO",
      text: "O que voce quer fazer agora?",
      buttonText: "Ver opcoes",
      footer: "Digite 'ajuda' a qualquer momento",
      sections: [
        {
          title: "Competicoes",
          rows: [
            { id: "menu_tournaments", title: "Torneios", description: "Ver, criar ou se inscrever" },
            { id: "menu_challenges", title: "Desafios", description: "Desafiar ou aceitar duelos" },
            { id: "menu_bets", title: "Apostas", description: "Apostar em jogos e desafios" },
          ],
        },
        {
          title: "Social",
          rows: [
            { id: "menu_social", title: "Feed", description: "Ver e criar posts" },
            { id: "menu_leaderboard", title: "Ranking", description: "Ver melhores jogadores" },
            { id: "menu_notifications", title: "Notificacoes", description: "Ver suas notificacoes" },
          ],
        },
        {
          title: "Conta",
          rows: [
            { id: "menu_gcoins", title: "GCoins", description: "Saldo, comprar, transferir" },
            { id: "menu_profile", title: "Meu Perfil", description: "Ver e editar perfil" },
            { id: "menu_settings", title: "Configuracoes", description: "Preferencias e ajuda" },
          ],
        },
      ],
    };
  },

  // ==================== TOURNAMENTS ====================
  tournamentsMenu(): OutgoingMessage {
    return {
      type: "buttons",
      header: "TORNEIOS",
      text: "O que voce quer fazer?",
      footer: "Digite 'voltar' para o menu principal",
      buttons: [
        { id: "tournaments_list", title: "Ver torneios" },
        { id: "tournaments_mine", title: "Meus torneios" },
        { id: "tournaments_create", title: "Criar torneio" },
      ],
    };
  },

  tournamentDetail(t: {
    name: string;
    sportName: string;
    city?: string;
    date?: string;
    entryFee?: number;
    enrolled?: number;
    maxParticipants?: number;
    status: string;
    id: string;
  }): OutgoingMessage {
    const spotsText = t.maxParticipants
      ? `${t.enrolled ?? 0}/${t.maxParticipants} vagas`
      : `${t.enrolled ?? 0} inscritos`;

    const statusEmoji: Record<string, string> = {
      registration_open: "Inscricoes abertas",
      in_progress: "Em andamento",
      completed: "Finalizado",
      draft: "Rascunho",
      registration_closed: "Inscricoes fechadas",
      cancelled: "Cancelado",
    };

    let text = `*${t.name}*\n\n`;
    text += `Esporte: ${t.sportName}\n`;
    if (t.city) text += `Cidade: ${t.city}\n`;
    if (t.date) text += `Data: ${t.date}\n`;
    text += `Taxa: ${t.entryFee ? `${t.entryFee} GCoins` : "Gratis"}\n`;
    text += `Vagas: ${spotsText}\n`;
    text += `Status: ${statusEmoji[t.status] ?? t.status}`;

    const buttons: Array<{ id: string; title: string }> = [];
    if (t.status === "registration_open") {
      buttons.push({ id: `enroll_${t.id}`, title: "Inscrever-me" });
    }
    buttons.push({ id: `bet_tournament_${t.id}`, title: "Apostar" });
    buttons.push({ id: "menu_tournaments", title: "Voltar" });

    return { type: "buttons", text, buttons };
  },

  // ==================== BETTING ====================
  bettingMenu(): OutgoingMessage {
    return {
      type: "buttons",
      header: "APOSTAS",
      text: "Escolha uma opcao:",
      footer: "Apostas usam GCoins de gamificacao",
      buttons: [
        { id: "bets_open", title: "Apostas abertas" },
        { id: "bets_mine", title: "Minhas apostas" },
        { id: "bets_leaderboard", title: "Ranking apostas" },
      ],
    };
  },

  betDetail(bet: {
    matchDescription: string;
    odds: Record<string, number>;
    id: string;
    type: "tournament" | "challenge";
  }): OutgoingMessage {
    let text = `*${bet.matchDescription}*\n\nOdds:\n`;
    const entries = Object.entries(bet.odds);
    for (const [name, odd] of entries) {
      text += `  ${name}: ${odd.toFixed(2)}x\n`;
    }
    text += "\nEscolha em quem apostar:";

    const buttons = entries.slice(0, 3).map(([name], i) => ({
      id: `bet_on_${bet.id}_${i}`,
      title: name.substring(0, 20),
    }));

    return { type: "buttons", text, buttons };
  },

  betAmountPrompt(selection: string, odds: number): OutgoingMessage {
    return {
      type: "text",
      text: `Voce escolheu: *${selection}* (${odds.toFixed(2)}x)\n\nDigite a quantidade de GCoins que quer apostar:\n(ex: 50)`,
    };
  },

  // ==================== CHALLENGES ====================
  challengesMenu(): OutgoingMessage {
    return {
      type: "buttons",
      header: "DESAFIOS",
      text: "O que voce quer fazer?",
      buttons: [
        { id: "challenges_list", title: "Ver desafios" },
        { id: "challenges_create", title: "Criar desafio" },
        { id: "challenges_mine", title: "Meus desafios" },
      ],
    };
  },

  challengeInvite(challenge: {
    challengerName: string;
    sport: string;
    amount: number;
    location?: string;
    date?: string;
    id: string;
  }): OutgoingMessage {
    let text = `*DESAFIO!*\n\n`;
    text += `${challenge.challengerName} te desafiou!\n\n`;
    text += `Esporte: ${challenge.sport}\n`;
    text += `Aposta: ${challenge.amount} GCoins cada\n`;
    if (challenge.location) text += `Local: ${challenge.location}\n`;
    if (challenge.date) text += `Data: ${challenge.date}\n`;

    return {
      type: "buttons",
      text,
      buttons: [
        { id: `challenge_accept_${challenge.id}`, title: "Aceitar" },
        { id: `challenge_decline_${challenge.id}`, title: "Recusar" },
        { id: `challenge_negotiate_${challenge.id}`, title: "Negociar" },
      ],
    };
  },

  // ==================== GCOINS ====================
  gcoinsMenu(balanceReal: number, balanceGamification: number): OutgoingMessage {
    return {
      type: "buttons",
      header: "GCOINS",
      text:
        `Seu saldo:\n` +
        `  Reais: ${balanceReal.toFixed(2)} GCoins\n` +
        `  Gamificacao: ${balanceGamification.toFixed(2)} GCoins\n\n` +
        `Total: ${(balanceReal + balanceGamification).toFixed(2)} GCoins`,
      footer: "1 GCoin = R$0,10",
      buttons: [
        { id: "gcoins_buy", title: "Comprar GCoins" },
        { id: "gcoins_transfer", title: "Transferir" },
        { id: "gcoins_history", title: "Historico" },
      ],
    };
  },

  gcoinPackages(): OutgoingMessage {
    return {
      type: "list",
      header: "COMPRAR GCOINS",
      text: "Escolha um pacote:",
      buttonText: "Ver pacotes",
      footer: "Pagamento via PIX instantaneo",
      sections: [
        {
          title: "Pacotes de GCoins",
          rows: [
            { id: "buy_50", title: "50 GCoins - R$5,00", description: "Pacote basico" },
            { id: "buy_100", title: "100 GCoins - R$9,00", description: "10% de desconto!" },
            { id: "buy_250", title: "250 GCoins - R$20,00", description: "20% de desconto!" },
            { id: "buy_500", title: "500 GCoins - R$40,00", description: "20% de desconto!" },
            { id: "buy_1000", title: "1000 GCoins - R$75,00", description: "25% de desconto!" },
          ],
        },
      ],
    };
  },

  // ==================== SOCIAL ====================
  socialMenu(): OutgoingMessage {
    return {
      type: "buttons",
      header: "FEED SOCIAL",
      text: "O que voce quer fazer?",
      buttons: [
        { id: "social_feed", title: "Ver feed" },
        { id: "social_post", title: "Criar post" },
        { id: "social_trending", title: "Em alta" },
      ],
    };
  },

  // ==================== PROFILE ====================
  profileView(user: {
    name: string;
    city?: string;
    level: number;
    xp: number;
    roles: string[];
    sports: string[];
    gcoinsReal: number;
    gcoinsGamification: number;
    followersCount: number;
    followingCount: number;
  }): OutgoingMessage {
    let text = `*${user.name}*\n\n`;
    text += `Nivel: ${user.level} (${user.xp} XP)\n`;
    if (user.city) text += `Cidade: ${user.city}\n`;
    text += `Personas: ${user.roles.join(", ")}\n`;
    if (user.sports.length) text += `Esportes: ${user.sports.join(", ")}\n`;
    text += `\nSeguidores: ${user.followersCount}\n`;
    text += `Seguindo: ${user.followingCount}\n`;
    text += `\nGCoins: ${(user.gcoinsReal + user.gcoinsGamification).toFixed(2)}`;

    return {
      type: "buttons",
      text,
      buttons: [
        { id: "profile_edit", title: "Editar perfil" },
        { id: "profile_achievements", title: "Conquistas" },
        { id: "menu_main", title: "Menu principal" },
      ],
    };
  },

  // ==================== LEADERBOARD ====================
  leaderboardMenu(): OutgoingMessage {
    return {
      type: "buttons",
      header: "RANKING",
      text: "Qual ranking voce quer ver?",
      buttons: [
        { id: "leaderboard_xp", title: "Ranking XP" },
        { id: "leaderboard_bets", title: "Ranking apostas" },
        { id: "leaderboard_gcoins", title: "Ranking GCoins" },
      ],
    };
  },

  // ==================== ONBOARDING ====================
  welcome(): OutgoingMessage {
    return {
      type: "buttons",
      header: "BEM-VINDO AO SPORTIO!",
      text:
        "Fala, craque! Sou o Sportio Bot.\n\n" +
        "Aqui voce pode:\n" +
        "  Participar de torneios\n" +
        "  Desafiar amigos\n" +
        "  Apostar em jogos\n" +
        "  Ganhar GCoins\n\n" +
        "Vamos criar sua conta?",
      buttons: [
        { id: "onboarding_start", title: "Criar conta" },
        { id: "onboarding_login", title: "Ja tenho conta" },
        { id: "onboarding_info", title: "Saber mais" },
      ],
    };
  },

  askName(): OutgoingMessage {
    return {
      type: "text",
      text: "Qual e o seu nome completo?",
    };
  },

  askEmail(): OutgoingMessage {
    return {
      type: "text",
      text: "Qual e o seu email? (para login e recuperacao de conta)",
    };
  },

  askCity(): OutgoingMessage {
    return {
      type: "text",
      text: "Em qual cidade voce mora? (ex: Sao Paulo, Rio de Janeiro)",
    };
  },

  askRoles(): OutgoingMessage {
    return {
      type: "list",
      header: "SEU PERFIL",
      text: "O que voce e no mundo do esporte? (escolha a principal)",
      buttonText: "Escolher",
      sections: [
        {
          title: "Escolha seu perfil",
          rows: [
            { id: "role_athlete", title: "Atleta", description: "Pratico esportes" },
            { id: "role_organizer", title: "Organizador", description: "Organizo torneios e eventos" },
            { id: "role_brand", title: "Marca", description: "Patrocino e promovo" },
            { id: "role_trainer", title: "Treinador", description: "Treino atletas" },
            { id: "role_referee", title: "Arbitro", description: "Apito os jogos" },
            { id: "role_photographer", title: "Fotografo", description: "Registro os momentos" },
            { id: "role_arena_owner", title: "Dono de arena", description: "Tenho quadra/arena" },
          ],
        },
      ],
    };
  },

  askSports(): OutgoingMessage {
    return {
      type: "list",
      header: "ESPORTES",
      text: "Qual seu esporte principal?",
      buttonText: "Escolher esporte",
      sections: [
        {
          title: "Esportes populares",
          rows: [
            { id: "sport_beach_tennis", title: "Beach Tennis" },
            { id: "sport_padel", title: "Padel" },
            { id: "sport_tennis", title: "Tenis" },
            { id: "sport_futevolei", title: "Futevolei" },
            { id: "sport_futebol", title: "Futebol" },
            { id: "sport_volei", title: "Voleibol" },
            { id: "sport_basquete", title: "Basquete" },
            { id: "sport_corrida", title: "Corrida" },
            { id: "sport_natacao", title: "Natacao" },
            { id: "sport_crossfit", title: "CrossFit" },
          ],
        },
      ],
    };
  },

  onboardingComplete(name: string): OutgoingMessage {
    return {
      type: "buttons",
      header: "CONTA CRIADA!",
      text: `Bem-vindo ao Sportio, ${name}!\n\nSua conta foi criada com sucesso. Voce ja pode explorar tudo!`,
      buttons: [
        { id: "menu_tournaments", title: "Ver torneios" },
        { id: "menu_challenges", title: "Desafiar alguem" },
        { id: "menu_main", title: "Menu principal" },
      ],
    };
  },

  // ==================== NOTIFICATIONS ====================
  notificationsList(notifications: Array<{ title: string; message?: string; type: string; createdAt: string }>): OutgoingMessage {
    if (notifications.length === 0) {
      return {
        type: "buttons",
        text: "Voce nao tem notificacoes novas!",
        buttons: [{ id: "menu_main", title: "Menu principal" }],
      };
    }

    const typeEmoji: Record<string, string> = {
      tournament: "[Torneio]",
      match: "[Jogo]",
      gcoin: "[GCoin]",
      social: "[Social]",
      bet: "[Aposta]",
      chat: "[Chat]",
      system: "[Sistema]",
      challenge: "[Desafio]",
    };

    let text = "*NOTIFICACOES*\n\n";
    for (const n of notifications.slice(0, 10)) {
      text += `${typeEmoji[n.type] ?? ""} *${n.title}*\n`;
      if (n.message) text += `${n.message}\n`;
      text += `${n.createdAt}\n\n`;
    }

    return {
      type: "buttons",
      text,
      buttons: [
        { id: "notifications_mark_read", title: "Marcar como lidas" },
        { id: "menu_main", title: "Menu principal" },
      ],
    };
  },

  // ==================== HELP ====================
  helpMessage(): OutgoingMessage {
    return {
      type: "text",
      text:
        "*AJUDA - SPORTIO BOT*\n\n" +
        "Comandos rapidos:\n" +
        '  "menu" - Menu principal\n' +
        '  "torneios" - Ver torneios\n' +
        '  "apostas" - Ver apostas\n' +
        '  "desafio" - Criar desafio\n' +
        '  "saldo" - Ver saldo GCoins\n' +
        '  "perfil" - Seu perfil\n' +
        '  "ranking" - Leaderboards\n' +
        '  "ajuda" - Esta mensagem\n\n' +
        "Voce tambem pode escrever naturalmente!\n" +
        'Ex: "quero apostar 50 gcoins no joao"\n' +
        'Ex: "me inscreve no torneio de beach tennis"',
    };
  },

  // ==================== ERROR / GENERIC ====================
  unknownCommand(): OutgoingMessage {
    return {
      type: "buttons",
      text: "Nao entendi. Pode repetir ou escolher uma opcao:",
      buttons: [
        { id: "menu_main", title: "Menu principal" },
        { id: "menu_help", title: "Ajuda" },
      ],
    };
  },

  error(message?: string): OutgoingMessage {
    return {
      type: "text",
      text: `Ops! Algo deu errado${message ? `: ${message}` : ""}. Tente novamente ou digite "menu" para voltar ao inicio.`,
    };
  },

  confirmAction(text: string, confirmId: string, cancelId: string): OutgoingMessage {
    return {
      type: "buttons",
      text,
      buttons: [
        { id: confirmId, title: "Confirmar" },
        { id: cancelId, title: "Cancelar" },
      ],
    };
  },
};
