import Link from "next/link";
import { getBrands } from "../../../lib/catalog";
import { getPublicProducts } from "../../../lib/catalog-server";
import { Header, Footer } from "../../components/SiteChrome";
import { ProductCard } from "../../components/ProductCard";

function filterProducts(items, { category = "", subcategory = "", q = "", sort = "featured" }) {
  const query = q.trim().toLowerCase();

  const filtered = items.filter((product) => {
    const matchesCategory = !category || product.categorySlug === category;
    const matchesSubcategory = !subcategory || product.subcategory === subcategory;
    const haystack = `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  return [...filtered].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "category") return `${a.category}${a.name}`.localeCompare(`${b.category}${b.name}`);
    return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name);
  });
}

export default async function OpusBrandPage({ searchParams }) {
  const filters = await searchParams;
  const publicProducts = await getPublicProducts();
  const allProducts = publicProducts.filter(
    (product) => product.brand?.toLowerCase() === "opus" || product.brand?.toLowerCase() === "birla opus",
  );

  const items = filterProducts(allProducts, filters);
  const categories = [...new Map(
    allProducts.map((product) => [product.categorySlug, product.category])
  ).entries()];

  return (
    <>
      <Header />
      <main className="page brand-page">
        <div className="container">
          <Link href="/products" className="back">← ALL PRODUCTS</Link>

          <section className="brand-hero">
            <div>
              <p className="kicker orange-kicker">BRAND COLLECTION</p>
              <h1>Birla Opus.</h1>
              <p className="lead">
                Explore the Birla Opus products available through Shri Mallikarjun Hardware & Paints,
                across paints, primers, waterproofing and other product ranges.
              </p>
              <div className="brand-actions">
                <a href="https://www.birlaopus.com/paint-products" target="_blank" rel="noreferrer" className="btn btn-orange">
                  VISIT BIRLA OPUS ↗
                </a>
              </div>
            </div>
            <div className="opus-mark-block" aria-label="Birla Opus">
              <img src="/images/opus-logo.svg" alt="Birla Opus" />
            </div>
          </section>

          <div className="brand-category-nav" aria-label="Birla Opus product categories">
            <Link className={!filters.category ? "active" : ""} href="/brands/opus">ALL PRODUCTS</Link>
            {categories.map(([slug, name]) => (
              <Link
                key={slug}
                className={filters.category === slug ? "active" : ""}
                href={`/brands/opus?category=${slug}`}
              >
                {name.toUpperCase()}
              </Link>
            ))}
          </div>

          <div className="brand-results-tools">
            <form className="catalog-filter-panel" method="get">
              {filters.category ? <input type="hidden" name="category" value={filters.category} /> : null}

              <div className="catalog-search">
                <label htmlFor="opus-search">SEARCH BIRLA OPUS PRODUCTS</label>
                <div className="search-row">
                  <input
                    id="opus-search"
                    type="search"
                    name="q"
                    defaultValue={filters.q || ""}
                    placeholder="Search Opus products..."
                  />
                  <button type="submit" className="btn btn-black">SEARCH</button>
                </div>
              </div>

              <div className="filter-fields">
                <label>
                  SORT BY
                  <select name="sort" defaultValue={filters.sort || "featured"}>
                    <option value="featured">Featured</option>
                    <option value="name-asc">Name A–Z</option>
                    <option value="name-desc">Name Z–A</option>
                    <option value="category">Category</option>
                  </select>
                </label>
              </div>

              <div className="filter-actions">
                <button type="submit" className="btn btn-orange">APPLY</button>
                <Link href={filters.category ? `/brands/opus?category=${filters.category}` : "/brands/opus"} className="filter-reset">RESET</Link>
              </div>
            </form>
          </div>

          <div className="catalog-results-head">
            <div>
              <p className="kicker">BIRLA OPUS CATALOGUE</p>
              <h2>{filters.category ? categories.find(([slug]) => slug === filters.category)?.[1] || "Products" : "All Opus Products"}</h2>
            </div>
            <span>{items.length} {items.length === 1 ? "PRODUCT" : "PRODUCTS"}</span>
          </div>

          <div className="product-grid large pro-grid">
            {items.length ? (
              items.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))
            ) : (
              <div className="empty-state">
                <strong>No Birla Opus products match your search.</strong>
                <p>Try another search or browse all Opus products.</p>
                <Link href="/brands/opus" className="btn btn-black">VIEW ALL OPUS PRODUCTS</Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
