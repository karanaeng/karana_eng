import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { services } from '../data/services';
import { CosmicCard } from '../components/cosmic/CosmicCard';
import * as LucideIcons from 'lucide-react';

// ─── SEO constants ────────────────────────────────────────────────────────────
const PAGE_TITLE = 'Our Expertise & Services | [karana-agency]';
const PAGE_DESCRIPTION =
  'Explore our multidisciplinary engineering services — blending physical precision with digital intelligence across software, hardware, and beyond.';
const CANONICAL_URL = 'https://karana-agency.vercel.app/services'; // ← update to your domain

// ─── JSON-LD structured data (ItemList) ───────────────────────────────────────
function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Engineering Services',
    description: PAGE_DESCRIPTION,
    url: CANONICAL_URL,
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.name,
      description: service.description,
      url: `${CANONICAL_URL}/${service.slug}`,
    })),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Services() {
  const categories = Array.from(new Set(services.map((s) => s.category)));
  const structuredData = buildStructuredData();

  return (
    <>
      {/* ── Head / Meta ───────────────────────────────────────────────────── */}
      <Helmet>
        {/* Primary */}
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={CANONICAL_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        {/* <meta property="og:image" content="https://yoursite.com/og-services.jpg" /> */}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />

        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* ── Page ──────────────────────────────────────────────────────────── */}
      <main
        className="relative z-10 min-h-screen px-6 py-24 max-w-7xl mx-auto"
        aria-label="Services and expertise"
      >
        {/* Hero heading */}
        <header className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black font-montserrat text-white mb-8 tracking-tight"
          >
            OUR <span className="text-cosmic-gold">EXPERTISE</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto font-montserrat"
          >
            A multidisciplinary approach to engineering, blending physical
            precision with digital intelligence.
          </motion.p>
        </header>

        {/* Service categories */}
        <div className="space-y-32">
          {categories.map((category, catIdx) => {
            const categoryId = `category-${category
              .toLowerCase()
              .replace(/\s+/g, '-')}`;

            return (
              <section
                key={category}
                className="space-y-12"
                aria-labelledby={categoryId}
              >
                {/* Category heading */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.1 }}
                  className="flex items-center gap-6"
                >
                  <h2
                    id={categoryId}
                    className="text-3xl font-black text-white font-montserrat uppercase tracking-widest"
                  >
                    {category}
                  </h2>
                  <div
                    className="h-px flex-grow bg-gradient-to-r from-cosmic-gold/50 to-transparent"
                    aria-hidden="true"
                  />
                </motion.div>

                {/* Service cards */}
                <ul
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0"
                  aria-label={`${category} services`}
                >
                  {services
                    .filter((s) => s.category === category)
                    .map((service) => {
                      const Icon = (
                        LucideIcons[
                          service.icon as keyof typeof LucideIcons
                        ] || LucideIcons.Box
                      ) as React.ComponentType<{ size: number; 'aria-hidden': string }>;

                      return (
                        <li key={service.id}>
                          <article aria-label={service.name}>
                            <Link to={`/services/${service.slug}`} className="block h-full cursor-pointer">
                              <CosmicCard className="group flex flex-col justify-between h-full">
                                <div className="space-y-6">
                                  {/* Icon */}
                                  <div
                                    className="w-12 h-12 bg-cosmic-gold/10 rounded-lg flex items-center justify-center text-cosmic-gold group-hover:bg-cosmic-gold group-hover:text-cosmic-black transition-colors duration-300"
                                    aria-hidden="true"
                                  >
                                    <Icon size={24} aria-hidden="true" />
                                  </div>

                                  {/* Service name — h3 for correct heading hierarchy */}
                                  <h3 className="text-2xl font-bold text-white font-montserrat group-hover:text-cosmic-gold transition-colors">
                                    {service.name}
                                  </h3>

                                  {/* Description */}
                                  <p className="text-white/60 text-sm font-montserrat leading-relaxed">
                                    {service.description}
                                  </p>
                                </div>

                                {/* CTA link — descriptive text for screen readers & crawlers */}
                                <div
                                  className="text-cosmic-gold text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all pt-6"
                                  aria-label={`Learn more about ${service.name}`}
                                >
                                  Learn More{' '}
                                  <span aria-hidden="true" className="text-lg">
                                    →
                                  </span>
                                </div>
                              </CosmicCard>
                            </Link>
                          </article>
                        </li>
                      );
                    })}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
