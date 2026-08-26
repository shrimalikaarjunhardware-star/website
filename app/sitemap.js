import { siteConfig } from "../lib/siteConfig";
import { categories } from "../lib/catalog";
import { getPublicProducts } from "../lib/catalog-server";
export default async function sitemap() {
  const products = await getPublicProducts();
  const now = new Date();
  return [
    { url: siteConfig.siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.siteUrl}/products`, lastModified: now, changeFrequency: "daily", priority: .9 },
    { url: `${siteConfig.siteUrl}/categories`, lastModified: now, changeFrequency: "weekly", priority: .8 },
    { url: `${siteConfig.siteUrl}/brands/opus`, lastModified: now, changeFrequency: "weekly", priority: .7 },
    { url: `${siteConfig.siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: .6 },
    { url: `${siteConfig.siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: .9 },
    ...categories.map(c => ({ url: `${siteConfig.siteUrl}/categories/${c.slug}`, lastModified: now, changeFrequency: "weekly", priority: .7 })),
    ...products.map(p => ({ url: `${siteConfig.siteUrl}/products/${p.slug}`, lastModified: now, changeFrequency: "weekly", priority: .7 })),
  ];
}
