create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short text,
  brand text not null,
  range text,
  category text not null,
  category_slug text not null,
  subcategory text not null,
  subcategory_name text,
  description text not null,
  long_description text not null,
  features jsonb not null default '[]'::jsonb,
  pack_sizes jsonb not null default '[]'::jsonb,
  finish text,
  coverage text,
  warranty text,
  manufacturer_url text,
  image text not null,
  available boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.admins enable row level security;

drop policy if exists "Public can read live products" on public.products;
create policy "Public can read live products"
on public.products for select
to anon, authenticated
using (available = true or exists (
  select 1 from public.admins a where a.user_id = auth.uid()
));

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert
to authenticated
with check (exists (
  select 1 from public.admins a where a.user_id = auth.uid()
));

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update
to authenticated
using (exists (
  select 1 from public.admins a where a.user_id = auth.uid()
))
with check (exists (
  select 1 from public.admins a where a.user_id = auth.uid()
));

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete
to authenticated
using (exists (
  select 1 from public.admins a where a.user_id = auth.uid()
));

drop policy if exists "Admins can read admin records" on public.admins;
create policy "Admins can read admin records"
on public.admins for select
to authenticated
using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Anyone can view product images"
on storage.objects for select
to public
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'product-images'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'product-images'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
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

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();


create table if not exists public.homepage_slides (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  image text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.homepage_slides enable row level security;

drop policy if exists "Public can read active homepage slides" on public.homepage_slides;
create policy "Public can read active homepage slides"
on public.homepage_slides for select
using (active = true or exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admins can insert homepage slides" on public.homepage_slides;
create policy "Admins can insert homepage slides"
on public.homepage_slides for insert to authenticated
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admins can update homepage slides" on public.homepage_slides;
create policy "Admins can update homepage slides"
on public.homepage_slides for update to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admins can delete homepage slides" on public.homepage_slides;
create policy "Admins can delete homepage slides"
on public.homepage_slides for delete to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));


-- Hero image storage bucket and policies.
insert into storage.buckets (id, name, public)
values ('homepage-hero-images', 'homepage-hero-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can view hero images" on storage.objects;
create policy "Anyone can view hero images"
on storage.objects for select
to public
using (bucket_id = 'homepage-hero-images');

drop policy if exists "Admins can upload hero images" on storage.objects;
create policy "Admins can upload hero images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'homepage-hero-images'
  and exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update hero images" on storage.objects;
create policy "Admins can update hero images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'homepage-hero-images'
  and exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'homepage-hero-images'
  and exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete hero images" on storage.objects;
create policy "Admins can delete hero images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'homepage-hero-images'
  and exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  )
);
