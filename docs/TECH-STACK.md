# Stack Tecnologica - Sportio

## Decisao de Stack

### Criterios de Escolha

1. **Velocidade de desenvolvimento**: Stack que permita entregar rapido
2. **Performance**: Carregamento rapido, SEO otimizado, experiencia fluida
3. **Escalabilidade**: Suportar de 0 a 500k+ usuarios
4. **Custo**: Iniciar com custo minimo e escalar conforme necessidade
5. **Ecossistema**: Ferramentas maduras com boa documentacao
6. **Fullstack**: Uma linguagem (TypeScript) para frontend, backend e infra

---

## Stack Escolhida

### Frontend

| Tecnologia | Versao | Justificativa |
|-----------|--------|---------------|
| **Next.js** | 15+ (App Router) | SSR/SSG para SEO, Server Components para performance, API Routes para backend |
| **React** | 19+ | Biblioteca UI mais madura, maior ecossistema |
| **TypeScript** | 5.x | Seguranca de tipos, melhor DX, menos bugs |
| **Tailwind CSS** | 4.x | Estilizacao rapida, design system consistente, otimizado para producao |
| **shadcn/ui** | Latest | Componentes acessiveis, customizaveis, sem bloat |
| **Framer Motion** | Latest | Animacoes fluidas para gamificacao e transicoes |
| **React Hook Form** | Latest | Formularios performaticos com validacao |
| **Zod** | Latest | Validacao de schema compartilhada (front + back) |

### Backend

| Tecnologia | Versao | Justificativa |
|-----------|--------|---------------|
| **Next.js API Routes** | 15+ | Server Actions + Route Handlers, zero config adicional |
| **tRPC** | 11+ | API type-safe end-to-end, sem boilerplate |
| **Drizzle ORM** | Latest | ORM type-safe, SQL-like, migrations automaticas, excelente performance |
| **NextAuth.js (Auth.js)** | v5 | Autenticacao completa (email, Google, Apple, telefone) |

### Banco de Dados

| Tecnologia | Justificativa |
|-----------|---------------|
| **PostgreSQL** (via Neon/Supabase) | Banco relacional robusto, JSONB para flexibilidade, full-text search |
| **Redis** (via Upstash) | Cache, sessions, rate limiting, real-time leaderboards |
| **S3-compatible** (via Cloudflare R2) | Storage de imagens, videos, documentos |

### Servicos de Infraestrutura

| Servico | Uso | Justificativa |
|---------|-----|---------------|
| **Vercel** | Hosting + Deploy | Deploy automatico, edge functions, analytics, zero config |
| **Neon** | PostgreSQL serverless | Scale to zero, branching para dev, conexoes pool |
| **Upstash** | Redis serverless | Pay-per-request, global, rate limiting nativo |
| **Cloudflare R2** | Object storage | S3-compatible, sem egress fees, CDN global |
| **Resend** | Email transacional | API moderna, templates React, deliverability |
| **Stripe** | Pagamentos internacionais | Checkout, assinaturas, marketplace (Connect) |
| **Pusher/Ably** | WebSockets | Real-time para placar ao vivo, chat, notificacoes |

### Pagamentos Brasil

| Servico | Uso |
|---------|-----|
| **Stripe** | Cartoes, checkout, marketplace |
| **Mercado Pago** ou **Asaas** | PIX nativo, boleto, split de pagamentos |

### Monitoramento e Analytics

| Ferramenta | Uso |
|-----------|-----|
| **Vercel Analytics** | Web vitals, performance |
| **PostHog** | Product analytics, feature flags, session replay |
| **Sentry** | Error tracking, performance monitoring |
| **Better Stack** (Logtail) | Logs centralizados |

### IA e ML

| Ferramenta | Uso |
|-----------|-----|
| **Claude API (Anthropic)** | Matchmaking inteligente, analise de performance, chatbot |
| **OpenAI** | Alternativa para analise de texto/imagem |
| **Vercel AI SDK** | Streaming de IA, integracao simplificada |

---

## Estrutura do Projeto

```
sportio-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/        # Paginas publicas (home, blog, etc.)
│   │   │   ├── page.tsx        # Home
│   │   │   ├── athletes/
│   │   │   ├── organizers/
│   │   │   ├── brands/
│   │   │   ├── fans/
│   │   │   ├── bettors/
│   │   │   ├── referees/
│   │   │   └── blog/
│   │   │       ├── page.tsx    # Lista de posts
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   ├── (auth)/             # Paginas de autenticacao
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify/
│   │   ├── (dashboard)/        # Area logada
│   │   │   ├── layout.tsx      # Sidebar + nav
│   │   │   ├── dashboard/
│   │   │   ├── tournaments/
│   │   │   ├── wallet/
│   │   │   ├── profile/
│   │   │   ├── social/
│   │   │   ├── betting/
│   │   │   ├── challenges/
│   │   │   ├── chat/
│   │   │   ├── settings/
│   │   │   └── admin/
│   │   ├── api/                # API Routes
│   │   │   └── trpc/[trpc]/
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── marketing/          # Landing pages components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── tournament/         # Tournament-specific
│   │   ├── social/             # Feed, posts, comments
│   │   ├── betting/            # Apostas UI
│   │   └── shared/             # Header, Footer, etc.
│   ├── server/
│   │   ├── api/                # tRPC routers
│   │   │   ├── routers/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── tournament.ts
│   │   │   │   ├── gcoin.ts
│   │   │   │   ├── betting.ts
│   │   │   │   ├── social.ts
│   │   │   │   ├── challenge.ts
│   │   │   │   ├── chat.ts
│   │   │   │   └── admin.ts
│   │   │   ├── trpc.ts
│   │   │   └── root.ts
│   │   ├── db/
│   │   │   ├── schema/         # Drizzle schema
│   │   │   ├── migrations/
│   │   │   └── index.ts
│   │   ├── auth/               # Auth config
│   │   └── services/           # Business logic
│   │       ├── gcoin.ts
│   │       ├── tournament.ts
│   │       ├── matching.ts
│   │       ├── betting.ts
│   │       ├── notification.ts
│   │       └── antifraud.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── validations/        # Zod schemas
│   │   └── constants.ts
│   ├── hooks/                  # React hooks
│   ├── stores/                 # Zustand stores
│   └── types/                  # TypeScript types
├── public/
│   ├── images/
│   └── icons/
├── drizzle/                    # Drizzle config
├── .env.example
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

---

## Dependencias Principais

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@trpc/server": "^11.0.0",
    "@trpc/client": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@tanstack/react-query": "^5.0.0",
    "drizzle-orm": "latest",
    "next-auth": "^5.0.0",
    "zod": "^3.23.0",
    "tailwindcss": "^4.0.0",
    "framer-motion": "^11.0.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "zustand": "^5.0.0",
    "date-fns": "^3.0.0",
    "lucide-react": "latest",
    "sonner": "latest",
    "recharts": "^2.0.0",
    "@radix-ui/react-*": "latest",
    "pusher-js": "latest",
    "stripe": "latest",
    "@neondatabase/serverless": "latest",
    "@upstash/redis": "latest",
    "resend": "latest",
    "@sentry/nextjs": "latest",
    "posthog-js": "latest"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "drizzle-kit": "latest",
    "eslint": "^9.0.0",
    "eslint-config-next": "latest",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "latest",
    "@types/react": "latest",
    "@types/node": "latest",
    "vitest": "^2.0.0",
    "@testing-library/react": "latest",
    "playwright": "latest"
  }
}
```

---

## Performance

### Metricas Target

| Metrica | Target | Como |
|---------|--------|------|
| LCP | < 2.5s | SSR + Image optimization + CDN |
| FID | < 100ms | React Server Components, minimal JS |
| CLS | < 0.1 | Tailwind, layout stability |
| TTFB | < 200ms | Edge functions, DB connection pooling |
| Bundle size | < 100KB initial | Tree-shaking, code splitting |

### Estrategias

- **Server Components** por padrao (menos JS no cliente)
- **Streaming SSR** para carregamento progressivo
- **Image Optimization** via `next/image`
- **Code Splitting** automatico por rota
- **Edge Functions** para APIs criticas (baixa latencia)
- **CDN** para assets estaticos
- **Database Connection Pooling** via Neon
- **Redis Cache** para queries frequentes (rankings, estatisticas)

---

## Seguranca

| Aspecto | Implementacao |
|---------|---------------|
| Autenticacao | NextAuth v5 com JWT + sessions |
| Autorizacao | RBAC (Role-Based Access Control) |
| Input validation | Zod em todas as rotas |
| SQL Injection | Drizzle ORM (parametrizado) |
| XSS | React (escape automatico) + CSP headers |
| CSRF | NextAuth tokens + SameSite cookies |
| Rate Limiting | Upstash Redis |
| Dados sensiveis | Env vars, secrets management |
| SSL/TLS | Vercel (automatico) |
| Antifraude | Servico customizado com regras + IA |

---

## Ambientes

| Ambiente | URL | Branch | DB |
|----------|-----|--------|-----|
| Desenvolvimento | localhost:3000 | feature/* | Neon branch (dev) |
| Staging | staging.sportio.com | develop | Neon branch (staging) |
| Producao | sportio.com | main | Neon main |

### CI/CD

- **GitHub Actions** para CI (lint, type-check, test)
- **Vercel** para CD (deploy automatico por branch)
- **Preview deployments** para cada PR
- **Database migrations** automaticas via Drizzle Kit
