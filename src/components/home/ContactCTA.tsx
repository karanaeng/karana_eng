
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const ContactCTA = () => {
  return (
    <section className="py-32 px-6 max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative p-12 md:p-20 rounded-3xl overflow-hidden bg-cosmic-card border border-cosmic-border shadow-cosmic"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50" />
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black font-montserrat text-cosmic-white mb-8 tracking-tight">
            READY TO TRANSFORM <br />
            YOUR VISION?
          </h2>
          <p className="text-cosmic-muted text-lg max-w-2xl mx-auto mb-12 font-montserrat leading-relaxed">
            Join the ranks of elite companies partnering with Karana to build the next generation of engineering marvels.
          </p>
          <Link
            to="/contact"
            className="group px-10 py-5 bg-cosmic-gold text-cosmic-black font-bold rounded-full inline-flex items-center gap-3 hover:bg-cosmic-gold-light hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Talk To Us
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
};
