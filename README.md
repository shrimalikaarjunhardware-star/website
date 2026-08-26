# Shri Mallikarjun Hardware & Paints

Next.js website for Shri Mallikarjun Hardware & Paints, Canacona, Goa.

## Catalogue system

Products are managed in `lib/catalog.js`.

Each product supports:

- `categorySlug` — top-level category
- `subcategory` — product type within that category
- `brand` — brand filter
- `image` — optional image path, e.g. `/products/product-name.jpg`
- `available` — set to `false` to hide a product without deleting it
- `featured` — controls homepage featured products

Categories contain their own `subcategories`, so the website automatically builds the relevant filters for each category.

### Add a product

Add another object to `products` in `lib/catalog.js`:

```js
{
  slug: "new-product",
  name: "New Product",
  short: "PRODUCT",
  brand: "Brand Name",
  category: "Paints",
  categorySlug: "paints",
  subcategory: "exterior-paints",
  tone: "orange",
  description: "Short product description.",
  longDescription: "Longer product description for the product page.",
  image: null,
  available: true,
  featured: false,
}
```

If `image` is used, put the file in `public/products/` and use a path such as `/products/new-product.jpg`.

### Hide a product

Set:

```js
available: false
```

The product page can remain in the source, but it will not appear in the normal catalogue listings.

### Add a new product type

Add a subcategory to the relevant category in `categories`. The category page and filters will pick it up automatically.

## Catalogue features

- Search across product name, brand, category and description
- Category filtering
- Category-specific subcategory filtering
- Brand filtering
- Featured/name/category sorting
- Product availability control
- Featured products on the homepage
- Product detail pages
- Category pages generated from catalogue data
