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

      // Exact coordinates of the Chaudi shop
      mapQuery: "15.008032267609096,74.04528344348333",

      // Google Maps embed centered on the exact shop coordinates
      mapEmbed: `<iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d963.4304346294621!2d74.04469862581024!3d15.00814406562382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbe5b001488f4fd%3A0xfed14502f20f44f7!2sShri%20Mallikarjun%20Hardware%20%26%20Paint!5e0!3m2!1sen!2sin!4v1788700056407!5m2!1sen!2sin"
        width="600"
        height="450"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>`,
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

      mapQuery: "Batpal, Canacona, Goa",

      mapEmbed:
        "https://www.google.com/maps?q=Batpal%2C%20Canacona%2C%20Goa&output=embed",
    },
  ],
};
