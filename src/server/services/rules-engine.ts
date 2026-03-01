export interface SportRuleTemplate {
  sportSlug: string;
  sportName: string;
  defaultRules: RuleSet;
}

export interface RuleSet {
  matchDuration: string;
  scoring: string;
  players: string;
  equipment: string;
  general: string[];
}

const ruleTemplates: Record<string, RuleSet> = {
  "futebol": {
    matchDuration: "2 tempos de 45 minutos",
    scoring: "Gols",
    players: "11 jogadores por time",
    equipment: "Bola oficial, chuteiras, caneleiras",
    general: [
      "Impedimento conforme regras da FIFA",
      "Cartao amarelo para faltas moderadas",
      "Cartao vermelho para faltas graves ou duplo amarelo",
      "Substituicoes permitidas conforme regulamento do torneio",
      "Empate pode ir para prorrogacao e penaltis em fases eliminatorias",
    ],
  },
  "beach-tennis": {
    matchDuration: "Melhor de 3 sets",
    scoring: "Sets de 6 games com tiebreak em 6x6",
    players: "Duplas (2 jogadores por lado)",
    equipment: "Raquete de beach tennis, bola oficial",
    general: [
      "Saque por baixo",
      "Quadra de areia com rede",
      "Sem let no saque",
      "Ponto por toque na rede durante jogada",
      "Super tiebreak no terceiro set (primeiro a 10 pontos)",
    ],
  },
  "padel": {
    matchDuration: "Melhor de 3 sets",
    scoring: "Sets de 6 games com tiebreak em 6x6",
    players: "Duplas (2 jogadores por lado)",
    equipment: "Raquete de padel, bola oficial",
    general: [
      "Saque por baixo abaixo da cintura",
      "Bola pode ser jogada nas paredes de vidro",
      "Servico cruzado obrigatorio",
      "Pontuacao igual ao tenis (15, 30, 40, game)",
      "Vantagem (deuce) em 40x40",
    ],
  },
  "volei": {
    matchDuration: "Melhor de 5 sets (3 sets para vencer)",
    scoring: "Sets de 25 pontos (15 no tie-break/5o set)",
    players: "6 jogadores por time",
    equipment: "Bola oficial de volei",
    general: [
      "3 toques por equipe",
      "Rodizio de posicoes",
      "Bloqueio nao conta como toque",
      "Set vencido com 2 pontos de diferenca minima",
      "Substituicoes conforme regulamento",
    ],
  },
  "basquete": {
    matchDuration: "4 quartos de 10 minutos (FIBA) ou 12 minutos (NBA)",
    scoring: "Cestas de 2 e 3 pontos, lance livre 1 ponto",
    players: "5 jogadores por time",
    equipment: "Bola oficial de basquete",
    general: [
      "24 segundos para atacar",
      "5 faltas pessoais eliminam o jogador",
      "Prorrogacao de 5 minutos em caso de empate",
      "Substituicoes ilimitadas",
      "Regra de 3 segundos no garrafao",
    ],
  },
  "tenis": {
    matchDuration: "Melhor de 3 ou 5 sets",
    scoring: "Sets de 6 games, tiebreak em 6x6",
    players: "1 jogador por lado (simples) ou 2 (duplas)",
    equipment: "Raquete de tenis, bolas oficiais",
    general: [
      "Servico alternado a cada game",
      "Let no saque: servico repetido",
      "Hawk-eye disponivel em torneios oficiais",
      "Pontuacao: 15, 30, 40, game",
      "Deuce em 40x40, vantagem necessaria",
    ],
  },
  "jiu-jitsu": {
    matchDuration: "5 a 10 minutos conforme faixa",
    scoring: "Pontos por posicao e finalizacao",
    players: "1 x 1",
    equipment: "Kimono (gi) ou sem kimono (no-gi)",
    general: [
      "Vitoria por finalizacao encerra a luta imediatamente",
      "Pontos: montada (4), costas (4), passagem de guarda (3), raspagem (2), queda (2)",
      "Vantagens em caso de empate em pontos",
      "Faixas: branca, azul, roxa, marrom, preta",
      "Divisao por peso obrigatoria",
    ],
  },
  "crossfit": {
    matchDuration: "Conforme WOD (Workout of the Day)",
    scoring: "Tempo, repeticoes ou carga",
    players: "Individual ou equipes",
    equipment: "Barra olimpica, kettlebells, corda, box",
    general: [
      "Padroes de movimento devem ser cumpridos",
      "Juiz valida cada repeticao",
      "No rep para movimentos fora do padrao",
      "Escala disponivel para atletas iniciantes",
      "Ranking por tempo ou numero de repeticoes",
    ],
  },
  "league-of-legends": {
    matchDuration: "Melhor de 1, 3 ou 5 partidas",
    scoring: "Destruir o Nexus inimigo",
    players: "5 jogadores por time",
    equipment: "PC com especificacoes minimas, conta ativa",
    general: [
      "Pick e ban de campeoes antes de cada partida",
      "Fase de lanes: top, jungle, mid, adc, support",
      "Pausa permitida em caso de problemas tecnicos",
      "Uso de programas externos proibido",
      "Comunicacao via voice chat permitida entre o time",
    ],
  },
  "counter-strike": {
    matchDuration: "Melhor de 30 rounds (MR15) ou MR12",
    scoring: "16 rounds para vencer (MR15) ou 13 (MR12)",
    players: "5 jogadores por time",
    equipment: "PC com especificacoes minimas, conta ativa",
    general: [
      "Troca de lados ao meio da partida",
      "Economia de dinheiro para compra de armas",
      "Overtime em caso de empate",
      "Anti-cheat obrigatorio",
      "Pausa tatica limitada por mapa",
    ],
  },
  "valorant": {
    matchDuration: "Melhor de 25 rounds (primeiro a 13)",
    scoring: "13 rounds para vencer",
    players: "5 jogadores por time",
    equipment: "PC com especificacoes minimas, conta ativa",
    general: [
      "Selecao de agentes antes da partida",
      "Troca de lados apos 12 rounds",
      "Habilidades unicas por agente",
      "Overtime em caso de empate 12x12",
      "Anti-cheat Vanguard obrigatorio",
    ],
  },
  "truco": {
    matchDuration: "Primeiro a 12 pontos",
    scoring: "Pontos por rodada (1, 3, 6, 9, 12)",
    players: "2 a 4 jogadores (duplas ou individual)",
    equipment: "Baralho espanhol (40 cartas)",
    general: [
      "Truco pode ser pedido a qualquer momento da rodada",
      "Ordem das cartas: Zap, Copas, Espadilha, Ouros, Manilhas",
      "Esconder carta e blefar faz parte do jogo",
      "Envido em algumas variantes regionais",
      "Mao de ferro: jogar sem ver as cartas",
    ],
  },
  "poker": {
    matchDuration: "Conforme formato (torneio ou cash game)",
    scoring: "Fichas acumuladas ou eliminacao",
    players: "2 a 10 jogadores por mesa",
    equipment: "Baralho ingles (52 cartas), fichas",
    general: [
      "Texas Hold'em como formato principal",
      "Blinds crescentes em torneios",
      "Royal flush e a maior mao",
      "All-in permitido a qualquer momento",
      "Dealer rotativo no sentido horario",
    ],
  },
  "xadrez": {
    matchDuration: "Conforme formato: rapido, blitz ou classico",
    scoring: "Xeque-mate, empate ou tempo esgotado",
    players: "1 x 1",
    equipment: "Tabuleiro e pecas oficiais, relogio",
    general: [
      "Brancas sempre iniciam a partida",
      "Roque permitido se rei e torre nao se moveram",
      "En passant para peoes",
      "Promocao de peao ao chegar na ultima fileira",
      "Empate por afogamento, repeticao ou regra dos 50 movimentos",
    ],
  },
};

/**
 * Get the default rule template for a sport
 */
export function getRuleTemplate(sportSlug: string): RuleSet | null {
  return ruleTemplates[sportSlug] ?? null;
}

/**
 * Get all available rule templates
 */
export function getAllRuleTemplates(): { slug: string; name: string }[] {
  return Object.keys(ruleTemplates).map((slug) => ({
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  }));
}

/**
 * Format a RuleSet into readable text for the tournament rules field
 */
export function formatRulesAsText(rules: RuleSet): string {
  const lines: string[] = [];
  lines.push(`Duracao: ${rules.matchDuration}`);
  lines.push(`Pontuacao: ${rules.scoring}`);
  lines.push(`Jogadores: ${rules.players}`);
  lines.push(`Equipamento: ${rules.equipment}`);
  lines.push("");
  lines.push("Regras gerais:");
  rules.general.forEach((rule, i) => {
    lines.push(`${i + 1}. ${rule}`);
  });
  return lines.join("\n");
}
