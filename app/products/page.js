import { Header, Footer } from "../components/SiteChrome";
import { CatalogFilters } from "../components/CatalogFilters";
import { ProductCard } from "../components/ProductCard";
import { getPublicProducts } from "../../lib/catalog-server";

export const metadata = {
  title: "Paints, Hardware & Tools in Canacona, Goa",
  description: "Browse paints, hardware, tools, waterproofing and painting accessories available from Shri Mallikarjun Hardware & Paints in Canacona, Goa.",
  alternates: { canonical: "/products" },
};

function filterProducts(items, { category = "", subcategory = "", brand = "", q = "", sort = "featured" }) {
  const query = q.trim().toLowerCase();
  const filtered = items.filter((product) => {
    const matchesCategory = !category || product.categorySlug === category;
    const matchesSubcategory = !subcategory || product.subcategory === subcategory;
    const matchesBrand = !brand || product.brand === brand;
    const haystack = `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    return matchesCategory && matchesSubcategory && matchesBrand && matchesSearch;
  });

  return [...filtered].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "category") return `${a.category}${a.name}`.localeCompare(`${b.category}${b.name}`);
    return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name);
  });
}

export default async function ProductsPage({ searchParams }) {
  const filters = await searchParams;
  const allProducts = await getPublicProducts();
  const items = filterProducts(allProducts, filters);

  return (
    <>
      <Header />
      <main className="page">
        <div className="container">
          <p className="kicker">PRODUCT CATALOGUE</p>
          <h1>Products.</h1>
          <p className="lead">
            Browse paints, hardware, tools, waterproofing and painting accessories. Filter the catalogue by category, product type or brand.
          </p>

          <CatalogFilters
            categorySlug={filters.category || ""}
            subcategorySlug={filters.subcategory || ""}
            brand={filters.brand || ""}
            search={filters.q || ""}
            sort={filters.sort || "featured"}
          />

          <div className="catalog-results-head">
            <div>
              <p className="kicker">RESULTS</p>
              <h2>Browse the range.</h2>
            </div>
            <span>{items.length} OF {allProducts.length} PRODUCTS</span>
          </div>

          <div className="product-grid large pro-grid">
            {items.length ? (
              items.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)
            ) : (
              <div className="empty-state">
                <strong>No products match these filters.</strong>
                <p>Try another category, brand or search term.</p>
                <a href="/products" className="btn btn-black">CLEAR FILTERS</a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
