"use client";

import { useMemo, useState } from "react";

export function ProductGallery({ product }) {
  const allImages = useMemo(
    () => [product.image, ...(product.images || [])].filter(Boolean),
    [product.image, product.images]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (!allImages.length) {
    return (
      <div className="detail-gallery">
        <div className={`detail-art ${product.tone}`}>
          <span>{product.short}</span>
        </div>
      </div>
    );
  }

  const activeImage = allImages[activeIndex] || allImages[0];

  return (
    <div className="detail-gallery">
      <div className={`detail-art ${product.tone}`}>
        <img src={activeImage} alt={product.name} className="detail-photo" />
      </div>

      {allImages.length > 1 ? (
        <div className="detail-thumbnails" aria-label="Product images">
          {allImages.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`detail-thumbnail ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${product.name} image ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
