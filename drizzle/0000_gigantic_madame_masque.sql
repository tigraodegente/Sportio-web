CREATE TYPE "public"."achievement_tier" AS ENUM('bronze', 'silver', 'gold', 'platinum', 'diamond');--> statement-breakpoint
CREATE TYPE "public"."ad_placement" AS ENUM('feed_banner', 'sidebar', 'tournament_sponsor', 'profile_banner', 'challenge_sponsor', 'post_promoted');--> statement-breakpoint
CREATE TYPE "public"."bet_result" AS ENUM('pending', 'won', 'lost', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."bet_type" AS ENUM('winner', 'score', 'mvp', 'custom');--> statement-breakpoint
CREATE TYPE "public"."campaign_type" AS ENUM('banner', 'product_giveaway', 'gcoin_reward', 'tournament_sponsor', 'challenge_sponsor');--> statement-breakpoint
CREATE TYPE "public"."challenge_status" AS ENUM('pending', 'accepted', 'betting_open', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."challenge_type" AS ENUM('duel', 'community');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('pending', 'confirmed', 'checked_in', 'eliminated', 'winner', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."fan_badge_tier" AS ENUM('bronze', 'silver', 'gold', 'diamond');--> statement-breakpoint
CREATE TYPE "public"."favorite_entity_type" AS ENUM('team', 'athlete', 'competition');--> statement-breakpoint
CREATE TYPE "public"."gcoin_category" AS ENUM('tournament_prize', 'tournament_entry', 'bet_win', 'bet_place', 'challenge_reward', 'purchase', 'withdrawal', 'referral_bonus', 'daily_bonus', 'achievement', 'brand_reward', 'transfer', 'bet_cashout', 'gift_sent', 'gift_received', 'subscription_payment', 'subscription_revenue', 'shoutout_payment', 'shoutout_revenue', 'affiliate_commission');--> statement-breakpoint
CREATE TYPE "public"."gcoin_type" AS ENUM('real', 'gamification');--> statement-breakpoint
CREATE TYPE "public"."invite_status" AS ENUM('pending', 'accepted', 'declined', 'expired');--> statement-breakpoint
CREATE TYPE "public"."invite_type" AS ENUM('athlete', 'sponsor');--> statement-breakpoint
CREATE TYPE "public"."level" AS ENUM('A', 'B', 'C');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('scheduled', 'live', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."mission_frequency" AS ENUM('daily', 'weekly', 'monthly', 'one_time');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('tournament', 'match', 'gcoin', 'social', 'bet', 'chat', 'system', 'challenge');--> statement-breakpoint
CREATE TYPE "public"."parlay_leg_status" AS ENUM('pending', 'won', 'lost', 'void');--> statement-breakpoint
CREATE TYPE "public"."parlay_status" AS ENUM('pending', 'won', 'lost', 'partial', 'cashed_out', 'void');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('pix', 'credit_card', 'debit_card', 'boleto');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'expired');--> statement-breakpoint
CREATE TYPE "public"."pro_bet_status" AS ENUM('pending', 'won', 'lost', 'cashed_out', 'void');--> statement-breakpoint
CREATE TYPE "public"."pro_market_type" AS ENUM('1x2', 'over_under', 'btts', 'handicap', 'correct_score', 'goalscorer');--> statement-breakpoint
CREATE TYPE "public"."pro_match_status" AS ENUM('scheduled', 'live', 'halftime', 'completed', 'cancelled', 'postponed');--> statement-breakpoint
CREATE TYPE "public"."shoutout_status" AS ENUM('pending', 'accepted', 'completed', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."sponsor_tier" AS ENUM('main', 'gold', 'silver', 'bronze');--> statement-breakpoint
CREATE TYPE "public"."sponsorship_status" AS ENUM('pending', 'active', 'paused', 'completed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'expired', 'past_due');--> statement-breakpoint
CREATE TYPE "public"."tournament_format" AS ENUM('single_elimination', 'double_elimination', 'round_robin', 'swiss', 'league');--> statement-breakpoint
CREATE TYPE "public"."tournament_status" AS ENUM('draft', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('athlete', 'organizer', 'brand', 'fan', 'bettor', 'referee', 'trainer', 'nutritionist', 'photographer', 'arena_owner', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'submitted', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_status" AS ENUM('pending', 'approved', 'processing', 'completed', 'rejected');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(50),
	"tier" "achievement_tier" NOT NULL,
	"category" varchar(50) NOT NULL,
	"target_role" "user_role",
	"requirement" jsonb NOT NULL,
	"xp_reward" integer DEFAULT 0,
	"gcoin_reward" integer DEFAULT 0,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliate_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"product_url" text NOT NULL,
	"image_url" text,
	"price_cents" integer NOT NULL,
	"commission_pct" numeric(5, 2) NOT NULL,
	"clicks" integer DEFAULT 0,
	"purchases" integer DEFAULT 0,
	"total_revenue" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "arenas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"owner_id" uuid NOT NULL,
	"address" text,
	"city" varchar(100),
	"state" varchar(50),
	"phone" varchar(20),
	"images" jsonb,
	"sports" jsonb,
	"price_per_hour" numeric(8, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"match_id" uuid,
	"tournament_id" uuid,
	"challenge_id" uuid,
	"bet_type" "bet_type" NOT NULL,
	"prediction" jsonb NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"odds" numeric(6, 2),
	"potential_win" numeric(12, 2),
	"result" "bet_result" DEFAULT 'pending',
	"settled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"cover_image" text,
	"author_id" uuid,
	"sport" varchar(50),
	"tags" jsonb,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "brand_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" "campaign_type" NOT NULL,
	"placement" "ad_placement" NOT NULL,
	"status" "sponsorship_status" DEFAULT 'pending',
	"budget" numeric(12, 2) DEFAULT '0',
	"spent" numeric(12, 2) DEFAULT '0',
	"image_url" text,
	"link_url" text,
	"target_sport_id" uuid,
	"target_tournament_id" uuid,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"product_name" varchar(255),
	"product_description" text,
	"product_image" text,
	"gcoin_reward_amount" numeric(10, 2),
	"max_redemptions" integer,
	"current_redemptions" integer DEFAULT 0,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"redeemed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenge_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"progress" jsonb,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"challenge_type" "challenge_type" DEFAULT 'duel' NOT NULL,
	"status" "challenge_status" DEFAULT 'pending' NOT NULL,
	"sport_id" uuid,
	"creator_id" uuid NOT NULL,
	"opponent_id" uuid,
	"winner_id" uuid,
	"score1" integer,
	"score2" integer,
	"betting_enabled" boolean DEFAULT true,
	"betting_deadline" timestamp,
	"reward" numeric(10, 2) DEFAULT '0',
	"reward_type" "gcoin_type" DEFAULT 'gamification',
	"wager_amount" numeric(10, 2) DEFAULT '0',
	"goal" jsonb,
	"max_participants" integer,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"accepted_at" timestamp,
	"completed_at" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"last_read_at" timestamp,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text NOT NULL,
	"images" jsonb,
	"is_edited" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100),
	"is_group" boolean DEFAULT false,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"parent_id" uuid,
	"content" text NOT NULL,
	"likes_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"date" date NOT NULL,
	"subscribers" integer DEFAULT 0,
	"gifts_received" integer DEFAULT 0,
	"gift_revenue_cents" integer DEFAULT 0,
	"subscription_revenue_cents" integer DEFAULT 0,
	"affiliate_revenue_cents" integer DEFAULT 0,
	"impressions" integer DEFAULT 0,
	"profile_views" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "creator_tiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"price_monthly_cents" integer NOT NULL,
	"description" text,
	"benefits" jsonb DEFAULT '[]'::jsonb,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"team_id" uuid,
	"status" "enrollment_status" DEFAULT 'pending',
	"seed" integer,
	"placement" integer,
	"paid_amount" numeric(10, 2),
	"checked_in_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fan_badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fan_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"tier" "fan_badge_tier" NOT NULL,
	"total_gcoins_given" integer DEFAULT 0,
	"months_subscribed" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fan_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fan_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"tier_id" uuid NOT NULL,
	"status" "subscription_status" DEFAULT 'active',
	"started_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"auto_renew" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "followers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gated_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"min_tier_id" uuid NOT NULL,
	"teaser_text" text,
	"teaser_image_url" text
);
--> statement-breakpoint
CREATE TABLE "gcoin_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "gcoin_type" NOT NULL,
	"category" "gcoin_category" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"balance_after" numeric(12, 2),
	"description" text,
	"reference_id" uuid,
	"reference_type" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gift_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"emoji" varchar(10) NOT NULL,
	"gcoin_cost" integer NOT NULL,
	"animation_url" text,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"gift_type_id" uuid NOT NULL,
	"message" text,
	"post_id" uuid,
	"gcoin_amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"post_id" uuid,
	"comment_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"round" integer NOT NULL,
	"position" integer NOT NULL,
	"player1_id" uuid,
	"player2_id" uuid,
	"team1_id" uuid,
	"team2_id" uuid,
	"winner_id" uuid,
	"score1" integer,
	"score2" integer,
	"sets_data" jsonb,
	"status" "match_status" DEFAULT 'scheduled',
	"referee_id" uuid,
	"scheduled_at" timestamp,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "missions" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(50),
	"frequency" "mission_frequency" NOT NULL,
	"target_role" "user_role",
	"requirement" jsonb NOT NULL,
	"xp_reward" integer DEFAULT 0,
	"gcoin_reward" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text,
	"data" jsonb,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parlay_legs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parlay_id" uuid NOT NULL,
	"match_id" uuid NOT NULL,
	"market_type" "pro_market_type" NOT NULL,
	"selection" text NOT NULL,
	"odds" numeric(8, 2) NOT NULL,
	"status" "parlay_leg_status" DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE "parlays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"gcoin_amount" integer NOT NULL,
	"total_odds" numeric(10, 2) NOT NULL,
	"potential_winnings" integer NOT NULL,
	"status" "parlay_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"settled_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payment_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"gcoin_amount" numeric(12, 2) NOT NULL,
	"brl_amount" numeric(12, 2) NOT NULL,
	"method" "payment_method" NOT NULL,
	"status" "payment_status" DEFAULT 'pending',
	"gateway_id" varchar(255),
	"gateway_data" jsonb,
	"paid_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"images" jsonb,
	"sport_id" uuid,
	"tournament_id" uuid,
	"likes_count" integer DEFAULT 0,
	"comments_count" integer DEFAULT 0,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pro_athletes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"photo_url" text,
	"team_id" uuid,
	"sport_id" uuid NOT NULL,
	"position" varchar(100),
	"nationality" varchar(100),
	"external_id" text,
	"stats" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pro_athletes_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "pro_bets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"match_id" uuid NOT NULL,
	"market_type" "pro_market_type" NOT NULL,
	"selection" text NOT NULL,
	"gcoin_amount" integer NOT NULL,
	"odds_at_placement" numeric(8, 2) NOT NULL,
	"potential_winnings" integer NOT NULL,
	"status" "pro_bet_status" DEFAULT 'pending',
	"settled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pro_competitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"sport_id" uuid NOT NULL,
	"country" varchar(100),
	"season" varchar(50),
	"logo_url" text,
	"external_id" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pro_competitions_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "pro_match_odds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"market_type" "pro_market_type" NOT NULL,
	"selection" text NOT NULL,
	"odds_decimal" numeric(8, 2) NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pro_matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"home_team_id" uuid NOT NULL,
	"away_team_id" uuid NOT NULL,
	"status" "pro_match_status" DEFAULT 'scheduled',
	"home_score" integer DEFAULT 0,
	"away_score" integer DEFAULT 0,
	"kickoff_at" timestamp,
	"venue" text,
	"external_id" text,
	"stats" jsonb,
	"events" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pro_matches_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "pro_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_name" varchar(50),
	"logo_url" text,
	"sport_id" uuid NOT NULL,
	"league" text,
	"country" varchar(100),
	"external_id" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pro_teams_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "shoutout_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fan_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"message" text NOT NULL,
	"gcoin_amount" integer NOT NULL,
	"status" "shoutout_status" DEFAULT 'pending',
	"video_url" text,
	"deadline" timestamp NOT NULL,
	"completed_at" timestamp,
	"cancelled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"icon" varchar(50),
	"color" varchar(20),
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sports_name_unique" UNIQUE("name"),
	CONSTRAINT "sports_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "super_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comment_id" uuid NOT NULL,
	"gcoin_amount" integer NOT NULL,
	"highlight_color" varchar(20),
	"is_pinned" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(50) DEFAULT 'member',
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"logo" text,
	"sport_id" uuid,
	"captain_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"invited_user_id" uuid NOT NULL,
	"invited_by_user_id" uuid NOT NULL,
	"type" "invite_type" NOT NULL,
	"status" "invite_status" DEFAULT 'pending',
	"message" text,
	"suggested_tier" "sponsor_tier",
	"responded_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_prizes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"sponsor_id" uuid,
	"placement" integer NOT NULL,
	"prize_type" varchar(20) NOT NULL,
	"gcoin_amount" numeric(12, 2),
	"product_name" varchar(255),
	"product_description" text,
	"product_image" text,
	"is_awarded" boolean DEFAULT false,
	"awarded_to_user_id" uuid,
	"awarded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_sponsors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"brand_user_id" uuid NOT NULL,
	"campaign_id" uuid,
	"tier" "sponsor_tier" DEFAULT 'bronze' NOT NULL,
	"gcoin_contribution" numeric(12, 2) DEFAULT '0',
	"product_prizes" jsonb,
	"logo_url" text,
	"message" text,
	"status" "sponsorship_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"rules" text,
	"cover_image" text,
	"sport_id" uuid NOT NULL,
	"organizer_id" uuid NOT NULL,
	"format" "tournament_format" DEFAULT 'single_elimination',
	"status" "tournament_status" DEFAULT 'draft',
	"max_participants" integer DEFAULT 32,
	"current_participants" integer DEFAULT 0,
	"min_participants" integer DEFAULT 4,
	"entry_fee" numeric(10, 2) DEFAULT '0',
	"entry_fee_type" "gcoin_type" DEFAULT 'real',
	"prize_pool" numeric(12, 2) DEFAULT '0',
	"prize_distribution" jsonb,
	"city" varchar(100),
	"state" varchar(50),
	"address" text,
	"is_online" boolean DEFAULT false,
	"level" "level",
	"start_date" timestamp,
	"end_date" timestamp,
	"registration_deadline" timestamp,
	"bracket_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tournaments_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"achievement_id" varchar(100) NOT NULL,
	"progress" integer DEFAULT 0,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"entity_type" "favorite_entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_missions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"mission_id" varchar(100) NOT NULL,
	"progress" integer DEFAULT 0,
	"completed_at" timestamp,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"reward_claimed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "user_role" NOT NULL,
	"verification_status" "verification_status" DEFAULT 'pending',
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"notify_tournaments" boolean DEFAULT true,
	"notify_matches" boolean DEFAULT true,
	"notify_gcoins" boolean DEFAULT true,
	"notify_social" boolean DEFAULT true,
	"notify_chat" boolean DEFAULT true,
	"notify_bets" boolean DEFAULT true,
	"notify_marketing" boolean DEFAULT false,
	"public_profile" boolean DEFAULT true,
	"show_results" boolean DEFAULT true,
	"show_gcoins" boolean DEFAULT true,
	"allow_messages" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_sports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"sport_id" uuid NOT NULL,
	"level" "level" DEFAULT 'C',
	"position" varchar(50),
	"rating" numeric(8, 2) DEFAULT '1000',
	"wins" integer DEFAULT 0,
	"losses" integer DEFAULT 0,
	"draws" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text,
	"email_verified" timestamp,
	"image" text,
	"phone" varchar(20),
	"bio" text,
	"city" varchar(100),
	"state" varchar(50),
	"country" varchar(50) DEFAULT 'Brasil',
	"gcoins_real" numeric(12, 2) DEFAULT '0',
	"gcoins_gamification" numeric(12, 2) DEFAULT '0',
	"xp" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"is_pro" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"instagram" varchar(100),
	"twitter" varchar(100),
	"youtube" varchar(100),
	"pix_key" varchar(255),
	"stripe_customer_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "withdrawal_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"gcoin_amount" numeric(12, 2) NOT NULL,
	"brl_amount" numeric(12, 2) NOT NULL,
	"pix_key" varchar(255) NOT NULL,
	"status" "withdrawal_status" DEFAULT 'pending',
	"reviewed_by" uuid,
	"reviewed_at" timestamp,
	"rejection_reason" text,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_products" ADD CONSTRAINT "affiliate_products_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arenas" ADD CONSTRAINT "arenas_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_campaigns" ADD CONSTRAINT "brand_campaigns_brand_user_id_users_id_fk" FOREIGN KEY ("brand_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_campaigns" ADD CONSTRAINT "brand_campaigns_target_sport_id_sports_id_fk" FOREIGN KEY ("target_sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_campaigns" ADD CONSTRAINT "brand_campaigns_target_tournament_id_tournaments_id_fk" FOREIGN KEY ("target_tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_redemptions" ADD CONSTRAINT "campaign_redemptions_campaign_id_brand_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."brand_campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_redemptions" ADD CONSTRAINT "campaign_redemptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_opponent_id_users_id_fk" FOREIGN KEY ("opponent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_winner_id_users_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_stats" ADD CONSTRAINT "creator_stats_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_tiers" ADD CONSTRAINT "creator_tiers_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_badges" ADD CONSTRAINT "fan_badges_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_badges" ADD CONSTRAINT "fan_badges_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_subscriptions" ADD CONSTRAINT "fan_subscriptions_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_subscriptions" ADD CONSTRAINT "fan_subscriptions_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_subscriptions" ADD CONSTRAINT "fan_subscriptions_tier_id_creator_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."creator_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gated_content" ADD CONSTRAINT "gated_content_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gated_content" ADD CONSTRAINT "gated_content_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gated_content" ADD CONSTRAINT "gated_content_min_tier_id_creator_tiers_id_fk" FOREIGN KEY ("min_tier_id") REFERENCES "public"."creator_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gcoin_transactions" ADD CONSTRAINT "gcoin_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_gift_type_id_gift_types_id_fk" FOREIGN KEY ("gift_type_id") REFERENCES "public"."gift_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_player1_id_users_id_fk" FOREIGN KEY ("player1_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_player2_id_users_id_fk" FOREIGN KEY ("player2_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_team1_id_teams_id_fk" FOREIGN KEY ("team1_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_team2_id_teams_id_fk" FOREIGN KEY ("team2_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_id_users_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_referee_id_users_id_fk" FOREIGN KEY ("referee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parlay_legs" ADD CONSTRAINT "parlay_legs_parlay_id_parlays_id_fk" FOREIGN KEY ("parlay_id") REFERENCES "public"."parlays"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parlay_legs" ADD CONSTRAINT "parlay_legs_match_id_pro_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."pro_matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parlays" ADD CONSTRAINT "parlays_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_athletes" ADD CONSTRAINT "pro_athletes_team_id_pro_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."pro_teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_athletes" ADD CONSTRAINT "pro_athletes_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_bets" ADD CONSTRAINT "pro_bets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_bets" ADD CONSTRAINT "pro_bets_match_id_pro_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."pro_matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_competitions" ADD CONSTRAINT "pro_competitions_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_match_odds" ADD CONSTRAINT "pro_match_odds_match_id_pro_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."pro_matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_matches" ADD CONSTRAINT "pro_matches_competition_id_pro_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."pro_competitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_matches" ADD CONSTRAINT "pro_matches_home_team_id_pro_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."pro_teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_matches" ADD CONSTRAINT "pro_matches_away_team_id_pro_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."pro_teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_teams" ADD CONSTRAINT "pro_teams_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shoutout_requests" ADD CONSTRAINT "shoutout_requests_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shoutout_requests" ADD CONSTRAINT "shoutout_requests_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "super_comments" ADD CONSTRAINT "super_comments_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_captain_id_users_id_fk" FOREIGN KEY ("captain_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_invites" ADD CONSTRAINT "tournament_invites_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_invites" ADD CONSTRAINT "tournament_invites_invited_user_id_users_id_fk" FOREIGN KEY ("invited_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_invites" ADD CONSTRAINT "tournament_invites_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_prizes" ADD CONSTRAINT "tournament_prizes_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_prizes" ADD CONSTRAINT "tournament_prizes_sponsor_id_tournament_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."tournament_sponsors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_prizes" ADD CONSTRAINT "tournament_prizes_awarded_to_user_id_users_id_fk" FOREIGN KEY ("awarded_to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_sponsors" ADD CONSTRAINT "tournament_sponsors_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_sponsors" ADD CONSTRAINT "tournament_sponsors_brand_user_id_users_id_fk" FOREIGN KEY ("brand_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_sponsors" ADD CONSTRAINT "tournament_sponsors_campaign_id_brand_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."brand_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_missions" ADD CONSTRAINT "user_missions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_missions" ADD CONSTRAINT "user_missions_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sports" ADD CONSTRAINT "user_sports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sports" ADD CONSTRAINT "user_sports_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_provider_idx" ON "accounts" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE INDEX "accounts_user_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "achievements_category_idx" ON "achievements" USING btree ("category");--> statement-breakpoint
CREATE INDEX "achievements_role_idx" ON "achievements" USING btree ("target_role");--> statement-breakpoint
CREATE INDEX "affiliate_products_creator_idx" ON "affiliate_products" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "affiliate_products_active_idx" ON "affiliate_products" USING btree ("creator_id","is_active");--> statement-breakpoint
CREATE INDEX "arenas_owner_idx" ON "arenas" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "arenas_city_idx" ON "arenas" USING btree ("city");--> statement-breakpoint
CREATE INDEX "bets_user_idx" ON "bets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bets_match_idx" ON "bets" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "bets_challenge_idx" ON "bets" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX "bets_result_idx" ON "bets" USING btree ("result");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_posts_published_idx" ON "blog_posts" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "brand_campaigns_brand_idx" ON "brand_campaigns" USING btree ("brand_user_id");--> statement-breakpoint
CREATE INDEX "brand_campaigns_status_idx" ON "brand_campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "brand_campaigns_placement_idx" ON "brand_campaigns" USING btree ("placement");--> statement-breakpoint
CREATE UNIQUE INDEX "campaign_redemptions_unique_idx" ON "campaign_redemptions" USING btree ("campaign_id","user_id");--> statement-breakpoint
CREATE INDEX "campaign_redemptions_campaign_idx" ON "campaign_redemptions" USING btree ("campaign_id");--> statement-breakpoint
CREATE UNIQUE INDEX "challenge_participants_unique_idx" ON "challenge_participants" USING btree ("challenge_id","user_id");--> statement-breakpoint
CREATE INDEX "challenges_sport_idx" ON "challenges" USING btree ("sport_id");--> statement-breakpoint
CREATE INDEX "challenges_creator_idx" ON "challenges" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "challenges_opponent_idx" ON "challenges" USING btree ("opponent_id");--> statement-breakpoint
CREATE INDEX "challenges_status_idx" ON "challenges" USING btree ("status");--> statement-breakpoint
CREATE INDEX "challenges_type_idx" ON "challenges" USING btree ("challenge_type");--> statement-breakpoint
CREATE UNIQUE INDEX "chat_members_unique_idx" ON "chat_members" USING btree ("room_id","user_id");--> statement-breakpoint
CREATE INDEX "chat_messages_room_idx" ON "chat_messages" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "chat_messages_created_idx" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "comments_post_idx" ON "comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "comments_user_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "creator_stats_creator_idx" ON "creator_stats" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "creator_stats_date_idx" ON "creator_stats" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "creator_stats_unique_idx" ON "creator_stats" USING btree ("creator_id","date");--> statement-breakpoint
CREATE INDEX "creator_tiers_creator_idx" ON "creator_tiers" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "creator_tiers_active_idx" ON "creator_tiers" USING btree ("creator_id","is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollments_unique_idx" ON "enrollments" USING btree ("tournament_id","user_id");--> statement-breakpoint
CREATE INDEX "enrollments_tournament_idx" ON "enrollments" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "enrollments_user_idx" ON "enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "fan_badges_unique_idx" ON "fan_badges" USING btree ("fan_id","creator_id");--> statement-breakpoint
CREATE INDEX "fan_badges_creator_idx" ON "fan_badges" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "fan_subscriptions_fan_idx" ON "fan_subscriptions" USING btree ("fan_id");--> statement-breakpoint
CREATE INDEX "fan_subscriptions_creator_idx" ON "fan_subscriptions" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "fan_subscriptions_status_idx" ON "fan_subscriptions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "fan_subscriptions_unique_idx" ON "fan_subscriptions" USING btree ("fan_id","creator_id");--> statement-breakpoint
CREATE UNIQUE INDEX "followers_unique_idx" ON "followers" USING btree ("follower_id","following_id");--> statement-breakpoint
CREATE INDEX "followers_follower_idx" ON "followers" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "followers_following_idx" ON "followers" USING btree ("following_id");--> statement-breakpoint
CREATE INDEX "gated_content_creator_idx" ON "gated_content" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "gated_content_post_idx" ON "gated_content" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "gcoin_tx_user_idx" ON "gcoin_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "gcoin_tx_type_idx" ON "gcoin_transactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "gcoin_tx_created_idx" ON "gcoin_transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "gifts_sender_idx" ON "gifts" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "gifts_receiver_idx" ON "gifts" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "gifts_created_idx" ON "gifts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "likes_user_idx" ON "likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "matches_tournament_idx" ON "matches" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "matches_status_idx" ON "matches" USING btree ("status");--> statement-breakpoint
CREATE INDEX "missions_frequency_idx" ON "missions" USING btree ("frequency");--> statement-breakpoint
CREATE INDEX "missions_role_idx" ON "missions" USING btree ("target_role");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_read_idx" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "parlay_legs_parlay_idx" ON "parlay_legs" USING btree ("parlay_id");--> statement-breakpoint
CREATE INDEX "parlay_legs_match_idx" ON "parlay_legs" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "parlays_user_idx" ON "parlays" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "parlays_status_idx" ON "parlays" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_orders_user_idx" ON "payment_orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_orders_status_idx" ON "payment_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_orders_created_idx" ON "payment_orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "posts_user_idx" ON "posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "posts_created_idx" ON "posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "pro_athletes_team_idx" ON "pro_athletes" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "pro_athletes_sport_idx" ON "pro_athletes" USING btree ("sport_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pro_athletes_external_id_idx" ON "pro_athletes" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "pro_bets_user_idx" ON "pro_bets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pro_bets_match_idx" ON "pro_bets" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "pro_bets_status_idx" ON "pro_bets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "pro_competitions_sport_idx" ON "pro_competitions" USING btree ("sport_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pro_competitions_external_id_idx" ON "pro_competitions" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "pro_match_odds_match_idx" ON "pro_match_odds" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "pro_match_odds_market_idx" ON "pro_match_odds" USING btree ("market_type");--> statement-breakpoint
CREATE INDEX "pro_matches_competition_idx" ON "pro_matches" USING btree ("competition_id");--> statement-breakpoint
CREATE INDEX "pro_matches_home_team_idx" ON "pro_matches" USING btree ("home_team_id");--> statement-breakpoint
CREATE INDEX "pro_matches_away_team_idx" ON "pro_matches" USING btree ("away_team_id");--> statement-breakpoint
CREATE INDEX "pro_matches_status_idx" ON "pro_matches" USING btree ("status");--> statement-breakpoint
CREATE INDEX "pro_matches_kickoff_idx" ON "pro_matches" USING btree ("kickoff_at");--> statement-breakpoint
CREATE UNIQUE INDEX "pro_matches_external_id_idx" ON "pro_matches" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "pro_teams_sport_idx" ON "pro_teams" USING btree ("sport_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pro_teams_external_id_idx" ON "pro_teams" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shoutout_requests_fan_idx" ON "shoutout_requests" USING btree ("fan_id");--> statement-breakpoint
CREATE INDEX "shoutout_requests_creator_idx" ON "shoutout_requests" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "shoutout_requests_status_idx" ON "shoutout_requests" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "super_comments_comment_idx" ON "super_comments" USING btree ("comment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "team_members_unique_idx" ON "team_members" USING btree ("team_id","user_id");--> statement-breakpoint
CREATE INDEX "teams_captain_idx" ON "teams" USING btree ("captain_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tournament_invites_unique_idx" ON "tournament_invites" USING btree ("tournament_id","invited_user_id","type");--> statement-breakpoint
CREATE INDEX "tournament_invites_tournament_idx" ON "tournament_invites" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "tournament_invites_invited_idx" ON "tournament_invites" USING btree ("invited_user_id");--> statement-breakpoint
CREATE INDEX "tournament_invites_status_idx" ON "tournament_invites" USING btree ("invited_user_id","status");--> statement-breakpoint
CREATE INDEX "tournament_prizes_tournament_idx" ON "tournament_prizes" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "tournament_prizes_sponsor_idx" ON "tournament_prizes" USING btree ("sponsor_id");--> statement-breakpoint
CREATE INDEX "tournament_sponsors_tournament_idx" ON "tournament_sponsors" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "tournament_sponsors_brand_idx" ON "tournament_sponsors" USING btree ("brand_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tournament_sponsors_unique_idx" ON "tournament_sponsors" USING btree ("tournament_id","brand_user_id");--> statement-breakpoint
CREATE INDEX "tournaments_sport_idx" ON "tournaments" USING btree ("sport_id");--> statement-breakpoint
CREATE INDEX "tournaments_organizer_idx" ON "tournaments" USING btree ("organizer_id");--> statement-breakpoint
CREATE INDEX "tournaments_status_idx" ON "tournaments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tournaments_start_idx" ON "tournaments" USING btree ("start_date");--> statement-breakpoint
CREATE UNIQUE INDEX "user_achievements_unique_idx" ON "user_achievements" USING btree ("user_id","achievement_id");--> statement-breakpoint
CREATE INDEX "user_achievements_user_idx" ON "user_achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_achievements_completed_idx" ON "user_achievements" USING btree ("completed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_favorites_unique_idx" ON "user_favorites" USING btree ("user_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "user_favorites_user_idx" ON "user_favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_favorites_entity_idx" ON "user_favorites" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "user_missions_user_idx" ON "user_missions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_missions_period_idx" ON "user_missions" USING btree ("period_start","period_end");--> statement-breakpoint
CREATE UNIQUE INDEX "user_missions_unique_idx" ON "user_missions" USING btree ("user_id","mission_id","period_start");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_unique_idx" ON "user_roles" USING btree ("user_id","role");--> statement-breakpoint
CREATE INDEX "user_roles_user_idx" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_sports_unique_idx" ON "user_sports" USING btree ("user_id","sport_id");--> statement-breakpoint
CREATE INDEX "user_sports_user_idx" ON "user_sports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_sports_sport_idx" ON "user_sports" USING btree ("sport_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_city_idx" ON "users" USING btree ("city");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_tokens_idx" ON "verification_tokens" USING btree ("identifier","token");--> statement-breakpoint
CREATE INDEX "withdrawal_requests_user_idx" ON "withdrawal_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "withdrawal_requests_status_idx" ON "withdrawal_requests" USING btree ("status");