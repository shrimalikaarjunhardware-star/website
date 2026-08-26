import Link from "next/link";

export function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card pro-card"
    >
      <div className="product-art">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-photo"
          />
        ) : null}
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.brand || product.category}
        </span>

        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <span className="product-link">
          VIEW PRODUCT →
        </span>
      </div>
    </Link>
  );
}
