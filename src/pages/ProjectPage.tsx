import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { projects } from '../data/projects';
import { ProjectHero } from '../components/works-detail/ProjectHero';
import { ProjectContent } from '../components/works-detail/ProjectContent';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  // ── 404 branch ───────────────────────────────────────────────────────────
  if (!project) return (
    <>
      <Helmet>
        <title>Project Not Found | Karana Agency</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="text-white text-center py-20 font-montserrat">Project not found</div>
    </>
  );

  const currentIndex = projects.findIndex(p => p.slug === slug);
  const prevProject = projects[currentIndex - 1] || projects[projects.length - 1];
  const nextProject = projects[currentIndex + 1] || projects[0];

  // Build canonical URL — update base domain
  const BASE_URL = 'https://karanaagency.com';
  const canonicalUrl = `${BASE_URL}/works/${project.slug}`;

  // JSON-LD: CreativeWork schema per project
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,   // add `description` to your project data if missing
    "url": canonicalUrl,
    "image": project.image,               // add `image` to your project data if missing
    "creator": {
      "@type": "Organization",
      "name": "Karana Agency",
      "url": BASE_URL,
    },
    ...(project.category && { "genre": project.category }),
    ...(project.year && { "dateCreated": String(project.year) }),
  };

  return (
    <>
      <Helmet>
        {/* Primary */}
        <title>{project.title} | Karana Agency Works</title>
        <meta
          name="description"
          content={
            project.description
              ? `${project.description.slice(0, 145)}…`
              : `Explore the ${project.title} project by Karana Agency — engineering and tech solutions from Amaravati, India.`
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph — controls WhatsApp / LinkedIn previews */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${project.title} | Karana Agency`} />
        <meta
          property="og:description"
          content={project.description ?? `A project by Karana Agency.`}
        />
        {project.image && <meta property="og:image" content={project.image} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.title} | Karana Agency`} />
        {project.description && <meta name="twitter:description" content={project.description} />}
        {project.image && <meta name="twitter:image" content={project.image} />}

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="relative z-10">
        <ProjectHero project={project} />
        <ProjectContent project={project} />

        {/* ── Project Navigation ───────────────────────────────────────── */}
        <nav
          aria-label="Project navigation"
          className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Link
              to={`/works/${prevProject.slug}`}
              rel="prev"
              aria-label={`Previous project: ${prevProject.title}`}
              className="group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cosmic-gold/50 transition-all duration-300"
            >
              <ChevronLeft aria-hidden="true" className="text-cosmic-gold group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <span className="text-white/50 text-xs uppercase tracking-widest block mb-1">Previous Project</span>
                <span className="text-white font-bold font-montserrat">{prevProject.title}</span>
              </div>
            </Link>

            <Link
              to={`/works/${nextProject.slug}`}
              rel="next"
              aria-label={`Next project: ${nextProject.title}`}
              className="group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cosmic-gold/50 transition-all duration-300 text-right"
            >
              <div className="text-right">
                <span className="text-white/50 text-xs uppercase tracking-widest block mb-1">Next Project</span>
                <span className="text-white font-bold font-montserrat">{nextProject.title}</span>
              </div>
              <ChevronRight aria-hidden="true" className="text-cosmic-gold group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </nav>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section
          aria-label="Start a project"
          className="py-32 px-6 max-w-4xl mx-auto text-center"
        >
          <div className="p-12 rounded-3xl bg-gradient-to-br from-cosmic-gold to-cosmic-gold-light text-cosmic-black">
            <h2 className="text-3xl md:text-5xl font-black font-montserrat mb-8 tracking-tight">
              START YOUR NEXT <br />
              MASTERPIECE
            </h2>
            <Link
              to="/contact"
              className="px-10 py-5 bg-cosmic-black text-white font-bold rounded-full inline-flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Request a Consultation
              <ChevronRight aria-hidden="true" className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}