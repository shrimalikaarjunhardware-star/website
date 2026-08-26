-- Run this once on an existing Shri Mallikarjun Supabase project.
-- It adds support for multiple images per product without changing existing products.

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx
on public.product_images(product_id, sort_order, created_at);

alter table public.product_images enable row level security;

drop policy if exists "Public can read live product gallery images" on public.product_images;
create policy "Public can read live product gallery images"
on public.product_images for select
to anon, authenticated
using (exists (
  select 1 from public.products p
  where p.id = product_images.product_id
    and (p.available = true or exists (select 1 from public.admins a where a.user_id = auth.uid()))
));

drop policy if exists "Admins can insert product gallery images" on public.product_images;
create policy "Admins can insert product gallery images"
on public.product_images for insert
to authenticated
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admins can update product gallery images" on public.product_images;
create policy "Admins can update product gallery images"
on public.product_images for update
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admins can delete product gallery images" on public.product_images;
create policy "Admins can delete product gallery images"
on public.product_images for delete
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
