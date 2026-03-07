import { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------
const C = {
  bg: "#0A1628",
  card: "#132038",
  cardAlt: "#1B2D4A",
  primary: "#00C853",
  accent: "#FF6D00",
  red: "#FF1744",
  yellow: "#FFD600",
  white: "#FFFFFF",
  textPrimary: "#FFFFFF",
  textSecondary: "#90A4AE",
  textMuted: "#546E7A",
  border: "#1E3A5F",
  live: "#FF1744",
};

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

interface LiveMatch {
  id: string;
  sport: string;
  sportIcon: keyof typeof Ionicons.glyphMap;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeColor: string;
  awayColor: string;
  matchTime: string;
  viewers: number;
}

const LIVE_MATCHES: LiveMatch[] = [
  {
    id: "m1",
    sport: "Futebol",
    sportIcon: "football",
    league: "Brasileirao Serie A",
    homeTeam: "Flamengo",
    awayTeam: "Palmeiras",
    homeScore: 2,
    awayScore: 1,
    homeColor: "#C62828",
    awayColor: "#2E7D32",
    matchTime: "67'",
    viewers: 12400,
  },
  {
    id: "m2",
    sport: "Basquete",
    sportIcon: "basketball",
    league: "NBB",
    homeTeam: "Franca",
    awayTeam: "Flamengo",
    homeScore: 78,
    awayScore: 82,
    homeColor: "#1565C0",
    awayColor: "#C62828",
    matchTime: "Q3 4:22",
    viewers: 3200,
  },
  {
    id: "m3",
    sport: "Volei",
    sportIcon: "tennisball",
    league: "Superliga",
    homeTeam: "Minas",
    awayTeam: "Sada Cruzeiro",
    homeScore: 2,
    awayScore: 1,
    homeColor: "#F9A825",
    awayColor: "#1565C0",
    matchTime: "Set 4",
    viewers: 5600,
  },
  {
    id: "m4",
    sport: "MMA",
    sportIcon: "fitness",
    league: "UFC 312",
    homeTeam: "Poatan",
    awayTeam: "Ankalaev",
    homeScore: 0,
    awayScore: 0,
    homeColor: "#E65100",
    awayColor: "#4E342E",
    matchTime: "R2 3:45",
    viewers: 45000,
  },
];

interface Challenge {
  id: string;
  title: string;
  description: string;
  sport: string;
  sportIcon: keyof typeof Ionicons.glyphMap;
  progress: number;
  total: number;
  prize: number;
  endsIn: string;
  difficulty: "Facil" | "Medio" | "Dificil";
}

const CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Rei do Palpite",
    description: "Acerte 5 resultados seguidos",
    sport: "Futebol",
    sportIcon: "football",
    progress: 3,
    total: 5,
    prize: 500,
    endsIn: "2h 15m",
    difficulty: "Medio",
  },
  {
    id: "c2",
    title: "Maratonista",
    description: "Assista 10 jogos ao vivo",
    sport: "Geral",
    sportIcon: "tv",
    progress: 7,
    total: 10,
    prize: 200,
    endsIn: "5d",
    difficulty: "Facil",
  },
  {
    id: "c3",
    title: "Apostador Mestre",
    description: "Ganhe 3 apostas com odds > 2.0",
    sport: "Multi",
    sportIcon: "trophy",
    progress: 1,
    total: 3,
    prize: 1000,
    endsIn: "12h",
    difficulty: "Dificil",
  },
];

interface Tournament {
  id: string;
  name: string;
  sport: string;
  sportIcon: keyof typeof Ionicons.glyphMap;
  date: string;
  location: string;
  price: number;
  spots: number;
  totalSpots: number;
  format: string;
}

const TOURNAMENTS: Tournament[] = [
  {
    id: "t1",
    name: "Copa Pelada SP",
    sport: "Futebol",
    sportIcon: "football",
    date: "15 Mar",
    location: "Sao Paulo, SP",
    price: 50,
    spots: 4,
    totalSpots: 16,
    format: "Eliminatoria",
  },
  {
    id: "t2",
    name: "Desafio 3x3",
    sport: "Basquete",
    sportIcon: "basketball",
    date: "22 Mar",
    location: "Rio de Janeiro, RJ",
    price: 30,
    spots: 6,
    totalSpots: 8,
    format: "Round Robin",
  },
  {
    id: "t3",
    name: "Open de Beach Tennis",
    sport: "Beach Tennis",
    sportIcon: "tennisball",
    date: "29 Mar",
    location: "Florianopolis, SC",
    price: 80,
    spots: 12,
    totalSpots: 32,
    format: "Chaves",
  },
  {
    id: "t4",
    name: "Liga de Padel",
    sport: "Padel",
    sportIcon: "tennisball",
    date: "05 Abr",
    location: "Curitiba, PR",
    price: 60,
    spots: 8,
    totalSpots: 16,
    format: "Swiss",
  },
];

interface FeedItem {
  id: string;
  userName: string;
  userAvatar: string;
  sport: string;
  sportIcon: keyof typeof Ionicons.glyphMap;
  type: "activity" | "result" | "achievement";
  title: string;
  description: string;
  stats?: { label: string; value: string }[];
  timeAgo: string;
  likes: number;
  comments: number;
}

const FEED_ITEMS: FeedItem[] = [
  {
    id: "f1",
    userName: "Lucas Silva",
    userAvatar: "LS",
    sport: "Corrida",
    sportIcon: "walk",
    type: "activity",
    title: "Corrida matinal",
    description: "Treinando para a Maratona de SP! Pace melhorando.",
    stats: [
      { label: "Distancia", value: "10.2 km" },
      { label: "Pace", value: "5:12/km" },
      { label: "Tempo", value: "53:14" },
    ],
    timeAgo: "2h",
    likes: 24,
    comments: 5,
  },
  {
    id: "f2",
    userName: "Ana Costa",
    userAvatar: "AC",
    sport: "Beach Tennis",
    sportIcon: "tennisball",
    type: "result",
    title: "Vitoria no torneio!",
    description: "Semifinal do Open de Santos. Proximo jogo domingo!",
    stats: [
      { label: "Resultado", value: "6-4, 7-5" },
      { label: "Aces", value: "8" },
    ],
    timeAgo: "4h",
    likes: 56,
    comments: 12,
  },
  {
    id: "f3",
    userName: "Pedro Mendes",
    userAvatar: "PM",
    sport: "Musculacao",
    sportIcon: "barbell",
    type: "achievement",
    title: "Novo recorde pessoal!",
    description: "Supino reto 120kg! Meta do ano batida em marco.",
    stats: [
      { label: "Peso", value: "120 kg" },
      { label: "Reps", value: "1 RM" },
    ],
    timeAgo: "6h",
    likes: 89,
    comments: 23,
  },
  {
    id: "f4",
    userName: "Julia Santos",
    userAvatar: "JS",
    sport: "Natacao",
    sportIcon: "water",
    type: "activity",
    title: "Treino de velocidade",
    description: "Sessao de tiros curtos. Focando nos 100m livre.",
    stats: [
      { label: "Distancia", value: "2.5 km" },
      { label: "Melhor 100m", value: "1:02" },
    ],
    timeAgo: "8h",
    likes: 31,
    comments: 7,
  },
  {
    id: "f5",
    userName: "Rafael Oliveira",
    userAvatar: "RO",
    sport: "Futebol",
    sportIcon: "football",
    type: "result",
    title: "Hat-trick na pelada!",
    description: "3 gols e 1 assistencia. Time invicto ha 4 jogos.",
    stats: [
      { label: "Gols", value: "3" },
      { label: "Assistencias", value: "1" },
      { label: "Resultado", value: "5-2" },
    ],
    timeAgo: "1d",
    likes: 67,
    comments: 15,
  },
];

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerGreeting}>Boa tarde</Text>
        <Text style={styles.headerName}>Jogador</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.coinBadge}>
          <Ionicons name="diamond" size={14} color={C.yellow} />
          <Text style={styles.coinText}>1.250</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="notifications-outline" size={22} color={C.white} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SectionHeader({
  title,
  actionText,
  onAction,
}: {
  title: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionText && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function LiveBadge() {
  return (
    <View style={styles.liveBadge}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>AO VIVO</Text>
    </View>
  );
}

function LiveMatchCard({ match }: { match: LiveMatch }) {
  return (
    <TouchableOpacity style={styles.matchCard} activeOpacity={0.8}>
      <View style={styles.matchCardTop}>
        <View style={styles.matchLeague}>
          <Ionicons name={match.sportIcon} size={12} color={C.textSecondary} />
          <Text style={styles.matchLeagueText}>{match.league}</Text>
        </View>
        <LiveBadge />
      </View>

      <View style={styles.matchTeams}>
        <View style={styles.matchTeam}>
          <View
            style={[styles.teamColorDot, { backgroundColor: match.homeColor }]}
          />
          <Text style={styles.teamName}>{match.homeTeam}</Text>
        </View>
        <View style={styles.matchScoreContainer}>
          <Text style={styles.matchScore}>
            {match.homeScore} - {match.awayScore}
          </Text>
          <Text style={styles.matchTime}>{match.matchTime}</Text>
        </View>
        <View style={[styles.matchTeam, { alignItems: "flex-end" }]}>
          <View
            style={[styles.teamColorDot, { backgroundColor: match.awayColor }]}
          />
          <Text style={styles.teamName}>{match.awayTeam}</Text>
        </View>
      </View>

      <View style={styles.matchCardBottom}>
        <View style={styles.viewersContainer}>
          <Ionicons name="eye-outline" size={12} color={C.textMuted} />
          <Text style={styles.viewersText}>
            {match.viewers >= 1000
              ? `${(match.viewers / 1000).toFixed(1)}k`
              : match.viewers}
          </Text>
        </View>
        <TouchableOpacity style={styles.betButton}>
          <Text style={styles.betButtonText}>Apostar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const progressPct = (challenge.progress / challenge.total) * 100;
  const difficultyColor =
    challenge.difficulty === "Facil"
      ? C.primary
      : challenge.difficulty === "Medio"
        ? C.yellow
        : C.red;

  return (
    <TouchableOpacity style={styles.challengeCard} activeOpacity={0.8}>
      <View style={styles.challengeTop}>
        <View style={styles.challengeInfo}>
          <View style={styles.challengeIconContainer}>
            <Ionicons
              name={challenge.sportIcon}
              size={20}
              color={C.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDesc}>{challenge.description}</Text>
          </View>
        </View>
        <View style={styles.challengeMeta}>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyColor + "20" },
            ]}
          >
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
              {challenge.difficulty}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[styles.progressBarFill, { width: `${progressPct}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {challenge.progress}/{challenge.total}
        </Text>
      </View>

      <View style={styles.challengeBottom}>
        <View style={styles.prizeContainer}>
          <Ionicons name="diamond" size={14} color={C.yellow} />
          <Text style={styles.prizeText}>{challenge.prize} GCoins</Text>
        </View>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={14} color={C.textMuted} />
          <Text style={styles.timerText}>{challenge.endsIn}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const spotsLeft = tournament.totalSpots - tournament.spots;
  const almostFull = spotsLeft <= 4;

  return (
    <TouchableOpacity style={styles.tournamentCard} activeOpacity={0.8}>
      <View style={styles.tournamentTop}>
        <View style={styles.tournamentSport}>
          <Ionicons
            name={tournament.sportIcon}
            size={14}
            color={C.primary}
          />
          <Text style={styles.tournamentSportText}>{tournament.sport}</Text>
        </View>
        <Text style={styles.tournamentDate}>{tournament.date}</Text>
      </View>

      <Text style={styles.tournamentName}>{tournament.name}</Text>

      <View style={styles.tournamentLocation}>
        <Ionicons name="location-outline" size={13} color={C.textMuted} />
        <Text style={styles.tournamentLocationText}>
          {tournament.location}
        </Text>
      </View>

      <View style={styles.tournamentBottom}>
        <View style={styles.tournamentPrice}>
          <Text style={styles.tournamentPriceLabel}>Inscricao</Text>
          <Text style={styles.tournamentPriceValue}>
            R$ {tournament.price}
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.tournamentSpots,
              almostFull && { color: C.accent },
            ]}
          >
            {spotsLeft} vagas
          </Text>
          <Text style={styles.tournamentFormat}>{tournament.format}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  const typeIcon: keyof typeof Ionicons.glyphMap =
    item.type === "achievement"
      ? "medal"
      : item.type === "result"
        ? "trophy"
        : "fitness";
  const typeColor =
    item.type === "achievement"
      ? C.yellow
      : item.type === "result"
        ? C.primary
        : C.textSecondary;

  return (
    <View style={styles.feedCard}>
      <View style={styles.feedHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.userAvatar}</Text>
        </View>
        <View style={styles.feedUserInfo}>
          <Text style={styles.feedUserName}>{item.userName}</Text>
          <View style={styles.feedSportRow}>
            <Ionicons name={item.sportIcon} size={12} color={C.textMuted} />
            <Text style={styles.feedSportText}>{item.sport}</Text>
            <Text style={styles.feedTimeText}>{item.timeAgo}</Text>
          </View>
        </View>
        <Ionicons name={typeIcon} size={20} color={typeColor} />
      </View>

      <Text style={styles.feedTitle}>{item.title}</Text>
      <Text style={styles.feedDescription}>{item.description}</Text>

      {item.stats && (
        <View style={styles.statsRow}>
          {item.stats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.feedActions}>
        <TouchableOpacity style={styles.feedAction}>
          <Ionicons name="heart-outline" size={18} color={C.textSecondary} />
          <Text style={styles.feedActionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedAction}>
          <Ionicons
            name="chatbubble-outline"
            size={17}
            color={C.textSecondary}
          />
          <Text style={styles.feedActionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedAction}>
          <Ionicons
            name="share-social-outline"
            size={18}
            color={C.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedAction}>
          <Ionicons name="diamond-outline" size={17} color={C.yellow} />
          <Text style={[styles.feedActionText, { color: C.yellow }]}>Gift</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const renderFeedItem = useCallback(
    ({ item }: { item: FeedItem }) => <FeedCard item={item} />,
    [],
  );

  const ListHeader = useCallback(
    () => (
      <>
        <Header />

        {/* Live Matches */}
        <SectionHeader title="Ao Vivo" actionText="Ver todos" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {LIVE_MATCHES.map((match) => (
            <LiveMatchCard key={match.id} match={match} />
          ))}
        </ScrollView>

        {/* Challenges */}
        <SectionHeader title="Desafios Ativos" actionText="Ver todos" />
        {CHALLENGES.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}

        {/* Tournaments */}
        <SectionHeader title="Torneios Proximos" actionText="Ver todos" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {TOURNAMENTS.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </ScrollView>

        {/* Feed Header */}
        <SectionHeader title="Feed" actionText="Filtrar" />
      </>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={FEED_ITEMS}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const MATCH_CARD_WIDTH = SCREEN_WIDTH * 0.72;
const TOURNAMENT_CARD_WIDTH = SCREEN_WIDTH * 0.55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  listContent: {
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerGreeting: {
    fontSize: 14,
    color: C.textSecondary,
  },
  headerName: {
    fontSize: 22,
    fontWeight: "bold",
    color: C.white,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  coinText: {
    color: C.yellow,
    fontWeight: "700",
    fontSize: 13,
  },
  headerIcon: {
    position: "relative",
    padding: 4,
  },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.red,
  },

  // Section
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.white,
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: "600",
    color: C.primary,
  },

  // Horizontal scroll
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 12,
  },

  // Live Match Card
  matchCard: {
    width: MATCH_CARD_WIDTH,
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  matchCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  matchLeague: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  matchLeagueText: {
    fontSize: 11,
    color: C.textSecondary,
    fontWeight: "500",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.live + "20",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.live,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "800",
    color: C.live,
    letterSpacing: 0.5,
  },
  matchTeams: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  matchTeam: {
    flex: 1,
    gap: 4,
  },
  teamColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  teamName: {
    fontSize: 14,
    fontWeight: "700",
    color: C.white,
  },
  matchScoreContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  matchScore: {
    fontSize: 24,
    fontWeight: "800",
    color: C.white,
    letterSpacing: 2,
  },
  matchTime: {
    fontSize: 11,
    color: C.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  matchCardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
  },
  viewersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewersText: {
    fontSize: 11,
    color: C.textMuted,
  },
  betButton: {
    backgroundColor: C.primary + "20",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
  },
  betButtonText: {
    color: C.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  // Challenge Card
  challengeCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  challengeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  challengeInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.white,
    marginBottom: 2,
  },
  challengeDesc: {
    fontSize: 12,
    color: C.textSecondary,
  },
  challengeMeta: {
    alignItems: "flex-end",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: C.cardAlt,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: C.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: "600",
    minWidth: 28,
    textAlign: "right",
  },
  challengeBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  prizeText: {
    fontSize: 13,
    color: C.yellow,
    fontWeight: "700",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    color: C.textMuted,
  },

  // Tournament Card
  tournamentCard: {
    width: TOURNAMENT_CARD_WIDTH,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  tournamentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tournamentSport: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  tournamentSportText: {
    fontSize: 11,
    color: C.primary,
    fontWeight: "600",
  },
  tournamentDate: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: "500",
  },
  tournamentName: {
    fontSize: 15,
    fontWeight: "700",
    color: C.white,
    marginBottom: 6,
  },
  tournamentLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  tournamentLocationText: {
    fontSize: 11,
    color: C.textMuted,
  },
  tournamentBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
  },
  tournamentPrice: {
    gap: 1,
  },
  tournamentPriceLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  tournamentPriceValue: {
    fontSize: 14,
    fontWeight: "700",
    color: C.white,
  },
  tournamentSpots: {
    fontSize: 12,
    fontWeight: "600",
    color: C.primary,
    textAlign: "right",
  },
  tournamentFormat: {
    fontSize: 10,
    color: C.textMuted,
    textAlign: "right",
  },

  // Feed Card
  feedCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.cardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: C.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  feedUserInfo: {
    flex: 1,
  },
  feedUserName: {
    fontSize: 14,
    fontWeight: "700",
    color: C.white,
  },
  feedSportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  feedSportText: {
    fontSize: 11,
    color: C.textMuted,
  },
  feedTimeText: {
    fontSize: 11,
    color: C.textMuted,
    marginLeft: 4,
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.white,
    marginBottom: 4,
  },
  feedDescription: {
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: C.cardAlt,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    gap: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    color: C.white,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  feedActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
  },
  feedAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  feedActionText: {
    fontSize: 12,
    color: C.textSecondary,
  },
});
