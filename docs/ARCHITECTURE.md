# Arquitetura do Sistema - Sportio

## 1. Visao Geral

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTES                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Web App  │  │  PWA /   │  │  App Nativo      │  │
│  │ (Next.js)│  │  Mobile  │  │  (futuro - RN)   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────────────┘  │
└───────┼──────────────┼─────────────┼────────────────┘
        │              │             │
        └──────────────┼─────────────┘
                       │
┌──────────────────────┼──────────────────────────────┐
│                 EDGE LAYER (Vercel)                   │
│  ┌────────────────┐  ┌──────────────────────────┐   │
│  │ CDN + Static   │  │ Edge Functions            │   │
│  │ Assets         │  │ (Middleware, Auth, Geo)   │   │
│  └────────────────┘  └──────────────────────────┘   │
└──────────────────────┼──────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────┐
│              APPLICATION LAYER                        │
│                                                       │
│  ┌─────────────────────────────────────────────┐     │
│  │           Next.js App Router                 │     │
│  │  ┌─────────────┐  ┌───────────────────────┐ │     │
│  │  │ Server      │  │ API Layer             │ │     │
│  │  │ Components  │  │ (tRPC + Route Handler)│ │     │
│  │  │ (RSC)       │  │                       │ │     │
│  │  └─────────────┘  └───────────┬───────────┘ │     │
│  └────────────────────────────────┼─────────────┘     │
│                                   │                   │
│  ┌────────────────────────────────┼─────────────┐     │
│  │          SERVICE LAYER                       │     │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │     │
│  │  │ Auth     │ │ GCoin    │ │ Tournament   │ │     │
│  │  │ Service  │ │ Service  │ │ Service      │ │     │
│  │  └──────────┘ └──────────┘ └──────────────┘ │     │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │     │
│  │  │ Betting  │ │ Social   │ │ Matching     │ │     │
│  │  │ Service  │ │ Service  │ │ Service (IA) │ │     │
│  │  └──────────┘ └──────────┘ └──────────────┘ │     │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │     │
│  │  │ Payment  │ │ Notif.   │ │ Antifraud    │ │     │
│  │  │ Service  │ │ Service  │ │ Service      │ │     │
│  │  └──────────┘ └──────────┘ └──────────────┘ │     │
│  └──────────────────────────────────────────────┘     │
└──────────────────────┼──────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────┐
│                DATA LAYER                             │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │PostgreSQL│  │  Redis   │  │  Object Storage  │   │
│  │ (Neon)   │  │(Upstash) │  │ (Cloudflare R2)  │   │
│  │          │  │          │  │                   │   │
│  │- Users   │  │- Cache   │  │- Imagens         │   │
│  │- Tourneys│  │- Sessions│  │- Videos          │   │
│  │- GCoins  │  │- Rankings│  │- Documentos      │   │
│  │- Bets    │  │- Rate    │  │- Fotos eventos   │   │
│  │- Social  │  │  Limit   │  │                   │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              SERVICOS EXTERNOS                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Stripe / │  │ Pusher / │  │ Resend (Email)   │   │
│  │ MercadoPg│  │ Ably     │  │                   │   │
│  │(Payments)│  │(Realtime)│  │ Sentry (Errors)  │   │
│  └──────────┘  └──────────┘  │ PostHog(Analytics)│   │
│  ┌──────────┐  ┌──────────┐  │ Claude (IA)      │   │
│  │ WhatsApp │  │ Maps API │  └──────────────────┘   │
│  │ Business │  │ (Google) │                          │
│  └──────────┘  └──────────┘                          │
└──────────────────────────────────────────────────────┘
```

---

## 2. Padroes Arquiteturais

### 2.1 Server Components First

Next.js App Router com React Server Components como padrao:

```
Pagina (Server Component)
├── Dados buscados no servidor (zero JS no cliente)
├── SEO otimizado (HTML renderizado)
├── Streaming SSR para carregamento progressivo
└── Client Components apenas quando necessario
    ├── Interatividade (cliques, formularios)
    ├── Estado local (hooks)
    └── Animacoes (Framer Motion)
```

### 2.2 tRPC para API Type-Safe

```
Cliente (React)                    Servidor (Next.js)
┌──────────────┐                  ┌──────────────────┐
│ useQuery()   │ ────type-safe──→ │ tRPC Router      │
│ useMutation()│ ←────────────── │ (procedures)      │
│              │   inferencia     │                    │
│ Zod schemas  │   automatica     │ Zod validation    │
└──────────────┘    de tipos      └──────────────────┘
```

### 2.3 Fluxo de Dados

```
UI Component
    │
    ▼
tRPC Client (useQuery/useMutation)
    │
    ▼
tRPC Router (validacao Zod)
    │
    ▼
Service Layer (logica de negocio)
    │
    ▼
Drizzle ORM (query builder type-safe)
    │
    ▼
PostgreSQL (Neon)
```

---

## 3. Autenticacao e Autorizacao

### 3.1 Fluxo de Auth

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│  Login  │────→│ NextAuth │────→│ Session  │
│  Page   │     │  v5      │     │ JWT/DB   │
└─────────┘     └──────────┘     └──────────┘
                     │
              ┌──────┼──────┐
              │      │      │
           Google  Email  Telefone
           OAuth   Magic   SMS OTP
                   Link
```

### 3.2 RBAC (Role-Based Access Control)

```typescript
enum UserRole {
  ATHLETE = 'athlete',
  ORGANIZER = 'organizer',
  BRAND = 'brand',
  FAN = 'fan',
  BETTOR = 'bettor',
  REFEREE = 'referee',
  TRAINER = 'trainer',
  NUTRITIONIST = 'nutritionist',
  PHOTOGRAPHER = 'photographer',
  ARENA_OWNER = 'arena_owner',
  ADMIN = 'admin'
}

// Usuarios podem ter multiplos roles
// Ex: Um usuario pode ser Atleta + Apostador + Fa
```

### 3.3 Middleware de Protecao

```
Request
  │
  ▼
Edge Middleware (Vercel)
  │
  ├─ Rota publica? → Permite
  │
  ├─ Rota protegida? → Verifica session
  │   │
  │   ├─ Sem session → Redirect /login
  │   └─ Com session → Verifica role
  │       │
  │       ├─ Role insuficiente → 403
  │       └─ Role OK → Permite
  │
  └─ API route? → Verifica token + rate limit
```

---

## 4. Real-Time

### 4.1 Eventos Real-Time

| Evento | Canal | Tecnologia |
|--------|-------|------------|
| Placar ao vivo | tournament:{id} | WebSocket (Pusher) |
| Chat mensagens | chat:{room} | WebSocket |
| Notificacoes | user:{id} | WebSocket |
| Odds atualizadas | betting:{match} | WebSocket |
| GPS tracking | race:{id} | WebSocket |
| Feed social | feed:global | SSE ou polling |
| Ranking updates | ranking:{sport} | Redis pub/sub |

### 4.2 Arquitetura Real-Time

```
Cliente                    Servidor                    Pusher/Ably
┌────────┐              ┌────────────┐              ┌──────────┐
│ pusher │◄────────────│  API Route  │─────────────►│  Channel │
│  -js   │  subscribe   │  (trigger) │   publish     │  Server  │
└────────┘              └────────────┘              └──────────┘
```

---

## 5. Pagamentos

### 5.1 Fluxo de Pagamento

```
Inscricao Torneio / Compra
         │
         ▼
    Checkout Page
         │
    ┌────┼────┐
    │    │    │
   PIX  Cartao Boleto
    │    │     │
    ▼    ▼     ▼
  Gateway de Pagamento
  (Stripe / MercadoPago)
         │
         ▼
    Webhook confirma
         │
         ▼
    Credita GCoins
    Confirma inscricao
```

### 5.2 Fluxo de Saque (PIX)

```
Usuario solicita saque
         │
         ▼
    Verifica saldo GCoins Reais
         │
         ▼
    Verifica limites e antifraude
         │
         ▼
    Processa transferencia PIX
    (Stripe Connect / MercadoPago)
         │
         ▼
    Debita GCoins + Registra transacao
```

### 5.3 Split de Pagamentos

Para torneios e marketplace:

```
Inscricao R$ 100
    │
    ├─ Organizador: 60-70%
    ├─ Sportio: 15-20%
    ├─ Premiacao: 10-20%
    └─ Arbitro: 5%
```

---

## 6. Cache Strategy

### 6.1 Niveis de Cache

```
┌────────────────────────────────┐
│ Browser Cache (assets, images) │  TTL: 1 ano (hashed)
├────────────────────────────────┤
│ CDN Cache (Vercel Edge)        │  TTL: 1-5 min (pages)
├────────────────────────────────┤
│ Redis Cache (Upstash)          │  TTL: variavel
│ - Rankings: 5 min              │
│ - Perfis publicos: 10 min     │
│ - Estatisticas: 1 min         │
│ - Sessions: 24h               │
├────────────────────────────────┤
│ Database (PostgreSQL)          │  Source of truth
└────────────────────────────────┘
```

### 6.2 Invalidacao

- **Rankings**: Invalidado quando resultado e registrado
- **Perfil**: Invalidado quando usuario atualiza
- **Torneios**: Invalidado quando status muda
- **Blog**: Revalidacao ISR (1 hora)

---

## 7. Observabilidade

```
┌─────────────────────────────────────┐
│            Aplicacao                 │
│                                     │
│  Sentry ─── Errors + Performance    │
│  PostHog ── Analytics + Flags       │
│  Logtail ── Logs estruturados       │
│  Vercel ─── Web Vitals              │
│                                     │
└─────────────────────────────────────┘
```

### Alertas Criticos

- Error rate > 1% → Slack + Email
- API latency p95 > 2s → Slack
- Payment failure → Slack imediato
- Antifraude detection → Email + Dashboard
- Downtime → PagerDuty

---

## 8. Escalabilidade

### Fase 1: 0-10k usuarios
- Vercel (serverless)
- Neon free tier
- Upstash free tier
- Custo: ~$0-50/mes

### Fase 2: 10k-100k usuarios
- Vercel Pro
- Neon Scale
- Upstash Pro
- CDN + Image optimization
- Custo: ~$200-500/mes

### Fase 3: 100k-500k+ usuarios
- Vercel Enterprise
- Neon Business (read replicas)
- Redis cluster
- Dedicated WebSocket server
- Background jobs (Inngest/Trigger.dev)
- Custo: ~$1000-3000/mes

---

## 9. Background Jobs

Para tarefas assincronas:

| Job | Frequencia | Ferramenta |
|-----|-----------|------------|
| Calcular rankings | A cada 5 min | Cron (Vercel) |
| Processar saques PIX | A cada hora | Queue (Inngest) |
| Enviar notificacoes | Evento | Queue (Inngest) |
| Gerar certificados | Pos-torneio | Queue |
| Antifraude scan | Tempo real | Event-driven |
| Email marketing | Agendado | Resend + Cron |
| Limpar cache | A cada hora | Cron |
| Backup dados | Diario | Neon (automatico) |
