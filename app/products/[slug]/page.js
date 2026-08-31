import Link from "next/link";
import { getCategory, getSubcategory, products } from "../../../lib/catalog";
import { getPublicProducts, getPublicProduct } from "../../../lib/catalog-server";
import { Header, Footer } from "../../components/SiteChrome";
import { ProductGallery } from "../../components/ProductGallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description, alternates: { canonical: `/products/${product.slug}` }, openGraph: { title: product.name, description: product.description, images: product.image ? [{ url: product.image, alt: product.name }] : undefined } };
}


export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) {
    return <div className="page container"><h1>Product not found.</h1></div>;
  }

  const category = getCategory(product.categorySlug);

  return (
    <>
      <Header />
      <main className="page">
        <div className="container">
          <Link href={`/categories/${product.categorySlug}`} className="back">
            ← BACK TO {product.category.toUpperCase()}
          </Link>

          <div className="product-detail pro-detail">
            <ProductGallery product={product} />

            <div>
              <span className="product-category">{product.brand || product.category}</span>
              <h1>{product.name}</h1>
              <p className="detail-copy">{product.longDescription}</p>

              <div className="spec-list">
                <div className="spec-row">
                  <span>CATEGORY</span>
                  <strong>{category?.name || product.category}</strong>
                </div>
             <div className="spec-row">
                <span>PRODUCT TYPE</span>
                <strong>
                  {Array.isArray(product.subcategory)
                    ? product.subcategory
                        .map((slug) => getSubcategory(product.categorySlug, slug)?.name)
                        .filter(Boolean)
                        .join(" · ") || "GENERAL"
                    : getSubcategory(product.categorySlug, product.subcategory)?.name || "GENERAL"}
                </strong>
              </div>
                <div className="spec-row">
                  <span>BRAND</span>
                  <strong>{product.brand || "VARIOUS"}</strong>
                </div>

                {Array.isArray(product.features) && product.features.length > 0 ? (
                  <div className="spec-row spec-row-list">
                    <span>FEATURES</span>
                    <div className="spec-chips" aria-label="Product features">
                      {product.features.map((feature, index) => (
                        <span className="spec-chip" key={`${feature}-${index}`}>{feature}</span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {Array.isArray(product.packSizes) && product.packSizes.length > 0 ? (
                  <div className="spec-row spec-row-list">
                    <span>PACK SIZES</span>
                    <div className="spec-chips" aria-label="Available pack sizes">
                      {product.packSizes.map((size, index) => (
                        <span className="spec-chip spec-chip-size" key={`${size}-${index}`}>{size}</span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {product.finish ? (
                  <div className="spec-row">
                    <span>FINISH</span>
                    <strong>{product.finish}</strong>
                  </div>
                ) : null}

                {product.coverage ? (
                  <div className="spec-row">
                    <span>COVERAGE</span>
                    <strong>{product.coverage}</strong>
                  </div>
                ) : null}

                {product.warranty ? (
                  <div className="spec-row">
                    <span>WARRANTY</span>
                    <strong>{product.warranty}</strong>
                  </div>
                ) : null}

                <div className="spec-row">
                  <span>AVAILABILITY</span>
                  <strong>{product.available === false ? "CHECK STORE" : "CONTACT STORE"}</strong>
                </div>
              </div>

              <div className="detail-actions">
                <a
                  className="btn btn-orange"
                  href={`https://wa.me/918310248961?text=${encodeURIComponent(`Hi, I'm interested in:

Product: ${product.name}${product.brand ? `\nBrand: ${product.brand}` : ""}

Could you please tell me more about this product, including availability and price?`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  ENQUIRE ON WHATSAPP
                </a>
                <Link href={`/categories/${product.categorySlug}`} className="btn btn-outline-black">
                  VIEW CATEGORY
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
