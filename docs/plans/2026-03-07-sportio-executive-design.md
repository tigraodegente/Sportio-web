# Sportio — Design Executivo Completo

> Análise de gap, design de produto e plano de execução para transformar o MVP em plataforma completa.

---

## Parte 1: Análise de Gap (O que existe vs. O que falta)

### Status Atual do MVP

O Sportio-web tem uma base funcional sólida:

- **38 tabelas** no PostgreSQL (Neon)
- **130+ endpoints tRPC** em 11 routers
- **10 tipos de usuário** (atleta, organizador, marca, fã, apostador, árbitro, etc.)
- **Sistema de torneios** com brackets automáticos (single/double elimination, round robin, swiss)
- **Duelos 1v1** com apostas integradas
- **Economia GCoins** dual (real + gamificação)
- **Feed social** com posts, comentários, likes, follows
- **Gamificação** com 55+ conquistas e missões diárias/semanais
- **Patrocínio de marcas** com campanhas, impressões, cliques
- **Chat** 1v1 e grupo
- **Blog** com categorias
- **Landing pages** por persona (atleta, organizador, marca, fã, apostador, árbitro)
- **Admin panel** básico
- **Auth** com Google OAuth + credenciais

### O que o Deck Promete e NÃO EXISTE

#### 1. PILAR PROFISSIONAL (Esportes Profissionais Indexados)
| Feature | Status | Impacto |
|---------|--------|---------|
| Indexação de torneios profissionais (Brasileirão, Copa, UFC, etc.) | ❌ Não existe | CRÍTICO — cold start |
| API de dados esportivos (scores, escalações, stats em tempo real) | ❌ Não existe | CRÍTICO |
| Páginas de times profissionais | ❌ Não existe | ALTO |
| Páginas de atletas profissionais | ❌ Não existe | ALTO |
| Calendário de eventos profissionais | ❌ Não existe | ALTO |
| Live scores com updates em tempo real | ❌ Não existe | ALTO |
| Match tracker visual (momentum, timeline) | ❌ Não existe | MÉDIO |
| Odds em tempo real para jogos profissionais | ❌ Não existe | ALTO |
| Integração com provedores de dados (API-Football, SportMonks) | ❌ Não existe | CRÍTICO |

#### 2. CREATOR ECONOMY (Monetização de Atletas)
| Feature | Status | Impacto |
|---------|--------|---------|
| Página de perfil do atleta como "canal" (estilo Patreon) | ❌ Não existe | CRÍTICO |
| Slots de patrocínio na página do atleta | ❌ Não existe | ALTO |
| Conteúdo exclusivo gated (Free/Fã/VIP/Patrono) | ❌ Não existe | CRÍTICO |
| Sistema de assinaturas de fãs (tiers) | ❌ Não existe | CRÍTICO |
| GCoin Gifts em posts/perfis | ❌ Não existe | ALTO |
| Super Comments (comentários destacados pagos) | ❌ Não existe | ALTO |
| Shoutouts personalizados (modelo Cameo) | ❌ Não existe | MÉDIO |
| Fan Challenges (desafios propostos por fãs) | ❌ Não existe | MÉDIO |
| Presentes virtuais animados (modelo Twitch bits) | ❌ Não existe | MÉDIO |
| Fan Badges (Bronze→Silver→Gold→Diamond) | ❌ Não existe | ALTO |
| Programa de afiliados "Meu Equipamento" | ❌ Não existe | MÉDIO |
| Dashboard de receita para atletas/creators | ❌ Não existe | ALTO |
| Hype Train (momentum coletivo em lives/eventos) | ❌ Não existe | MÉDIO |

#### 3. FEATURES DE PRODUTO FALTANTES (Core)
| Feature | Status | Impacto |
|---------|--------|---------|
| Upload real de arquivos/imagens (R2/S3) | ❌ Stub | CRÍTICO |
| Pagamento real (PIX, cartão, boleto) | ❌ Fake/stub | CRÍTICO |
| Envio de emails (verificação, notificações) | ❌ Não existe | CRÍTICO |
| Proteção real de rotas (middleware auth) | ⚠️ Parcial | ALTO |
| Busca com Typesense/Algolia | ❌ Não existe | ALTO |
| Push notifications (mobile web/PWA) | ❌ Não existe | ALTO |
| WebSocket para chat e live updates | ❌ HTTP polling | ALTO |
| PWA / App Shell | ❌ Não existe | ALTO |
| SEO otimizado (meta tags, OG, sitemap) | ⚠️ Básico | MÉDIO |
| i18n (PT-BR como padrão, EN futuro) | ❌ Hardcoded | BAIXO |
| Rate limiting / abuse prevention | ❌ Não existe | ALTO |
| Testes automatizados (unit, e2e) | ⚠️ Mínimo | MÉDIO |
| CI/CD pipeline completo | ⚠️ Básico | MÉDIO |
| Monitoramento (Sentry, PostHog) | ❌ Configurado mas não integrado | MÉDIO |
| LGPD compliance (termos, consentimento, exclusão) | ❌ Não existe | ALTO |

#### 4. EXPERIÊNCIAS POR PERSONA FALTANTES

**Atleta Amador:**
- Onboarding guiado com setup de perfil esportivo
- Dashboard personalizado com stats, próximos torneios, desafios ativos
- Matchmaking automático para encontrar oponentes do mesmo nível
- Histórico de partidas com evolução visual
- Ranking por esporte/cidade/estado
- Certificados digitais de participação

**Organizador:**
- Wizard de criação de torneio step-by-step
- Gestão de inscrições com aprovação/rejeição
- Check-in via QR code
- Streaming de resultados em tempo real
- Financeiro do evento (receitas, custos, lucro)
- Templates de regulamento por esporte
- Comunicação com participantes (bulk notifications)

**Marca/Patrocinador:**
- Dashboard de ROI com métricas em tempo real
- Self-serve ad creation (criar campanha em 3 cliques)
- Targeting por esporte, região, nível, idade
- A/B testing de criativos
- Relatórios automáticos (PDF/CSV)
- Marketplace de atletas para patrocínio direto

**Fã/Torcedor:**
- Feed personalizado por times/atletas favoritos
- Torcida virtual em jogos ao vivo
- Fantasy sports (escalação virtual)
- Enquetes e votações durante jogos
- Loja de itens virtuais (avatares, frames, badges)
- Histórico de apostas com analytics

**Apostador:**
- Interface de apostas estilo FanDuel/DraftKings
- Bet slip com parlays (apostas combinadas)
- Live betting durante partidas
- Cash out parcial/total
- Estatísticas e tendências para análise
- Responsible gambling (limites, autoexclusão)
- Apostas sociais (apostar junto com amigos)

**Árbitro:**
- Agenda de partidas disponíveis
- Aceitar/recusar convites para arbitrar
- Registro de resultados em tempo real (mobile-first)
- Rating por participantes (reputação)
- Dashboard de ganhos
- Certificação e ranking

---

## Parte 2: Design Executivo — Inspirado nas Melhores Referências

### 2.1 Design System

**Referências:** Strava (clean, data-rich), FanDuel (clean betting UI), Nike Run Club (bold, motivacional)

```
SPORTIO DESIGN TOKENS
━━━━━━━━━━━━━━━━━━━━━

Cores Primárias:
  --sport-green: #00C853     (principal — energia, vitória, dinheiro)
  --sport-dark:  #0A1628     (backgrounds escuros — imersão)
  --sport-white: #FAFBFC     (backgrounds claros)

Cores de Ação:
  --bet-gold:    #FFB300     (apostas, GCoins, dinheiro)
  --live-red:    #FF1744     (ao vivo, urgência)
  --win-blue:    #2979FF     (rankings, stats, vitórias)

Cores de Persona:
  --athlete:     #00C853     (verde — performance)
  --organizer:   #7C4DFF     (roxo — gestão)
  --brand:       #FF6D00     (laranja — marketing)
  --fan:         #00B0FF     (azul — engajamento)
  --bettor:      #FFB300     (dourado — apostas)
  --referee:     #78909C     (cinza — neutralidade)

Tipografia:
  --font-display: 'Plus Jakarta Sans' (títulos — geométrica, moderna)
  --font-body:    'Inter' (corpo — legibilidade)
  --font-mono:    'JetBrains Mono' (stats, números, odds)

Espaçamento: 4px base grid
Bordas: 12px radius padrão, 8px para cards menores
Sombras: 3 níveis (sm, md, lg) com blur crescente
Animações: 200ms ease-out padrão, 300ms para modais
```

### 2.2 Navegação e Estrutura

**Referência:** WeChat (super app com 5 tabs), Strava (bottom nav mobile)

```
MOBILE (Bottom Nav — 5 tabs máximo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────┐
│                                        │
│          [Conteúdo da Página]          │
│                                        │
├────┬────┬────┬────┬────────────────────┤
│ 🏠 │ 🏆 │ 📱 │ 💰 │ 👤              │
│Home│Comp│Feed│Cart│Perfil             │
└────┴────┴────┴────┴────────────────────┘

Home    = Feed personalizado por persona + live scores
Comp    = Torneios + Desafios + Ranking
Feed    = Social + Trending + Discover
Cart    = Wallet GCoins + Apostas ativas + Histórico
Perfil  = Settings + Stats + Achievements


DESKTOP (Sidebar + Top Bar)
━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────┬─────────────────────────────────────┐
│ SPORTIO  │ 🔍 Busca  [Live]  🔔 3  💰 1.250  │
├──────────┼─────────────────────────────────────┤
│          │                                     │
│ 🏠 Home  │                                     │
│ 🏆 Torneios                                    │
│ ⚔️ Desafios                                    │
│ 📊 Ranking│       CONTEÚDO PRINCIPAL           │
│ 📱 Social │                                    │
│ 💬 Chat   │                                    │
│ ────────  │                                    │
│ 💰 Wallet │                                    │
│ 🎯 Apostas│                                    │
│ 📈 Stats  │                                    │
│ 🏅 Conquistas                                  │
│ ────────  │                                    │
│ ⚙️ Config │                                    │
└──────────┴─────────────────────────────────────┘
```

### 2.3 Onboarding (Multi-Persona)

**Referência:** Canva (self-segmentation), LinkedIn (progressive disclosure)

```
FLUXO DE ONBOARDING (máx. 60 segundos até primeiro valor)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Cadastro (10s)
┌────────────────────────────────────┐
│     Entrar com Google              │
│     ─── ou ───                     │
│     Email + Senha                  │
└────────────────────────────────────┘

STEP 2: "O que te traz ao Sportio?" (15s)
┌────────────────────────────────────┐
│  🏃 Quero competir e ganhar       │ → Atleta
│  🏆 Quero organizar torneios     │ → Organizador
│  📢 Quero patrocinar             │ → Marca
│  📺 Quero acompanhar e apostar   │ → Fã/Apostador
│  🏁 Quero arbitrar               │ → Árbitro
│                                    │
│  (Pode escolher múltiplos)         │
└────────────────────────────────────┘

STEP 3A (Atleta): "Quais esportes?" (15s)
┌────────────────────────────────────┐
│  ⚽ Futebol     🎾 Beach Tennis   │
│  🏃 Corrida     💪 CrossFit      │
│  🏐 Volei       🏀 Basquete      │
│  ⚽ Futevôlei   🎮 eSports       │
│  + Ver todos os 43 esportes       │
└────────────────────────────────────┘

STEP 3B (Atleta): "Qual seu nível?" (10s)
┌────────────────────────────────────┐
│  🟢 Iniciante (jogo por diversão) │
│  🟡 Intermediário (compito local) │
│  🔴 Avançado (compito regional+)  │
└────────────────────────────────────┘

STEP 4: "Sua cidade" (10s)
┌────────────────────────────────────┐
│  📍 Detectar localização          │
│  ou digitar cidade                │
└────────────────────────────────────┘

→ PRONTO! Redireciona para home personalizada com:
  - Torneios perto de você
  - Jogos profissionais ao vivo
  - Atletas da sua cidade
  - Primeiro desafio sugerido
```

### 2.4 HOME — Feed Personalizado por Persona

**Referência:** TikTok (For You personalizado), Strava (activity feed), FanDuel (live + featured)

```
HOME — ATLETA
━━━━━━━━━━━━━

┌─────────────────────────────────────────────┐
│ 🔴 AO VIVO AGORA                           │
│ ┌──────────────┐ ┌──────────────┐           │
│ │ Flamengo 2x1 │ │ UFC 315      │           │
│ │ Palmeiras     │ │ Pantoja vs   │ → scroll  │
│ │ ⏱️ 67'  ⚽   │ │ Asakura R3   │           │
│ └──────────────┘ └──────────────┘           │
├─────────────────────────────────────────────┤
│ ⚔️ DESAFIOS PARA VOCÊ                      │
│ ┌─────────────────────────────────────────┐ │
│ │ 🏃 "Corra 50km este mês"               │ │
│ │ 🏆 Prêmio: 500 GCoins | 234 competindo │ │
│ │ ████████░░░░░ 62% completo              │ │
│ │ [Participar]                            │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ 🏆 TORNEIOS PERTO DE VOCÊ                  │
│ ┌───────────────┐ ┌───────────────┐         │
│ │ 📍 SP, 2km    │ │ 📍 SP, 5km    │         │
│ │ Beach Tennis   │ │ Fut Society   │         │
│ │ Duplas Mistas  │ │ Copa Bairro   │         │
│ │ 15 Mar | R$80  │ │ 22 Mar | R$50 │         │
│ │ 12/16 vagas    │ │ 8/12 vagas    │         │
│ │ [Inscrever]    │ │ [Inscrever]   │         │
│ └───────────────┘ └───────────────┘         │
├─────────────────────────────────────────────┤
│ 📱 FEED SOCIAL (estilo Strava)              │
│ ┌─────────────────────────────────────────┐ │
│ │ 👤 João Silva · Corrida · 2h atrás     │ │
│ │ "10km matinal 🏃‍♂️ novo recorde!"       │ │
│ │ ┌─────────────────────────────┐         │ │
│ │ │ 🗺️ Mapa do percurso         │         │ │
│ │ │ 10.2km | 48:32 | 4:45/km   │         │ │
│ │ └─────────────────────────────┘         │ │
│ │ ❤️ 23  💬 5  🔄 2                      │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ 📢 Patrocinado · Nike Running           │ │
│ │ "Pegasus 41 — Para quem não para"       │ │
│ │ [Ver Oferta]                            │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ 📊 SEUS STATS DA SEMANA                    │
│ ┌─────────┬──────────┬──────────┐          │
│ │ 3 treinos│ 2 vitórias│ 150 GC  │          │
│ │ esta sem │ 67% win  │ ganhos   │          │
│ └─────────┴──────────┴──────────┘          │
└─────────────────────────────────────────────┘


HOME — FÃ/APOSTADOR
━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────┐
│ 🔴 JOGOS AO VIVO                           │
│ ┌─────────────────────────────────────────┐ │
│ │ BRASILEIRÃO — Série A                   │ │
│ │ Flamengo  [2] ⚽ vs ⚽ [1]  Palmeiras  │ │
│ │ ⏱️ 67' | Gol: Pedro 34', 52'           │ │
│ │                                         │ │
│ │ 📊 Posse: 45% ████░░░░░ 55%            │ │
│ │ 🎯 Chutes: 8 vs 12                     │ │
│ │                                         │ │
│ │ APOSTAR: Fla 1.45 | Emp 4.20 | Pal 6.50│ │
│ │ [Apostar Agora]                         │ │
│ └─────────────────────────────────────────┘ │
│ ┌──────────────┐ ┌──────────────┐           │
│ │ Copa BR       │ │ Beach Tennis  │ → scroll  │
│ │ Gremio 0x0   │ │ Finals BT100 │           │
│ │ Inter ⏱️ 23' │ │ Set 2: 4-3   │           │
│ └──────────────┘ └──────────────┘           │
├─────────────────────────────────────────────┤
│ 🎯 SUAS APOSTAS ATIVAS                     │
│ ┌─────────────────────────────────────────┐ │
│ │ Parlay 3 jogos — 150 GC → 1.200 GC     │ │
│ │ ✅ Fla vence (2x1 ✓)                   │ │
│ │ ⏳ Grêmio vence (0x0, 23')             │ │
│ │ ⏳ +2.5 gols Santos vs Bahia (20:00)   │ │
│ │ [Cash Out: 340 GC]                     │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ 🏆 DESTAQUES                               │
│ ┌─────────────────────────────────────────┐ │
│ │ 🔥 Creator em alta: @MariaRunBR         │ │
│ │ "3 maratonas sub-3h este ano"           │ │
│ │ 12.5K fãs | 89 assinantes VIP          │ │
│ │ [Seguir] [Assinar R$9.90/mês]          │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ 📅 PRÓXIMOS JOGOS                          │
│ ┌─────────────────────────────────────────┐ │
│ │ Hoje 20:00  Santos vs Bahia  │ [Apostar]│ │
│ │ Hoje 21:30  Botafogo vs São P│ [Apostar]│ │
│ │ Amanhã 16:00 Corinthians vs  │ [Apostar]│ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 2.5 Perfil do Atleta como "Canal de Creator"

**Referência:** Patreon (tiers) + Twitch (gifts/badges) + Strava (stats) + Cameo (shoutouts)

```
PÁGINA DO ATLETA — "CANAL"
━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────┐ │
│ │              BANNER (patrocinável)              │ │
│ │        🏷️ Patrocinado por: [Logo Nike]         │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌──────┐  Maria Santos @mariarun                    │
│ │ FOTO │  🏃 Corrida | 🎾 Beach Tennis              │
│ │  👑  │  📍 São Paulo, SP                          │
│ │ Gold │  ⭐ Nível 42 | 🏆 23 torneios vencidos     │
│ └──────┘                                            │
│                                                     │
│ 12.5K seguidores · 89 assinantes · 234 fãs ativos  │
│                                                     │
│ [Seguir] [Assinar ▾] [🎁 Enviar Gift] [📹 Shoutout]│
│                                                     │
│ ┌──────────────────────────────────────────────────┐│
│ │ "Corredora amadora perseguindo o sub-3h na      ││
│ │  maratona. Compartilho treinos, dicas de prova  ││
│ │  e bastidores da preparação."                   ││
│ └──────────────────────────────────────────────────┘│
│                                                     │
│ ─── TABS ──────────────────────────────────────── │
│ [📱 Posts] [📊 Stats] [🏆 Torneios] [🎁 Loja]     │
│ [💎 Exclusivo] [🏅 Conquistas] [⚽ Equipamento]   │
│                                                     │
│ ─── TAB: POSTS ────────────────────────────────── │
│                                                     │
│ ┌──────────────────────────────────────────────── ┐│
│ │ 🔓 POST PÚBLICO                                 ││
│ │ "Semana de taper antes da Maratona de SP! 🏃‍♀️"  ││
│ │ 📷 [foto do treino]                             ││
│ │ ❤️ 145  💬 23  🎁 12 GCoins recebidos           ││
│ └──────────────────────────────────────────────── ┘│
│                                                     │
│ ┌──────────────────────────────────────────────── ┐│
│ │ 🔒 CONTEÚDO EXCLUSIVO — Tier: Fã (R$9.90/mês)  ││
│ │ ┌──────────────────────────────────────────┐    ││
│ │ │        [Conteúdo borrado/blur]           │    ││
│ │ │   🔐 "Meu plano de treino completo      │    ││
│ │ │    para maratona sub-3h com planilha"    │    ││
│ │ │                                          │    ││
│ │ │   [Assinar para Desbloquear — R$9.90]    │    ││
│ │ └──────────────────────────────────────────┘    ││
│ └──────────────────────────────────────────────── ┘│
│                                                     │
│ ┌──────────────────────────────────────────────── ┐│
│ │ 🔒 CONTEÚDO EXCLUSIVO — Tier: VIP (R$29.90)    ││
│ │ ┌──────────────────────────────────────────┐    ││
│ │ │        [Conteúdo borrado/blur]           │    ││
│ │ │   🔐 "Vídeo: análise da minha prova     │    ││
│ │ │    com GPS e splits detalhados"          │    ││
│ │ │                                          │    ││
│ │ │   [Assinar VIP — R$29.90/mês]            │    ││
│ │ └──────────────────────────────────────────┘    ││
│ └──────────────────────────────────────────────── ┘│
│                                                     │
│ ─── TAB: STATS ────────────────────────────────── │
│                                                     │
│ ┌──────────────────────────────────────────────── ┐│
│ │ CORRIDA               BEACH TENNIS              ││
│ │ 🏃 Pace médio: 4:45   🎾 Ranking: #42 SP      ││
│ │ 📏 Km/mês: 180km      🏆 V/D: 67/23 (74%)    ││
│ │ 🏆 PRs:               📊 Rating: 1.850        ││
│ │   5K: 21:30           ⬆️ +120 último mês       ││
│ │   10K: 44:15                                    ││
│ │   21K: 1:38:20                                  ││
│ │   42K: 3:12:45                                  ││
│ │                                                  ││
│ │ 📈 [Gráfico de evolução — últimos 12 meses]    ││
│ └──────────────────────────────────────────────── ┘│
│                                                     │
│ ─── TAB: EQUIPAMENTO (Afiliados) ──────────────── │
│                                                     │
│ ┌──────────────────────────────────────────────── ┐│
│ │ "O que eu uso" — por @mariarun                  ││
│ │                                                  ││
│ │ 👟 Nike Pegasus 41          R$ 799 [Comprar] 🔗││
│ │ ⌚ Garmin Forerunner 265    R$ 2.499 [Comprar]🔗││
│ │ 🩳 Shorts Nike Dri-FIT     R$ 199 [Comprar] 🔗││
│ │ 🎧 AirPods Pro 2           R$ 1.849 [Comprar]🔗││
│ │                                                  ││
│ │ Maria ganha comissão por cada compra ❤️         ││
│ └──────────────────────────────────────────────── ┘│
│                                                     │
│ ─── SIDEBAR (Desktop) ───────────────────────── │
│                                                     │
│ ┌────────────────────────┐                         │
│ │ TIERS DE ASSINATURA    │                         │
│ │                        │                         │
│ │ 🟢 Fã — R$9.90/mês    │                         │
│ │ • Posts exclusivos     │                         │
│ │ • Badge de fã          │                         │
│ │ • Chat direto          │                         │
│ │ [Assinar]              │                         │
│ │                        │                         │
│ │ 🔵 VIP — R$29.90/mês  │                         │
│ │ • Tudo do Fã +         │                         │
│ │ • Vídeos de treino     │                         │
│ │ • Planilhas            │                         │
│ │ • Q&A mensal           │                         │
│ │ [Assinar]              │                         │
│ │                        │                         │
│ │ 💎 Patrono — R$99/mês │                         │
│ │ • Tudo do VIP +        │                         │
│ │ • 1 shoutout/mês       │                         │
│ │ • Nome nos créditos    │                         │
│ │ • Acesso antecipado    │                         │
│ │ [Assinar]              │                         │
│ └────────────────────────┘                         │
│                                                     │
│ ┌────────────────────────┐                         │
│ │ 🏆 TOP FÃS            │                         │
│ │ 💎 Pedro — 2.340 GC   │                         │
│ │ 🥇 Ana — 1.890 GC     │                         │
│ │ 🥈 Lucas — 1.230 GC   │                         │
│ │ 🥉 Julia — 980 GC     │                         │
│ └────────────────────────┘                         │
│                                                     │
│ ┌────────────────────────┐                         │
│ │ 📢 PATROCINADORES      │                         │
│ │ [Logo Nike] Running    │                         │
│ │ [Logo Garmin] Watches  │                         │
│ │ [Logo Oakley] Eyewear  │                         │
│ │                        │                         │
│ │ Quer patrocinar?       │                         │
│ │ [Saiba Mais]           │                         │
│ └────────────────────────┘                         │
└─────────────────────────────────────────────────────┘
```

### 2.6 Interface de Apostas

**Referência:** FanDuel (clean, fast), DraftKings (feature-rich), Betano (BR market leader)

```
TELA DE APOSTAS — JOGO PROFISSIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│ 🔴 AO VIVO  |  BRASILEIRÃO SÉRIE A  |  RODADA 28   │
├─────────────────────────────────────────────────────┤
│                                                     │
│    🔴⚫ FLAMENGO     2  ×  1     🟢⚪ PALMEIRAS    │
│                    ⏱️ 67'                           │
│                                                     │
│  ⚽ Pedro 34'            ⚽ Endrick 22'             │
│  ⚽ Pedro 52'                                       │
│  🟨 Gerson 45'          🟨 Zé Rafael 38'           │
│                                                     │
│  ┌────────────────────────────────────────────┐     │
│  │ MOMENTUM DO JOGO (ref: Sofascore)         │     │
│  │ Fla ███████▓░░░░░░░░░░████████ Pal        │     │
│  │     0'    15'   30'   45'   60'   75'     │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
│  Posse: 45% ████░░░░ 55%                           │
│  Chutes: 8 (4 no gol) vs 12 (3 no gol)            │
│  Escanteios: 5 vs 7                                │
│                                                     │
├─────────────────────────────────────────────────────┤
│ APOSTAR COM GCoins                                  │
│                                                     │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│ │ FLAMENGO    │ │ EMPATE      │ │ PALMEIRAS   │   │
│ │   1.45 ▲   │ │   4.20      │ │   6.50 ▼   │   │
│ │  (mais pro-│ │             │ │  (menos pro-│   │
│ │   vável)   │ │             │ │   vável)    │   │
│ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                     │
│ 📊 MAIS MERCADOS                                    │
│ ┌─────────────────────────────────────────────┐     │
│ │ Ambas marcam?      Sim 1.80  │  Não 1.95  │     │
│ │ Total de gols     +2.5 1.65  │ -2.5 2.20  │     │
│ │ Próximo gol       Fla 1.60   │ Pal 2.80   │     │
│ │ Handicap          Fla-1 2.90 │ Pal+1 1.40 │     │
│ │ Resultado exato   2x1 7.50   │ 2x2 9.00   │     │
│ │ Jogador marca     Pedro 2.20 │ Endrick 3.80│     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
├─────────────────────────────────────────────────────┤
│ 🎫 SEU BET SLIP                                     │
│ ┌─────────────────────────────────────────────┐     │
│ │ ✕ Flamengo vence         @1.45             │     │
│ │ ✕ Ambas marcam: Sim      @1.80             │     │
│ │                                             │     │
│ │ Parlay odds: 2.61                           │     │
│ │                                             │     │
│ │ Apostar: [100] GCoins                       │     │
│ │ Retorno potencial: 261 GCoins               │     │
│ │                                             │     │
│ │ [CONFIRMAR APOSTA]                          │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ 💬 CHAT AO VIVO DO JOGO                             │
│ ┌─────────────────────────────────────────────┐     │
│ │ Pedro_FlaBR: GOOOL DO PEDRO! 🔥🔥🔥        │     │
│ │ ⭐ Ana_GC (VIP): Apostei 500 GC no Fla!    │     │
│ │ Lucas99: Palmeiras vai empatar, confia      │     │
│ │ [Sua mensagem...] [Enviar] [🎁 Gift 5 GC]  │     │
│ └─────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

### 2.7 Torneio — Experiência Completa

**Referência:** Challonge (brackets), LetzPlay (beach tennis BR), Sofascore Torneo

```
PÁGINA DO TORNEIO
━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🏆 Copa Beach Tennis SP 2026                    │ │
│ │ 📍 Arena Paulista, São Paulo                    │ │
│ │ 📅 15-17 Mar 2026 | 🎾 Beach Tennis Duplas     │ │
│ │ 💰 Premiação: 5.000 GCoins + Troféu            │ │
│ │ Organizado por: @ArenaBeachSP                   │ │
│ │                                                 │ │
│ │ 📢 Patrocinado por: [Logo Centauro] [Logo Oakley]│
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ [📋 Info] [👥 Inscritos] [📊 Chave] [📈 Resultados]│
│ [💬 Chat] [📸 Fotos] [🎯 Apostas]                  │
│                                                     │
│ ─── TAB: INFO ──────────────────────────────────── │
│ Status: 🟡 Inscrições Abertas                       │
│ Vagas: 24/32 duplas inscritas                       │
│ Nível: B (intermediário)                            │
│ Inscrição: 80 GCoins por dupla                      │
│ Formato: Fase de grupos → Eliminação simples         │
│                                                     │
│ [INSCREVER MINHA DUPLA — 80 GC]                     │
│                                                     │
│ ─── TAB: CHAVE (Bracket visual) ────────────────── │
│                                                     │
│ QUARTAS          SEMIS           FINAL              │
│ ┌──────────┐                                        │
│ │ João/Maria│──┐                                    │
│ └──────────┘  │  ┌──────────┐                      │
│ ┌──────────┐  ├──│João/Maria│──┐                   │
│ │ Pedro/Ana │──┘  └──────────┘  │                   │
│ └──────────┘                    │  ┌──────────┐    │
│ ┌──────────┐                    ├──│  🏆 ???  │    │
│ │ Lucas/Bia │──┐                │  └──────────┘    │
│ └──────────┘  │  ┌──────────┐  │                   │
│ ┌──────────┐  ├──│Lucas/Bia │──┘                   │
│ │ Carlo/Lea │──┘  └──────────┘                      │
│ └──────────┘                                        │
│                                                     │
│ ─── TAB: APOSTAS ───────────────────────────────── │
│ Campeão:                                            │
│ João/Maria 2.10 | Lucas/Bia 3.50 | Pedro/Ana 4.00  │
│ [Apostar no campeão]                                │
└─────────────────────────────────────────────────────┘
```

### 2.8 Wallet de GCoins

**Referência:** Nubank (wallet BR), Twitch (bits), Roblox (Robux)

```
WALLET DE GCoins
━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│                                                     │
│  💰 Seu Saldo                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │     1.250 GCoins Reais                      │   │
│  │     = R$ 12,50 (sacável via PIX)            │   │
│  │                                             │   │
│  │     3.400 GCoins Gamificação               │   │
│  │     (apostas sociais, loja virtual)         │   │
│  │                                             │   │
│  │  [Comprar GCoins] [Sacar via PIX] [Transferir]│   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  📊 Resumo do Mês                                   │
│  ┌──────────┬──────────┬──────────┬──────────┐     │
│  │ Ganhos   │ Gastos   │ Apostas  │ Gifts    │     │
│  │ +850 GC  │ -320 GC  │ +120 GC  │ +45 GC   │     │
│  │ ▲ 23%    │ ▼ 10%    │ ▲ ROI 37%│ 12 gifts │     │
│  └──────────┴──────────┴──────────┴──────────┘     │
│                                                     │
│  📈 [Gráfico de evolução do saldo — 30 dias]       │
│                                                     │
│  💳 COMPRAR GCoins                                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ 100 GC  — R$ 10    (R$0.10/GC)             │   │
│  │ 500 GC  — R$ 45    (R$0.09/GC) 🔥 -10%     │   │
│  │ 1000 GC — R$ 80    (R$0.08/GC) 🔥 -20%     │   │
│  │ 5000 GC — R$ 350   (R$0.07/GC) 🔥 -30%     │   │
│  │                                             │   │
│  │ Pagar com: [PIX] [Cartão] [Boleto]          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  📜 HISTÓRICO DE TRANSAÇÕES                         │
│  ┌─────────────────────────────────────────────┐   │
│  │ +200 GC  🏆 Prêmio: Copa BT SP          Hoje│   │
│  │ -100 GC  🎯 Aposta: Fla vs Pal          Hoje│   │
│  │ +150 GC  🎯 Ganho: Aposta Fla vence     Hoje│   │
│  │ +50 GC   ⭐ Missão: Corra 5km           Ontem│   │
│  │ -80 GC   🏆 Inscrição: Torneio BT      Ontem│   │
│  │ +500 GC  💳 Compra: Pacote 500          2 dias│   │
│  │ [Ver Tudo]                                   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 2.9 Gift System (Presentes Virtuais)

**Referência:** Twitch bits, TikTok gifts, YouTube Super Chat

```
SISTEMA DE GIFTS
━━━━━━━━━━━━━━━

Quando o fã clica em "🎁 Enviar Gift" no perfil ou post:

┌─────────────────────────────────────────────────────┐
│ 🎁 Enviar Gift para @mariarun                      │
│                                                     │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐           │
│ │  👏   │ │  🔥   │ │  ⚡   │ │  🏆   │           │
│ │ Palma │ │ Fogo  │ │ Raio  │ │Troféu │           │
│ │ 5 GC  │ │ 20 GC │ │ 50 GC │ │100 GC │           │
│ └───────┘ └───────┘ └───────┘ └───────┘           │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐           │
│ │  💎   │ │  👑   │ │  🌟   │ │  🎯   │           │
│ │Diamant│ │ Coroa │ │Estrela│ │Alvo   │           │
│ │250 GC │ │500 GC │ │ 1K GC │ │Custom │           │
│ └───────┘ └───────┘ └───────┘ └───────┘           │
│                                                     │
│ Mensagem: [Vai Maria! Inspira demais! 🏃‍♀️]         │
│                                                     │
│ [ENVIAR 🔥 FOGO — 20 GCoins]                       │
│                                                     │
│ Seu saldo: 1.250 GC                                │
└─────────────────────────────────────────────────────┘

O gift aparece:
- Animado no perfil/post (efeito visual 2-3 segundos)
- No feed de atividade do atleta
- Na lista de "Top Fãs" se acumulado
- O atleta recebe 80% (16 GC), plataforma 20% (4 GC)
```

### 2.10 Dashboard do Organizador

**Referência:** Eventbrite (gestão de eventos), Challonge (brackets), LetzPlay (BT)

```
DASHBOARD DO ORGANIZADOR
━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│ 🏆 Meus Torneios                                    │
│                                                     │
│ ┌─────────────────────────────────────────────┐     │
│ │ MÉTRICAS GERAIS                             │     │
│ │ ┌──────────┬──────────┬──────────┬────────┐ │     │
│ │ │12 torneios│ 456 atletas│ R$3.2K   │ 4.8⭐ │ │     │
│ │ │realizados│ total     │ receita  │ nota  │ │     │
│ │ └──────────┴──────────┴──────────┴────────┘ │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ [+ Criar Novo Torneio]                              │
│                                                     │
│ TORNEIOS ATIVOS                                      │
│ ┌─────────────────────────────────────────────┐     │
│ │ 🏆 Copa BT SP — Em andamento                │     │
│ │ 📅 15-17 Mar | 📍 Arena Paulista             │     │
│ │ 👥 32/32 inscritos | 💰 2.560 GC arrecadados│     │
│ │                                             │     │
│ │ ┌──────┬──────┬──────┬──────┬──────┐       │     │
│ │ │Check-│Chave │Placar│Fotos │Financ│       │     │
│ │ │in    │      │      │      │eiro  │       │     │
│ │ └──────┴──────┴──────┴──────┴──────┘       │     │
│ │                                             │     │
│ │ CHECK-IN: 28/32 confirmados                 │     │
│ │ 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢⬜⬜       │     │
│ │                                             │     │
│ │ PRÓXIMAS PARTIDAS:                          │     │
│ │ 14:00 Quadra 1: João/Maria vs Pedro/Ana    │     │
│ │ 14:00 Quadra 2: Lucas/Bia vs Carlo/Lea     │     │
│ │ 14:40 Quadra 1: [vencedor] vs [vencedor]   │     │
│ │                                             │     │
│ │ [Registrar Resultado] [Enviar Notificação]  │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ WIZARD DE CRIAÇÃO (step-by-step)                    │
│ ┌─────────────────────────────────────────────┐     │
│ │ 1. Esporte & Formato  ✅                     │     │
│ │ 2. Data & Local       ✅                     │     │
│ │ 3. Vagas & Preço      ✅                     │     │
│ │ 4. Regulamento        ⬜ (templates prontos)│     │
│ │ 5. Premiação          ⬜                     │     │
│ │ 6. Patrocínio (opcional) ⬜                  │     │
│ │ 7. Publicar           ⬜                     │     │
│ └─────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

### 2.11 Dashboard da Marca/Patrocinador

**Referência:** Google Ads (self-serve), Meta Ads Manager (targeting), Strava Metro (analytics)

```
DASHBOARD DA MARCA
━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│ 📢 Minhas Campanhas                                 │
│                                                     │
│ ┌─────────────────────────────────────────────┐     │
│ │ MÉTRICAS GERAIS (últimos 30 dias)           │     │
│ │ ┌──────────┬──────────┬──────────┬────────┐ │     │
│ │ │125K      │ 3.2K     │ 2.56%    │ R$0.12 │ │     │
│ │ │impressões│ cliques  │ CTR      │ CPC    │ │     │
│ │ │▲ 34%     │▲ 28%     │▲ 0.3pp   │▼ 15%   │ │     │
│ │ └──────────┴──────────┴──────────┴────────┘ │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ [+ Criar Campanha]                                  │
│                                                     │
│ CRIAR CAMPANHA (3 passos)                           │
│ ┌─────────────────────────────────────────────┐     │
│ │ 1. OBJETIVO                                 │     │
│ │ ○ Banner no feed (CPM)                      │     │
│ │ ○ Patrocinar torneio (fixo + visibilidade)  │     │
│ │ ○ Patrocinar atleta (fixo mensal)           │     │
│ │ ○ Giveaway de GCoins (engajamento)          │     │
│ │ ○ Produto no marketplace (comissão)         │     │
│ │                                             │     │
│ │ 2. TARGETING                                │     │
│ │ Esportes: [Corrida] [Beach Tennis] [+]      │     │
│ │ Região: [São Paulo] [Rio de Janeiro] [+]    │     │
│ │ Nível: [Todos] [Iniciante] [Inter] [Avanç]  │     │
│ │ Idade: [18-25] [25-35] [35-45] [45+]        │     │
│ │                                             │     │
│ │ Alcance estimado: 45.000 atletas            │     │
│ │                                             │     │
│ │ 3. ORÇAMENTO                                │     │
│ │ Diário: R$ [50] | Total: R$ [1.500]         │     │
│ │ Duração: [30 dias]                          │     │
│ │                                             │     │
│ │ [Publicar Campanha]                         │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ MARKETPLACE DE ATLETAS                              │
│ ┌─────────────────────────────────────────────┐     │
│ │ Atletas disponíveis para patrocínio:        │     │
│ │ ┌───────────────────────────────────────┐   │     │
│ │ │ @mariarun | Corrida | 12.5K fãs      │   │     │
│ │ │ Engajamento: 8.5% | CPM: R$2.50      │   │     │
│ │ │ [Patrocinar — R$500/mês]             │   │     │
│ │ └───────────────────────────────────────┘   │     │
│ │ ┌───────────────────────────────────────┐   │     │
│ │ │ @joaobt | Beach Tennis | 8.2K fãs     │   │     │
│ │ │ Engajamento: 12% | CPM: R$1.80       │   │     │
│ │ │ [Patrocinar — R$350/mês]             │   │     │
│ │ └───────────────────────────────────────┘   │     │
│ └─────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

---

## Parte 3: Plano de Execução — Fases Ordenadas por Impacto

### FASE 0: Infraestrutura Crítica (Pré-requisito para tudo)
**Duração estimada: 2-3 semanas**

| # | Feature | Justificativa |
|---|---------|---------------|
| 0.1 | **Upload de arquivos** (Cloudflare R2 ou S3) | Sem upload não há fotos, avatares, conteúdo |
| 0.2 | **Pagamento real** (Stripe ou AppMax para PIX/cartão/boleto) | Sem pagamento não há economia |
| 0.3 | **Envio de emails** (Resend) | Verificação, recuperação de senha, notificações |
| 0.4 | **Middleware de auth real** | Rotas protegidas, roles validados server-side |
| 0.5 | **Rate limiting** | Proteção contra abuse |
| 0.6 | **SEO básico** (meta tags, OG images, sitemap) | Descoberta orgânica |
| 0.7 | **PWA manifest** | Install prompt, ícone na tela |

### FASE 1: Pilar Profissional — Cold Start (Tráfego desde o Dia 1)
**Duração estimada: 3-4 semanas**

| # | Feature | Justificativa |
|---|---------|---------------|
| 1.1 | **Integração com API de dados esportivos** (API-Football, SportMonks) | Dados de jogos profissionais em tempo real |
| 1.2 | **Páginas de jogos ao vivo** com live scores, stats, timeline | Engajamento contínuo |
| 1.3 | **Calendário de eventos profissionais** | Programação de jogos |
| 1.4 | **Páginas de times e atletas profissionais** | SEO + conteúdo |
| 1.5 | **Apostas com GCoins em jogos profissionais** | Monetização + retenção |
| 1.6 | **Chat ao vivo por jogo** (WebSocket) | Comunidade em tempo real |
| 1.7 | **Push notifications** para gols, resultados, odds | Re-engajamento |

### FASE 2: Creator Economy — Monetização de Atletas
**Duração estimada: 4-5 semanas**

| # | Feature | Justificativa |
|---|---------|---------------|
| 2.1 | **Perfil de atleta como "canal"** (novo layout) | Base da creator economy |
| 2.2 | **Sistema de tiers/assinaturas** (Free, Fã, VIP, Patrono) | Receita recorrente |
| 2.3 | **Conteúdo gated** (blur + lock + paywall) | Conteúdo exclusivo |
| 2.4 | **GCoin Gifts** com animações e leaderboard de fãs | Engajamento + monetização |
| 2.5 | **Super Comments** (destacados pagos) | Monetização social |
| 2.6 | **Fan Badges** (Bronze→Silver→Gold→Diamond) | Gamificação de fãs |
| 2.7 | **Dashboard de receita para creators** | Transparência para atletas |
| 2.8 | **Shoutouts** (vídeos personalizados, modelo Cameo) | Monetização premium |
| 2.9 | **Programa de afiliados** "Meu Equipamento" | Receita passiva para atletas |

### FASE 3: Experiências por Persona — Diferenciação
**Duração estimada: 3-4 semanas**

| # | Feature | Justificativa |
|---|---------|---------------|
| 3.1 | **Onboarding multi-persona** (wizard com self-segmentation) | Primeira impressão personalizada |
| 3.2 | **Home personalizada** por tipo de usuário | Relevância do conteúdo |
| 3.3 | **Dashboard do organizador** (wizard de torneio, check-in QR, financeiro) | Experiência completa para organizadores |
| 3.4 | **Dashboard da marca** (self-serve ads, targeting, ROI) | Self-serve para marcas |
| 3.5 | **Interface de apostas** estilo FanDuel (bet slip, parlays, cash out) | Experiência de apostas premium |
| 3.6 | **Matchmaking automático** (encontrar oponentes por nível/região) | Engajamento para atletas |
| 3.7 | **Registro de resultados mobile-first** para árbitros | Ferramenta para árbitros |

### FASE 4: Social e Engajamento — Retenção
**Duração estimada: 2-3 semanas**

| # | Feature | Justificativa |
|---|---------|---------------|
| 4.1 | **WebSocket** para chat, live updates, notificações | Real-time experience |
| 4.2 | **Busca completa** (Typesense: atletas, torneios, posts, times) | Descoberta |
| 4.3 | **Stories/Reels** (conteúdo curto efêmero) | Engajamento diário |
| 4.4 | **Enquetes e votações** em jogos ao vivo | Interação de fãs |
| 4.5 | **Fantasy Sports** (escalação virtual, liga com amigos) | Retenção semanal |
| 4.6 | **Certificados digitais** de participação (shareable) | Prova social |
| 4.7 | **Year in Sport** (recap anual compartilhável, estilo Strava) | Viralização |

### FASE 5: Compliance e Escala
**Duração estimada: 2-3 semanas**

| # | Feature | Justificativa |
|---|---------|---------------|
| 5.1 | **LGPD compliance** (termos, consentimento, exclusão de dados) | Legal |
| 5.2 | **Responsible gambling** (limites, autoexclusão) | Regulatório |
| 5.3 | **KYC básico** (verificação de identidade para saques) | Anti-fraude |
| 5.4 | **Monitoring completo** (Sentry + PostHog + analytics) | Observabilidade |
| 5.5 | **Testes automatizados** (unit + e2e) | Qualidade |
| 5.6 | **CI/CD completo** | Deploy confiável |
| 5.7 | **CDN + caching** | Performance |
| 5.8 | **i18n** (EN como segundo idioma) | Expansão |

---

## Parte 4: Novas Tabelas de Banco Necessárias

### Creator Economy
```sql
-- Tiers de assinatura definidos por cada atleta
creator_tiers (id, creator_id, name, price_monthly_cents, description, benefits_json, sort_order, is_active)

-- Assinaturas ativas de fãs
fan_subscriptions (id, fan_id, creator_id, tier_id, status, started_at, expires_at, payment_method, auto_renew)

-- Conteúdo gated por tier
gated_content (id, creator_id, post_id, min_tier_id, teaser_text, teaser_image_url)

-- Gifts enviados
gifts (id, sender_id, receiver_id, gift_type, gcoin_amount, message, post_id, created_at)

-- Tipos de gift disponíveis
gift_types (id, name, emoji, gcoin_cost, animation_url, sort_order, is_active)

-- Super comments (destacados)
super_comments (id, comment_id, gcoin_amount, highlight_color, is_pinned)

-- Shoutout requests
shoutout_requests (id, fan_id, creator_id, message, gcoin_amount, video_url, status, deadline, created_at, completed_at)

-- Fan badges
fan_badges (id, fan_id, creator_id, tier, total_gcoins_given, months_subscribed, updated_at)

-- Affiliate links
affiliate_products (id, creator_id, product_name, product_url, image_url, price, commission_pct, clicks, purchases, sort_order)

-- Creator analytics (aggregated)
creator_stats (id, creator_id, date, subscribers, gifts_received, gift_revenue, subscription_revenue, affiliate_revenue, impressions, profile_views)
```

### Esportes Profissionais
```sql
-- Times profissionais indexados
pro_teams (id, name, short_name, logo_url, sport_id, league, country, external_id, metadata_json)

-- Atletas profissionais indexados
pro_athletes (id, name, photo_url, team_id, sport_id, position, nationality, external_id, stats_json)

-- Competições profissionais
pro_competitions (id, name, sport_id, country, season, logo_url, external_id, is_active)

-- Jogos profissionais
pro_matches (id, competition_id, home_team_id, away_team_id, status, home_score, away_score, kickoff_at, venue, external_id, stats_json, events_json)

-- Odds de apostas
pro_match_odds (id, match_id, market_type, selection, odds_decimal, updated_at)

-- Apostas em jogos profissionais
pro_bets (id, user_id, match_id, market_type, selection, gcoin_amount, odds_at_placement, potential_winnings, status, settled_at)

-- Favoritos do usuário (times, atletas, competições)
user_favorites (id, user_id, entity_type, entity_id, created_at)
```

### Apostas Avançadas
```sql
-- Parlays (apostas combinadas)
parlays (id, user_id, gcoin_amount, total_odds, potential_winnings, status, created_at, settled_at)

-- Legs do parlay
parlay_legs (id, parlay_id, match_id, market_type, selection, odds, status)
```

---

## Parte 5: APIs Externas Necessárias

| Serviço | Uso | Custo Estimado |
|---------|-----|----------------|
| **API-Football** (via RapidAPI) | Dados de futebol em tempo real | $99-299/mês |
| **SportMonks** | Dados multi-esporte | $79-199/mês |
| **Stripe** ou **AppMax** | Pagamentos (PIX, cartão, boleto) | 2.5-3.5% por transação |
| **Resend** | Emails transacionais | Free tier: 3K/mês, depois $20/mês |
| **Cloudflare R2** | Storage de arquivos/imagens | $0.015/GB/mês (barato) |
| **Typesense Cloud** ou self-hosted | Busca full-text | $29-99/mês ou self-hosted |
| **OneSignal** ou **Firebase FCM** | Push notifications | Free tier generoso |
| **Pusher** ou **Ably** | WebSockets (chat, live) | Free-$49/mês |
| **Sentry** | Error monitoring | Free tier: 5K events/mês |
| **PostHog** | Product analytics | Free tier: 1M events/mês |

---

## Resumo: De MVP para Produto Completo

| Métrica | Hoje | Produto Completo |
|---------|------|-----------------|
| Tabelas no DB | 38 | ~58 (+20 novas) |
| Endpoints de API | 130+ | 250+ |
| Páginas/Rotas | ~25 | ~45 |
| Fontes de receita implementadas | 2 (compra GCoin + inscrição) | 14 |
| Personas atendidas de verdade | 2 (atleta genérico + organizador básico) | 6 completas |
| Conteúdo profissional | 0 | Brasileirão, Copa BR, UFC, Beach Tennis, + |
| Creator economy features | 0 | 9 features |
| Real-time features | 0 | Chat, live scores, notifications |
| Pagamento real | ❌ | ✅ PIX + Cartão + Boleto |
| Upload de arquivos | ❌ | ✅ R2/S3 |
| Busca | ❌ | ✅ Typesense full-text |
| PWA | ❌ | ✅ Instalável |
