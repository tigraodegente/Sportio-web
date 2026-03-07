# SPORTIO — Documento de Apresentacao para Investidores

> **O Ecossistema Digital Completo do Esporte — Do Amador ao Profissional**

---

## Sumario Executivo

**Sportio** e uma plataforma digital que conecta todo o ecossistema esportivo — atletas amadores e profissionais, organizadores de torneios, marcas patrocinadoras, apostadores, fas e arbitros — em uma unica experiencia integrada com economia propria baseada em **GCoins**, uma moeda dual (real + gamificacao).

O Brasil tem **61 milhoes de praticantes regulares de esporte** (IBGE/PNAD), **17,7 milhoes de apostadores ativos** (SPA/Fazenda, 2025) e um mercado de apostas que movimenta **R$ 100 bilhoes/ano** (5o maior do mundo). Apesar desse volume, nao existe nenhuma plataforma que integre competicao, comunidade, monetizacao e apostas em um unico ecossistema — nem para o esporte amador, nem para o profissional.

Sportio resolve isso com uma abordagem em duas camadas:

1. **Camada de conteudo profissional** — Torneios como Brasileirao, Copa do Brasil, UFC e circuitos de beach tennis sao indexados na plataforma. Fas acompanham, apostam com GCoins e interagem. Isso gera trafego massivo desde o dia 1.
2. **Camada de competicao amadora** — Atletas amadores criam torneios, competem em duelos 1v1, ganham GCoins e sacam via PIX. Organizadores gerenciam eventos. Marcas patrocinam com self-serve.

O MVP esta **construido e funcional** com Next.js 15, tRPC, PostgreSQL, 40+ tabelas, 12 routers de API, sistema de gamificacao com 55+ conquistas, duelos 1v1 com apostas integradas e gateway de pagamento (PIX + cartao).

---

## O Mercado: Numeros Reais

### O Brasil Esportivo

| Dado | Numero | Fonte |
|------|--------|-------|
| Praticantes regulares de esporte | **61 milhoes** (37,9% da populacao 15+) | IBGE PNAD 2015 |
| Futebol (todas as formas) | **30,4 milhoes** | Federacoes estaduais / Top10Mais 2024 |
| Corrida de rua | **15 milhoes** | Olympikus/Box1824 "Por Dentro do Corre" 2025 |
| Volei | **15,3 milhoes** | Top10Mais 2024 |
| Futebol Society (pelada/7x7) | **12,5 milhoes** | Portal do Rodoviario 2024 |
| Beach Tennis | **1,1 milhao** (crescimento de 175% em 2 anos) | CBT 2023 |
| Padel | **600–700 mil** (crescendo 15-20%/ano) | Cobrapa 2024 |
| CrossFit (boxes afiliados) | **1.150 boxes** (2o maior do mundo) | Ativo.com 2024 |
| Mercado fitness total | **R$ 17 bilhoes/ano** | Panorama Setorial Fitness 2024 |
| E-commerce esportivo | **R$ 16,3 bilhoes** (+42,3% YoY) | MKT Esportivo 2024 |

### O Boom dos Torneios Amadores

| Dado | Numero | Fonte |
|------|--------|-------|
| Corridas de rua homologadas (2025) | **5.241 eventos** (+85% vs 2024) | Abraceo/CNN Brasil |
| Corridas de rua total (incluindo nao-homologadas) | **~8.500/ano** | Estimativa multiplas fontes |
| Ticket medio de inscricao (corrida) | **R$ 119,39** | Maquina do Esporte 2024 |
| Torneios de beach tennis (ITF + regionais) | **240+/ano** | CBT / LetzPlay |
| Quadras de beach tennis no Brasil | **30.000+** | FPT / Sagres Online 2024 |
| Campos de futebol society | **4.000–5.000** | Portal do Rodoviario 2024 |
| Ligas municipais de futebol | **150+** | Federacoes estaduais |
| Economia da corrida de rua | **R$ 1–2 bilhoes/ano** | Times Brasil / ISTOE 2025 |

### O Mercado de Apostas Esportivas no Brasil

| Dado | Numero | Fonte |
|------|--------|-------|
| Dinheiro apostado (2025) | **R$ 100+ bilhoes** (~1% do PIB) | Brazil Economy 2025 |
| Receita dos operadores (GGR, 2025) | **R$ 36 bilhoes** | Meio e Mensagem 2025 |
| Apostadores ativos (H1 2025) | **17,7 milhoes** | CNN Brasil / SPA |
| Pessoas que apostaram em 2024 | **50+ milhoes** | CNN Brasil |
| Gasto medio mensal por apostador | **R$ 164/mes** | ISTOE Dinheiro 2025 |
| Ranking global | **5o maior mercado do mundo** | InfoMoney 2025 |
| Arrecadacao federal com apostas (jan-set 2025) | **R$ 6,85 bilhoes** | Maquina do Esporte |
| Perfil: 16-39 anos | **56% dos apostadores** | DataSenado 2024 |
| Perfil: masculino | **62%** | DataSenado 2024 |
| Licenca SIGAP (outorga) | **R$ 30 milhoes / 5 anos** | Lei 14.790/23 |
| Operadores autorizados | **67 operadores, 139 marcas** | Serpro/SIGAP 2025 |

### Plataformas Comparaveis

| Plataforma | Dados | Fonte |
|------------|-------|-------|
| **Strava** (Brasil) | **20 milhoes de usuarios** (2o maior mercado global); valuation US$ 2,2 bi | Strava Year in Sport 2024; MKT Esportivo 2025 |
| **FlashScore** (global) | **155 milhoes MAU**, 400M+ downloads | FlashScore 2024 |
| **Sofascore** (global) | **25-30 milhoes de usuarios**, 20+ esportes | TechTudo 2024 |
| **Torneo by Sofascore** | Gestao de torneios integrada ao Sofascore | Sofascore 2024 |
| **Challonge** (Logitech) | **31 milhoes de chaves criadas** (lifetime) | StriveCloud 2024 |
| **FACEIT** (adquirida) | Vendida por **US$ 1,05 bilhao** (Savvy Games/Saudi PIF) | Wikipedia/Crunchbase 2022 |
| **Betano** (Brasil) | **23% market share** em apostas | H2 Gambling Capital 2024 |
| **Bet365** (Brasil) | **20% market share** em apostas | H2 Gambling Capital 2024 |

### Infraestrutura Digital no Brasil

| Dado | Numero | Fonte |
|------|--------|-------|
| Transacoes PIX (2025) | **79,8 bilhoes** | Agencia Brasil |
| Volume PIX (2025) | **R$ 35,4 trilhoes** | Metropoles |
| Recorde diario PIX | **313 milhoes de transacoes/dia** | Agencia Brasil, dez/2025 |
| Gastos em apps (Brasil) | **US$ 1,9 bilhao/ano** | Business of Apps 2024 |
| Uso diario de apps | **5+ horas/dia** (maior do mundo) | Business of Apps 2024 |
| CPI medio (Android, Brasil) | **US$ 0,44** | IronSource/Mapendo 2025 |
| CPI medio (iOS, Brasil) | **US$ 0,86** | IronSource/Mapendo 2025 |

### Patrocinio Esportivo

| Dado | Numero | Fonte |
|------|--------|-------|
| Receita de patrocinio (Serie A) | **~R$ 1 bilhao** | IBOPE Repucom 2025 |
| Marketing total dos clubes brasileiros | **R$ 1,9 bilhao** | Torcedores.com 2024 |
| Maior patrocinio individual | **R$ 115 milhoes** (Flamengo x Pixbet) | Lance 2025 |
| Marcas de apostas patrocinando Serie A | **18 marcas em 20 clubes** (100%) | IBOPE Repucom 2025 |
| Mercado global de marketing esportivo | **US$ 1,24 trilhao ate 2026** (+7,6%/ano) | Agencia IV |

---

## O Problema

### Fragmentacao Total do Ecossistema

O ecossistema esportivo brasileiro — tanto amador quanto profissional — opera de forma completamente fragmentada:

**Para Atletas Amadores (61M de praticantes)**
- Nao existe plataforma para monetizar desempenho esportivo fora do circuito profissional
- Dificuldade em encontrar torneios compativeis com seu nivel
- Sem visibilidade para atrair patrocinios
- Custos com inscricao, equipamento e deslocamento sem retorno financeiro

**Para Fas e Apostadores (17,7M de apostadores ativos)**
- Apostas concentradas em esporte profissional nas mesmas plataformas genericas (Betano, Bet365)
- Zero engajamento com esporte amador — nao existe onde apostar na pelada do bairro
- Nenhuma plataforma recompensa fas por engajamento social com o esporte
- Dados esportivos espalhados entre Sofascore, FlashScore, apps isolados

**Para Organizadores de Eventos (5.000+ corridas/ano, 240+ torneios de beach tennis)**
- Gestao manual de chaveamento, inscricoes e pagamentos em planilhas
- Alta inadimplencia de inscricoes (ate 30% de desistencia)
- Dificuldade em atrair patrocinadores
- Ferramentas como Challonge e Sympla nao sao integradas entre si

**Para Marcas (R$ 1,9 bi investidos so em futebol profissional)**
- Dificuldade em atingir o consumidor esportivo amador de forma segmentada
- Investimento concentrado em grandes clubes com custo proibitivo para PMEs
- Sem canal direto para os 61 milhoes de praticantes amadores
- Falta de dados sobre o comportamento do consumidor esportivo grassroots

---

## A Solucao: Sportio

Sportio e uma **super app do esporte** com duas camadas complementares:

### Camada 1: Conteudo Profissional (Tracao desde o Dia 1)

Torneios profissionais — Brasileirao, Copa do Brasil, UFC, ATP, circuitos de beach tennis — sao indexados como conteudo na plataforma. Fas acompanham resultados, fazem palpites com GCoins, interagem no feed social e seguem atletas. Atletas profissionais tem perfis publicos (sem necessidade de cadastro ativo) que podem "clamar" quando quiserem.

**Por que isso importa:** Nao dependemos de criar conteudo do zero. O esporte profissional gera centenas de jogos por semana que alimentam o feed, as apostas e o engajamento. Isso resolve o problema do "ovo e galinha" que mata a maioria das redes sociais na fase inicial.

### Camada 2: Competicao Amadora (Monetizacao Direta)

Atletas amadores criam perfis, competem em torneios, se desafiam em duelos 1v1, ganham GCoins por performance e sacam via PIX. Organizadores gerenciam eventos com chaveamento automatico. Marcas criam campanhas self-serve.

**Por que isso importa:** Aqui esta a monetizacao real — inscricoes, apostas, wagers, compra de GCoins, campanhas de marcas. A camada profissional atrai; a camada amadora converte e retém.

### Funcionalidades Integradas

| Funcionalidade | Equivalente de Mercado | Diferencial Sportio |
|---|---|---|
| Feed Social Esportivo | Instagram/Twitter do Esporte | Conteudo profissional + amador integrado |
| Torneios e Competicoes | Challonge + Sympla | Profissionais indexados + amadores gerenciados |
| Duelos 1v1 com Apostas | Inexistente | Exclusivo: desafio direto entre atletas com wager |
| Apostas Esportivas | Bet365/Betano | Profissional + amador; GCoins dual (real + gamificacao) |
| Patrocinio e Ads | Google Ads esportivo | Self-serve; acesso direto a praticantes, nao apenas espectadores |
| Chat e Comunidade | WhatsApp Groups | Integrado ao ecossistema; salas por torneio/esporte |
| Economia de GCoins | PayPal + recompensas | Moeda dual proprietaria com saque PIX |
| Gamificacao | Strava + Duolingo | XP, 55+ conquistas, missoes diarias, rating ELO |
| Acompanhamento ao Vivo | Sofascore/FlashScore | Integrado com apostas e feed social |
| Gestao de Arbitros | Uber da arbitragem | Marketplace com reputacao e pagamento automatico |

**Nenhuma plataforma no mercado integra todas essas verticais em um unico ecossistema com economia propria.**

---

## Personas e Proposta de Valor

### 1. ATLETA — "Ganhe Dinheiro com Seu Esporte"

> *"Cada partida, cada gol e cada treino se transformam em GCoins Reais que viram dinheiro na sua conta."*

**Quem e:** Praticante amador, semiprofissional ou profissional de qualquer esporte que busca competir, evoluir e monetizar sua paixao.

**Mercado enderecavel:** 61 milhoes de praticantes regulares no Brasil (IBGE/PNAD). Esportes em crescimento explosivo: beach tennis (+175% em 2 anos, CBT), padel (+15-20%/ano, Cobrapa), corrida de rua (15M de praticantes, Olympikus/Box1824 2025).

**O que pode fazer na plataforma:**

| Funcionalidade | Descricao |
|---|---|
| **Competir em Torneios** | Inscricao em torneios de 43+ modalidades com premiacao em GCoins Reais |
| **Duelos 1v1** | Desafie qualquer atleta para um duelo direto com aposta (wager) em GCoins |
| **Rating ELO por Esporte** | Sistema de ranking inteligente que ajusta apos cada vitoria/derrota |
| **Perfil Profissional** | Estatisticas, conquistas, nivel XP e historico completo para atrair patrocinios |
| **Ranking e Leaderboard** | Suba no ranking global e por esporte; ganhe visibilidade na plataforma |
| **Patrocinios Diretos** | Marcas encontram atletas por desempenho; receba ofertas de patrocinio |
| **Conquistas e Missoes** | 55+ achievements (bronze a diamante) e 16+ missoes diarias/semanais com recompensas |
| **Apostas** | Aposte em partidas e duelos com GCoins |
| **Feed Social** | Compartilhe conquistas, interaja com a comunidade |
| **Compra e Saque de GCoins** | Compre GCoins via PIX/cartao e saque via PIX instantaneamente |

**Potencial de Ganhos (amador):**

| Nivel | Faixa Mensal | Descricao |
|---|---|---|
| **Casual** | R$ 50 – 200 | Desafios esporadicos e missoes diarias |
| **Regular** | R$ 200 – 800 | Torneios locais, desafios semanais, pequenos patrocinios |
| **Competitivo** | R$ 800 – 3.000+ | Top ranking, patrocinadores frequentes, eventos premium |

*Nota: Faixas estimadas com base no ticket medio de inscricao de torneios (R$ 119 para corrida, R$ 89-179 para beach tennis — Maquina do Esporte/LetzPlay 2024) e projecao de premiacoes.*

**Para atletas profissionais:** Perfis publicos com estatisticas, seguidores e interacao com fas. O atleta profissional nao precisa gerenciar nada — a plataforma indexa seus dados. Se quiser, pode "clamar" seu perfil e interagir diretamente.

---

### 2. ORGANIZADOR — "Organize Torneios Profissionais sem Balburdia"

> *"Automatize chaveamento, inscricoes e pagamentos. Foque na experiencia do evento."*

**Quem e:** Pessoa fisica ou empresa que organiza torneios, circuitos e ligas esportivas.

**Mercado enderecavel:** Mais de 5.241 corridas homologadas/ano (+85% de crescimento, Abraceo 2025), 240+ torneios de beach tennis, milhares de torneios de futebol society em 150+ ligas municipais. Mercado totalmente fragmentado entre planilhas, WhatsApp e ferramentas desconectadas.

**O que pode fazer na plataforma:**

| Funcionalidade | Descricao |
|---|---|
| **Criacao de Torneios** | Configure torneio em minutos: esporte, regras, capacidade, preco, local |
| **Formatos Multiplos** | Eliminacao simples/dupla, Round Robin, Suico, Liga |
| **Chaveamento Automatico** | Algoritmo gera chaves equilibradas com base no ranking dos atletas |
| **Pagamento Integrado** | Cobranca automatica via PIX/cartao; sem inadimplencia |
| **Convites para Atletas** | Convide atletas especificos e patrocinadores para o evento |
| **Gestao de Patrocinio** | Receba propostas de marcas e aprove patrocinios para seus torneios |
| **Distribuicao de Premios** | Configuracao flexivel de premiacao por colocacao |
| **Dashboard Completo** | Visao em tempo real de inscricoes, receita, partidas e metricas |
| **Niveis de Dificuldade** | Categorize torneios por nivel (A/B/C) para segmentar publico |

**Potencial de Receita por Evento:**

| Tipo de Evento | Faixa de Receita | Base de Calculo |
|---|---|---|
| **Evento Pequeno** | R$ 2.000 – 5.000 | 32 participantes x R$ 100-150 de inscricao |
| **Evento Medio** | R$ 5.000 – 15.000 | 64-128 atletas + patrocinios locais |
| **Liga/Circuito Anual** | R$ 60.000 – 120.000 | 12 etapas mensais + patrocinadores recorrentes |

*Referencia: ticket medio de corrida de rua no Brasil e R$ 119,39 (Maquina do Esporte 2024). Torneios de beach tennis cobram R$ 89-179 por categoria (LetzPlay/CBBT 2024).*

---

### 3. MARCA / PATROCINADOR — "Acesse Diretamente os 61 Milhoes de Praticantes"

> *"Alcance consumidores apaixonados pelo esporte com segmentacao que nenhuma outra plataforma oferece."*

**Quem e:** Marcas esportivas, de nutricao, suplementos, equipamentos, saude e qualquer empresa que queira atingir o publico esportivo.

**Oportunidade de mercado:** R$ 1,9 bilhao investidos so em marketing de futebol profissional (Torcedores.com 2024). O mercado amador — 61 milhoes de praticantes — recebe uma fracao minuscula desse investimento por falta de canal eficiente. Sportio cria esse canal.

**O que pode fazer na plataforma:**

| Funcionalidade | Descricao |
|---|---|
| **Campanhas de Banner** | Anuncios no feed social (a cada 5 posts) e na sidebar |
| **Sorteio de Produtos** | Promocao de produtos com sistema de resgate controlado |
| **Distribuicao de GCoins** | Distribua GCoins como recompensa para engajamento |
| **Patrocinio de Torneios** | Associe sua marca a torneios; 4 niveis: Main, Gold, Silver, Bronze |
| **Patrocinio de Desafios** | Crie desafios patrocinados com sua marca |
| **Segmentacao Precisa** | Filtre por esporte, regiao, faixa etaria, nivel de habilidade |
| **A/B Testing** | Teste diferentes criativos e mensagens |
| **Dashboard de Analytics** | Impressoes, cliques, CTR, conversoes, resgates — tudo em tempo real |

**Tipos de Campanha:**

| Tipo | Descricao | Exemplo |
|---|---|---|
| **Banner** | Anuncio visual no feed e sidebar | Banner de nova linha de tenis |
| **Product Giveaway** | Resgate de produto pelo usuario | "Resgate sua amostra de suplemento" |
| **GCoin Reward** | Distribuicao de GCoins | "Ganhe 50 GCoins ao se cadastrar" |
| **Tournament Sponsor** | Patrocinio de torneio | "Torneio Copa Nike de Beach Tennis" |
| **Challenge Sponsor** | Patrocinio de desafio | "Desafio Gatorade: 10km em 7 dias" |

**Diferencial vs. midia tradicional:** A marca nao atinge apenas espectadores — atinge **praticantes**. Um banner no Sportio alcanca quem joga beach tennis 3x por semana, nao quem assiste na TV. Isso muda fundamentalmente a qualidade do lead.

---

### 4. APOSTADOR — "Aposte com Inteligencia no Esporte"

> *"Aposte em partidas reais — de torneios profissionais a duelos 1v1 entre amigos. Dados transparentes e odds justas."*

**Quem e:** Qualquer usuario da plataforma que queira apostar com GCoins.

**Mercado enderecavel:** 17,7 milhoes de apostadores ativos no Brasil (CNN Brasil/SPA, H1 2025), gastando em media R$ 164/mes (ISTOE Dinheiro). Nenhuma plataforma atual oferece apostas em esporte amador. Sportio abre um nicho inteiramente novo.

**Estrategia regulatoria:**

| Cenario | Abordagem |
|---|---|
| **Fase 1 (lancamento)** | GCoins de Gamificacao — apostas sociais sem conversao em dinheiro. Nao requer licenca SIGAP. |
| **Fase 2 (com licenca)** | GCoins Reais — apostas com conversao em dinheiro real. Requer licenca SIGAP (R$ 30M / 5 anos). |
| **Alternativa** | Parceria com operador licenciado (white-label ou revenue share). |

**O que pode fazer na plataforma:**

| Funcionalidade | Descricao |
|---|---|
| **Apostas em Torneios Profissionais** | Aposte em jogos do Brasileirao, Copa do Brasil, UFC indexados na plataforma |
| **Apostas em Torneios Amadores** | Aposte em torneios e partidas que acontecem na plataforma |
| **Apostas em Duelos 1v1** | Aposte em desafios diretos entre atletas com odds dinamicas |
| **Tipos de Aposta** | Vencedor (1.8x), Placar Exato (3x), MVP, Custom |
| **Odds Dinamicas** | Sistema parimutuel: odds mudam com base nas apostas existentes |
| **Dashboard Completo** | Historico de apostas com filtros |
| **Leaderboard** | Ranking dos melhores apostadores por lucro |
| **Jogo Responsavel** | Limites de aposta, alertas de comportamento, ferramentas de autocontrole |

**Dois Modos de Aposta:**

| Modo | Descricao | Ideal para |
|---|---|---|
| **GCoins Gamificacao** | Apostas sociais; troque por premios exclusivos. **Nao requer licenca.** | Lancamento, engajamento, diversao sem risco |
| **GCoins Reais** | Apostas com conversao em dinheiro; saque via PIX. **Requer licenca SIGAP.** | Apostadores que buscam retorno financeiro |

---

### 5. FA / TORCEDOR — "O Esporte e Mais Emocionante Quando Voce Faz Parte"

> *"Acompanhe torneios profissionais e amadores, torca pelos seus atletas preferidos e ganhe GCoins por cada interacao."*

**Quem e:** Todo e qualquer usuario da plataforma. A persona de Fa e atribuida automaticamente a todos os cadastros.

**Mercado enderecavel:** O Strava tem 20 milhoes de usuarios no Brasil (Strava Year in Sport 2024). O FlashScore tem 155 milhoes de MAU globais com o Brasil entre os top 6 mercados. O espaco de "fa ativo e recompensado" e um mercado nao atendido.

**O que pode fazer na plataforma:**

| Funcionalidade | Descricao |
|---|---|
| **Feed Social Esportivo** | Resultados profissionais + amadores, placares e highlights em tempo real |
| **Seguir Atletas** | Acompanhe atletas profissionais e amadores favoritos |
| **Curtir, Comentar, Compartilhar** | Interaja com conteudo e ganhe GCoins por cada acao |
| **Palpites e Previsoes** | Teste seu conhecimento esportivo e ganhe GCoins |
| **Comunidade** | Debate jogadas, celebre vitorias, conecte-se com outros fas |
| **Ranking de Fas** | Suba no ranking; top fas ganham recompensas especiais |

**Ganhos por Engajamento (GCoins Gamificacao):**

| Atividade | Recompensa | Descricao |
|---|---|---|
| **Likes e Comentarios** | 20 – 50 GCoins | Recompensas diarias por interacao |
| **Palpites Corretos** | 100 – 300 GCoins | Proporcional a dificuldade da previsao |
| **Top Fa do Mes** | 1.000 GCoins | Bonus exclusivo para os mais engajados |

---

### 6. ARBITRO — "O Esporte Precisa de Arbitros Justos"

> *"Cada validacao feita por voce e registrada, avaliada e remunerada."*

**Quem e:** Arbitro profissional ou amador que busca mais oportunidades de trabalho e valorizacao.

**O que pode fazer na plataforma:**

| Funcionalidade | Descricao |
|---|---|
| **Perfil Verificado** | Selo de arbitro verificado com certificacoes e experiencia |
| **Convites Automaticos** | Receba convites para partidas na sua regiao conforme disponibilidade |
| **Validacao de Resultados** | Registre placares, incidentes e valide resultados das partidas |
| **Pagamento por Partida** | Remuneracao automatica em GCoins apos cada jogo |
| **Ranking de Qualidade** | Avaliacoes dos atletas constroem seu ranking |

---

### Personas Secundarias

| Persona | Proposta de Valor |
|---------|-------------------|
| **Treinador / Professor** | Conecta-se com atletas, organiza treinos, aumenta renda e visibilidade |
| **Nutricionista** | Oferece servicos especializados para atletas com visibilidade para o publico-alvo exato |
| **Fotografo Esportivo** | Captura conteudo de torneios, gera receita com fotos e videos exclusivos |
| **Dono de Arena / Quadra** | Gerencia instalacoes, conecta-se com organizadores, maximiza ocupacao |

---

## Economia de GCoins — A Moeda do Ecossistema

### Visao Geral

GCoins sao a moeda digital interna que movimenta toda a economia da plataforma. O sistema e **dual**, projetado para funcionar desde o dia 1 sem licenca de apostas:

| Tipo | Obtencao | Uso | Conversao |
|---|---|---|---|
| **GCoins Reais** | Compra via PIX/cartao, premios de torneio, patrocinios | Inscricoes, transferencias | **Sim** — saque via PIX |
| **GCoins Gamificacao** | Vitorias, desafios, bonus diarios, conquistas, engajamento | Apostas sociais, troca por premios | **Nao** — apenas dentro da plataforma |

**Ponto critico:** GCoins de Gamificacao usados para apostas **nao configuram jogo de azar** sob a Lei 14.790/23, pois nao tem conversibilidade em dinheiro. Isso permite operar apostas sociais desde o lancamento sem licenca SIGAP.

### Fluxo Completo de GCoins

```
ENTRADA DE GCOINS REAIS                    ENTRADA DE GCOINS GAMIFICACAO
├─ Compra com dinheiro real (PIX/cartao)    ├─ Vitorias em apostas sociais
├─ Premio de torneio                        ├─ Conclusao de desafios e missoes
├─ Vitoria em duelo 1v1 (wager)             ├─ Bonus diario de login
├─ Recompensa de patrocinio                 ├─ Indicacao de amigos (referral)
├─ Transferencia entre usuarios             ├─ Conquistas desbloqueadas (55+ achievements)
└─ Recompensa de marca (brand reward)       ├─ XP convertido em recompensa
                                            └─ Engajamento social (likes, comments)

USO DE GCOINS
├─ Inscricao em torneios (taxa de entrada)
├─ Apostas sociais (GCoins Gamificacao — sem licenca)
├─ Apostas reais (GCoins Reais — com licenca, fase futura)
├─ Wager em duelos (aposta entre jogadores)
├─ Transferencia para outros usuarios
├─ Saque via PIX (apenas GCoins Reais, taxa 5%, min. 100 GCoins)
└─ Troca por premios exclusivos (gamificacao)
```

### Modelo Monetario

| # | Fonte de Receita | Modelo | Descricao |
|---|---|---|---|
| 1 | **Venda de GCoins** | Transacional | Usuarios compram GCoins com dinheiro real — R$ 0,10/GCoin |
| 2 | **Taxa sobre inscricoes** | Comissao | % sobre cada inscricao de torneio processada pela plataforma |
| 3 | **Taxa sobre saques** | Comissao | 5% sobre cada saque de GCoins Reais via PIX |
| 4 | **Campanhas de Marcas** | Self-serve | Marcas pagam para criar campanhas (banners, giveaways, recompensas) |
| 5 | **Patrocinio de Torneios** | Marketplace | Comissao sobre patrocinios aprovados entre marcas e organizadores |
| 6 | **Float Financeiro** | Financeiro | GCoins comprados mas nao sacados geram rendimento |
| 7 | **Apostas (Take Rate)** | Comissao | Margem sobre pools de apostas (torneios + duelos 1v1) |
| 8 | **Comissao sobre Wagers** | Comissao | % sobre apostas diretas entre jogadores em duelos |
| 9 | **Premium (futuro)** | Assinatura | Funcionalidades premium para atletas, organizadores e marcas |
| 10 | **Dados e Analytics (futuro)** | SaaS | Insights de mercado esportivo para marcas e federacoes |

---

## Funcionalidades da Plataforma em Detalhe

### Feed Social Esportivo

O feed social e o coracao da interacao na plataforma, combinando conteudo de esporte profissional e amador.

**Caracteristicas:**
- Posts com texto + imagens
- Resultados automaticos de torneios profissionais indexados
- Tags de esporte e torneio
- Comentarios com respostas aninhadas
- Sistema de likes (posts e comentarios)
- Infinite scroll com paginacao por cursor
- Filtro por esporte
- Posts em alta (trending — mais curtidos nos ultimos 7 dias)
- Sugestao de usuarios para seguir
- **Anuncios patrocinados a cada 5 posts** (monetizacao de marca)
- Posts automaticos gerados por atividades (inscricao em torneio, conclusao de desafio, etc.)

### Sistema de Torneios (Dual)

**Torneios Indexados (Profissionais):**
- Brasileirao, Copa do Brasil, Liga dos Campeoes, UFC, ATP, circuitos de beach tennis
- Dados de partidas, placares e resultados importados automaticamente
- Fas fazem palpites e apostas sociais com GCoins Gamificacao
- Se o torneio quiser usar a plataforma para gestao, a porta esta aberta

**Torneios Gerenciados (Amadores):**
- Criacao e gestao completa pelo organizador
- 5 formatos: Eliminacao Simples/Dupla, Round Robin, Suico, Liga
- Chaveamento automatico com base no ranking dos atletas
- Pagamento integrado via PIX/cartao
- Patrocinio em 4 niveis (Main, Gold, Silver, Bronze)
- Distribuicao automatica de premios por colocacao
- Niveis de dificuldade (A/B/C)

**Ciclo de vida do torneio:**
```
draft → registration_open → registration_closed → in_progress → completed
```

### Sistema de Duelos 1v1

O sistema de duelos permite que **qualquer atleta desafie outro diretamente** para um confronto 1v1 com apostas integradas.

**Como funciona:**

```
Criacao → Aceite do Oponente → Abertura de Apostas → Partida → Resultado → Liquidacao
(pending)   (accepted)         (betting_open)       (in_progress) (completed) (settlement)
```

**Funcionalidades:**
- Desafio direto entre dois atletas com esporte, data e local configuraveis
- **Wager:** Cada atleta aposta GCoins; o vencedor leva tudo
- **Apostas da comunidade:** Fas e espectadores podem apostar no resultado
- Periodo de apostas configuravel com deadline automatico
- Liquidacao automatica de todas as apostas vinculadas
- Atualizacao automatica de rating ELO apos o resultado
- Posts automaticos no feed para criacao, aceite e resultado

**Impacto no engajamento:**
- Cada duelo gera 3-4 posts automaticos no feed (conteudo organico)
- Atletas voltam para desafiar rivais (retencao)
- Apostas da comunidade criam audiencia (viralidade)

### Sistema de Apostas

**Tipos de aposta:**

| Tipo | Multiplicador Base | Descricao |
|---|---|---|
| **Vencedor** | 1.8x | Prever o vencedor da partida |
| **Placar Exato** | 3.0x | Prever o placar exato |
| **MVP** | Variavel | Prever o melhor jogador |
| **Custom** | Variavel | Aposta personalizada |

**Algoritmo de odds:**
- Sistema **parimutuel** (odds dinamicas baseadas no volume de apostas)
- Quanto mais pessoas apostam em um lado, menor o multiplicador
- Garante equilibrio e justica matematica

**Settlement automatico:**
- Quando uma partida ou duelo termina, todas as apostas sao liquidadas automaticamente
- Servicos dedicados: `bet-settlement.ts` para torneios e `challenge-settlement.ts` para duelos
- Em caso de cancelamento, reembolso automatico
- Notificacoes enviadas para apostadores

### Sistema de Patrocinio e Ads

**Posicionamentos disponiveis:**

| Posicao | Descricao |
|---|---|
| `feed_banner` | Banner entre posts no feed (a cada 5 posts) |
| `sidebar` | Widget lateral do feed |
| `tournament_sponsor` | Pagina do torneio |
| `profile_banner` | Perfil do atleta |
| `challenge_sponsor` | Pagina do desafio |
| `post_promoted` | Post promovido |

**Metricas em tempo real:** Impressoes, cliques, CTR, resgates de produto, orcamento gasto vs. alocado.

### Sistema de Gamificacao Completo

A gamificacao e transversal a **todas as personas** da plataforma.

**Sistema de XP e Niveis:**
- Cada atividade gera XP proporcional ao impacto
- 50+ atividades mapeadas com XP especifico por persona
- Sistema de niveis com progressao exponencial (formula: `nivel² × 100`)

**Conquistas (Achievements):** 55+ conquistas organizadas em 5 tiers:

| Tier | Descricao | Exemplo |
|---|---|---|
| **Bronze** | Primeiros passos | "Primeira Vitoria", "Primeiro Post" |
| **Prata** | Consistencia | "10 Torneios Disputados", "50 Seguidores" |
| **Ouro** | Excelencia | "Campeao de Liga", "100 Apostas Ganhas" |
| **Platina** | Elite | "Top 10 do Ranking", "R$ 5.000 em Premios" |
| **Diamante** | Lendario | "1.000 Vitorias", "Organizador do Ano" |

**Missoes:** 16+ missoes com frequencias variadas (diarias, semanais, mensais, unicas).

**Rating ELO por Esporte:**
- Base 1200, K-factor dinamico
- Atualizado apos cada partida e duelo 1v1
- Tiers visuais: Ferro, Bronze, Prata, Ouro, Platina, Diamante, Mestre, Grao-Mestre

### Gateway de Pagamento

| Metodo | Descricao |
|---|---|
| **PIX** | QR Code gerado automaticamente; confirmacao em segundos |
| **Cartao de Credito** | Aprovacao instantanea |
| **Cartao de Debito** | Debito imediato |
| **Boleto** | Vencimento em 3 dias uteis |

- Preco: R$ 0,10 por GCoin (1 GCoin = R$ 0,10)
- Minimo de compra: 50 GCoins (R$ 5,00)
- Saque via PIX: minimo 100 GCoins Reais, taxa 5%
- Processo de saque: Pedido → Revisao Admin → Aprovacao/Rejeicao → Transferencia

### Demais Funcionalidades

| Funcionalidade | Status |
|---|---|
| **Chat** | Salas 1-a-1 e em grupo, texto + imagens, rastreamento de leitura |
| **Notificacoes** | 30+ tipos de eventos (social, torneios, apostas, GCoins, chat) |
| **Painel Administrativo** | RBAC, gestao de usuarios/torneios/apostas/saques, metricas |

---

## Modelo de Negocio e Unit Economics

### Fontes de Receita

A plataforma tem **10 fontes de receita independentes**, reduzindo risco e aumentando resiliencia.

### Unit Economics (Projecao Conservadora)

**Premissas baseadas em dados reais de mercado:**

```
ATLETA AMADOR (praticante regular)
  Gasto medio em inscricoes: R$ 119/torneio (Maquina do Esporte 2024)
  Frequencia estimada: 3-6 torneios/ano
  Compra de GCoins: R$ 30-50/mes (apostas sociais + wagers)
  LTV estimado = R$ 600 – 1.200/ano
  CAC estimado = R$ 25-50 (CPI Android R$ 2,50 + ativacao; ref: IronSource 2025)
  LTV/CAC = 12-48x

ORGANIZADOR
  Receita media por evento: R$ 5.000-15.000
  Comissao Sportio: 8-12%
  Frequencia: 4-12 eventos/ano
  LTV estimado = R$ 3.000 – 12.000/ano
  CAC estimado = R$ 100-200 (outbound + content marketing)
  LTV/CAC = 15-120x

MARCA / PATROCINADOR
  Budget medio campanha digital PME: R$ 2.000-10.000/campanha
  Frequencia: 3-6 campanhas/ano
  LTV estimado = R$ 6.000 – 60.000/ano
  CAC estimado = R$ 300-500 (vendas consultivas)
  LTV/CAC = 12-200x

APOSTADOR / FA
  Gasto medio do apostador brasileiro: R$ 164/mes (ISTOE Dinheiro 2025)
  Percentual que converte em GCoins: 10-30% do gasto (plataforma nova)
  LTV estimado = R$ 200 – 600/ano
  CAC estimado = R$ 15-30 (via conteudo profissional + social)
  LTV/CAC = 7-40x

NOTA: Ranges amplos sao intencionais. Sem dados de operacao real,
apresentamos cenarios conservador-otimista em vez de pontos fixos.
LTV/CAC sera refinado apos os primeiros 6 meses de operacao.
```

### Flywheel Effect (Efeito de Rede)

```
Conteudo Profissional (Brasileirao, UFC, Beach Tennis)
    ↓
Fas e Apostadores (engajamento + palpites + apostas sociais)
    ↓
Base de Usuarios Massiva (atrai marcas e organizadores)
    ↓
Marcas Investem (campanhas + patrocinios + GCoins)
    ↓
Premios e GCoins Circulam (incentivo para atletas amadores)
    ↓
Atletas Amadores Competem (torneios + duelos 1v1)
    ↓
Mais Conteudo Organico (posts, resultados, conquistas)
    ↓
Mais Fas e Apostadores (ciclo se retroalimenta)
```

A camada profissional **resolve o problema do cold start**: nao e preciso esperar usuarios criarem conteudo. O conteudo ja existe — sao milhares de jogos por semana.

---

## Analise Competitiva

### Mapa de Concorrentes

| Plataforma | O que faz | O que NAO faz |
|---|---|---|
| **Strava** (20M usuarios BR) | Tracking de atividades, feed social | Torneios, apostas, monetizacao, patrocinio |
| **Sofascore/FlashScore** (155M MAU) | Scores ao vivo de esporte profissional | Esporte amador, apostas, comunidade, monetizacao |
| **Bet365/Betano** (23% share BR) | Apostas em esporte profissional | Esporte amador, comunidade, gamificacao, torneios |
| **Challonge** (31M brackets) | Chaveamento de torneios (foco eSports) | Pagamento, apostas, social, economia |
| **Torneo by Sofascore** | Gestao de torneios amadores | Apostas, economia, patrocinio, gamificacao |
| **Sympla** | Venda de ingressos para eventos | Chaveamento, apostas, social, gamificacao |
| **LetzPlay** | Inscricoes de beach tennis | Outras modalidades, apostas, social, economia |

### Posicao Unica do Sportio

| Aspecto | Sportio | Mercado |
|---|---|---|
| **Escopo** | Profissional + Amador (43+ modalidades) | Ou profissional ou amador; nicho unico |
| **Integracao** | Social + torneios + apostas + economia + patrocinio | Ferramentas isoladas |
| **Monetizacao do atleta** | GCoins com saque PIX | Sem monetizacao ou premios pontuais |
| **Economia proprietaria** | Dual (real + gamificacao) | Sem moeda interna |
| **Apostas amadoras** | Unica plataforma que oferece | Inexistente |
| **Duelos 1v1** | Exclusivo: desafio direto com wager | Inexistente |
| **Modelo regulatorio** | GCoins Gamificacao (sem licenca) → GCoins Reais (com licenca) | Operacao binaria: ou tem licenca ou nao opera |

---

## Stack Tecnologico

| Camada | Tecnologia |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TailwindCSS 4, Lucide Icons |
| **Backend** | tRPC (API type-safe end-to-end), Drizzle ORM |
| **Banco de Dados** | Neon PostgreSQL (Serverless) — 40+ tabelas, 12 routers |
| **Autenticacao** | NextAuth.js v5 (credenciais + Google OAuth) |
| **Deploy** | Vercel + GitHub Actions (CI/CD automatizado) |
| **CDN** | Cloudflare |
| **Pagamentos** | PIX + Cartao (gateway integrado, webhook-ready) |
| **Animacoes** | Framer Motion |
| **State** | Zustand (client-side), React Query (server-state) |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod validation |

**Decisoes arquiteturais:**
- **Serverless-first**: Escalabilidade automatica com custo sob demanda (Neon + Vercel)
- **Type-safe end-to-end**: tRPC garante contratos entre frontend e backend
- **Real-time ready**: Arquitetura preparada para WebSockets
- **Multi-tenant**: Suporte a multiplos perfis por usuario com RBAC granular
- **Gamification Engine**: Motor de conquistas e missoes com verificacao automatica

---

## Modalidades Esportivas

A plataforma suporta **43+ modalidades** cadastradas no banco de dados:

| Categoria | Esportes |
|---|---|
| **Raquete** | Tenis, Beach Tennis, Padel, Badminton, Squash, Tenis de Mesa |
| **Coletivos** | Futebol, Futsal, Volei, Basquete, Handebol, Rugby, Futebol Americano, Polo Aquatico |
| **Areia/Praia** | Volei de Praia, Futevolei, Beach Soccer |
| **Aquaticos** | Natacao, Surfe |
| **Combate** | Boxe, MMA, Judo, Karate, Taekwondo, Muay Thai, Jiu-Jitsu, Esgrima, Wrestling |
| **Individual** | Atletismo, Ciclismo, Golfe, Skate, Escalada, Ginastica, Levantamento de Peso |
| **Precisao** | Tiro com Arco, Tiro Esportivo, Boliche |
| **Outros** | CrossFit, Triathlon, Canoagem, Remo, Hoquei |
| **eSports** | eSports (jogos eletronicos competitivos) |

**Foco inicial:** Futebol Society (12,5M praticantes), Beach Tennis (1,1M, +175%), Corrida (15M), CrossFit (1.150 boxes), Volei (15,3M).

---

## Roadmap de Produto

### Fase Atual — MVP Funcional

- [x] Feed social completo (posts, comentarios, likes, follows)
- [x] Sistema de torneios (criacao, inscricao, chaveamento automatico, standings)
- [x] Economia de GCoins (dual currency, transferencias, historico)
- [x] Sistema de apostas sociais (parimutuel, settlement automatico)
- [x] Patrocinio e campanhas de marcas (self-serve)
- [x] Duelos 1v1 (desafio direto com wager + apostas da comunidade)
- [x] Chat (1-a-1 e grupo)
- [x] Sistema de notificacoes (30+ tipos)
- [x] Painel administrativo (RBAC, gestao financeira)
- [x] Autenticacao (credenciais + Google OAuth)
- [x] Gamificacao completa (XP, niveis, 55+ conquistas, 16+ missoes, ELO)
- [x] Gateway de pagamento (PIX + cartao, saque via PIX)
- [x] Landing pages para cada persona
- [x] Deploy automatizado (Vercel + GitHub Actions)

### Fase 2 — Tracao e Conteudo Profissional

- [ ] Indexacao de torneios profissionais (Brasileirao, Copa do Brasil, UFC)
- [ ] Perfis publicos de atletas profissionais
- [ ] App mobile nativo (React Native)
- [ ] WebSockets para chat e apostas em tempo real
- [ ] Integracao com gateway de pagamento real (Stripe / Pagar.me)
- [ ] Sistema de email (verificacao, notificacoes, recuperacao de senha)
- [ ] Upload de imagens (Cloudflare R2)
- [ ] Middleware de protecao de rotas

### Fase 3 — Escala e Regulacao

- [ ] Streaming ao vivo de partidas
- [ ] Licenca SIGAP ou parceria com operador licenciado
- [ ] Integracao com wearables (Strava, Garmin, Apple Watch)
- [ ] Marketplace de produtos esportivos
- [ ] Machine learning para matchmaking e recomendacao
- [ ] API aberta para integracoes externas

### Fase 4 — Expansao

- [ ] Sistema de assinatura premium
- [ ] Expansao para America Latina
- [ ] Parcerias com federacoes esportivas
- [ ] Data products para marcas e federacoes

---

## Metricas-Chave (KPIs)

| Metrica | Descricao | Meta Ano 1 |
|---|---|---|
| **MAU** | Usuarios ativos mensais | 50.000 – 100.000 |
| **Torneios/mes** | Torneios amadores criados + profissionais indexados | 50 – 200 |
| **Duelos 1v1/mes** | Desafios diretos entre atletas | 500 – 2.000 |
| **GMV de GCoins** | Volume total de GCoins transacionados (R$) | R$ 500K – 2M |
| **Take rate** | % de receita sobre transacoes | 8-15% |
| **Retencao D7/D30** | Retencao de usuarios em 7 e 30 dias | D7: 40%+ / D30: 20%+ |
| **Revenue per User** | Receita media por usuario ativo | R$ 5-15/mes |
| **NPS** | Net Promoter Score por persona | 40+ |

*Nota: Metas de Ano 1 baseadas em benchmarks de apps sociais/esportivos no Brasil. Strava adicionou 5 milhoes de usuarios no Brasil em 2024 (CNN Brasil). Nosso alvo e conservador.*

---

## Por Que Investir na Sportio?

### 1. Mercado Gigante, Comprovado e em Crescimento

O Brasil tem 61 milhoes de praticantes regulares de esporte (IBGE), 17,7 milhoes de apostadores ativos (SPA 2025), e um mercado de apostas de R$ 100 bilhoes/ano — o 5o maior do mundo (InfoMoney). O mercado fitness gera R$ 17 bi/ano e o e-commerce esportivo R$ 16,3 bi/ano. Esportes como beach tennis (+175% em 2 anos) e corrida (+85% em eventos) estao em crescimento explosivo. **Todos esses numeros sao verificaveis em fontes publicas.**

### 2. Posicionamento Unico: Profissional + Amador

Nenhuma plataforma no mundo integra acompanhamento de esporte profissional, competicao amadora, apostas, economia proprietaria e patrocinio self-serve em um unico ecossistema. Strava faz tracking. Sofascore faz scores. Bet365 faz apostas. Challonge faz chaveamento. Sportio integra tudo.

### 3. Estrategia de Cold Start Resolvida

A camada de conteudo profissional gera engajamento desde o dia 1. Nao dependemos de usuarios criarem conteudo — o Brasileirao tem 380 jogos/ano, a Serie B mais 380, a Copa do Brasil dezenas. Isso atrai fas, que atraem marcas, que financiam torneios amadores.

### 4. Modelo Regulatorio Inteligente

A estrutura dual de GCoins permite operar apostas sociais (gamificacao) **sem licenca** desde o lancamento, e migrar para apostas reais quando houver licenca SIGAP ou parceria com operador. Nao e binario — e uma rampa.

### 5. Efeito de Rede com 10 Personas

Cada persona que entra aumenta o valor para todas as outras. Atletas atraem organizadores. Organizadores atraem marcas. Marcas financiam premios. Premios atraem mais atletas. Fas amplificam tudo com engajamento e apostas.

### 6. Multiplas Fontes de Receita

10 streams independentes: venda de GCoins, taxas sobre inscricoes, taxa de saque, campanhas de marcas, patrocinio de torneios, take rate de apostas, comissao de wagers, float financeiro, premium (futuro), data products (futuro).

### 7. MVP Construido e Funcional

Nao e um slide deck. E uma plataforma construida com Next.js 15, PostgreSQL, 40+ tabelas, 12 routers de API, sistema completo de gamificacao, duelos 1v1, gateway de pagamento e deploy automatizado. O produto existe e roda.

### 8. Timing Perfeito

- **Regulamentacao de apostas** (Lei 14.790/23) abre mercado de R$ 100 bi
- **Beach tennis** cresceu 175% em 2 anos
- **Corrida de rua** cresceu 85% em eventos (2024-2025)
- **PIX** processou 79,8 bilhoes de transacoes em 2025 — infraestrutura de pagamento instantaneo esta madura
- **Strava** atingiu 20M de usuarios no Brasil — o publico esportivo digital existe e esta ativo

### 9. Defensibilidade por Dados

Conforme cresce, a plataforma acumula dados unicos sobre o ecossistema esportivo: performance de atletas amadores, preferencias de apostas, eficacia de patrocinios, comportamento de fas por esporte. Esses dados criam inteligencia competitiva impossivel de replicar e abrem oportunidades de data products para marcas e federacoes.

---

## Fontes e Referencias

Todos os numeros deste documento sao verificaveis:

| Dado | Fonte | Ano |
|------|-------|-----|
| 61M praticantes de esporte | IBGE PNAD (Pratica de Esportes e Atividades Fisicas) | 2015 |
| 30,4M jogadores de futebol | Federacoes estaduais / Top10Mais | 2024 |
| 15M corredores | Olympikus/Box1824 "Por Dentro do Corre" | 2025 |
| 1,1M praticantes de beach tennis | CBT (Confederacao Brasileira de Tenis) | 2023 |
| 600-700K praticantes de padel | Cobrapa | 2024 |
| 1.150 boxes de CrossFit | Ativo.com | 2024 |
| 5.241 corridas homologadas | Abraceo / CNN Brasil | 2025 |
| R$ 119,39 ticket medio corrida | Maquina do Esporte | 2024 |
| R$ 100 bi apostados | Brazil Economy | 2025 |
| R$ 36 bi GGR operadores | Meio e Mensagem | 2025 |
| 17,7M apostadores ativos | CNN Brasil / SPA Fazenda | H1 2025 |
| R$ 164/mes gasto medio apostador | ISTOE Dinheiro | 2025 |
| 5o maior mercado de apostas | InfoMoney | 2025 |
| R$ 30M licenca SIGAP | Lei 14.790/23 / Senado | 2024 |
| 20M usuarios Strava BR | Strava Year in Sport / Portal Tela | 2024-2025 |
| US$ 2,2 bi valuation Strava | MKT Esportivo | 2025 |
| 155M MAU FlashScore | FlashScore (press release) | 2024 |
| 31M brackets Challonge | StriveCloud | 2024 |
| US$ 1,05 bi aquisicao FACEIT | Crunchbase / Wikipedia | 2022 |
| R$ 1,9 bi marketing clubes | Torcedores.com | 2024 |
| R$ 17 bi mercado fitness | Panorama Setorial Fitness | 2024 |
| R$ 16,3 bi e-commerce esportivo | MKT Esportivo | 2024 |
| 79,8 bi transacoes PIX | Agencia Brasil | 2025 |
| US$ 0,44 CPI Android BR | IronSource / Mapendo | 2025 |

---

## Contato

**Sportio — O Ecossistema Digital Completo do Esporte**

Repositorio: [github.com/tigraodegente/Sportio-web](https://github.com/tigraodegente/Sportio-web)

---

*Documento atualizado em Marco de 2026. Todos os dados de mercado sao de fontes publicas verificaveis.*
