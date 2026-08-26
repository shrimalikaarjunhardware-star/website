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
  const subcategory = getSubcategory(product.categorySlug, product.subcategory);

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
              <div>
                <span>CATEGORY</span>
                <strong>{category?.name || product.category}</strong>
              </div>
            
              <div>
                <span>PRODUCT TYPE</span>
                <strong>{subcategory?.name || "GENERAL"}</strong>
              </div>
            
              {product.brand ? (
                <div>
                  <span>BRAND</span>
                  <strong>{product.brand}</strong>
                </div>
              ) : null}
            
              {product.features ? (
                <div className="spec-features">
                  <span>FEATURES</span>
              
                  <strong>
                    {product.features
                      .split(",")
                      .map((feature) => feature.trim())
                      .filter(Boolean)
                      .map((feature, index) => (
                        <span key={`${feature}-${index}`} className="spec-feature">
                          {feature}
                        </span>
                      ))}
                  </strong>
                </div>
              ) : null}
            
              {product.packSizes ? (
                <div>
                  <span>PACK SIZES</span>
                  <strong>{product.packSizes}</strong>
                </div>
              ) : null}
            
              {product.finish ? (
                <div>
                  <span>FINISH</span>
                  <strong>{product.finish}</strong>
                </div>
              ) : null}
            
              {product.coverage ? (
                <div>
                  <span>COVERAGE</span>
                  <strong>{product.coverage}</strong>
                </div>
              ) : null}
            
              {product.warranty ? (
                <div>
                  <span>WARRANTY / GUARANTEE</span>
                  <strong>{product.warranty}</strong>
                </div>
              ) : null}
            
              <div>
                <span>AVAILABILITY</span>
                <strong>
                  {product.available === false ? "CHECK STORE" : "CONTACT STORE"}
                </strong>
              </div>
            </div>

              <div className="detail-actions">
                <a
                  className="btn btn-orange"
                  href={`https://wa.me/918310248961?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Is it available?`)}`}
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
