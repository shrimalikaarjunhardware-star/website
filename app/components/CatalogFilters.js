import Link from "next/link";
import { categories } from "../../lib/catalog";
import { getPublicProducts } from "../../lib/catalog-server";

export async function CatalogFilters({
  categorySlug = "",
  subcategorySlug = "",
  brand = "",
  search = "",
  sort = "featured",
  lockCategory = false,
}) {
  const category = categories.find((item) => item.slug === categorySlug);
  const brands = [...new Set((await getPublicProducts()).map((product) => product.brand).filter(Boolean))].sort();

  return (
    <div className="catalog-tools">
      <form className="catalog-filter-panel" method="get">
        <div className="catalog-search">
          <label htmlFor="catalog-search">SEARCH PRODUCTS</label>
          <div className="search-row">
            <input
              id="catalog-search"
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search paint, tools, hardware..."
            />
            <button type="submit" className="btn btn-black">SEARCH</button>
          </div>
        </div>

        <div className="filter-fields">
          <label>
            CATEGORY
            {lockCategory ? <input type="hidden" name="category" value={categorySlug} /> : null}
            <select name="category" defaultValue={categorySlug} disabled={lockCategory}>
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            SUBCATEGORY
            <select name="subcategory" defaultValue={subcategorySlug} disabled={!category}>
              <option value="">{category ? "All subcategories" : "Choose a category"}</option>
              {category?.subcategories.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            BRAND
            <select name="brand" defaultValue={brand}>
              <option value="">All brands</option>
              {brands.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            SORT BY
            <select name="sort" defaultValue={sort}>
              <option value="featured">Featured</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="category">Category</option>
            </select>
          </label>
        </div>

        <div className="filter-actions">
          <button type="submit" className="btn btn-orange">APPLY FILTERS</button>
          <Link href={categorySlug ? `/categories/${categorySlug}` : "/products"} className="filter-reset">RESET</Link>
        </div>
      </form>

      {category ? (
        <div className="subcategory-chips" aria-label={`${category.name} subcategories`}>
          <Link className={!subcategorySlug ? "active" : ""} href={`/categories/${category.slug}`}>ALL {category.name.toUpperCase()}</Link>
          {category.subcategories.map((item) => (
            <Link
              key={item.slug}
              className={subcategorySlug === item.slug ? "active" : ""}
              href={`/categories/${category.slug}?subcategory=${item.slug}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
