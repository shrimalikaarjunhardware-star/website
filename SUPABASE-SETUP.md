# Supabase + Admin setup

## Environment variables

Create these in Vercel (the Supabase/Vercel integration can add them automatically):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 1. Database

For a brand-new Supabase project, run:

1. `supabase/schema.sql`

Do **not** run `supabase/seed.sql` if the client should start with an empty catalogue.

If `schema.sql` was already run before this version added multiple product images, run this one additional migration:

2. `supabase/add-product-gallery.sql`

That migration is safe to run on an existing database and only creates the `product_images` table and its RLS policies.

## 2. Admin user

In Supabase Authentication → Users, create the client's email/password user.

Copy that user's UUID and run:

```sql
insert into public.admins (user_id)
values ('USER-UUID-HERE');
```

The admin is available only at `/admin`. There is intentionally no public-site admin CTA.

## 3. Product validation

The admin form requires:

- Product name
- Brand
- Category
- Subcategory
- At least one product image
- Short description

For Paints it also requires:

- Pack sizes
- Finish
- Coverage

Optional fields stay optional when the manufacturer does not provide them.

## 4. Multiple product images

The product image picker accepts multiple images at once.

- The first selected image becomes the main product image.
- Additional selected images are saved to that product's gallery.
- Existing gallery images can be removed while editing a product.
- Product pages show the main image plus clickable gallery thumbnails.

All product images use the existing public `product-images` Supabase Storage bucket.

Products can be added, edited, hidden/shown, searched and permanently deleted.
