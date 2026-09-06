export const siteConfig = {
  name: "Shri Mallikarjun Hardware & Paints",
  shortName: "Shri Mallikarjun",
  description: "Shri Mallikarjun Hardware & Paints is a local hardware, paint, tools and project-supplies store serving Canacona, Goa.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://shri-malikaarjun-hardware.vercel.app",
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
      "Street Road, Near Ravindra Bhavan & St. Teresa's Church"
    ],
      locality: "Chauri",
      region: "Goa",
      postalCode: "403702",
      country: "IN",
      mapQuery: "15.008032267609096,74.04528344348333",
      mapEmbed: "https://maps.app.goo.gl/ZhRKKBVhZFUixRoH9",
    },
    {
      id: "batpal",
      name: "Shri Mallikarjun Hardware — Batpal",
      shortName: "Batpal, Canacona",
      address: ["Batpal, Canacona", "Goa, India"],
      locality: "Batpal",
      region: "Goa",
      country: "IN",
      mapQuery: "Batpal, Canacona, Goa",
      mapEmbed: "https://www.google.com/maps?q=Batpal%2C%20Canacona%2C%20Goa&output=embed",
    },
  ],
};
