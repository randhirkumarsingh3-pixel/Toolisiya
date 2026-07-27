-- Change id columns from UUID to TEXT to match PocketBase alphanumeric string IDs
alter table public.seo_settings alter column id drop default;
alter table public.seo_settings alter column id type text;

alter table public.website_settings alter column id drop default;
alter table public.website_settings alter column id type text;

alter table public.menu_settings alter column id drop default;
alter table public.menu_settings alter column id type text;

-- Drop foreign key constraint on tools category if it exists
alter table public.tools drop constraint if exists tools_category_fkey;

-- Drop unique constraint on seo_settings page_name
alter table public.seo_settings drop constraint if exists seo_settings_page_name_key;

-- Align categories schema
alter table public.categories add column if not exists icon text;
alter table public.categories add column if not exists description text;
alter table public.categories add column if not exists updated_at timestamptz default timezone('utc'::text, now()) not null;

-- Align tools schema
alter table public.tools add column if not exists url text;
alter table public.tools add column if not exists description text;
alter table public.tools add column if not exists icon text;
alter table public.tools add column if not exists status text;
alter table public.tools add column if not exists updated_at timestamptz default timezone('utc'::text, now()) not null;

-- Align website_settings schema
alter table public.website_settings add column if not exists description text;
alter table public.website_settings add column if not exists setting_key text;
alter table public.website_settings add column if not exists setting_type text;
alter table public.website_settings add column if not exists setting_value text;
alter table public.website_settings add column if not exists site_name text;
alter table public.website_settings add column if not exists site_description text;
alter table public.website_settings add column if not exists site_logo text;
alter table public.website_settings add column if not exists facebook_url text;
alter table public.website_settings add column if not exists twitter_url text;
alter table public.website_settings add column if not exists instagram_url text;
alter table public.website_settings add column if not exists linkedin_url text;
alter table public.website_settings add column if not exists youtube_url text;
alter table public.website_settings add column if not exists ga4_measurement_id text;
alter table public.website_settings add column if not exists adsense_publisher_id text;
alter table public.website_settings add column if not exists search_console_verification text;
alter table public.website_settings add column if not exists contact_email text;
alter table public.website_settings add column if not exists contact_phone text;
alter table public.website_settings add column if not exists contact_address text;
alter table public.website_settings add column if not exists maintenance_mode boolean default false;
alter table public.website_settings add column if not exists category_order jsonb;
alter table public.website_settings add column if not exists category_visibility jsonb;
alter table public.website_settings add column if not exists menu_items_config jsonb;

-- Align seo_settings schema
alter table public.seo_settings add column if not exists meta_title text;
alter table public.seo_settings add column if not exists meta_description text;
alter table public.seo_settings add column if not exists meta_keywords text;
alter table public.seo_settings add column if not exists canonical_url text;
alter table public.seo_settings add column if not exists og_title text;
alter table public.seo_settings add column if not exists og_description text;
alter table public.seo_settings add column if not exists og_image text;
alter table public.seo_settings add column if not exists twitter_title text;
alter table public.seo_settings add column if not exists twitter_description text;
alter table public.seo_settings add column if not exists twitter_image text;
alter table public.seo_settings add column if not exists structured_data jsonb;
alter table public.seo_settings add column if not exists is_published boolean default true;
alter table public.seo_settings add column if not exists h1_tag text;
alter table public.seo_settings add column if not exists faq_schema jsonb;
alter table public.seo_settings add column if not exists tool_schema jsonb;

-- Align menu_settings schema
alter table public.menu_settings add column if not exists "menuItems" jsonb;
