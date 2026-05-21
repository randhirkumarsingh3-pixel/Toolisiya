-- 9. Add order column to categories
alter table public.categories add column if not exists "order" integer default 0;

-- 10. Analytics Events Table
create table if not exists public.analytics_events (
  id text primary key default substring(md5(random()::text) from 1 for 15),
  "eventType" text,
  "toolName" text,
  "toolCategory" text,
  page text,
  referrer text,
  device text,
  browser text,
  os text,
  country text,
  region text,
  city text,
  "userId" text,
  "sessionId" text,
  timestamp text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 11. Menu Settings Table
create table if not exists public.menu_settings (
  id uuid primary key default gen_random_uuid(),
  categories jsonb,
  "categoryOrder" jsonb,
  visibility jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Add missing tables to realtime publication
alter publication supabase_realtime add table public.menu_settings;
