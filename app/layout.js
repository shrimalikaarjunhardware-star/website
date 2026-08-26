import "./globals.css";
import { siteConfig } from "../lib/siteConfig";

export const metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Shri Mallikarjun Hardware & Paints | Hardware & Paint Shop in Canacona, Goa",
    template: "%s | Shri Mallikarjun Hardware & Paints",
  },
  description: "Shop paints, hardware, tools, waterproofing and painting accessories at Shri Mallikarjun Hardware & Paints in Canacona, Goa. Visit our Chaudi and Batpal locations.",
  keywords: [
    "hardware shop in Canacona",
    "paint shop in Canacona",
    "hardware store Canacona Goa",
    "paint shop Canacona Goa",
    "hardware and paints Canacona",
    "paint dealer Canacona",
    "hardware store Goa",
    "Shri Mallikarjun Hardware & Paints",
  ],
  authors: [{ name: "Shri Mallikarjun Hardware & Paints" }],
  creator: "Shri Mallikarjun Hardware & Paints",
  publisher: "Shri Mallikarjun Hardware & Paints",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Shri Mallikarjun Hardware & Paints",
    title: "Shri Mallikarjun Hardware & Paints | Canacona, Goa",
    description: "Paints, hardware, tools, waterproofing and project supplies in Canacona, Goa.",
    images: [{ url: "/images/seo-share.png", width: 1200, height: 630, alt: "Shri Mallikarjun Hardware & Paints — Canacona, Goa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shri Mallikarjun Hardware & Paints | Canacona, Goa",
    description: "Paints, hardware, tools and project supplies in Canacona, Goa.",
    images: ["/images/seo-share.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/images/icon.png" },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
