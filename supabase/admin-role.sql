-- Run this after creating the admin user in Supabase Auth.
-- It marks this email as an admin for the RLS policies in supabase/schema.sql.
-- Replace admin@example.com with your real admin email before running.

update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'admin@example.com';
