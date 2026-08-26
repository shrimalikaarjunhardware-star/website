import { createClient } from "@supabase/supabase-js";

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function normalize(row) {
  return {
    slug: row.slug,
    name: row.name,
    short: row.short,
    brand: row.brand,
    range: row.range,
    category: row.category,
    categorySlug: row.category_slug,
    subcategory: row.subcategory,
    subcategoryName: row.subcategory_name,
    description: row.description,
    longDescription: row.long_description,
    features: row.features || [],
    packSizes: row.pack_sizes || [],
    finish: row.finish,
    coverage: row.coverage,
    warranty: row.warranty,
    manufacturerUrl: row.manufacturer_url,
    image: row.image,
    available: row.available,
    featured: row.featured,
    id: row.id,
  };
}

export async function getPublicProducts() {
  const client = getServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []).map(normalize);
}

export async function getPublicProduct(slug) {
  const items = await getPublicProducts();
  return items.find((product) => product.slug === slug);
}
