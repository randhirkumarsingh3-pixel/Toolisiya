-- Toolisiya Supabase Tables Initialization Schema
-- Copy and paste this script into your Supabase SQL Editor to create all required tables.

-- 1. Users Profile Table (linked to auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text,
  username text unique,
  mobile text unique,
  name text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Admin Users Table
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  username text unique,
  name text,
  status text default 'active',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Categories Table
create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text unique not null,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Tools Table
create table if not exists public.tools (
  id text primary key,
  name text not null,
  slug text unique not null,
  is_active boolean default true,
  show_in_menu boolean default true,
  category text references public.categories(id) on delete set null,
  seo_title text,
  seo_description text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. SEO Settings Table
create table if not exists public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  page_name text unique not null,
  title text,
  description text,
  keywords text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 6. Website Settings Table
create table if not exists public.website_settings (
  id uuid primary key default gen_random_uuid(),
  facebook text,
  twitter text,
  instagram text,
  linkedin text,
  youtube text,
  ga_id text,
  adsense_id text,
  header_scripts text,
  footer_scripts text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 7. Tracker Tables (Water Intake, Habits, Moods, Medicines, Todos, Meetings, Tasks)
create table if not exists public.water_intake (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  amount numeric not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  name text not null,
  streak integer default 0,
  is_completed boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.moods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  mood text not null,
  note text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Medicines Table
create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  name text not null,
  dosage text,
  reminder_time time not null,
  is_taken boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Todos Table
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  task text not null,
  completed boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Meetings Table
create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  notes text,
  meeting_time timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Tasks Table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  status text default 'todo',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 8. Enable Realtime Replication for Subscriptions
alter publication supabase_realtime add table public.categories;
alter publication supabase_realtime add table public.tools;
alter publication supabase_realtime add table public.water_intake;
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.moods;
alter publication supabase_realtime add table public.medicines;
alter publication supabase_realtime add table public.todos;
alter publication supabase_realtime add table public.meetings;
alter publication supabase_realtime add table public.tasks;
