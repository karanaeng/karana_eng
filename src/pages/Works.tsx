import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';
import { services } from '../data/services';
import { ProjectCard } from '../components/works/ProjectCard';

// ─── SEO constants ────────────────────────────────────────────────────────────
const PAGE_TITLE = 'Our Work & Projects | Crafted Excellence | [Your Company Name]';
const PAGE_DESCRIPTION =
  'Browse our portfolio of engineering projects — from precision hardware to intelligent software solutions. Filter by service category to find relevant case studies.';
const CANONICAL_URL = 'https://karana-agency.vercel.app/buy'; // ← update to your domain

// ─── JSON-LD structured data (ItemList of projects) ───────────────────────────
function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Project Portfolio',
    description: PAGE_DESCRIPTION,
    url: CANONICAL_URL,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      description: project.description,
      url: `${CANONICAL_URL}/${project.id}`,
    })),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Works() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', ...services.map((s) => s.name)];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesFilter =
        filter === 'All' ||
        p.services.some((sId) => {
          const service = services.find((srv) => srv.id === sId);
          return service?.name === filter;
        });
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

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
        {/* <meta property="og:image" content="https://yoursite.com/og-works.jpg" /> */}

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
        aria-label="Project portfolio"
      >
        {/* Hero heading */}
        <header className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black font-montserrat text-white mb-8 tracking-tight"
          >
            CRAFTED <span className="text-cosmic-gold">EXCELLENCE</span>
          </motion.h1>

          {/* Search + filter controls */}
          <div
            className="flex flex-col items-center justify-center gap-8 mb-16"
            role="search"
            aria-label="Filter projects"
          >
            {/* Category filter buttons */}
            <nav aria-label="Filter projects by service category">
              <ul className="flex flex-wrap justify-center gap-2 list-none p-0 m-0">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setFilter(cat)}
                      aria-pressed={filter === cat}
                      aria-label={`Filter by ${cat}`}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${filter === cat
                          ? 'bg-cosmic-gold text-cosmic-black shadow-gold-glow'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Search input */}
            <div className="relative w-full max-w-md">
              <label htmlFor="project-search" className="sr-only">
                Search projects
              </label>
              <input
                id="project-search"
                type="search"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                className="w-full px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all placeholder:text-white/30 text-center"
              />
            </div>
          </div>
        </header>

        {/* Project grid */}
        <section aria-label={`Projects${filter !== 'All' ? ` — ${filter}` : ''}`}>
          {/* Live region announces result count to screen readers & signals content change */}
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {filteredProjects.length === 0
              ? 'No projects found matching your criteria.'
              : `Showing ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}${filter !== 'All' ? ` in ${filter}` : ''}.`}
          </p>

          <motion.ul
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0"
            aria-label="Project list"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.li
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard project={project} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <p
              className="text-center py-20 text-white/30 font-montserrat"
              role="status"
            >
              No projects found matching your criteria.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
