export const siteConfig = {
  name: "Shri Mallikarjun Hardware & Paints",
  shortName: "Shri Mallikarjun",

  description:
    "Shri Mallikarjun Hardware & Paints is a local hardware, paint, tools and project-supplies store serving Canacona, Goa.",

  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://shri-malikaarjun-hardware.vercel.app",

  phone: "+918310248961",
  phoneDisplay: "+91 83102 48961",
  whatsapp: "918310248961",

  locations: [
    {
      id: "chaudi",

      name: "Shri Mallikarjun Hardware & Paints — Chaudi",
      shortName: "Chaudi, Canacona",

      address: [
        "BG/4, Shop No. 6, Vijayabai Complex, 224",
        "Street Road, Near Ravindra Bhavan & St. Teresa's Church",
        "Chauri, Canacona",
        "Goa – 403702",
      ],

      locality: "Chauri",
      region: "Goa",
      postalCode: "403702",
      country: "IN",

      // Exact location of the Chaudi shop
      mapQuery: "15.008032267609096,74.04528344348333",

      // Google Maps embed
      mapEmbed:
        "https://www.google.com/maps?q=15.008032267609096,74.04528344348333&z=17&output=embed",
    },

    {
      id: "batpal",

      name: "Shri Mallikarjun Hardware — Batpal",
      shortName: "Batpal, Canacona",

      address: [
        "Batpal, Canacona",
        "Goa, India",
      ],

      locality: "Batpal",
      region: "Goa",
      country: "IN",

      // Search the actual business rather than just the locality
      mapQuery:
        "Shri Mallikarjun Hardware, Batpal, Canacona, Goa",

      // Google Maps embed
      mapEmbed:
        "https://www.google.com/maps?q=Shri%20Mallikarjun%20Hardware%2C%20Batpal%2C%20Canacona%2C%20Goa&z=17&output=embed",
    },
  ],
};
