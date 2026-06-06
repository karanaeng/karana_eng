
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { services } from '../../data/services';
import { CosmicCard } from '../cosmic/CosmicCard';
import * as LucideIcons from 'lucide-react';

export const ServicesGrid = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black font-montserrat text-white mb-6 tracking-tight"
        >
          OUR <span className="text-cosmic-gold">CAPABILITIES</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/50 text-lg max-w-2xl mx-auto font-montserrat"
        >
          From quantum simulations to neural networks, we provide an unparalleled spectrum of engineering expertise.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = (LucideIcons[service.icon as keyof typeof LucideIcons] || LucideIcons.Box) as React.ComponentType<{ size: number }>;
          return (
            <Link key={service.id} to={`/services/${service.slug}`} className="block h-full cursor-pointer">
              <CosmicCard className="h-full flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 bg-cosmic-gold/10 rounded-lg flex items-center justify-center mb-6 text-cosmic-gold transition-colors group-hover:bg-cosmic-gold group-hover:text-cosmic-black">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 font-montserrat group-hover:text-cosmic-gold transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 font-montserrat">
                    {service.description}
                  </p>
                </div>
                <div
                  className="text-cosmic-gold text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  Explore Service <span className="text-lg">→</span>
                </div>
              </CosmicCard>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
