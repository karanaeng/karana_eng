
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Hero = () => {
  const [showIntroLogo, setShowIntroLogo] = useState(true);

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setShowIntroLogo(false);
    }, 1400);

    return () => window.clearTimeout(introTimer);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center max-w-5xl px-6">
        <AnimatePresence mode="wait">
          {showIntroLogo ? (
            <motion.div
              key="hero-logo"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex min-h-[430px] items-center justify-center"
            >
              <img
                src="/karana-logo.png"
                alt="Karana Engineering"
                className="w-full max-w-[620px] object-contain opacity-90"
              />
            </motion.div>
          ) : (
            <motion.div
              key="hero-copy"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-montserrat text-white leading-tight tracking-tighter mb-8">
                  ENGINEERING <br />
                  <span className="text-cosmic-gold text-glow-gold">THE FUTURE</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="text-white/60 text-lg md:text-xl font-montserrat max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                Karana is an elite multidisciplinary powerhouse bridging the gap between
                visionary concepts and industrial reality. We engineer the impossible.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  to="/contact"
                  className="group px-8 py-4 bg-cosmic-gold text-cosmic-black font-bold rounded-full flex items-center gap-2 hover:bg-cosmic-gold-light transition-all duration-300 hover:shadow-gold-glow"
                >
                  Start Your Project
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/works"
                  className="px-8 py-4 text-white font-bold rounded-full border border-white/20 hover:border-cosmic-gold/50 hover:text-cosmic-gold transition-all duration-300"
                >
                  View Our Works
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
};
