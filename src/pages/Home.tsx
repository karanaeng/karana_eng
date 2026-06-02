import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/home/Hero';
import { ServicesGrid } from '../components/home/ServicesGrid';
import { Capabilities } from '../components/home/Capabilities';
import { ContactCTA } from '../components/home/ContactCTA';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Karana Agency",
  "url": "https://karanaagency.com",
  "logo": "https://karanaagency.com/logo.png", // update path
  "description": "Engineering services, 3D printing, and custom tech solutions based in Amaravati, India.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Amaravati",
    "addressRegion": "Andhra Pradesh",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-75692-74373",
    "contactType": "customer service"
  },
  "sameAs": [
    // add your social profile URLs here
    // "https://www.instagram.com/karanaagency",
    // "https://www.linkedin.com/company/karanaagency"
  ]
};

export default function Home() {
  return (
    <>
      <Helmet>
        {/* Primary */}
        <title>Karana Agency — Engineering, 3D Printing & Tech Services in Amaravati</title>
        <meta
          name="description"
          content="Karana Agency delivers precision engineering, 3D printing, and custom technology solutions from Amaravati, India. Get a response within 24 hours."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://karanaagency.com" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karanaagency.com" />
        <meta property="og:title" content="Karana Agency — Engineering & 3D Printing, Amaravati" />
        <meta property="og:description" content="Precision engineering, 3D printing, and custom tech solutions. Based in Amaravati, India." />
        <meta property="og:image" content="https://karanaagency.com/og-image.jpg" /> {/* 1200×630px */}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Karana Agency — Engineering & 3D Printing" />
        <meta name="twitter:description" content="Precision engineering and custom tech solutions from Amaravati, India." />
        <meta name="twitter:image" content="https://karanaagency.com/og-image.jpg" />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="relative z-10">
        <Hero />
        <ServicesGrid />
        <Capabilities />
        <ContactCTA />
      </main>
    </>
  );
}