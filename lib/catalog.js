export const categories = [
  {
    slug: "paints",
    name: "Paints",
    icon: "/icons/paint.svg",
    description: "Interior, exterior, primers, enamels and more.",
    subcategories: [
      { slug: "interior-paints", name: "Interior Paints" },
      { slug: "exterior-paints", name: "Exterior Paints" },
      { slug: "primers", name: "Primers" },
      { slug: "enamels", name: "Enamels" },
      { slug: "wood-finishes", name: "Wood Finishes" },
      { slug: "metal-paints", name: "Metal Paints" },
      { slug: "specialty-paints", name: "Specialty Paints" },
      { slug: "other", name: "Others" },
    ],
  },
  {
    slug: "hardware",
    name: "Hardware",
    icon: "/icons/hardware-hammer.svg",
    description: "Everyday hardware for home, trade and projects.",
    subcategories: [
      { slug: "fasteners", name: "Fasteners" },
      { slug: "screws-bolts", name: "Screws & Bolts" },
      { slug: "hinges", name: "Hinges" },
      { slug: "locks-latches", name: "Locks & Latches" },
      { slug: "handles", name: "Handles" },
      { slug: "brackets", name: "Brackets" },
      { slug: "general-hardware", name: "General Hardware" },
      { slug: "other", name: "Others" },
    ],
  },
  {
    slug: "tools",
    name: "Tools",
    icon: "/icons/tools-wrench.svg",
    description: "Hand tools and useful equipment for the job.",
    subcategories: [
      { slug: "hand-tools", name: "Hand Tools" },
      { slug: "screwdrivers", name: "Screwdrivers" },
      { slug: "pliers-wrenches", name: "Pliers & Wrenches" },
      { slug: "measuring-tools", name: "Measuring Tools" },
      { slug: "cutting-tools", name: "Cutting Tools" },
      { slug: "power-tools", name: "Power Tools" },
      { slug: "other", name: "Others" },
    ],
  },
  {
    slug: "waterproofing",
    name: "Waterproofing",
    icon: "/icons/waterproofing.svg",
    description: "Products to help protect walls, roofs and surfaces.",
    subcategories: [
      { slug: "roof-waterproofing", name: "Roof Waterproofing" },
      { slug: "wall-waterproofing", name: "Wall Waterproofing" },
      { slug: "bathroom-waterproofing", name: "Bathroom Waterproofing" },
      { slug: "crack-fillers", name: "Crack Fillers" },
      { slug: "sealants", name: "Sealants" },
      { slug: "waterproofing-accessories", name: "Waterproofing Accessories" },
      { slug: "other", name: "Others" },
    ],
  },
  {
  slug: "construction-materials",
  name: "Construction",
  icon: "/icons/construction-materials.svg",
  description: "Cement, white cement, tile adhesives, grouts and essential construction materials.",
  subcategories: [
    { slug: "construction-raw-materials", name: "Construction Raw Materials" },
    { slug: "cement", name: "Cement" },
    { slug: "white-cement", name: "White Cement" },
    { slug: "tile-adhesives", name: "Tile Adhesives" },
    { slug: "grouts", name: "Tile Grouts" },
    { slug: "construction-chemicals", name: "Construction Chemicals" },
    { slug: "wall-putty", name: "Wall Putty" },
    { slug: "repair-materials", name: "Repair Materials" },
    { slug: "other", name: "Others" },
  ],
},
  {
    slug: "painting-accessories",
    name: "Accessories",
    icon: "/icons/paint-roller.svg",
    description: "Brushes, rollers, trays and painting essentials.",
    subcategories: [
      { slug: "brushes", name: "Paint Brushes" },
      { slug: "rollers", name: "Paint Rollers" },
      { slug: "trays", name: "Paint Trays" },
      { slug: "scrapers", name: "Scrapers" },
      { slug: "sandpaper", name: "Sandpaper" },
      { slug: "masking", name: "Masking Tape" },
      { slug: "extension-poles", name: "Extension Poles" },
      { slug: "other-accessories", name: "Other Accessories" },
      { slug: "other", name: "Others" },
    ],
  },
];

export const products = [];

export function getCategory(slug) {
  return categories.find((category) => category.slug === slug);
}

export function getSubcategory(categorySlug, subcategorySlug) {
  return getCategory(categorySlug)?.subcategories.find(
    (subcategory) => subcategory.slug === subcategorySlug,
  );
}

export function getAvailableProducts() {
  return products.filter((product) => product.available !== false);
}

export function getBrands(items = getAvailableProducts()) {
  return [...new Set(items.map((product) => product.brand).filter(Boolean))].sort();
}
