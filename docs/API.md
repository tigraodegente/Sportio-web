# API Design - Sportio

## Visao Geral

A API do Sportio utiliza **tRPC** para comunicacao type-safe entre frontend e backend. Todas as rotas sao definidas em routers tRPC com validacao Zod.

---

## Routers

### auth

```typescript
auth.register          // POST - Cadastro de usuario
auth.login             // POST - Login (email/telefone)
auth.verifyEmail       // POST - Verificar email (magic link)
auth.verifyPhone       // POST - Verificar telefone (OTP)
auth.getSession        // GET  - Obter sessao atual
auth.updateProfile     // PUT  - Atualizar perfil
auth.addRole           // POST - Adicionar role ao usuario
auth.submitVerification // POST - Enviar documentos para verificacao
```

### user

```typescript
user.getById           // GET  - Perfil publico do usuario
user.getByUsername     // GET  - Perfil por username
user.getStats          // GET  - Estatisticas do usuario
user.getRoles          // GET  - Roles do usuario
user.getSports         // GET  - Esportes do usuario
user.updateSport       // PUT  - Atualizar dados de esporte
user.getFollowers      // GET  - Lista de seguidores
user.getFollowing      // GET  - Lista de quem segue
user.follow            // POST - Seguir usuario
user.unfollow          // POST - Deixar de seguir
user.search            // GET  - Buscar usuarios (filtros: esporte, nivel, cidade)
user.getRankings       // GET  - Rankings por esporte/regiao
user.getReferralStats  // GET  - Estatisticas de indicacao
```

### tournament

```typescript
tournament.list        // GET  - Listar torneios (filtros: esporte, data, local, status)
tournament.getById     // GET  - Detalhes do torneio
tournament.getBySlug   // GET  - Torneio por slug
tournament.create      // POST - Criar torneio (organizador)
tournament.update      // PUT  - Atualizar torneio
tournament.cancel      // POST - Cancelar torneio
tournament.enroll      // POST - Inscrever-se em torneio
tournament.cancelEnroll // POST - Cancelar inscricao
tournament.checkin     // POST - Check-in no torneio
tournament.getBracket  // GET  - Chaveamento
tournament.generateBracket // POST - Gerar chaveamento (IA)
tournament.getMatches  // GET  - Partidas do torneio
tournament.getLeaderboard // GET - Classificacao
tournament.getEnrollments // GET - Lista de inscritos
tournament.updateMatchResult // POST - Registrar resultado
tournament.validateResult // POST - Validar resultado (arbitro)
tournament.distributePrizes // POST - Distribuir premiacoes
tournament.getStats    // GET  - Estatisticas do torneio
```

### match

```typescript
match.getById          // GET  - Detalhes da partida
match.getLive          // GET  - Partidas ao vivo
match.updateScore      // POST - Atualizar placar (tempo real)
match.setReferee       // POST - Atribuir arbitro
match.validate         // POST - Validar resultado (arbitro)
match.getStats         // GET  - Estatisticas da partida
match.getHistory       // GET  - Historico de confrontos
```

### gcoin

```typescript
gcoin.getBalance       // GET  - Saldo do usuario (real + gamificacao)
gcoin.getTransactions  // GET  - Historico de transacoes (paginado)
gcoin.transfer         // POST - Transferir GCoins para outro usuario
gcoin.withdraw         // POST - Solicitar saque PIX
gcoin.getWithdrawals   // GET  - Historico de saques
gcoin.getEarnings      // GET  - Resumo de ganhos (periodo)
gcoin.getMonthlyReport // GET  - Relatorio mensal detalhado
```

### betting

```typescript
betting.getAvailable   // GET  - Partidas disponiveis para aposta
betting.getOdds        // GET  - Odds de uma partida
betting.placeBet       // POST - Fazer aposta
betting.cancelBet      // POST - Cancelar aposta (antes do inicio)
betting.getMyBets      // GET  - Minhas apostas (filtros: status, periodo)
betting.getHistory     // GET  - Historico de apostas
betting.getLeaderboard // GET  - Ranking de apostadores
betting.getStats       // GET  - Estatisticas de acuracia
betting.setLimits      // PUT  - Configurar limites diarios/mensais
betting.createPrivate  // POST - Criar aposta privada entre amigos
```

### social

```typescript
social.getFeed         // GET  - Feed social (paginado)
social.getPost         // GET  - Post individual
social.createPost      // POST - Criar post
social.deletePost      // DELETE - Deletar post
social.likePost        // POST - Curtir post
social.unlikePost      // POST - Descurtir
social.getComments     // GET  - Comentarios de um post
social.addComment      // POST - Comentar
social.deleteComment   // DELETE - Deletar comentario
social.likeComment     // POST - Curtir comentario
social.sharePost       // POST - Compartilhar post
social.reportPost      // POST - Denunciar post
```

### challenge

```typescript
challenge.list         // GET  - Listar desafios disponiveis
challenge.getById      // GET  - Detalhes do desafio
challenge.join         // POST - Participar do desafio
challenge.updateProgress // POST - Atualizar progresso
challenge.getMyActive  // GET  - Meus desafios ativos
challenge.getHistory   // GET  - Historico de desafios
challenge.getLeaderboard // GET - Ranking do desafio
challenge.create       // POST - Criar desafio (organizador/marca)
```

### chat

```typescript
chat.getRooms          // GET  - Listar salas de chat
chat.getMessages       // GET  - Mensagens de uma sala (paginado)
chat.sendMessage       // POST - Enviar mensagem
chat.createRoom        // POST - Criar sala (grupo, torneio)
chat.addMember         // POST - Adicionar membro
chat.removeMember      // POST - Remover membro
chat.markAsRead        // POST - Marcar como lido
```

### notification

```typescript
notification.list      // GET  - Listar notificacoes (paginado)
notification.markRead  // POST - Marcar como lida
notification.markAllRead // POST - Marcar todas como lidas
notification.getUnreadCount // GET - Contagem de nao lidas
notification.updatePreferences // PUT - Preferencias de notificacao
```

### arena

```typescript
arena.list             // GET  - Listar arenas (filtro: esporte, cidade, distancia)
arena.getById          // GET  - Detalhes da arena
arena.create           // POST - Cadastrar arena (dono)
arena.update           // PUT  - Atualizar arena
arena.getAvailability  // GET  - Horarios disponiveis
arena.book             // POST - Reservar horario
arena.getBookings      // GET  - Reservas da arena
arena.getStats         // GET  - Estatisticas (ocupacao, receita)
```

### blog

```typescript
blog.list              // GET  - Listar posts (filtros: sport, tag, search)
blog.getBySlug         // GET  - Post por slug
blog.getRelated        // GET  - Posts relacionados
blog.getTags           // GET  - Todas as tags
```

### brand (marcas/patrocinadores)

```typescript
brand.getDashboard     // GET  - Dashboard da marca
brand.createCampaign   // POST - Criar campanha
brand.updateCampaign   // PUT  - Atualizar campanha
brand.getCampaigns     // GET  - Listar campanhas
brand.getCampaignStats // GET  - Metricas de campanha
brand.sponsorTournament // POST - Patrocinar torneio
brand.getAudienceData  // GET  - Dados de audiencia
```

### admin

```typescript
admin.getUsers         // GET  - Listar usuarios (admin)
admin.verifyUser       // POST - Verificar usuario
admin.rejectUser       // POST - Rejeitar verificacao
admin.getDashboard     // GET  - Dashboard administrativo
admin.getFinancials    // GET  - Relatorio financeiro
admin.flagUser         // POST - Sinalizar usuario (antifraude)
admin.getReports       // GET  - Denuncias/reports
admin.resolveReport    // POST - Resolver denuncia
```

---

## Autenticacao

Todas as rotas protegidas requerem session token via cookie:

```typescript
// Rotas publicas (sem auth)
auth.register, auth.login, auth.verify*
tournament.list, tournament.getBySlug
blog.list, blog.getBySlug
user.getById (perfil publico)

// Rotas protegidas (auth required)
Todas as demais rotas

// Rotas com role especifico
tournament.create         → organizer
tournament.validateResult → referee
brand.*                   → brand
admin.*                   → admin
arena.create              → arena_owner
```

---

## Paginacao

Padrao cursor-based para performance:

```typescript
input: {
  cursor?: string,  // ID do ultimo item
  limit: number,    // default: 20, max: 100
  sort?: 'recent' | 'popular' | 'relevant'
}

output: {
  items: T[],
  nextCursor?: string,
  hasMore: boolean,
  total?: number
}
```

---

## Real-Time Events (WebSocket)

```typescript
// Canais
'tournament:{id}' → score_update, match_start, match_end, bracket_update
'match:{id}'      → score_change, stat_update, bet_odds_update
'chat:{roomId}'   → new_message, member_joined, typing
'user:{id}'       → notification, gcoin_earned, challenge_progress
'race:{id}'       → gps_position, checkpoint, finish
'feed:global'     → new_post (via SSE ou polling)
```

---

## Rate Limiting

| Endpoint | Limite | Janela |
|----------|--------|--------|
| auth.login | 5 | 15 min |
| auth.register | 3 | 1 hora |
| betting.placeBet | 30 | 1 min |
| social.createPost | 10 | 1 min |
| gcoin.withdraw | 5 | 1 hora |
| Geral (auth'd) | 100 | 1 min |
| Geral (anon) | 30 | 1 min |

---

## Codigos de Erro

```typescript
enum ErrorCode {
  // Auth
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Business
  INSUFFICIENT_GCOINS = 'INSUFFICIENT_GCOINS',
  TOURNAMENT_FULL = 'TOURNAMENT_FULL',
  ALREADY_ENROLLED = 'ALREADY_ENROLLED',
  BET_LIMIT_EXCEEDED = 'BET_LIMIT_EXCEEDED',
  MATCH_NOT_LIVE = 'MATCH_NOT_LIVE',
  WITHDRAWAL_LIMIT = 'WITHDRAWAL_LIMIT',

  // System
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
}
```
