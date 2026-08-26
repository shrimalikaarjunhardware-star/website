-- Run once in Supabase SQL Editor to remove the starter/placeholder catalogue rows.
-- This is intentionally explicit; it will not delete future products.
delete from public.products
where slug in (
  'opus-one-inspire-clear-coat',
  'opus-interior',
  'opus-primer',
  'opus-waterproofing',
  'paint-brush-set',
  'paint-roller',
  'hammer',
  'screwdriver-set'
);
