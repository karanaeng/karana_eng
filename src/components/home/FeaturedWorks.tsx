
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../../data/projects';
import { CosmicCard } from '../cosmic/CosmicCard';
import { CosmicImage } from '../cosmic/CosmicImage';

export const FeaturedWorks = () => {
  const featured = projects.filter(p => p.featured).slice(0, 8);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="text-left">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black font-montserrat text-white tracking-tight mb-4"
          >
            FEATURED <span className="text-cosmic-gold">WORKS</span>
          </motion.h2>
          <p className="text-white/50 text-lg max-w-xl font-montserrat">
            A curated selection of our most ambitious projects, where engineering meets art.
          </p>
        </div>
        <Link
          to="/works"
          className="px-8 py-3 border border-cosmic-gold text-cosmic-gold font-bold rounded-full hover:bg-cosmic-gold hover:text-cosmic-black transition-all duration-300"
        >
          View All Projects
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((project) => (
          <Link key={project.id} to={`/works/${project.slug}`} className="block h-full cursor-pointer">
            <CosmicCard className="overflow-hidden p-0 group h-full">
              <div className="relative aspect-[4/5] overflow-hidden">
                <CosmicImage
                  src={project.thumbnail}
                  alt={project.title}
                  title={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-6 z-10">
                  <span className="text-cosmic-gold text-[10px] font-black uppercase tracking-widest mb-2 block">
                    {project.services.map(s => s.split('-').join(' ')).join(' • ')}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-4 font-montserrat leading-tight group-hover:text-cosmic-gold transition-colors">
                    {project.title}
                  </h3>
                  <div
                    className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Case Study <span className="text-lg">→</span>
                  </div>
                </div>
              </div>
            </CosmicCard>
          </Link>
        ))}
      </div>
    </section>
  );
};

