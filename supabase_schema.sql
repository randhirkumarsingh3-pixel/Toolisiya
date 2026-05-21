-- Toolisiya Database Schema Migration Script for Supabase (PostgreSQL)
-- Generated automatically from PocketBase snapshot

-- -----------------------------------------------------
-- Table: users
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."users" CASCADE;
CREATE TABLE public."users" (
  "id" TEXT PRIMARY KEY,
  "password" TEXT NOT NULL,
  "tokenKey" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailVisibility" BOOLEAN DEFAULT FALSE,
  "verified" BOOLEAN DEFAULT FALSE,
  "name" TEXT,
  "profile_picture" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "role" TEXT,
  "username" TEXT,
  "mobile" TEXT,
  "google_id" TEXT
);

-- -----------------------------------------------------
-- Table: _integratedAiMessages
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."_integratedAiMessages" CASCADE;
CREATE TABLE public."_integratedAiMessages" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "role" TEXT NOT NULL,
  "content" JSONB DEFAULT '{}'::jsonb NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: _integratedAiImages
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."_integratedAiImages" CASCADE;
CREATE TABLE public."_integratedAiImages" (
  "id" TEXT PRIMARY KEY,
  "file" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: resumes
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."resumes" CASCADE;
CREATE TABLE public."resumes" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "address" TEXT,
  "summary" TEXT,
  "photo" TEXT,
  "experience" JSONB DEFAULT '{}'::jsonb,
  "education" JSONB DEFAULT '{}'::jsonb,
  "skills" JSONB DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: invoices
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."invoices" CASCADE;
CREATE TABLE public."invoices" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "invoiceNumber" TEXT NOT NULL,
  "clientName" TEXT NOT NULL,
  "clientEmail" TEXT NOT NULL,
  "items" JSONB DEFAULT '{}'::jsonb NOT NULL,
  "subtotal" DOUBLE PRECISION NOT NULL,
  "gstAmount" DOUBLE PRECISION NOT NULL,
  "totalAmount" DOUBLE PRECISION NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: otp_codes
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."otp_codes" CASCADE;
CREATE TABLE public."otp_codes" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "expires_at" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: password_reset_tokens
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."password_reset_tokens" CASCADE;
CREATE TABLE public."password_reset_tokens" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires_at" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: admin_users
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."admin_users" CASCADE;
CREATE TABLE public."admin_users" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "last_login" TEXT,
  "password" TEXT NOT NULL,
  "tokenKey" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailVisibility" BOOLEAN DEFAULT FALSE,
  "verified" BOOLEAN DEFAULT FALSE,
  "status" TEXT,
  "lastLogin" TEXT
);

-- -----------------------------------------------------
-- Table: website_settings
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."website_settings" CASCADE;
CREATE TABLE public."website_settings" (
  "id" TEXT PRIMARY KEY,
  "setting_key" TEXT NOT NULL,
  "setting_value" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "setting_type" TEXT,
  "description" TEXT,
  "category_visibility" JSONB DEFAULT '{}'::jsonb,
  "category_order" JSONB DEFAULT '{}'::jsonb,
  "menu_items_config" JSONB DEFAULT '{}'::jsonb,
  "site_name" TEXT,
  "site_description" TEXT,
  "contact_email" TEXT,
  "contact_phone" TEXT,
  "contact_address" TEXT,
  "ga4_measurement_id" TEXT,
  "adsense_publisher_id" TEXT,
  "search_console_verification" TEXT,
  "facebook_url" TEXT,
  "twitter_url" TEXT,
  "instagram_url" TEXT,
  "linkedin_url" TEXT,
  "youtube_url" TEXT,
  "maintenance_mode" BOOLEAN DEFAULT FALSE,
  "site_logo" TEXT
);

-- -----------------------------------------------------
-- Table: social_links
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."social_links" CASCADE;
CREATE TABLE public."social_links" (
  "id" TEXT PRIMARY KEY,
  "platform" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "enabled" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: activity_logs
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."activity_logs" CASCADE;
CREATE TABLE public."activity_logs" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT,
  "action" TEXT NOT NULL,
  "entity_type" TEXT,
  "entity_id" TEXT,
  "details" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: admin_logs
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."admin_logs" CASCADE;
CREATE TABLE public."admin_logs" (
  "id" TEXT PRIMARY KEY,
  "admin_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT,
  "details" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: notifications
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."notifications" CASCADE;
CREATE TABLE public."notifications" (
  "id" TEXT PRIMARY KEY,
  "admin_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "read" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: todos
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."todos" CASCADE;
CREATE TABLE public."todos" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "dueDate" TEXT,
  "priority" TEXT,
  "completed" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: tasks
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."tasks" CASCADE;
CREATE TABLE public."tasks" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "priority" TEXT,
  "status" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: daily_plans
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."daily_plans" CASCADE;
CREATE TABLE public."daily_plans" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "planDate" TEXT NOT NULL,
  "timeSlot" TEXT NOT NULL,
  "taskTitle" TEXT NOT NULL,
  "taskDescription" TEXT,
  "completed" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: sticky_notes
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."sticky_notes" CASCADE;
CREATE TABLE public."sticky_notes" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "color" TEXT,
  "pinned" BOOLEAN DEFAULT FALSE,
  "position" JSONB DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: meetings
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."meetings" CASCADE;
CREATE TABLE public."meetings" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "title" TEXT NOT NULL,
  "meetingDate" TEXT NOT NULL,
  "meetingTime" TEXT,
  "attendees" TEXT,
  "agenda" TEXT,
  "notes" TEXT,
  "actionItems" JSONB DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: countdowns
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."countdowns" CASCADE;
CREATE TABLE public."countdowns" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "name" TEXT,
  "hours" DOUBLE PRECISION,
  "minutes" DOUBLE PRECISION,
  "seconds" DOUBLE PRECISION,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: pomodoro_sessions
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."pomodoro_sessions" CASCADE;
CREATE TABLE public."pomodoro_sessions" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "workDuration" DOUBLE PRECISION,
  "breakDuration" DOUBLE PRECISION,
  "completedSessions" DOUBLE PRECISION,
  "lastSessionDate" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: habits
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."habits" CASCADE;
CREATE TABLE public."habits" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "habitName" TEXT NOT NULL,
  "currentStreak" DOUBLE PRECISION,
  "longestStreak" DOUBLE PRECISION,
  "completedDates" JSONB DEFAULT '{}'::jsonb,
  "lastCompletedDate" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: water_intake
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."water_intake" CASCADE;
CREATE TABLE public."water_intake" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "intakeDate" TEXT NOT NULL,
  "dailyGoal" DOUBLE PRECISION,
  "currentIntake" DOUBLE PRECISION,
  "intakeHistory" JSONB DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: moods
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."moods" CASCADE;
CREATE TABLE public."moods" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "mood" TEXT,
  "note" TEXT,
  "moodDate" TEXT NOT NULL,
  "moodTime" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: expenses
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."expenses" CASCADE;
CREATE TABLE public."expenses" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "category" TEXT,
  "amount" DOUBLE PRECISION NOT NULL,
  "expenseDate" TEXT NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: medicines
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."medicines" CASCADE;
CREATE TABLE public."medicines" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "medicineName" TEXT NOT NULL,
  "dosage" TEXT NOT NULL,
  "frequency" TEXT,
  "medicineTime" TEXT NOT NULL,
  "notes" TEXT,
  "takenToday" BOOLEAN DEFAULT FALSE,
  "lastTakenDate" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: meals
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."meals" CASCADE;
CREATE TABLE public."meals" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "mealDate" TEXT NOT NULL,
  "dayOfWeek" TEXT,
  "mealType" TEXT,
  "mealName" TEXT NOT NULL,
  "ingredients" JSONB DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: routines
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."routines" CASCADE;
CREATE TABLE public."routines" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "taskName" TEXT NOT NULL,
  "routineTime" TEXT NOT NULL,
  "duration" DOUBLE PRECISION NOT NULL,
  "category" TEXT,
  "completed" BOOLEAN DEFAULT FALSE,
  "completedDate" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: analytics_events
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."analytics_events" CASCADE;
CREATE TABLE public."analytics_events" (
  "id" TEXT PRIMARY KEY DEFAULT substring(md5(random()::text) from 1 for 15),
  "userId" TEXT,
  "eventType" TEXT NOT NULL,
  "toolName" TEXT,
  "toolCategory" TEXT,
  "page" TEXT,
  "referrer" TEXT,
  "device" TEXT,
  "browser" TEXT,
  "os" TEXT,
  "country" TEXT,
  "region" TEXT,
  "city" TEXT,
  "timestamp" TEXT,
  "sessionId" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: tools
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."tools" CASCADE;
CREATE TABLE public."tools" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "icon" TEXT,
  "url" TEXT NOT NULL,
  "status" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "show_in_menu" BOOLEAN DEFAULT FALSE
);

-- -----------------------------------------------------
-- Table: content_pages
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."content_pages" CASCADE;
CREATE TABLE public."content_pages" (
  "id" TEXT PRIMARY KEY,
  "page_type" TEXT NOT NULL,
  "page_id" TEXT,
  "title" TEXT,
  "description" TEXT,
  "content" TEXT,
  "image" TEXT,
  "metadata" JSONB DEFAULT '{}'::jsonb,
  "published" BOOLEAN DEFAULT FALSE,
  "scheduled_date" TEXT,
  "version" DOUBLE PRECISION,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: faq_items
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."faq_items" CASCADE;
CREATE TABLE public."faq_items" (
  "id" TEXT PRIMARY KEY,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "category" TEXT,
  "order" DOUBLE PRECISION,
  "published" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: blog_posts
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."blog_posts" CASCADE;
CREATE TABLE public."blog_posts" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "featured_image" TEXT,
  "author_id" TEXT,
  "category" TEXT,
  "tags" TEXT,
  "published" BOOLEAN DEFAULT FALSE,
  "published_date" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: seo_settings
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."seo_settings" CASCADE;
CREATE TABLE public."seo_settings" (
  "id" TEXT PRIMARY KEY,
  "page_name" TEXT NOT NULL,
  "meta_title" TEXT,
  "meta_description" TEXT,
  "meta_keywords" TEXT,
  "canonical_url" TEXT,
  "og_title" TEXT,
  "og_description" TEXT,
  "og_image" TEXT,
  "twitter_title" TEXT,
  "twitter_description" TEXT,
  "twitter_image" TEXT,
  "structured_data" JSONB DEFAULT '{}'::jsonb,
  "is_published" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "h1_tag" TEXT NOT NULL,
  "faq_schema" JSONB DEFAULT '{}'::jsonb,
  "tool_schema" JSONB DEFAULT '{}'::jsonb
);

-- -----------------------------------------------------
-- Table: tool_content
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."tool_content" CASCADE;
CREATE TABLE public."tool_content" (
  "id" TEXT PRIMARY KEY,
  "toolId" TEXT NOT NULL,
  "toolName" TEXT NOT NULL,
  "introduction" TEXT NOT NULL,
  "howToUse" TEXT NOT NULL,
  "realWorldExamples" TEXT NOT NULL,
  "tipsAndTricks" TEXT NOT NULL,
  "commonMistakes" TEXT NOT NULL,
  "relatedTools" JSONB DEFAULT '{}'::jsonb NOT NULL,
  "keywords" TEXT,
  "lastUpdated" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "faq" JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- -----------------------------------------------------
-- Table: menu_settings
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."menu_settings" CASCADE;
CREATE TABLE public."menu_settings" (
  "id" TEXT PRIMARY KEY,
  "categories" JSONB DEFAULT '{}'::jsonb,
  "menuItems" JSONB DEFAULT '{}'::jsonb,
  "categoryOrder" JSONB DEFAULT '{}'::jsonb,
  "visibility" JSONB DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: email_reports
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."email_reports" CASCADE;
CREATE TABLE public."email_reports" (
  "id" TEXT PRIMARY KEY,
  "reportDate" TEXT NOT NULL,
  "metrics" JSONB DEFAULT '{}'::jsonb NOT NULL,
  "emailSent" BOOLEAN DEFAULT FALSE,
  "sentAt" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: invitation_templates
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."invitation_templates" CASCADE;
CREATE TABLE public."invitation_templates" (
  "id" TEXT PRIMARY KEY,
  "templateId" TEXT NOT NULL,
  "templateName" TEXT NOT NULL,
  "templateCategory" TEXT NOT NULL,
  "toolType" TEXT NOT NULL,
  "previewImage" TEXT,
  "designData" JSONB DEFAULT '{}'::jsonb NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: saved_invitations
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."saved_invitations" CASCADE;
CREATE TABLE public."saved_invitations" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "toolType" TEXT NOT NULL,
  "invitationName" TEXT NOT NULL,
  "templateId" TEXT,
  "formData" JSONB DEFAULT '{}'::jsonb NOT NULL,
  "customizationData" JSONB DEFAULT '{}'::jsonb,
  "previewImage" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: email_logs
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."email_logs" CASCADE;
CREATE TABLE public."email_logs" (
  "id" TEXT PRIMARY KEY,
  "reportDate" TEXT NOT NULL,
  "adminEmail" TEXT NOT NULL,
  "adminName" TEXT,
  "status" TEXT NOT NULL,
  "errorMessage" TEXT,
  "sentAt" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- -----------------------------------------------------
-- Table: categories
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."categories" CASCADE;
CREATE TABLE public."categories" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "icon" TEXT,
  "description" TEXT,
  "is_active" BOOLEAN DEFAULT FALSE,
  "order" DOUBLE PRECISION
);

-- -----------------------------------------------------
-- Table: pwa_stats
-- -----------------------------------------------------
DROP TABLE IF EXISTS public."pwa_stats" CASCADE;
CREATE TABLE public."pwa_stats" (
  "id" TEXT PRIMARY KEY
);

-- -----------------------------------------------------
-- Database Indexes
-- -----------------------------------------------------
CREATE UNIQUE INDEX "idx_tokenKey__pb_users_auth_" ON public."users" ("tokenKey");
CREATE UNIQUE INDEX "idx_email__pb_users_auth_" ON public."users" ("email") WHERE "email" != '';
CREATE UNIQUE INDEX "idx_users_username" ON public."users" ("username");
CREATE INDEX "idx_WPAhfnyyQ7" ON public."_integratedAiMessages" ("userId");
CREATE UNIQUE INDEX "idx_invoices_invoiceNumber" ON public."invoices" ("invoiceNumber");
CREATE INDEX "idx_otp_codes_email" ON public."otp_codes" ("email");
CREATE UNIQUE INDEX "idx_password_reset_tokens_token" ON public."password_reset_tokens" ("token");
CREATE UNIQUE INDEX "idx_tokenKey_pbc_3387401183" ON public."admin_users" ("tokenKey");
CREATE UNIQUE INDEX "idx_email_pbc_3387401183" ON public."admin_users" ("email") WHERE "email" != '';
CREATE UNIQUE INDEX "idx_website_settings_setting_key" ON public."website_settings" ("setting_key");
