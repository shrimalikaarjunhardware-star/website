import Link from "next/link";
import { Header, Footer } from "../components/SiteChrome";

export const metadata = {
  title: "About Shri Mallikarjun Hardware & Paints | Canacona, Goa",
  description:
    "Shri Mallikarjun Hardware & Paints is a local source for paints, hardware, tools and painting supplies in Canacona, Goa.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <Header />

      <main className="page">
        <div className="container narrow">
          <p className="kicker">ABOUT SHRI MALLIKARJUN</p>

          <h1>Your local hardware & paint partner.</h1>

          <p className="lead">
            Shri Mallikarjun Hardware & Paints brings together paints,
            hardware, tools and painting accessories for homeowners,
            painters, contractors and local projects across Canacona, Goa.
          </p>

          <div className="about-box industrial-box">
            <span className="box-index">01</span>

            <h2>Everything you need for the job.</h2>

            <p>
              From interior and exterior paints to everyday hardware, tools,
              waterproofing products and painting accessories, our catalogue
              is built around the products people need to maintain, improve
              and complete their projects.
            </p>

            <p>
              We also stock products from recognised paint brands, including
              Birla Opus, alongside a range of hardware and project
              essentials.
            </p>
          </div>

          <div className="about-box industrial-box">
            <span className="box-index">02</span>

            <h2>Serving Canacona, Goa.</h2>

            <p>
              With locations serving the Canacona area, Shri Mallikarjun
              Hardware & Paints makes it convenient to find the materials
              you need close to home.
            </p>
          </div>

          <div className="actions">
            <Link href="/products" className="btn btn-orange">
              EXPLORE PRODUCTS
            </Link>

            <Link href="/contact" className="btn btn-outline-black">
              VISIT THE STORE
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
