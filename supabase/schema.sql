create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric not null default 0 check (price >= 0),
  discount_price numeric check (discount_price is null or discount_price >= 0),
  main_image_url text,
  status text not null default 'active' check (status in ('active', 'draft', 'out_of_stock')),
  is_featured boolean not null default false,
  is_promo boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_name text,
  size text,
  color text,
  stock int not null default 0 check (stock >= 0),
  is_available boolean not null default true
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'INA BEAUTY',
  slogan text not null default 'Cantik Alami, Percaya Diri Setiap Hari',
  whatsapp_number text not null default '6281234567890',
  instagram_url text,
  tiktok_url text,
  default_whatsapp_message text default 'Halo Admin INA BEAUTY, saya ingin bertanya tentang produk.'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (status = 'active' or public.is_admin());

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read images for active products" on public.product_images;
create policy "Public can read images for active products"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and (products.status = 'active' or public.is_admin())
  )
);

drop policy if exists "Admins can manage product images" on public.product_images;
create policy "Admins can manage product images"
on public.product_images
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read available variants for active products" on public.product_variants;
create policy "Public can read available variants for active products"
on public.product_variants
for select
to anon, authenticated
using (
  (
    is_available = true
    and exists (
      select 1
      from public.products
      where products.id = product_variants.product_id
        and products.status = 'active'
    )
  )
  or public.is_admin()
);

drop policy if exists "Admins can manage product variants" on public.product_variants;
create policy "Admins can manage product variants"
on public.product_variants
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.site_settings (
  store_name,
  slogan,
  whatsapp_number,
  instagram_url,
  tiktok_url,
  default_whatsapp_message
)
select
  'INA BEAUTY',
  'Cantik Alami, Percaya Diri Setiap Hari',
  '6281234567890',
  null,
  null,
  'Halo Admin INA BEAUTY, saya ingin bertanya tentang produk.'
where not exists (select 1 from public.site_settings);

insert into public.categories (name, slug, sort_order, is_active)
values
  ('Skincare', 'skincare', 1, true),
  ('Makeup', 'makeup', 2, true),
  ('Fashion Wanita', 'fashion-wanita', 3, true),
  ('Aksesoris', 'aksesoris', 4, true)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read product image files" on storage.objects;
create policy "Public can read product image files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product image files" on storage.objects;
create policy "Admins can upload product image files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product image files" on storage.objects;
create policy "Admins can update product image files"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product image files" on storage.objects;
create policy "Admins can delete product image files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());
