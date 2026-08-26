import Link from "next/link";
import { categories, getCategory, getBrands } from "../../../lib/catalog";
import { getPublicProducts } from "../../../lib/catalog-server";
import { Header, Footer } from "../../components/SiteChrome";
import { ProductCard } from "../../components/ProductCard";
import { CatalogFilters } from "../../components/CatalogFilters";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Category not found" };
  return { title: `${category.name} in Canacona, Goa`, description: `${category.name} from Shri Mallikarjun Hardware & Paints in Canacona, Goa. Browse available products and brands.`, alternates: { canonical: `/categories/${category.slug}` } };
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

function filterProducts(items, { subcategory = "", brand = "", q = "", sort = "featured" }) {
  const query = q.trim().toLowerCase();
  const filtered = items.filter((product) => {
    const matchesSubcategory = !subcategory || product.subcategory === subcategory;
    const matchesBrand = !brand || product.brand === brand;
    const haystack = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    return matchesSubcategory && matchesBrand && matchesSearch;
  });

  return [...filtered].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "category") return `${a.category}${a.name}`.localeCompare(`${b.category}${b.name}`);
    return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name);
  });
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const filters = await searchParams;
  const category = getCategory(slug);

  if (!category) {
    return <div className="page container"><h1>Category not found.</h1></div>;
  }

  const allPublicProducts = await getPublicProducts();
  const allItems = allPublicProducts.filter((product) => product.categorySlug === slug);
  const items = filterProducts(allItems, filters);
  const subcategory = category.subcategories.find((item) => item.slug === filters.subcategory);
  const brandCount = getBrands(allItems).length;

  return (
    <>
      <Header />
      <main className="page">
        <div className="container">
          <Link href="/categories" className="back">← ALL CATEGORIES</Link>
          <div className="category-page-intro">
            <div>
              <p className="kicker orange-kicker">{category.name.toUpperCase()}</p>
              <h1>{category.name}.</h1>
              <p className="lead">{category.description}</p>
            </div>
            <div className="category-page-meta">
              <strong>{allItems.length}</strong>
              <span>listed products</span>
              <span>{category.subcategories.length} product types · {brandCount} brands</span>
            </div>
          </div>

          <CatalogFilters
            categorySlug={slug}
            subcategorySlug={filters.subcategory || ""}
            brand={filters.brand || ""}
            search={filters.q || ""}
            sort={filters.sort || "featured"}
            lockCategory
          />

          <div className="catalog-results-head">
            <div>
              <p className="kicker">CATALOGUE</p>
              <h2>{subcategory ? subcategory.name : `All ${category.name}`}</h2>
            </div>
            <span>{items.length} {items.length === 1 ? "PRODUCT" : "PRODUCTS"}</span>
          </div>

          <div className="product-grid large pro-grid">
            {items.length ? (
              items.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)
            ) : (
              <div className="empty-state">
                <strong>No products match these filters.</strong>
                <p>Try another product type, brand or search term.</p>
                <Link href={`/categories/${slug}`} className="btn btn-black">CLEAR FILTERS</Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
