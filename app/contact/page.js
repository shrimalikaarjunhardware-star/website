import { Header, Footer } from "../components/SiteChrome";
import { siteConfig } from "../../lib/siteConfig";

export const metadata = {
  title: "Contact & Store Locations in Canacona, Goa",
  description: "Find Shri Mallikarjun Hardware & Paints in Chaudi and Batpal, Canacona, Goa. Get directions, call the store or message us on WhatsApp.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <Header />

      <main className="page">
        <div className="container">

          <p className="kicker">GET IN TOUCH</p>

          <h1>Talk to the store.</h1>

          <p className="lead">
            For product availability, colours, sizes, project requirements or
            general enquiries, call or WhatsApp us.
          </p>

          <div className="contact-grid pro-contact">
            {siteConfig.locations.map((location, index) => (
              <div className="contact-card" key={location.id}>
                <span className="contact-icon">0{index + 1}</span>
                <h3>{location.shortName}</h3>
                <p>{location.address.map((line, i) => <span key={i}>{line}<br /></span>)}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapQuery)}`} target="_blank" rel="noreferrer" className="text-link">GET DIRECTIONS ↗</a>
              </div>
            ))}
            <div className="contact-card">
              <span className="contact-icon">03</span>
              <h3>WHATSAPP &amp; CALL</h3>
              <p>For product availability, colours, sizes and project enquiries.<br />{siteConfig.phoneDisplay}</p>
              <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer" className="text-link">MESSAGE ON WHATSAPP ↗</a>
              <a href={`tel:${siteConfig.phone}`} className="text-link">CALL NOW ↗</a>
            </div>
          </div>

          {/* GOOGLE MAPS */}
          <div className="contact-maps-grid">
            {siteConfig.locations.map((location) => (
              <div className="map-embed wide" key={location.id}>
                <div className="map-title"><strong>{location.shortName}</strong><span>{location.name}</span></div>
                <iframe src={location.mapEmbed} title={`${location.name} Google Map`} width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
