import Link from "next/link";
import { categories } from "../../lib/catalog";
import { Header, Footer } from "../components/SiteChrome";

export default function CategoriesPage() {
  return (
    <>
      <Header />
      <main className="page">
        <div className="container">
          <p className="kicker">PRODUCT RANGE</p>
          <h1>Shop by category.</h1>
          <p className="lead">
            Start with a product category, then narrow down to the type of product you need.
          </p>

          <div className="category-grid big pro-category-grid">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="category-card pro-category"
              >
                <span className="category-number">0{index + 1}</span>
                <div>
                  <span
                    className="category-icon"
                    style={{ "--category-icon": `url(${category.icon})` }}
                    aria-hidden="true"
                  />
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="category-subcount">
                    {category.subcategories.length} product types
                  </span>
                </div>
                <span className="category-arrow">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
