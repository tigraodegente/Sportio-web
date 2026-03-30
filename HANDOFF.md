# HANDOFF: Sessão Web → Local

## Branch: `claude/whatsapp-contact-integration-4tfnW`

Para puxar as alterações:
```bash
git fetch origin claude/whatsapp-contact-integration-4tfnW
git checkout claude/whatsapp-contact-integration-4tfnW
npm install
```

---

## O QUE FOI FEITO (2 commits)

### Commit 1: `feat: add 100% WhatsApp-first bot integration`
Criou toda a integração WhatsApp do zero (26 arquivos, 5.151 linhas):

**Arquivos novos em `src/whatsapp/`:**
- `config.ts` - Configuração unificada (Evolution API + Cloud API + PIX + AI)
- `types.ts` - Tipos TypeScript para mensagens WhatsApp (incoming/outgoing)
- `router.ts` - Cérebro do bot: recebe mensagem → detecta estado → roteia para handler
- `webhook.ts` - Parser de webhooks (suporta Evolution API e WhatsApp Cloud API)
- `server.ts` - Servidor HTTP standalone na porta 3001
- `index.ts` - Exports centralizados

**Handlers (`src/whatsapp/handlers/`):**
- `onboarding.ts` - Cadastro/login (nome → email → role → esporte → cidade)
- `tournaments.ts` - Listar, ver detalhes, inscrever, criar (multi-step)
- `betting.ts` - Apostas abertas, apostar em match/challenge, minhas apostas, ranking
- `challenges.ts` - Criar duelo, buscar oponente, aceitar/recusar, notificar
- `gcoins.ts` - Saldo, comprar via PIX (gera QR EMV), transferir, histórico
- `social.ts` - Feed, criar post, trending
- `profile.ts` - Ver perfil, editar campos, conquistas
- `leaderboard.ts` - Rankings XP, apostas, GCoins
- `notifications.ts` - Listar, marcar como lidas
- `ai-chat.ts` - Intent detection por regex + fallback Claude API

**Services (`src/whatsapp/services/`):**
- `whatsapp-client.ts` - Cliente unificado que envia mensagens via Evolution OU Cloud API
- `session-manager.ts` - Estado da conversa em memória (Map), link phone→userId no DB
- `menu-builder.ts` - Templates de menus (botões, listas, carrosséis)
- `pix-generator.ts` - Gera payload PIX EMV/BR Code (copia e cola)
- `notification-sender.ts` - Envio proativo de notificações via WhatsApp
- `community-manager.ts` - Criação automática de grupos por torneio/esporte

**WhatsApp Flows (`src/whatsapp/flows/`):**
- `tournament-enrollment.json` - Formulário de inscrição
- `bet-placement.json` - Formulário de aposta
- `create-challenge.json` - Formulário de desafio
- `create-tournament.json` - Formulário de criação de torneio

**Webhook API (`src/app/api/whatsapp/route.ts`)** - rota Next.js (depois removida)

**Schema alterado:** Adicionou coluna `whatsappSent` na tabela `notifications`

### Commit 2: `refactor: remove ALL frontend, convert to 100% WhatsApp-first`
Removeu TUDO que era frontend. 211 arquivos alterados, -59.869 linhas:

**DELETADO:**
- `src/app/` inteiro (57 páginas Next.js, layouts, API routes)
- `src/components/` inteiro (74 componentes React)
- `src/lib/` (tRPC client, utils, blog-data, mock data, constants)
- `src/stores/` (Zustand - auth-store, ui-store)
- `src/contexts/` (GiftContext)
- `src/hooks/` (useFileUpload)
- `src/types/` (frontend types)
- `apps/mobile/` inteiro (workspace Expo)
- `packages/` inteiro (api-client, shared, ui)
- `tests/e2e/` (testes frontend)
- `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`
- `vercel.json`, `pnpm-workspace.yaml`
- Workflows: `deploy.yml`, `e2e-tests.yml`

**MODIFICADO:**
- `package.json` - Removidas 25+ deps frontend (React, Next, Tailwind, Framer Motion, Recharts, Zustand, NextAuth, react-hook-form, lucide-react, etc.). Mantidas só backend deps. Scripts agora apontam pro WhatsApp bot.
- `tsconfig.json` - Removido JSX, DOM libs, Next.js plugin
- `src/server/auth/index.ts` - Substituído NextAuth por funções simples de auth por telefone
- `src/server/api/trpc.ts` - Removida dependência de NextAuth session, aceita userId direto
- `.env.example` - Focado em WhatsApp + PIX + Evolution API
- `CLAUDE.md` - Documentação atualizada para arquitetura WhatsApp-first

**MANTIDO (70 arquivos):**
- `src/server/db/` - Schema (48 tabelas), seeds, connection
- `src/server/api/routers/` - 21 routers tRPC (lógica de negócio como referência)
- `src/server/services/` - 9 serviços (bet-settlement, gamification, odds, etc.)
- `src/server/auth/` - Auth simplificado por telefone
- `src/server/lib/` - Stripe, storage
- `src/whatsapp/` - Bot completo (26 arquivos)
- `drizzle.config.ts`, `db-setup.yml`

---

## ESTRUTURA FINAL DO PROJETO

```
src/
├── whatsapp/                     # BOT (entry point: npm run dev)
│   ├── server.ts                 # HTTP server porta 3001
│   ├── config.ts                 # Toda configuração
│   ├── types.ts                  # Tipos WhatsApp
│   ├── router.ts                 # Roteador de mensagens
│   ├── webhook.ts                # Parser webhooks
│   ├── index.ts                  # Exports
│   ├── handlers/                 # 10 handlers de features
│   ├── services/                 # 6 serviços
│   └── flows/                    # 4 WhatsApp Flows JSON
├── server/
│   ├── db/schema.ts              # 48 tabelas (core do sistema)
│   ├── db/index.ts               # Conexão Neon PostgreSQL
│   ├── db/seed*.ts               # Seeds
│   ├── api/routers/              # 21 routers (lógica de negócio)
│   ├── api/trpc.ts               # Setup tRPC (standalone)
│   ├── services/                 # 9 serviços backend
│   ├── auth/index.ts             # Auth por telefone
│   └── lib/                      # Stripe, storage
```

## COMO RODAR
```bash
npm run dev        # Inicia bot WhatsApp (porta 3001, hot reload)
npm run start      # Produção
npm run db:push    # Push schema pro banco
npm run db:seed    # Seed do banco
npm run db:setup   # Push + seed
npm run db:studio  # GUI do banco (Drizzle Studio)
```

## DECISÕES ARQUITETURAIS

1. **WhatsApp handlers NÃO usam tRPC** - Consultam banco direto via Drizzle. Mais simples, sem overhead.
2. **tRPC routers mantidos** - Servem como referência de lógica de negócio. Podem ser reativados se precisar de API REST/GraphQL no futuro.
3. **Dois providers WhatsApp** - `WHATSAPP_PROVIDER=evolution` (grátis, dev) ou `cloud` (oficial Meta, prod). Troca sem mudar código.
4. **Auth por telefone** - Número WhatsApp = identidade. Sem senha, sem login. Session in-memory (Map).
5. **PIX nativo** - Gera payload EMV BR Code como texto "copia e cola" dentro do chat.
6. **AI opcional** - Bot funciona 100% com keyword matching. Claude API só enriquece entendimento natural.

## PRÓXIMOS PASSOS SUGERIDOS

1. Configurar Evolution API (Docker) e testar webhook
2. Rodar `npm run db:push` para adicionar coluna `whatsapp_sent`
3. Testar fluxo completo: Oi → cadastro → menu → apostar
4. Implementar verificação real de pagamento PIX (webhook do banco)
5. Adicionar Redis para sessions em produção
6. Implementar cron jobs (settle bets, expire payments) como setInterval no server.ts
