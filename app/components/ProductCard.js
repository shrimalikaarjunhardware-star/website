import Link from "next/link";

export function ProductCard({ product, index = 0 }) {
  return (
    <Link href={`/products/${product.slug}`} className="product-card pro-card">
      <div className={`product-art ${product.tone}`}>
        {product.image ? (
          <img src={product.image} alt="" className="product-photo" />
        ) : null}
        <span className="product-tag">{String(index + 1).padStart(2, "0")}</span>
        <span className="product-short">{product.short}</span>
      </div>
      <div className="product-info">
        <span className="product-category">{product.brand || product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span className="product-link">VIEW PRODUCT →</span>
      </div>
    </Link>
  );
}
