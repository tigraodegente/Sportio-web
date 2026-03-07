CREATE TYPE "public"."achievement_tier" AS ENUM('bronze', 'silver', 'gold', 'platinum', 'diamond');--> statement-breakpoint
CREATE TYPE "public"."ad_placement" AS ENUM('feed_banner', 'sidebar', 'tournament_sponsor', 'profile_banner', 'challenge_sponsor', 'post_promoted');--> statement-breakpoint
CREATE TYPE "public"."campaign_type" AS ENUM('banner', 'product_giveaway', 'gcoin_reward', 'tournament_sponsor', 'challenge_sponsor');--> statement-breakpoint
CREATE TYPE "public"."challenge_status" AS ENUM('pending', 'accepted', 'betting_open', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."challenge_type" AS ENUM('duel', 'community');--> statement-breakpoint
CREATE TYPE "public"."fan_badge_tier" AS ENUM('bronze', 'silver', 'gold', 'diamond');--> statement-breakpoint
CREATE TYPE "public"."invite_status" AS ENUM('pending', 'accepted', 'declined', 'expired');--> statement-breakpoint
CREATE TYPE "public"."invite_type" AS ENUM('athlete', 'sponsor');--> statement-breakpoint
CREATE TYPE "public"."mission_frequency" AS ENUM('daily', 'weekly', 'monthly', 'one_time');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('pix', 'credit_card', 'debit_card', 'boleto');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'expired');--> statement-breakpoint
CREATE TYPE "public"."shoutout_status" AS ENUM('pending', 'accepted', 'completed', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."sponsor_tier" AS ENUM('main', 'gold', 'silver', 'bronze');--> statement-breakpoint
CREATE TYPE "public"."sponsorship_status" AS ENUM('pending', 'active', 'paused', 'completed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'expired', 'past_due');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_status" AS ENUM('pending', 'approved', 'processing', 'completed', 'rejected');--> statement-breakpoint
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
CREATE TABLE "gated_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"min_tier_id" uuid NOT NULL,
	"teaser_text" text,
	"teaser_image_url" text
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
CREATE TABLE "super_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comment_id" uuid NOT NULL,
	"gcoin_amount" integer NOT NULL,
	"highlight_color" varchar(20),
	"is_pinned" boolean DEFAULT false
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
CREATE TABLE "user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"achievement_id" varchar(100) NOT NULL,
	"progress" integer DEFAULT 0,
	"completed_at" timestamp,
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
ALTER TABLE "bets" ALTER COLUMN "match_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bets" ALTER COLUMN "tournament_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_sports" ALTER COLUMN "rating" SET DATA TYPE numeric(8, 2);--> statement-breakpoint
ALTER TABLE "user_sports" ALTER COLUMN "rating" SET DEFAULT '1000';--> statement-breakpoint
ALTER TABLE "bets" ADD COLUMN "challenge_id" uuid;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "challenge_type" "challenge_type" DEFAULT 'duel' NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "status" "challenge_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "opponent_id" uuid;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "winner_id" uuid;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "score1" integer;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "score2" integer;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "betting_enabled" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "betting_deadline" timestamp;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "wager_amount" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "current_participants" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "affiliate_products" ADD CONSTRAINT "affiliate_products_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_campaigns" ADD CONSTRAINT "brand_campaigns_brand_user_id_users_id_fk" FOREIGN KEY ("brand_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_campaigns" ADD CONSTRAINT "brand_campaigns_target_sport_id_sports_id_fk" FOREIGN KEY ("target_sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_campaigns" ADD CONSTRAINT "brand_campaigns_target_tournament_id_tournaments_id_fk" FOREIGN KEY ("target_tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_redemptions" ADD CONSTRAINT "campaign_redemptions_campaign_id_brand_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."brand_campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_redemptions" ADD CONSTRAINT "campaign_redemptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_stats" ADD CONSTRAINT "creator_stats_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_tiers" ADD CONSTRAINT "creator_tiers_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_badges" ADD CONSTRAINT "fan_badges_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_badges" ADD CONSTRAINT "fan_badges_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_subscriptions" ADD CONSTRAINT "fan_subscriptions_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_subscriptions" ADD CONSTRAINT "fan_subscriptions_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_subscriptions" ADD CONSTRAINT "fan_subscriptions_tier_id_creator_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."creator_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gated_content" ADD CONSTRAINT "gated_content_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gated_content" ADD CONSTRAINT "gated_content_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gated_content" ADD CONSTRAINT "gated_content_min_tier_id_creator_tiers_id_fk" FOREIGN KEY ("min_tier_id") REFERENCES "public"."creator_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_gift_type_id_gift_types_id_fk" FOREIGN KEY ("gift_type_id") REFERENCES "public"."gift_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shoutout_requests" ADD CONSTRAINT "shoutout_requests_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shoutout_requests" ADD CONSTRAINT "shoutout_requests_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "super_comments" ADD CONSTRAINT "super_comments_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_invites" ADD CONSTRAINT "tournament_invites_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_invites" ADD CONSTRAINT "tournament_invites_invited_user_id_users_id_fk" FOREIGN KEY ("invited_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_invites" ADD CONSTRAINT "tournament_invites_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_prizes" ADD CONSTRAINT "tournament_prizes_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_prizes" ADD CONSTRAINT "tournament_prizes_sponsor_id_tournament_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."tournament_sponsors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_prizes" ADD CONSTRAINT "tournament_prizes_awarded_to_user_id_users_id_fk" FOREIGN KEY ("awarded_to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_sponsors" ADD CONSTRAINT "tournament_sponsors_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_sponsors" ADD CONSTRAINT "tournament_sponsors_brand_user_id_users_id_fk" FOREIGN KEY ("brand_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_sponsors" ADD CONSTRAINT "tournament_sponsors_campaign_id_brand_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."brand_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_missions" ADD CONSTRAINT "user_missions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_missions" ADD CONSTRAINT "user_missions_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "achievements_category_idx" ON "achievements" USING btree ("category");--> statement-breakpoint
CREATE INDEX "achievements_role_idx" ON "achievements" USING btree ("target_role");--> statement-breakpoint
CREATE INDEX "affiliate_products_creator_idx" ON "affiliate_products" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "affiliate_products_active_idx" ON "affiliate_products" USING btree ("creator_id","is_active");--> statement-breakpoint
CREATE INDEX "brand_campaigns_brand_idx" ON "brand_campaigns" USING btree ("brand_user_id");--> statement-breakpoint
CREATE INDEX "brand_campaigns_status_idx" ON "brand_campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "brand_campaigns_placement_idx" ON "brand_campaigns" USING btree ("placement");--> statement-breakpoint
CREATE UNIQUE INDEX "campaign_redemptions_unique_idx" ON "campaign_redemptions" USING btree ("campaign_id","user_id");--> statement-breakpoint
CREATE INDEX "campaign_redemptions_campaign_idx" ON "campaign_redemptions" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "creator_stats_creator_idx" ON "creator_stats" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "creator_stats_date_idx" ON "creator_stats" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "creator_stats_unique_idx" ON "creator_stats" USING btree ("creator_id","date");--> statement-breakpoint
CREATE INDEX "creator_tiers_creator_idx" ON "creator_tiers" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "creator_tiers_active_idx" ON "creator_tiers" USING btree ("creator_id","is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "fan_badges_unique_idx" ON "fan_badges" USING btree ("fan_id","creator_id");--> statement-breakpoint
CREATE INDEX "fan_badges_creator_idx" ON "fan_badges" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "fan_subscriptions_fan_idx" ON "fan_subscriptions" USING btree ("fan_id");--> statement-breakpoint
CREATE INDEX "fan_subscriptions_creator_idx" ON "fan_subscriptions" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "fan_subscriptions_status_idx" ON "fan_subscriptions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "fan_subscriptions_unique_idx" ON "fan_subscriptions" USING btree ("fan_id","creator_id");--> statement-breakpoint
CREATE INDEX "gated_content_creator_idx" ON "gated_content" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "gated_content_post_idx" ON "gated_content" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "gifts_sender_idx" ON "gifts" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "gifts_receiver_idx" ON "gifts" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "gifts_created_idx" ON "gifts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "missions_frequency_idx" ON "missions" USING btree ("frequency");--> statement-breakpoint
CREATE INDEX "missions_role_idx" ON "missions" USING btree ("target_role");--> statement-breakpoint
CREATE INDEX "payment_orders_user_idx" ON "payment_orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_orders_status_idx" ON "payment_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_orders_created_idx" ON "payment_orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "shoutout_requests_fan_idx" ON "shoutout_requests" USING btree ("fan_id");--> statement-breakpoint
CREATE INDEX "shoutout_requests_creator_idx" ON "shoutout_requests" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "shoutout_requests_status_idx" ON "shoutout_requests" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "super_comments_comment_idx" ON "super_comments" USING btree ("comment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tournament_invites_unique_idx" ON "tournament_invites" USING btree ("tournament_id","invited_user_id","type");--> statement-breakpoint
CREATE INDEX "tournament_invites_tournament_idx" ON "tournament_invites" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "tournament_invites_invited_idx" ON "tournament_invites" USING btree ("invited_user_id");--> statement-breakpoint
CREATE INDEX "tournament_invites_status_idx" ON "tournament_invites" USING btree ("invited_user_id","status");--> statement-breakpoint
CREATE INDEX "tournament_prizes_tournament_idx" ON "tournament_prizes" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "tournament_prizes_sponsor_idx" ON "tournament_prizes" USING btree ("sponsor_id");--> statement-breakpoint
CREATE INDEX "tournament_sponsors_tournament_idx" ON "tournament_sponsors" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "tournament_sponsors_brand_idx" ON "tournament_sponsors" USING btree ("brand_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tournament_sponsors_unique_idx" ON "tournament_sponsors" USING btree ("tournament_id","brand_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_achievements_unique_idx" ON "user_achievements" USING btree ("user_id","achievement_id");--> statement-breakpoint
CREATE INDEX "user_achievements_user_idx" ON "user_achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_achievements_completed_idx" ON "user_achievements" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "user_missions_user_idx" ON "user_missions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_missions_period_idx" ON "user_missions" USING btree ("period_start","period_end");--> statement-breakpoint
CREATE UNIQUE INDEX "user_missions_unique_idx" ON "user_missions" USING btree ("user_id","mission_id","period_start");--> statement-breakpoint
CREATE INDEX "withdrawal_requests_user_idx" ON "withdrawal_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "withdrawal_requests_status_idx" ON "withdrawal_requests" USING btree ("status");--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_opponent_id_users_id_fk" FOREIGN KEY ("opponent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_winner_id_users_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bets_challenge_idx" ON "bets" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX "challenges_creator_idx" ON "challenges" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "challenges_opponent_idx" ON "challenges" USING btree ("opponent_id");--> statement-breakpoint
CREATE INDEX "challenges_status_idx" ON "challenges" USING btree ("status");--> statement-breakpoint
CREATE INDEX "challenges_type_idx" ON "challenges" USING btree ("challenge_type");