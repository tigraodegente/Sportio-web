# Roadmap de Desenvolvimento - Sportio

## Visao Geral das Fases

```
Fase 1 (MVP)          Fase 2 (Core)         Fase 3 (Scale)        Fase 4 (Expand)
4-6 semanas           4-6 semanas           4-6 semanas           Continuo
─────────────────────────────────────────────────────────────────────────────
Landing pages         App dashboard         Apostas               eSports
Auth + Perfis         Torneios completos    Chat real-time        Marketplace fotos
Blog                  GCoins economia       IA matchmaking        Apps nativos
SEO                   Feed social           Integracoes           Internacional
DB + API base         Pagamentos            Antifraude
                      Desafios              Rankings avancados
```

---

## Fase 1 - MVP (Semanas 1-6)

### Objetivo
Landing page funcional + autenticacao + blog + estrutura base da aplicacao.

### Sprint 1 (Semana 1-2): Fundacao

- [ ] **Setup do projeto**
  - Inicializar Next.js 15 + TypeScript + Tailwind 4
  - Configurar ESLint, Prettier, Husky
  - Configurar Vercel deploy
  - Setup pnpm workspace

- [ ] **Banco de dados**
  - Configurar Neon PostgreSQL
  - Schema Drizzle (users, roles, sports, blog_posts)
  - Migrations iniciais
  - Seed data (esportes, blog posts iniciais)

- [ ] **Autenticacao**
  - NextAuth v5 setup
  - Login com email (magic link)
  - Login com Google OAuth
  - Registro com selecao de role
  - Middleware de protecao de rotas

- [ ] **tRPC setup**
  - Configurar tRPC + React Query
  - Routers base: auth, user, blog

### Sprint 2 (Semana 3-4): Landing Pages

- [ ] **Layout e componentes base**
  - Header com navegacao (Home, Atletas, Organizadores, Marcas, Fas, Apostadores, Arbitros, Blog)
  - Footer
  - Componentes shadcn/ui instalados
  - Design system (cores, tipografia, espacamento)
  - Responsividade (mobile-first)

- [ ] **Home page**
  - Hero section com CTA
  - Estatisticas (12.500+ atletas, 850 torneios)
  - Secao economia GCoins
  - Como funciona (4 passos)
  - Tipos de usuario
  - Esportes suportados
  - Depoimentos/testimonials
  - FAQ
  - CTA final

- [ ] **Paginas por tipo de usuario**
  - /athletes - Hub para atletas
  - /organizers - Hub para organizadores
  - /brands - Hub para marcas
  - /fans - Hub para fas
  - /bettors - Hub para apostadores
  - /referees - Hub para arbitros

### Sprint 3 (Semana 5-6): Blog + SEO + Polish

- [ ] **Blog**
  - /blog - Lista de posts com filtros (esporte, tag, busca)
  - /blog/[slug] - Pagina individual
  - SEO meta tags (title, description, OG)
  - Schema markup
  - Compartilhamento social
  - Artigos relacionados
  - Tempo de leitura
  - Seed com 20+ artigos do conteudo extraido

- [ ] **SEO**
  - sitemap.xml
  - robots.txt
  - Meta tags em todas as paginas
  - OG images
  - Structured data

- [ ] **Modal de Login/Registro**
  - Modal global acessivel de qualquer pagina
  - Formulario de registro
  - Selecao de role e esporte

- [ ] **Polish e testes**
  - Lighthouse score > 90
  - Testes E2E das paginas principais
  - Mobile responsiveness
  - Acessibilidade basica
  - Error boundaries

### Entregaveis Fase 1
- Site publico com 9+ paginas otimizadas para SEO
- Sistema de autenticacao funcional
- Blog com 20+ artigos
- Deploy em producao (Vercel)
- Performance: LCP < 2.5s, CLS < 0.1

---

## Fase 2 - Core Features (Semanas 7-12)

### Objetivo
Dashboard funcional, sistema de torneios, economia GCoins e feed social.

### Sprint 4 (Semana 7-8): Dashboard + Perfil

- [ ] **Dashboard layout**
  - Sidebar navegacao
  - Header com notificacoes
  - Dashboard home (resumo de GCoins, proximos eventos, atividade)

- [ ] **Perfil do usuario**
  - Perfil publico completo
  - Edicao de perfil
  - Upload de avatar/cover
  - Adicionar esportes e posicoes
  - Estatisticas basicas
  - Badges e conquistas

- [ ] **Carteira digital**
  - Saldo GCoins (Real + Gamificacao)
  - Historico de transacoes
  - UI de saque (PIX)

### Sprint 5 (Semana 9-10): Torneios

- [ ] **Criar torneio**
  - Formulario completo (esporte, formato, datas, local, premiacao)
  - Preview do torneio
  - Publicacao

- [ ] **Listar/buscar torneios**
  - Filtros: esporte, data, cidade, nivel
  - Cards de torneio com info resumida
  - Mapa de torneios proximos

- [ ] **Inscricao**
  - Fluxo de inscricao
  - Integracao de pagamento (Stripe/MercadoPago)
  - Confirmacao por email

- [ ] **Chaveamento**
  - Geracao automatica de chave
  - Visualizacao de bracket
  - Registro de resultados

- [ ] **Placar ao vivo**
  - Atualizacao em tempo real (Pusher)
  - Timeline de eventos

### Sprint 6 (Semana 11-12): Social + GCoins

- [ ] **Feed social**
  - Criar posts (texto + imagem)
  - Feed paginado (infinite scroll)
  - Curtir, comentar, compartilhar
  - Seguir/deixar de seguir usuarios

- [ ] **Sistema de GCoins**
  - Creditar GCoins por acoes (vitoria, inscricao, etc.)
  - Debitar (apostas, compras)
  - Logica de multiplicadores/streaks
  - Transacoes atomicas

- [ ] **Desafios basicos**
  - Criar desafio (organizador/marca)
  - Listar desafios disponiveis
  - Participar e reportar progresso
  - Premiar conclusao

- [ ] **Notificacoes**
  - Sistema de notificacoes no app
  - Email para eventos criticos
  - Badge de nao lidas

### Entregaveis Fase 2
- Dashboard completo para atletas e organizadores
- Criacao e gestao de torneios
- Sistema de pagamentos funcional
- Feed social basico
- Economia GCoins operacional
- Notificacoes

---

## Fase 3 - Scale (Semanas 13-18)

### Sprint 7 (Semana 13-14): Apostas + Chat

- [ ] **Sistema de apostas**
  - Apostar GCoins em partidas
  - Tipos: vencedor, placar exato
  - Odds calculadas automaticamente
  - Liquidacao automatica pos-partida
  - Historico e estatisticas

- [ ] **Chat**
  - Chat 1-a-1
  - Grupos
  - Chat de torneio
  - Mensagens em tempo real (Pusher)

### Sprint 8 (Semana 15-16): IA + Integracoes

- [ ] **Matchmaking IA**
  - Classificacao automatica de nivel (A, B, C)
  - Sugestoes de adversarios
  - Formacao automatica de equipes

- [ ] **Integracoes**
  - Strava (corrida/ciclismo)
  - Garmin/Apple Watch (natacao, corrida)
  - GPS tracking para corridas

- [ ] **Antifraude**
  - Monitoramento de transacoes
  - Deteccao de padroes anomalos
  - Rate limiting agressivo
  - Validacao cruzada

### Sprint 9 (Semana 17-18): Rankings + Dashboard Avancado

- [ ] **Rankings avancados**
  - Rankings por esporte, regiao, nivel
  - Ranking de apostadores
  - Ranking de fas
  - Ranking de arenas
  - Ligas (Ouro, Prata, Bronze)

- [ ] **Dashboard da marca**
  - Criar campanhas
  - Segmentacao de audiencia
  - Analytics de performance
  - Patrocinio de torneios

- [ ] **Dashboard do arbitro**
  - Receber convites
  - Validar resultados
  - Historico e ranking

- [ ] **PWA**
  - Service Worker
  - Instalacao no celular
  - Push notifications

### Entregaveis Fase 3
- Sistema de apostas completo
- Chat em tempo real
- IA de matchmaking
- Integracoes com wearables
- Rankings e ligas
- Dashboards especializados
- PWA funcional

---

## Fase 4 - Expand (Semana 19+)

### Features Futuras (priorizacao flexivel)

- [ ] **eSports (CS2, etc.)**
  - Torneios online
  - Integracao com plataformas de jogos
  - Apostas em partidas de eSports

- [ ] **Marketplace de fotografos**
  - Upload de fotos por evento
  - Reconhecimento facial
  - Compra e download

- [ ] **Area de profissionais completa**
  - Dashboard nutricionista (videochamada, planos)
  - Dashboard personal trainer
  - Dashboard dono de arena (reservas, cashback)

- [ ] **Loja (sporteio.live)**
  - E-commerce integrado
  - Pagamento com GCoins
  - Produtos de parceiros

- [ ] **App nativo (React Native)**
  - Versao iOS
  - Versao Android
  - Push notifications nativo
  - Camera para video

- [ ] **Transmissao ao vivo**
  - Streaming de partidas
  - Integracao com plataformas de video
  - Watching time remunerado

- [ ] **Expansao internacional**
  - Portugal
  - America Latina
  - Internacionalizacao (i18n)
  - Multi-currency

- [ ] **Analytics avancado**
  - Dashboard de BI
  - Relatorios customizaveis
  - Exportacao de dados
  - Previsoes por IA

---

## Metricas de Sucesso por Fase

| Fase | Metrica | Target |
|------|---------|--------|
| 1 | Paginas online | 9+ |
| 1 | Lighthouse score | > 90 |
| 1 | Artigos no blog | 20+ |
| 2 | Usuarios registrados | 1.000 |
| 2 | Torneios criados | 50 |
| 2 | GCoins distribuidos | 100.000 |
| 3 | Usuarios ativos mensais | 5.000 |
| 3 | Apostas realizadas | 10.000 |
| 3 | Revenue (MRR) | R$ 10.000 |
| 4 | Usuarios totais | 50.000+ |
| 4 | Esportes ativos | 10+ |
| 4 | Revenue (MRR) | R$ 50.000+ |

---

## Prioridades Tecnicas

### P0 (Critico)
- Seguranca (auth, input validation, XSS, CSRF)
- Performance (LCP < 2.5s)
- SEO (paginas publicas)
- Pagamentos seguros

### P1 (Importante)
- Mobile responsiveness
- Acessibilidade (WCAG 2.1 AA)
- Testes automatizados (>60% cobertura)
- Monitoramento (errors, performance)

### P2 (Desejavel)
- Animacoes e microinteracoes
- Dark mode
- Offline support (PWA)
- Internacionalizacao
