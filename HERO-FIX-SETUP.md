# Hero image setup

The admin hero uploader uses the `homepage-hero-images` Supabase Storage bucket.

For an existing project, run the updated `supabase/migrate-homepage-and-clean-catalog.sql` once. It creates/updates the bucket and policies and removes only the known placeholder products.

After deployment:
1. Open `/admin`.
2. Upload a hero image.
3. Confirm it appears in the Hero Images list.
4. Open the homepage. The active image should replace `/sm-hero.png`.
5. Add more images to enable the carousel.
