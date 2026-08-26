# Supabase + Admin setup

## Environment variables

Create these in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 1. Database

In Supabase SQL Editor, run:

1. `supabase/schema.sql`
2. `supabase/seed.sql` (optional starter product)

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
- Product image
- Short description

For Paints it also requires:

- Pack sizes
- Finish
- Coverage

Optional fields stay optional when the manufacturer does not provide them.

Products can be added, edited, hidden/shown, searched and permanently deleted.
