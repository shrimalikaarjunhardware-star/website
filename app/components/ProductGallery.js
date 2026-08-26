"use client";

import { useMemo, useState } from "react";

export function ProductGallery({ product }) {
  const allImages = useMemo(
    () => [product.image, ...(product.images || [])].filter(Boolean),
    [product.image, product.images]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!allImages.length) {
    return (
      <div className="detail-gallery">
        <div className="detail-art">
          <span>{product.short}</span>
        </div>
      </div>
    );
  }

  const activeImage = allImages[activeIndex] || allImages[0];

  return (
    <>
      <div className="detail-gallery">
        <button
          type="button"
          className="detail-image-stage"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Enlarge ${product.name}`}
        >
          <img
            src={activeImage}
            alt={product.name}
            className="detail-photo"
          />
        </button>

        {allImages.length > 1 ? (
          <div
            className="detail-thumbnails"
            aria-label="Product images"
          >
            {allImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`detail-thumbnail ${
                  index === activeIndex ? "active" : ""
                }`}
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

      {lightboxOpen ? (
        <div
          className="product-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} enlarged image`}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="product-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close enlarged image"
          >
            ×
          </button>

          <img
            src={activeImage}
            alt={product.name}
            className="product-lightbox-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
