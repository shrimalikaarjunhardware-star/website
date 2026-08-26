import Link from "next/link";
import { categories } from "../lib/catalog";
import { getPublicProducts } from "../lib/catalog-server";
import { Header, Footer } from "./components/SiteChrome";
import { siteConfig } from "../lib/siteConfig";
import { getHomepageSlides } from "../lib/homepage-server";
import { HeroCarousel } from "./components/HeroCarousel";

const tradeItems = [
  ["CONTRACTORS", "Project materials, paint and hardware for the job."],
  ["PAINTERS", "Paints, primers, rollers, brushes and accessories."],
  ["BUILDERS", "Reliable supplies for ongoing construction and renovation."],
  ["PROPERTY TEAMS", "Maintenance and repair essentials, locally available."],
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const products = await getPublicProducts();
  const heroSlides = await getHomepageSlides();
  return (
    <>
      <Header />
      <main>
        <section className="hero hero-photo">
          <HeroCarousel slides={heroSlides} fallback="/sm-hero.png" />
          <div className="hero-photo-overlay" />
          <div className="container hero-content">
            <div className="hero-copy-block">
              <p className="kicker orange-kicker">BUILT FOR THE JOB</p>
              <h1>One-Stop Hardware & Paint Store. <span>At your service.</span></h1>
              <p className="hero-copy">Your local hardware and paint shop in Canacona, Goa — supplying paints, hardware, tools, waterproofing and project essentials for everyday projects, home rennovations to everyday consumers, painters, contractors and builders. We've got your covered </p>
              <div className="hero-actions">
                <Link href="/products" className="btn btn-orange">SHOP PRODUCTS</Link>
                <a href="https://wa.me/918310248961" target="_blank" rel="noreferrer" className="btn btn-outline-white">WHATSAPP US</a>
              </div>
            </div>
          </div>
          <div className="hero-corner">SM<br /><small>CANACONA</small></div>
        </section>

       <section className="quick-links">
  <div className="container quick-grid">
  {categories.map((c) => (
    <Link
      key={c.slug}
      href={`/categories/${c.slug}`}
      className="quick-link"
    >
      <span
        className="quick-icon"
        style={{
          maskImage: `url(${c.icon})`,
          WebkitMaskImage: `url(${c.icon})`,
        }}
        aria-hidden="true"
      />

      <strong>{c.name.toUpperCase()}</strong>

      <span className="quick-arrow">↗</span>
    </Link>
  ))}
</div>
</section>

        

        <section className="section products-section">
          <div className="container">
            <div className="section-head">
              <div><p className="kicker">FEATURED PRODUCTS</p><h2>Adding colour to life.</h2></div>
              <Link href="/products" className="section-link">VIEW ALL PRODUCTS ↗</Link>
            </div>
            <div className="product-grid pro-grid">
              {products.filter((p) => p.featured).slice(0, 6).map((p, i) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className="product-card pro-card">
                  <div className={`product-art ${p.tone || "orange"}`}>{p.image ? <img src={p.image} alt={p.name} loading="lazy" className="product-photo" /> : <span className="product-short">{p.short}</span>}</div>
                  <div className="product-info"><span className="product-category">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p><span className="product-link">VIEW PRODUCT →</span></div>
                </Link>
              ))}
              {!products.some((p) => p.featured) ? <div className="empty-state"><strong>Featured products are coming soon.</strong><p>Browse the full catalogue or contact the store for current availability.</p><Link href="/products" className="btn btn-black">BROWSE PRODUCTS</Link></div> : null}
            </div>
          </div>
        </section>

        <section className="opus-feature">
          <div className="container">
            <div className="opus-feature-grid">
              <div className="opus-brand-copy">
                <p className="kicker orange-kicker">FEATURED PAINT BRAND</p>

                <div className="opus-logo-wrap">
                  <img
                    src="/images/opus-logo.svg"
                    alt="Birla Opus"
                    className="opus-logo"
                  />
                </div>

                <h2>
                  COLOUR
                  <br />
                  YOUR SPACE.
                </h2>

                <p className="opus-description">
                  Explore Birla Opus paints, finishes and colour possibilities
                  available through Shri Mallikarjun Hardware &amp; Paint in Canacona.
                </p>

                <div className="opus-actions">
                  <Link href="/brands/opus" className="btn btn-orange">
                    EXPLORE OPUS
                  </Link>
                </div>
              </div>

              <div className="opus-products-panel">
                <div className="opus-products-art">
                  <img
                    src="/images/opus-products.png"
                    alt="Birla Opus paint products"
                    loading="lazy"
                  />
                </div>

                <a
                  href="https://www.birlaopus.com/colour-catalogue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-black opus-catalogue-button"
                >
                  EXPLORE COLOUR CATALOGUE ↗
                </a>
              </div>
            </div>

            <div className="opus-range-strip" aria-label="Birla Opus product ranges">
              <span>INTERIOR PAINTS</span>
              <span>EXTERIOR PAINTS</span>
              <span>WATERPROOFING</span>
              <span>ENAMELS</span>
              <span>WOOD FINISHES</span>
            </div>
          </div>
        </section>
                
       <section className="section dark-section">
          <div className="container">
            <div className="section-head light-head">
              <div><p className="kicker orange-kicker">TRADE SOLUTIONS</p><h2>Built for the people who build.</h2></div>
              <Link href="/contact" className="section-link light-link">TALK TO US ↗</Link>
            </div>
            <div className="trade-grid">
              {tradeItems.map(([title, text], i) => (
                <div className="trade-card" key={title}>
                  <span className="trade-index">0{i + 1}</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                  <span className="trade-arrow">→</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section store-section">
  <div className="container">
    <div className="section-head">
      <div><p className="kicker">FIND US</p><h2>Two local locations.</h2></div>
      <Link href="/contact" className="section-link">VIEW STORE DETAILS ↗</Link>
    </div>
    <div className="locations-home-grid">
      {siteConfig.locations.map((location) => (
        <div className="store-location-card" key={location.id}>
          <div className="store-location-copy"><p className="kicker orange-kicker">{location.shortName}</p><h3>{location.name}</h3><p>{location.address.map((line, i) => <span key={i}>{line}<br /></span>)}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapQuery)}`} target="_blank" rel="noreferrer" className="text-link">GET DIRECTIONS ↗</a></div>
          <div className="store-panel"><iframe src={location.mapEmbed} title={`${location.name} Google Map`} width="100%" height="340" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /></div>
        </div>
      ))}
    </div>
  </div>
</section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": siteConfig.locations.map((location) => ({
          "@type": "HardwareStore",
          "@id": `${siteConfig.siteUrl}/#${location.id}`,
          "name": location.name,
          "url": siteConfig.siteUrl,
          "telephone": siteConfig.phone,
          "image": `${siteConfig.siteUrl}/images/seo-share.png`,
          "address": { "@type": "PostalAddress", "streetAddress": location.address[0], "addressLocality": location.locality, "addressRegion": location.region, "postalCode": location.postalCode, "addressCountry": location.country },
          "areaServed": ["Canacona", "Goa"],
          "hasMap": `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapQuery)}`
        }))
      }) }} />
      <Footer />
    </>
  );
}
