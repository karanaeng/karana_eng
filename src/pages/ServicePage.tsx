import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { services } from '../data/services';
import { projects } from '../data/projects';
import { ServiceHero } from '../components/services/ServiceHero';
import { ServiceDetails } from '../components/services/ServiceDetails';
import { GenericServiceForm } from '../components/services/GenericServiceForm';
import { ProjectCard } from '../components/works/ProjectCard';
import { ChevronRight, Printer, CheckCircle2, MessageSquare, Briefcase } from 'lucide-react';
import { getServiceExpertise } from '../data/serviceExpertise';

const BASE_URL = 'https://karanaagency.vercel.app';

export default function ServicePage() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug);

  // ── 404 branch ───────────────────────────────────────────────────────────
  if (!service) return (
    <>
      <Helmet>
        <title>Service Not Found | Karana Agency</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="text-white text-center py-20 font-montserrat">Service not found</div>
    </>
  );

  const is3DPrinting = service.id === '3d-printing';
  const serviceProjects = projects.filter(p => p.services.includes(service.id));
  const related = services.filter(s => s.id !== service.id && s.category === service.category).slice(0, 3);

  const canonicalUrl = `${BASE_URL}/services/${service.slug}`;

  // JSON-LD: Service schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "url": canonicalUrl,
    "provider": {
      "@type": "Organization",
      "name": "Karana Agency",
      "url": BASE_URL,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Amaravati",
        "addressRegion": "Andhra Pradesh",
        "addressCountry": "IN"
      }
    },
    ...(service.category && { "serviceType": service.category }),
  };

  const seoHead = (
    <Helmet>
      <title>{service.name} | Karana Agency — Amaravati, India</title>
      <meta
        name="description"
        content={
          service.description
            ? `${service.description.slice(0, 145)}…`
            : `${service.name} services by Karana Agency. Precision engineering and tech solutions from Amaravati, India.`
        }
      />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={`${service.name} | Karana Agency`} />
      <meta property="og:description" content={service.description ?? `${service.name} services by Karana Agency.`} />
      <meta property="og:image" content="/og-image.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${service.name} | Karana Agency`} />
      {service.description && <meta name="twitter:description" content={service.description} />}
      <meta name="twitter:image" content="/og-image.jpg" />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );

  return (
    <>
      {seoHead}
      <main className="relative z-10">
        <ServiceHero service={service} />

        {/* SERVICE SPECIFIC DETAILS */}
        {is3DPrinting ? (
          <div className="space-y-0">
            {/* 3D Offering Highlights */}
            <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5 space-y-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-8">
                  <h2 className="text-3xl font-black text-white font-montserrat tracking-tight uppercase">
                    WHAT WE <span className="text-cosmic-gold">DELIVER</span>
                  </h2>
                  <ul className="grid grid-cols-1 gap-4">
                    {['Slicing', 'FDM Printing', 'Prototyping Consultation', 'Post-process & Finishing'].map((offering, idx) => (
                      <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cosmic-gold/50 transition-all duration-300">
                        <CheckCircle2 className="text-cosmic-gold shrink-0 mt-0.5" size={20} />
                        <span className="text-white/80 font-montserrat">{offering}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-12">
                  <div className="space-y-8">
                    <h2 className="text-3xl font-black text-white font-montserrat tracking-tight uppercase">
                      TECH <span className="text-cosmic-gold">STACK</span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { name: 'Ultimaker Cura' },
                        { name: 'PrusaSlicer' },
                        { name: 'Bambu Lab' }
                      ].map((tech, idx) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center group hover:border-cosmic-gold/50 transition-all duration-300">
                          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform overflow-hidden font-bold text-white/50 text-[10px]">
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-white/80 text-[10px] font-montserrat">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 pt-12 border-t border-white/0">
                <div className="space-y-8">
                  <h2 className="text-3xl font-black text-white font-montserrat tracking-tight uppercase">
                    OUR <span className="text-cosmic-gold">PROCESS</span>
                  </h2>
                  <div className="space-y-4">
                    {[
                      { phase: 'Material Selection', description: 'Choosing the optimal material — PLA+, PETG, or TPU.' },
                      { phase: 'Slicing', description: 'Precision slicing with optimised supports and layer height.' },
                      { phase: 'Printing', description: 'High-quality FDM printing with calibrated machines.' }
                    ].map((step, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex gap-5">
                        <span className="text-cosmic-gold font-black font-montserrat">{idx + 1}</span>
                        <div>
                          <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">{step.phase}</h3>
                          <p className="text-white/50 text-xs leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <h2 className="text-3xl font-black text-white font-montserrat tracking-tight uppercase">
                    WHY <span className="text-cosmic-gold">KARANA</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    {getServiceExpertise('3d-printing').map((item, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-5 hover:bg-white/10 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-xl bg-cosmic-gold/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-cosmic-gold/20 transition-all">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-white font-bold font-montserrat text-sm mb-1">{item.title}</h4>
                          <p className="text-white/50 text-[11px] font-montserrat leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

          </div>
        ) : (
          <ServiceDetails service={service} />
        )}

        {/* REQUEST FORM - MOVED BELOW PROCESS */}
        <section
          className="py-16 md:py-24 px-6 max-w-7xl mx-auto border-t border-white/5"
          id="request-form"
          aria-label={`Request ${service.name} service`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black font-montserrat text-white tracking-tight leading-tight">
                START YOUR <br />
                <span className="text-cosmic-gold">PROJECT</span> WITH US
              </h2>
              <p className="text-white/60 text-lg font-montserrat max-w-xl leading-relaxed">
                Fill out the form to request {service.name} services. Our team will review your requirements and get back to you within 24 hours.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-cosmic-gold/30 transition-all">
                  <div className="w-12 h-12 bg-cosmic-gold/10 rounded-full flex items-center justify-center text-cosmic-gold group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={24} />
                  </div>
                  <span className="text-white/80 font-bold font-montserrat text-sm">Expert Review</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-cosmic-gold/30 transition-all">
                  <div className="w-12 h-12 bg-cosmic-gold/10 rounded-full flex items-center justify-center text-cosmic-gold group-hover:scale-110 transition-transform">
                    <MessageSquare size={24} />
                  </div>
                  <span className="text-white/80 font-bold font-montserrat text-sm">24h Response</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cosmic-gold/10 blur-[100px] rounded-full group-hover:bg-cosmic-gold/20 transition-all duration-700" />

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-cosmic-gold/20 rounded-2xl flex items-center justify-center text-cosmic-gold transform -rotate-3 group-hover:rotate-0 transition-transform">
                  {is3DPrinting ? <Printer size={24} /> : <Briefcase size={24} />}
                </div>
                <div>
                  <h3 className="text-white font-black font-montserrat text-xl tracking-tight">Request Service</h3>
                  <p className="text-white/40 text-xs font-montserrat uppercase tracking-widest font-bold">Project Intake Form</p>
                </div>
              </div>

              <GenericServiceForm serviceId={service.id} serviceName={service.name} />
            </div>
          </div>
        </section>

        {/* Previous Works */}
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black font-montserrat text-white tracking-tight mb-4 uppercase">
              PREVIOUS <span className="text-cosmic-gold">WORKS</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto font-montserrat">
              Real-world applications of {service.name} in action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {serviceProjects.length === 0 && (
              <div className="col-span-full text-center py-20 text-white/30 font-montserrat">
                No projects listed for this specific service.
              </div>
            )}
          </div>

          <div className="mt-20 text-center">
            <Link to="/works" className="text-cosmic-gold font-bold uppercase tracking-widest text-xs hover:underline">
              View All Projects
            </Link>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black font-montserrat text-white tracking-tight mb-4 uppercase">
              RELATED <span className="text-cosmic-gold">SERVICES</span>
            </h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(rel => (
              <li key={rel.id}>
                <Link
                  to={`/services/${rel.slug}`}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cosmic-gold/50 transition-all duration-300 group text-left block"
                >
                  <h3 className="text-lg font-bold text-white mb-2 font-montserrat group-hover:text-cosmic-gold transition-colors">
                    {rel.name}
                  </h3>
                  <p className="text-white/50 text-sm font-montserrat mb-4 line-clamp-2">{rel.description}</p>
                  <div className="flex items-center gap-2 text-cosmic-gold text-xs font-bold uppercase tracking-widest">
                    Explore <ChevronRight size={14} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
