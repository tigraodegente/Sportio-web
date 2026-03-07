# UI/UX Research: Platform Benchmarks & Design Patterns

> Pesquisa detalhada de plataformas de referencia para inspiracao de UI/UX do Sportio.
> Data: 2026-03-07

---

## 1. Strava - Perfil de Atleta & Social Fitness

### 1.1 Perfil do Atleta
- **Estrutura do Perfil**: Exibe foto, localizacao, clube principal, status de subscriber (badge visual). Calendario de atividades mostra semana a semana quantas atividades foram registradas, dias ativos e tempo total.
- **Trophy Case**: Area dedicada a troféus e conquistas recentes, com abas para ver lista completa de seguidores, KOMs/CRs (King/Queen of the Mountain, Course Records).
- **Pro Athlete Status**: Badge especial para atletas profissionais verificados - diferenciacao visual clara.
- **Stats Dashboard**: Estatisticas de distancia, elevacao, tempo, pace medio. Visualizacao por semana/mes/ano.

### 1.2 Social Features
- **Kudos**: Equivalente a "curtida" mas especifico para atividades atleticas. Pesquisa mostra que corredores que recebem kudos correm mais e com mais frequencia (social proof comprovado).
- **Activity Feed**: Feed cronologico mostrando atividades dos seguidos. Deteccao automatica de atividades em grupo (mesmo horario + rota = atividades linkadas).
- **Comentarios**: Em atividades, conquistas, completions de challenges, corridas e metas.
- **Flyby**: Ferramenta que reproduz a atividade no mapa com timeline, mostrando quem voce cruzou durante o exercicio. Otimo para eventos em grupo.
- **Clubs**: Grupos com league tables (ranking de membros por distancia, velocidade). Feed proprio do clube.

### 1.3 Gamificacao & Achievements
- **Segments**: Trechos GPS de rota que qualquer usuario pode criar. Leaderboard automatico de todos que passaram pelo trecho.
- **KOM/QOM/CR Crowns**: Coroas visuais para o mais rapido em cada segmento. Status altamente desejado.
- **Local Legend**: Badge para quem mais completou um segmento nos ultimos 90 dias (frequencia, nao velocidade).
- **Challenges**: Duram 1 dia a 1 mes. Podem ser individuais ou em grupo. Metas de distancia, elevacao, tempo ou dias ativos.
- **Year in Sport**: Experiencia animada personalizada com dados do ano, altamente compartilhavel em redes sociais.

### 1.4 Monetizacao
- **Freemium Model**: Gratis com features basicas. Strava Summit/Subscription ($11.99/mes) desbloqueia leaderboards completos, filtros avancados, analises detalhadas, rotas, Beacon (seguranca).
- **Filtros de Leaderboard** (paywall): Ver por dia/semana/mes/ano, faixa etaria, peso - apenas subscribers.
- **Segment Analysis** (paywall): Analise detalhada de performance em segmentos.

### 1.5 Padroes-Chave para Sportio
| Padrao | Aplicacao Sportio |
|--------|-------------------|
| Kudos (reacao rapida) | "Torcida" em conquistas de atletas |
| Segments + Leaderboards | Rankings por modalidade/regiao |
| Local Legend (frequencia > velocidade) | Badge para jogadores mais assíduos em arenas |
| Year in Sport (shareable recap) | Retrospectiva anual do atleta |
| Club feed + rankings | Feed de equipes/academias |
| Trophy Case | Vitrine de conquistas no perfil |

---

## 2. FanDuel / DraftKings - Betting Interface

### 2.1 Filosofia de Design
- **FanDuel**: Design limpo, moderno, paleta suave. Prioriza simplicidade e velocidade. Melhor para usuarios casuais e live betting. Layout streamlined com menus minimalistas.
- **DraftKings**: Design mais carregado com cores fortes e alto contraste. Mais profundidade funcional. Prioriza sharp bettors com mais opcoes de customizacao.

### 2.2 Interface de Apostas
- **Odds Display**: Formato americano (+150, -200) ou decimal. Cores indicam favorito vs underdog. Updates em real-time com flash visual quando odd muda.
- **Bet Slip**: Panel lateral (desktop) ou drawer inferior (mobile). Adiciona apostas com 1 clique. Mostra potencial de ganho atualizado em tempo real.
- **Same Game Parlay (SGP)**: Tab dedicada no topo da pagina do jogo. Permite combinar multiplas apostas do mesmo jogo. Odds combinadas atualizadas automaticamente.
- **SGPx (DraftKings) / SGP+ (FanDuel)**: Permite combinar SGPs de jogos diferentes + apostas simples em um mega bet slip.
- **Progressive Parlays (DraftKings)**: Payout parcial mesmo que nem todas as legs acertem.

### 2.3 Live Betting
- **FanDuel**: Interface com color-coded line movement. Feature "Live Now" com navegacao rapida. Odds com refresh ultra-rapido. Same-game parlays disponíveis durante o jogo.
- **DraftKings**: Live stat tracking integrado. Mais props in-play. Micro-betting (apostas dentro de uma jogada). Flash bets com odds dinamicos.
- **Visual Feedback**: Setas verde/vermelha indicando movimento de odds. Animacoes sutis quando odds mudam. Lock icon quando mercado esta suspenso.

### 2.4 Monetizacao
- **Rake/Vig**: Margem embutida nas odds (tipicamente 4-5% por mercado).
- **Promotions**: Free bets, boost de odds, cashback em perdas. Design agressivo com banners coloridos.
- **VIP/Rewards Programs**: Pontos por aposta colocada. Tiers com beneficios crescentes.

### 2.5 Padroes-Chave para Sportio
| Padrao | Aplicacao Sportio |
|--------|-------------------|
| Bet slip drawer (mobile) | Cupom de aposta como drawer inferior |
| 1-click add to bet slip | Adicionar aposta com toque rapido nas odds |
| Real-time odds flash | Animacao quando odds mudam ao vivo |
| SGP builder | Construtor de apostas combinadas |
| Live stat tracking | Estatisticas ao vivo integradas na tela de apostas |
| Color-coded movement | Verde/vermelho para indicar direcao de odds |

---

## 3. Patreon - Paginas de Criador & Tiers

### 3.1 Creator Page Design
- **Layout**: Foco no conteudo criativo (posts em destaque, header, visuais-chave). Tiers NAO aparecem na pagina principal - ficam em "Membership Options" acessivel por clique.
- **Hierarquia Visual**: Hero com imagem/video do criador > About section > Posts recentes > CTA para assinar.
- **Copy Strategy**: "Acesso" supera "apoio" - posicionar como algo que o fa GANHA, nao algo que ele DA. Exclusividade e pertencimento vendem mais que caridade.

### 3.2 Sistema de Tiers
- **Estrutura 3 Tiers** (recomendada):
  - **Base ($3-5/mes)**: Acesso a comunidade, posts exclusivos basicos, badge de supporter.
  - **Mid ($7-12/mes)**: Tudo do base + conteudo premium, early access, Q&As.
  - **Premium ($20-30/mes)**: Tudo do mid + conteudo exclusivo, shoutouts, acesso direto ao criador.
- **Valor Progressivo**: Diferenca de valor entre tiers deve ser clara e proporcional. Se tier de $10 oferece o dobro do tier de $5, upgrade é natural.
- **One-off Products**: Patreon agora permite vender produtos digitais avulsos ALEM de subscriptions. Nem todo fa quer subscription mensal.

### 3.3 Engajamento
- **Posts Gated**: Criador escolhe quais posts sao free vs paid. Titulo e preview do post gated aparecem para todos (gera FOMO).
- **Community Tab**: Espaco de interacao entre subscribers do mesmo tier.
- **DMs para Tiers Premium**: Acesso direto ao criador como beneficio do tier mais alto.
- **Polls & Behind-the-scenes**: Conteudo que faz o fa se sentir "insider".

### 3.4 Monetizacao
- **Plataforma**: 5-12% de taxa dependendo do plano do criador.
- **Billing**: Mensal ou por criacao (cada post publicado gera cobranca).
- **Gift Memberships**: Fas podem presentear outros com memberships.

### 3.5 Padroes-Chave para Sportio
| Padrao | Aplicacao Sportio |
|--------|-------------------|
| Tiers 3 niveis | Bronze/Prata/Ouro para acesso a conteudo de atleta |
| Gated content preview | Preview de treinos/videos com blur + CTA "Assinar para ver" |
| Copy de "acesso" vs "apoio" | "Tenha acesso exclusivo" vs "Apoie o atleta" |
| One-off products | Venda avulsa de rotinas de treino, replays |
| Community tier-based | Chat exclusivo por nivel de assinatura |

---

## 4. Twitch - Presentes, Bits & Engajamento

### 4.1 Bits (Virtual Currency)
- **Compra**: Usuarios compram Bits com dinheiro real (100 bits ~ $1.40).
- **Uso em Chat**: Cheer com bits = mensagem destacada no chat com emotes animados. Quanto mais bits, mais elaborada a animacao.
- **Leaderboard de Bits**: Top cheerers aparecem em destaque no canal.

### 4.2 Power-ups (Lancado Jun/2024)
- **Message Effects**: Usuarios pagam bits para efeitos visuais nas mensagens do chat.
- **On-screen Celebration**: Animacao que aparece na transmissao ao vivo.
- **Gigantify Emote**: Emote ampliado que domina a tela momentaneamente.
- **Custom Power-ups (2025)**: Streamers criam seus proprios power-ups personalizados.
- **Revenue**: Cada power-up gera receita pequena para o streamer.

### 4.3 Hype Train
- **Trigger**: Ativado automaticamente quando ha pico de atividade (bits + subs) de diferentes viewers em curto periodo.
- **Mecanica**: Hype-o-Meter com barra de progresso. Timer de 5 minutos. Se barra enche, sobe de nivel, timer reseta, meta aumenta.
- **Acoes maiores = mais impacto**: Gift de 25 subs enche mais que 1 sub. Proporção visual clara.
- **Recompensas**: Emotes exclusivos de Hype Train usaveis por 24h em TODOS os canais do Twitch.
- **Shared Hype Trains (2025)**: Para colaboracoes entre streamers.

### 4.4 Channel Points
- **Acumulo**: Assistir stream, seguir, assinar, giftar subs, raid.
- **Redemptions populares**: Mensagem destacada no chat, sub gifted, status VIP, desafios para o streamer.
- **Predictions**: Viewers apostam channel points em outcomes durante a stream.
- **Polls**: Votacoes usando channel points.

### 4.5 Gifted Subs
- **Mecânica**: Viewer compra subscription para outro viewer aleatorio ou especifico.
- **Animacao**: Notificacao visual na stream + chat. Quanto mais subs giftados, mais impactante a animacao.
- **Social Proof**: "X giftou 50 subs!" gera cascade de mais gifts.

### 4.6 Padroes-Chave para Sportio
| Padrao | Aplicacao Sportio |
|--------|-------------------|
| Bits/Cheers com animacao | GCoins com efeitos visuais ao apoiar atleta ao vivo |
| Hype Train | "Onda de Apoio" durante jogos ao vivo - barra de progresso coletiva |
| Power-ups personalizados | Atletas criam efeitos customizados para seus fas |
| Channel Points predictions | Fas apostam GCoins em resultados durante partidas ao vivo |
| Gifted subs (cascade) | Gift de assinatura para outro fa - social proof |
| Leaderboard de supporters | Top apoiadores em destaque no perfil do atleta |

---

## 5. Cameo - Shoutouts & Fan Interaction

### 5.1 Request Flow
1. **Browse/Search**: Busca por celebridade. Filtros por categoria, preco, tempo de resposta.
2. **Perfil do Talento**: Video intro, rating, reviews, preco, tempo medio de entrega, tags.
3. **Request Form**: Campos: Para quem? Ocasiao? Instrucoes especificas para o video.
4. **Pagamento**: Preco fixo por celebridade (varia de $20 a $1000+). Rush delivery opcional.
5. **Entrega**: Video de 30-90 segundos. Entrega em até 7 dias (rush: 24h).
6. **Tip/Review**: Fan pode dar tip opcional apos receber. Sistema de reviews com estrelas.

### 5.2 Pricing Model
- **Celebridade define preco**: Total autonomia. Pode ajustar a qualquer momento.
- **Platform Fee**: 25% retido pela Cameo. Criador recebe 75%.
- **Rush Delivery**: Margem adicional para Cameo.
- **Tips**: 100% para o criador (sem taxa).

### 5.3 Opcoes Adicionais
- **Cameo Calls**: Zoom calls ao vivo agendadas (premium, precos mais altos).
- **Business Cameo**: Marcas contratam celebridades para conteudo promocional.
- **Gift**: Comprar shoutout como presente para outra pessoa.

### 5.4 UX que Funciona
- **Preco visivel no card**: Sem surpresas, decisao rapida.
- **Social Proof**: Numero de reviews + rating + "X pedidos completados".
- **Response Rate/Time**: Metrica visivel de confiabilidade.
- **Video Preview**: Mostrar tipo de conteudo que o talento produz antes de comprar.

### 5.5 Padroes-Chave para Sportio
| Padrao | Aplicacao Sportio |
|--------|-------------------|
| Request flow guiado | "Pedir video motivacional" ou "mensagem personalizada" do atleta |
| Preco visivel no card | Card de atleta mostra preco de shoutout direto |
| Rush delivery | Opcao express com markup |
| Cameo Calls = calls ao vivo | Sessoes de treino/mentoria ao vivo |
| Social proof (reviews + count) | Avaliacoes + numero de interacoes |
| Gift shoutouts | Presente de shoutout para amigo |

---

## 6. Sofascore / FlashScore - Live Scores & Match Tracking

### 6.1 UI de Live Scores
- **Minimalismo Funcional**: Interface limpa onde numeros, fatos e updates ao vivo se combinam de forma intuitiva. Light + Dark modes.
- **Real-time Updates**: JSON diffs (nao paginas completas). Latencia minima. Animacoes sutis quando placar muda.
- **Cores por Status**: Ao vivo (vermelho pulsante), Encerrado (cinza), Em breve (azul). Cada status tem identidade visual imediata.

### 6.2 Match Tracking
- **Attack Momentum Graph**: Grafico unico que mostra dinamica e intensidade de pressao de cada time ao longo do jogo. Conta a "historia da partida" visualmente.
- **Heatmaps**: Mapa de calor interativo mostrando areas de atuacao de jogadores. Destaque visual nos pontos de acao.
- **Player Ratings**: Algoritmo complexo baseado em 300+ estatisticas. Escala 1-10. Rating de match individual para cada jogador.
- **Shotmaps**: Mapa de posicao dos chutes com indicacao de gol/defesa/fora.
- **Box Score**: Estatisticas completas em formato tabular.

### 6.3 Tournament Brackets (Torneo by Sofascore)
- **Formatos**: Single-elimination, double-elimination, round-robin, two-stage, home-and-away, best-of-series.
- **Bracket Visual**: Completamente customizavel. Preview do layout antes de salvar.
- **Standings**: Tabelas de classificacao em tempo real com criterios de desempate configuraveis.
- **Push Notifications**: Por time favorito, por competicao, por tipo de evento.

### 6.4 Personalizacao
- **Times Favoritos**: Star/pin times para acesso rapido.
- **Filtros por Esporte**: Navegacao por tab entre esportes.
- **Notificacoes**: Granulares (gol, cartao vermelho, inicio/fim de jogo).
- **Odds Overlay**: Odds de apostas integradas na interface de score (parcerias com casas de aposta).

### 6.5 Padroes-Chave para Sportio
| Padrao | Aplicacao Sportio |
|--------|-------------------|
| Attack Momentum graph | Momentum de partida ao vivo (beach tennis, futebol) |
| Player Ratings 1-10 | Rating pos-jogo para jogadores |
| Heatmaps | Posicionamento em quadra (padel, beach tennis) |
| Status color-coding | Vermelho=ao vivo, Azul=proximo, Cinza=encerrado |
| Torneo bracket builder | Chave de torneios customizavel |
| Push notifications granulares | Notificacoes por atleta/torneio/tipo de evento |
| Odds overlay | Odds integradas no placar ao vivo |

---

## 7. LetzPlay - Tournament Management (Beach Tennis Brasil)

### 7.1 Features Principais
- **Ranking System**: Rankings por modalidade (beach tennis, tennis, padel). Pontuacao acumulada por torneios.
- **Tournament Management**: Criacao de torneios com chaves automaticas, categorias (amador A/B/C, pro), genero.
- **Court Booking**: Busca de quadras proximas, reserva online, horarios disponíveis.
- **Match Registration**: Jogadores registram resultados dos jogos diretamente no app.

### 7.2 Player Features
- **Head-to-Head (H2H)**: Comparacao direta entre dois jogadores - historico de confrontos.
- **Performance Dashboard**: Painel com estatisticas de evolucao, vitorias/derrotas, rankings por periodo.
- **Match History**: Historico completo de jogos com detalhes.
- **Brazil Beach Tennis Tour**: Circuito integrado no app com stages nacionais e internacionais.

### 7.3 Para Organizadores
- **Gestao de Chaves**: Criacao automatica de chaves por categoria.
- **Gestao de Quadras**: Agendamento, horarios, disponibilidade.
- **Resultados em Tempo Real**: Updates de resultados durante torneios.

### 7.4 Padroes-Chave para Sportio
| Padrao | Aplicacao Sportio |
|--------|-------------------|
| H2H entre jogadores | Confronto direto entre atletas no perfil |
| Performance dashboard | Evolucao do atleta com graficos temporais |
| Registro de resultado pelo jogador | Self-reporting de partidas |
| Court booking integrado | Reserva de quadras/espacos dentro do app |
| Ranking por categoria | Rankings separados por nivel + modalidade |
| Circuito de torneios | Circuitos com pontuacao acumulada (tipo ATP) |

---

## 8. Challengermode - Esports Tournament Management

### 8.1 Tournament Formats
- **Single/Double Elimination**: Brackets classicos com visualizacao completa.
- **Round Robin**: Todos jogam contra todos. Tabela de classificacao automatica.
- **Swiss System**: Numero de rounds configuravel. Scoring customizavel (pontos por vitoria/derrota/empate). Tiebreakers em cascata (prioridade configuravel).
- **Combinacoes**: Group stage -> Single elimination playoff. Multi-stage tournaments.
- **Top Cut**: Sistema sugere quem avanca/é eliminado baseado em numero de participantes e criterios.

### 8.2 Automacao
- **Recurring Tournaments**: Torneios automaticos em schedule recorrente.
- **Matchmaking 24/7**: Filas abertas para jogos rapidos e casuais.
- **Auto-seeding**: Distribuicao automatica baseada em ranking.
- **Auto-advancement**: Sugestao automatica de quem avanca de fase.

### 8.3 Organizer Features
- **Branded Spaces**: Organizadores criam paginas customizadas com branding proprio.
- **Membership Community**: Comunidade monetizavel dentro do Space.
- **Content Publishing**: Posts e atualizacoes dentro do Space.
- **Dashboard de Administracao**: Controle visual de matches e jogadores.
- **Override Manual**: Organizador pode alterar decisoes automaticas.

### 8.4 Player Features
- **Ladders & Leaderboards**: Rankings competitivos permanentes.
- **Casual vs Competitive**: Modos separados para diferentes intensidades.
- **Anti-cheat**: Sistema integrado de deteccao.

### 8.5 Padroes-Chave para Sportio
| Padrao | Aplicacao Sportio |
|--------|-------------------|
| Multi-format tournaments | Suporte a eliminacao simples, Swiss, round-robin |
| Branded Spaces | Paginas customizadas para organizadores/arenas |
| Recurring tournaments | Torneios automaticos semanais |
| Matchmaking queue | Fila para encontrar adversarios |
| Ladders | Rankings permanentes por modalidade |
| Auto-seeding | Distribuicao automatica de chaves |
| Swiss tiebreakers | Sistema de desempate configuravel |

---

## 9. Nike Run Club / Adidas Running - Challenges & Social

### 9.1 Nike Run Club
- **Guided Runs**: ~300 corridas guiadas com audio coaching. Coaches Nike + atletas de elite guiam a corrida com dicas em tempo real, historias, mindfulness.
- **Trophies & Badges**: Conquistas por milestones (primeira 5K, 10K, meia-maratona, maratona), personal bests, dias especificos da semana, participacao em challenges.
- **Streak System**: Rastreamento de sequencias consecutivas (dias/semanas/meses de corrida). Usuarios relutam em quebrar a streak - poderoso motivador. "High fives" virtuais quando streak continua.
- **Challenges**: Duracao definida (dia/semana/mes). Individuais ou em grupo. Metas de distancia, pace, frequencia. Recompensas exclusivas (early access a tenis, badges de elite).
- **Training Plans**: Planos personalizados (5K a maratona) com milestone badges ao completar cada fase.

### 9.2 Adidas Running
- **Social Movement**: 48% dos usuarios citam conexoes sociais como principal razao para usar o app. Walking clubs cresceram 52% em um ano.
- **Gamification**: Challenges com tiers, leaderboards sociais, sistema de recompensas.
- **170M+ usuarios**: Escala social massiva. 90+ esportes trackados.

### 9.3 Design Visual (NRC)
- **Paleta**: Fundo branco, texto preto bold, tipografia leve, muito espaco em branco, acentos em verde neon para CTAs.
- **Data Viz**: Graficos de pace, distancia, elevacao com design limpo e colorido.
- **AR + Real-time Leaderboards**: Tendencia 2025-2026, leaderboards com realidade aumentada.

### 9.4 O Que Torna "Sticky"
- **Intrinsic Reward**: Satisfacao de conquistar metas pessoais, ganhar badges, subir de level.
- **Social Accountability**: Amigos veem suas atividades. Streaks criam compromisso.
- **Coach Connection**: Audio guiado cria relacao parasocial com coaches.
- **Exclusive Rewards**: Early access a produtos Nike para top performers.

### 9.5 Padroes-Chave para Sportio
| Padrao | Aplicacao Sportio |
|--------|-------------------|
| Streak system | Sequencia de treinos/jogos consecutivos |
| Audio guided training | Treinos guiados por audio de profissionais |
| Progressive badges | Badges escalonados (5, 10, 25, 50, 100 jogos) |
| Exclusive rewards | Descontos/produtos exclusivos para top performers |
| Social accountability | Feed mostrando atividade de amigos |
| Training plans com milestones | Planos de evolucao com badges por fase |
| Walking clubs growth | Comunidades por modalidade/local |

---

## 10. OnlyFans / Substack - Gated Content & Creator Monetization

### 10.1 OnlyFans Model
- **Subscription**: Fan paga mensalidade para acesso ao feed do criador. Preco definido pelo criador.
- **Pay-Per-View (PPV)**: Mensagens com conteudo que exigem pagamento adicional alem da subscription.
- **Tips**: Tips em qualquer conteudo, a qualquer momento.
- **Live Streaming**: Lives exclusivas para subscribers.
- **Platform Fee**: 20% retido pela plataforma.

### 10.2 Substack Model
- **Free + Paid Mix**: Criador publica posts free (alcance) e posts paid (monetizacao). Titulo e preview de posts pagos aparecem para todos (FOMO engine).
- **3 Pricing Tiers**:
  - **Monthly**: Tipicamente $5-10/mes.
  - **Annual**: Desconto vs mensal (incentivo a comprometimento).
  - **Founding Member**: $200-500/ano com recompensas especiais, shoutouts. Urgencia com "pricing que expira".
- **Platform Fee**: 10% Substack + fees de Stripe (~3.6%).

### 10.3 Design Patterns de Gated Content
- **Blur + Lock**: Conteudo pago aparece com blur/desfocado + icone de cadeado + CTA "Subscribe to unlock".
- **Teaser Content**: Primeiros paragrafos free, resto gated. Ou video com primeiros 30 segundos free.
- **Tier Comparison Table**: Tabela clara mostrando o que cada tier inclui vs nao inclui.
- **Social Proof no Paywall**: "Join 5,000+ subscribers" proximo ao botão de assinar.
- **Founding Member Badge**: Badge visual especial para founding members (status + reciprocidade).

### 10.4 Creator Dashboard
- **Analytics Granulares**: Metricas por post, cohort analysis, A/B testing de pricing.
- **Subscriber Management**: Ver subscribers por tier, churn rate, lifetime value.
- **Export de Dados**: Criador dono da lista de emails/contatos.

### 10.5 Tendencias 2025-2026
- **Hybrid Model**: Subscriptions + produtos digitais avulsos na mesma plataforma.
- **Tiered Live Events**: Eventos ao vivo gated por tier (nivel mais alto = melhor acesso).
- **45% boost em ARPU**: Plataformas com tiered memberships vs preco unico.

### 10.6 Padroes-Chave para Sportio
| Padrao | Aplicacao Sportio |
|--------|-------------------|
| Blur + Lock paywall | Videos de treino/highlights com blur + "Assine para ver" |
| Teaser content | 30s de video free, resto pago |
| Founding Member | "Primeiro apoiador" com badge especial |
| Free + Paid mix | Conteudo free (alcance) + paid (receita) |
| PPV messages | Conteudo premium avulso (ex: analise tatica especifica) |
| Tier comparison table | Tabela Bronze/Prata/Ouro com checkmarks |
| Social proof no paywall | "X fas ja assinam" no CTA |

---

## 11. Onboarding Multi-Persona

### 11.1 Best Practices

#### Persona-Based Self-Segmentation
- **Tela de selecao no onboarding**: "Voce e..." com opcoes visuais (Atleta, Fa, Organizador, etc).
- **Cada selecao = experiencia diferente**: Templates, features em destaque, conteudo inicial, CTAs customizados.
- **Referencia: Canva**: 3 opcoes (pessoal, trabalho, educacao). Cada uma leva a onboarding diferente com templates relevantes.
- **Referencia: LinkedIn**: Onboarding progressivo em etapas digeriveis. Nao sobrecarrega com tudo de uma vez.

#### Progressive Disclosure
- **Etapa 1**: Conta basica (email/Google/Apple). Minimo de campos.
- **Etapa 2**: Selecao de persona. Visual, rapido, 1 toque.
- **Etapa 3**: Setup especifico da persona (atleta: esporte/nivel. Fa: times/atletas favoritos. Organizador: tipo de eventos).
- **Etapa 4**: First value moment (atleta: primeiro treino registrado. Fa: primeiro conteudo. Organizador: primeiro torneio criado).

#### Multi-Role Support
- **Referencia: PlanetHS**: 1M+ usuarios com roles de student-athlete, parent, teacher, school admin. Mesma plataforma, interfaces adaptadas.
- **Switch entre roles**: Nao forcar usuario a ter multiplas contas. Permitir ativar/desativar roles a qualquer momento.

### 11.2 Fluxo Recomendado para Sportio

```
Cadastro Rapido (email/Google/Apple)
         |
    Selecao de Role (visual, 1 toque)
    [Atleta] [Fa] [Organizador] [Apostador] [Arbitro] [Marca]
         |
    Setup Rapido (3-4 campos max por role)
    - Atleta: esporte, nivel, cidade
    - Fa: esportes favoritos, atletas
    - Organizador: tipo de eventos, cidade
    - Apostador: esportes de interesse
         |
    First Value Moment
    - Atleta: "Registre seu primeiro jogo"
    - Fa: Feed com conteudo dos atletas favoritos
    - Organizador: "Crie seu primeiro torneio"
    - Apostador: "Aposta gratis de boas-vindas"
         |
    Bonus de Boas-Vindas (GCoins)
```

### 11.3 Anti-Patterns a Evitar
- **Formularios longos**: Maximo 3-4 campos por tela.
- **Onboarding generico**: Mesmo fluxo para todos = alto drop-off.
- **Sem first value moment**: Usuario precisa sentir valor nos primeiros 60 segundos.
- **Verificacao antes do valor**: Nao exigir documentos antes de mostrar a plataforma.

---

## 12. Super Apps - Multi-User-Type Design

### 12.1 Principios-Chave

#### Consistencia Visual
- **WeChat**: Suporta 1M+ mini-programs mas interface core parece um app de chat simples. Servicos complexos ficam em tabs ou QR scans.
- **Shopee**: Mesma cor laranja, estilo de icones e layout quer voce esteja comprando, jogando mini-game, ou usando wallet.
- **Regra**: Um sistema de design unico que se adapta a cada contexto, nao multiplos designs.

#### Simplicidade como Prioridade
- **Problema comum**: Submenus excessivos, flyouts, decisao paralisante por excesso de opcoes.
- **Solucao WeChat**: Core interface minimalista. Complexidade fica "escondida" atras de acoes intencionais.
- **Solucao Shopee**: Barra de navegacao inferior com no maximo 5 tabs. Tudo acessivel em 2 toques.

#### Personalizacao por AI
- **Analise comportamental**: App adapta o que mostra baseado no uso real.
- **Sugestoes contextuais**: AI preve necessidades e sugere acoes relevantes.
- **Location-aware UX**: Conteudo relevante baseado em localizacao.

### 12.2 Aplicacao para Sportio

```
Barra de Navegacao Inferior (5 tabs max)
[Home] [Torneios] [Social] [Wallet] [Perfil]

Home adaptada por persona:
- Atleta: Proximos jogos, stats recentes, challenges ativos
- Fa: Feed de atletas seguidos, jogos ao vivo, odds
- Organizador: Torneios ativos, inscricoes pendentes, receita
- Apostador: Odds do dia, apostas ativas, historico

Mesmo design system, conteudo personalizado.
```

---

## 13. Apostas Esportivas no Brasil - Regulamentacao & UI

### 13.1 Marco Regulatorio (2025)
- **SPA/MF**: Secretaria de Premios e Apostas e o orgao regulador.
- **Licenca**: R$30 milhoes para licenca de 5 anos.
- **Dominio obrigatorio**: `.bet.br` para todas as plataformas autorizadas.
- **KYC obrigatorio**: CPF + reconhecimento facial no cadastro.
- **Data Center Brasil**: Sistemas e dados devem estar em data centers no Brasil.
- **Certificacao**: Sistema de apostas deve ser certificado por GLI, Trisigma ou eCOGRA.
- **Saques**: Maximo 120 minutos para processar solicitacao de saque.

### 13.2 Protecao ao Jogador (Obrigatorio por Lei)
- **Self-exclusion**: Mecanismo de autoexclusao obrigatorio.
- **Deposit Limits**: Limites de deposito configuraveis pelo usuario.
- **Jogo Responsavel**: Ferramentas e informacoes sobre jogo responsavel visíveis.
- **Idade Minima**: 18 anos com verificacao.

### 13.3 UI Requirements para Brasil
- **Odds em formato decimal**: Padrao brasileiro (nao americano).
- **Valores em BRL**: Moeda local com formatacao brasileira (R$ 1.234,56).
- **PIX**: Metodo de pagamento #1. Deposito e saque instantaneo.
- **Boleto**: Opcao secundaria de deposito.
- **Cartao de Credito**: Proibido para apostas em algumas regulamentacoes (verificar updates).
- **Idioma**: Interface 100% em portugues brasileiro.

### 13.4 Padroes de UI de Apostas para Brasil
| Padrao | Detalhe |
|--------|---------|
| PIX como metodo primario | QR Code + Copia e Cola. Deposito em segundos |
| Odds decimais | 1.50, 2.30, 3.75 (nao +150, -200) |
| Cupom de aposta | Termo brasileiro para bet slip |
| Apostas multiplas | Termo para parlays |
| Ao vivo | Termo para live betting |
| Verificacao CPF | Integrar com Receita Federal |
| Jogo Responsavel | Secao obrigatoria com link visivel |
| GCoins vs Dinheiro Real | Separar claramente moeda virtual (gamificacao) de apostas reais |

### 13.5 Consideracoes para Sportio
- **GCoins como moeda virtual de gamificacao**: NAO e aposta real. Deixar muito claro na UI.
- **Se oferecer apostas reais**: Necessita licenca SPA/MF, dominio .bet.br, KYC completo, certificacao.
- **Opcao intermediaria**: Apostas com GCoins (sem valor monetario real) = gamificacao, nao regulamentada como aposta.
- **Compliance UI**: Botoes de "Jogo Responsavel", "Autoexclusao", "Limites de Deposito" devem estar acessiveis em 1-2 cliques.

---

## 14. Sintese: Top Design Patterns para Sportio

### 14.1 Engajamento & Retenção
1. **Streak System** (NRC): Sequencias de atividade consecutiva. Difícil de abandonar.
2. **Kudos/Torcida** (Strava): Interacao de 1 toque que gera reciprocidade.
3. **Hype Train** (Twitch): Momentos coletivos de apoio com barra de progresso visual.
4. **Challenges** (Strava/NRC): Metas temporais com badges e recompensas.
5. **Leaderboards** (Strava/Sofascore): Rankings que geram competitividade saudavel.

### 14.2 Monetizacao
1. **Tiers 3 niveis** (Patreon/Substack): Bronze/Prata/Ouro com valor progressivo claro.
2. **Blur + Lock** (OnlyFans/Substack): FOMO visual em conteudo gated.
3. **Virtual Currency** (Twitch Bits): Moeda intermediaria que desacopla "gastar dinheiro" de "apoiar".
4. **Shoutouts/Mensagens** (Cameo): Interacao personalizada com preco fixo.
5. **Hybrid Model** (Patreon 2025): Subscriptions + produtos avulsos.
6. **Founding Member** (Substack): Status especial para early supporters.

### 14.3 Live Experience
1. **Attack Momentum** (Sofascore): Grafico de dinamica de jogo em tempo real.
2. **Real-time odds** (FanDuel): Flash visual quando odds mudam.
3. **Live stat tracking** (DraftKings): Estatisticas integradas na tela de apostas.
4. **Power-ups** (Twitch): Efeitos visuais pagos durante transmissao ao vivo.
5. **Predictions** (Twitch): Apostas de pontos em outcomes ao vivo.

### 14.4 Perfil & Identidade
1. **Trophy Case** (Strava): Vitrine de conquistas com badges visuais.
2. **Player Rating** (Sofascore): Rating numerico baseado em algoritmo.
3. **H2H** (LetzPlay): Confronto direto entre dois atletas.
4. **Pro Badge** (Strava): Verificacao e destaque para profissionais.
5. **Performance Dashboard** (LetzPlay/NRC): Graficos de evolucao temporal.

### 14.5 Organizacao de Torneios
1. **Multi-format brackets** (Challengermode/Torneo): Eliminacao, Swiss, Round-robin.
2. **Auto-seeding** (Challengermode): Distribuicao automatica por ranking.
3. **Branded Spaces** (Challengermode): Paginas customizadas para organizadores.
4. **Recurring tournaments** (Challengermode): Automacao de torneios recorrentes.
5. **Court booking** (LetzPlay): Reserva de quadras integrada.

### 14.6 Onboarding
1. **Self-segmentation** (Canva): Usuario escolhe sua persona visualmente.
2. **Progressive disclosure** (LinkedIn): Informacao em etapas, nao tudo de uma vez.
3. **First value moment** (todas): Valor percebido nos primeiros 60 segundos.
4. **Multi-role support** (PlanetHS): Mesma conta, multiplas personas.

---

## 15. Referencias e Fontes

### Strava
- [Complete Overview of Strava Features](https://communityhub.strava.com/t5/athlete-knowledge-base/strava-features-complete-overview/ta-p/275)
- [Strava Profile Page](https://support.strava.com/hc/en-us/articles/216917697-Your-Strava-Profile-Page)
- [Strava Segments](https://support.strava.com/hc/en-us/articles/216917137-Earning-Segment-Achievements)
- [Strava Marketing Strategy](https://www.latterly.org/strava-marketing-strategy/)
- [Strava Activity Grouping Engineering](https://medium.com/strava-engineering/activity-grouping-the-heart-of-a-social-network-for-athletes-865751f7dca)

### FanDuel / DraftKings
- [DraftKings vs FanDuel UX Wars](https://trymata.com/blog/draftkings-vs-fanduel-ux-wars/)
- [DraftKings or FanDuel Design Review](https://sccgmanagement.com/sccg-articles/2025/7/1/draftkings-or-fanduel-a-sports-bettors-no-bs-review-of-design-features-and-fun/)
- [Deceptive UX Patterns in Sports Betting](https://uxdesign.cc/winning-by-design-deceptive-ux-patterns-and-sports-betting-apps-1a9f0e1deaad)
- [NFL Sports Betting UX 2025](https://theunit.dev/blog/nfl-sports-betting-ux-2025/)
- [Sports Betting UX Guide 2026](https://prometteursolutions.com/blog/user-experience-and-interface-in-sports-betting-apps/)

### Patreon
- [Patreon Memberships Guide 2025](https://influencermarketinghub.com/patreon-memberships/)
- [Patreon Creator Page Customization](https://support.patreon.com/hc/en-us/articles/360026139111-Customize-your-creator-page)
- [Patreon Tier Pricing Guide](https://www.adweek.org/blog/ultimate-guide-to-patreon-tier-pricing)
- [Patreon Design System](https://www.aaron.mn/work/patreon)

### Twitch
- [Twitch Power-ups Launch](https://blog.twitch.tv/en/2024/06/12/introducing-power-ups-unleash-special-effects-with-bits/)
- [Twitch Hype Train Guide](https://besttwitchextensions.com/articles/twitch-hype-train-complete-guide)
- [Twitch Channel Points](https://allthings.how/how-to-earn-and-use-channel-points-on-twitch/)

### Cameo
- [Cameo Platform Review 2025](https://influencermarketinghub.com/cameo/)
- [Cameo Revenue Model](https://miracuves.com/blog/revenue-model-of-cameo/)
- [Cameo Features List](https://miracuves.com/blog/cameo-app-features-list/)

### Sofascore / FlashScore
- [Sofascore Player Performance Analysis](https://www.sofascore.com/news/football-player-performance-how-to-use-heatmaps-stats-and-attribute-overviews-to-measure-contribution/)
- [Torneo by Sofascore](https://torneo.sofascore.com/)
- [Sofascore Fan Engagement](https://insidersport.com/2019/10/21/sofascore-strengthening-fan-engagement-with-expansive-data/)

### LetzPlay
- [LetzPlay Platform](https://letzplay.me/home)
- [Brazil Beach Tennis Tour](https://letzplay.me/brazilbttour)

### Challengermode
- [Challengermode Features](https://challengermode.su/features/)
- [Challengermode Organizers](https://www.challengermode.com/organizers)
- [Swiss Format Guide](https://support.challengermode.com/en/organizing-tournaments1/swiss-format)

### Nike Run Club / Adidas Running
- [NRC Gamification Case Study](https://trophy.so/blog/nike-run-club-gamification-case-study)
- [NRC App Success Story](https://appsamurai.com/blog/mobile-app-success-story-nike-run-club/)
- [Adidas Running Social Movement](https://www.social.plus/blog/how-the-adidas-running-app-turned-solo-runs-into-a-global-movement)
- [Nike Run Club Design](https://www.designrush.com/best-designs/apps/nike-run-club)

### OnlyFans / Substack
- [OnlyFans Monetization Mechanics](https://influencermarketinghub.com/onlyfans-monetization/)
- [Substack Going Paid Guide](https://substack.com/going-paid)
- [Creator Platform Payouts Comparison](https://www.podcastvideos.com/articles/creator-platform-payouts-onlyfans-patreon-youtube/)

### Onboarding
- [App Onboarding Guide 2026](https://uxcam.com/blog/10-apps-with-great-user-onboarding/)
- [Onboarding UX Patterns](https://www.appcues.com/blog/user-onboarding-ui-ux-patterns)
- [200 Onboarding Flows Study](https://medium.com/design-bootcamp/i-studied-the-ux-ui-of-over-200-onboarding-flows-heres-everything-i-learned-d21e3c961609)

### Super Apps
- [Super App Design Principles](https://www.netguru.com/blog/super-app-design-balancing-functionality-and-user-experience)
- [Top 5 UX Principles for Super Apps](https://procreator.design/blog/super-app-ui-principles-from-top-global-app/)
- [Super Apps UX 2025](https://www.capiproduct.com/post/super-apps-how-ux-design-is-shaping-the-future-of-all-in-one-platforms-in-2025)

### Brazil Betting Regulation
- [Brazil Betting Regulation 2026](https://gr8.tech/blog/brazil-betting/)
- [Brazil Gambling Regulations Compliance](https://igamingbusiness.com/the-rulebook/brazil/brazil-gambling-regulations-compliance-aml-kyc/)
- [Brazil Gambling Laws 2025](https://sumsub.com/blog/gambling-in-brazil/)
- [Brazil bet.br Migration](https://env.media/online-gambling-regulation-brazil-2025/)

### Sports Betting UI
- [Sports Betting UX Best Practices 2026](https://prometteursolutions.com/blog/user-experience-and-interface-in-sports-betting-apps/)
- [Sportsbook UX Design Tips](https://altenar.com/blog/how-to-design-a-sportsbook-user-experience-ux-that-wins-in-live-play/)
- [Sports Betting UI/UX Strategic Guide](https://www.gammastack.com/blog/ui-ux-for-sports-betting-importance-how-to-improve/)
