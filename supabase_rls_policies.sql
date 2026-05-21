-- =====================================================
-- Supabase Row Level Security (RLS) Policies
-- Run this in Supabase SQL Editor to fix access errors
-- =====================================================

-- 1. Enable RLS on all tables
ALTER TABLE public."tools" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."tool_content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."website_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."seo_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."content_pages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."analytics_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."social_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."menu_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."blog_posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."faq_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."activity_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."admin_users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."resumes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."otp_codes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."password_reset_tokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."email_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."pwa_stats" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."_integratedAiMessages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."_integratedAiImages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."admin_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."todos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."daily_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."sticky_notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."meetings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."countdowns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."pomodoro_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."habits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."water_intake" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."moods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."expenses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."medicines" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."meals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."routines" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."email_reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."invitation_templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."saved_invitations" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ-ONLY TABLES (anyone can read these)
-- =====================================================

CREATE POLICY "Allow public read on tools" ON public."tools" FOR SELECT USING (true);
CREATE POLICY "Allow public read on categories" ON public."categories" FOR SELECT USING (true);
CREATE POLICY "Allow public read on tool_content" ON public."tool_content" FOR SELECT USING (true);
CREATE POLICY "Allow public read on website_settings" ON public."website_settings" FOR SELECT USING (true);
CREATE POLICY "Allow public read on seo_settings" ON public."seo_settings" FOR SELECT USING (true);
CREATE POLICY "Allow public read on content_pages" ON public."content_pages" FOR SELECT USING (true);
CREATE POLICY "Allow public read on social_links" ON public."social_links" FOR SELECT USING (true);
CREATE POLICY "Allow public read on menu_settings" ON public."menu_settings" FOR SELECT USING (true);
CREATE POLICY "Allow public read on blog_posts" ON public."blog_posts" FOR SELECT USING (true);
CREATE POLICY "Allow public read on faq_items" ON public."faq_items" FOR SELECT USING (true);
CREATE POLICY "Allow public read on invitation_templates" ON public."invitation_templates" FOR SELECT USING (true);

-- =====================================================
-- ANALYTICS: public insert, service role read
-- =====================================================

CREATE POLICY "Allow public insert on analytics_events" ON public."analytics_events" FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role read on analytics_events" ON public."analytics_events" FOR SELECT USING (auth.role() = 'service_role');

-- =====================================================
-- SERVICE ROLE ONLY TABLES
-- =====================================================

CREATE POLICY "Service role only for admin_users" ON public."admin_users" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role only for admin_logs" ON public."admin_logs" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role only for otp_codes" ON public."otp_codes" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role only for password_reset_tokens" ON public."password_reset_tokens" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role only for activity_logs" ON public."activity_logs" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role only for email_logs" ON public."email_logs" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role only for pwa_stats" ON public."pwa_stats" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role only for notifications" ON public."notifications" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role only for email_reports" ON public."email_reports" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role only for _integratedAiImages" ON public."_integratedAiImages" FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- USER-OWNED TABLES (authenticated owner or service role)
-- =====================================================

-- Users
CREATE POLICY "Service role full access on users" ON public."users" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users can read own record" ON public."users" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own record" ON public."users" FOR UPDATE USING (auth.uid()::text = id);

-- Resumes
CREATE POLICY "Service role full access on resumes" ON public."resumes" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own resumes" ON public."resumes" FOR ALL USING (auth.uid()::text = "userId");

-- Invoices
CREATE POLICY "Service role full access on invoices" ON public."invoices" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own invoices" ON public."invoices" FOR ALL USING (auth.uid()::text = "userId");

-- Todos
CREATE POLICY "Service role full access on todos" ON public."todos" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own todos" ON public."todos" FOR ALL USING (auth.uid()::text = "userId");

-- Tasks
CREATE POLICY "Service role full access on tasks" ON public."tasks" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own tasks" ON public."tasks" FOR ALL USING (auth.uid()::text = "userId");

-- Daily Plans
CREATE POLICY "Service role full access on daily_plans" ON public."daily_plans" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own daily_plans" ON public."daily_plans" FOR ALL USING (auth.uid()::text = "userId");

-- Sticky Notes
CREATE POLICY "Service role full access on sticky_notes" ON public."sticky_notes" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own sticky_notes" ON public."sticky_notes" FOR ALL USING (auth.uid()::text = "userId");

-- Meetings
CREATE POLICY "Service role full access on meetings" ON public."meetings" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own meetings" ON public."meetings" FOR ALL USING (auth.uid()::text = "userId");

-- Countdowns
CREATE POLICY "Service role full access on countdowns" ON public."countdowns" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own countdowns" ON public."countdowns" FOR ALL USING (auth.uid()::text = "userId");

-- Pomodoro Sessions
CREATE POLICY "Service role full access on pomodoro_sessions" ON public."pomodoro_sessions" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own pomodoro_sessions" ON public."pomodoro_sessions" FOR ALL USING (auth.uid()::text = "userId");

-- Habits
CREATE POLICY "Service role full access on habits" ON public."habits" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own habits" ON public."habits" FOR ALL USING (auth.uid()::text = "userId");

-- Water Intake
CREATE POLICY "Service role full access on water_intake" ON public."water_intake" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own water_intake" ON public."water_intake" FOR ALL USING (auth.uid()::text = "userId");

-- Moods
CREATE POLICY "Service role full access on moods" ON public."moods" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own moods" ON public."moods" FOR ALL USING (auth.uid()::text = "userId");

-- Expenses
CREATE POLICY "Service role full access on expenses" ON public."expenses" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own expenses" ON public."expenses" FOR ALL USING (auth.uid()::text = "userId");

-- Medicines (correct table for medicine reminders)
CREATE POLICY "Service role full access on medicines" ON public."medicines" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own medicines" ON public."medicines" FOR ALL USING (auth.uid()::text = "userId");

-- Meals
CREATE POLICY "Service role full access on meals" ON public."meals" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own meals" ON public."meals" FOR ALL USING (auth.uid()::text = "userId");

-- Routines
CREATE POLICY "Service role full access on routines" ON public."routines" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own routines" ON public."routines" FOR ALL USING (auth.uid()::text = "userId");

-- Saved Invitations
CREATE POLICY "Service role full access on saved_invitations" ON public."saved_invitations" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own saved_invitations" ON public."saved_invitations" FOR ALL USING (auth.uid()::text = "userId");

-- AI Messages
CREATE POLICY "Service role only for _integratedAiMessages" ON public."_integratedAiMessages" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users manage own _integratedAiMessages" ON public."_integratedAiMessages" FOR ALL USING (auth.uid()::text = "userId");
