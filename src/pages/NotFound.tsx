import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <>
      <Helmet>
        {/* Tell crawlers: don't index this, don't follow links on it */}
        <title>404 — Page Not Found | Karana Agency</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main
        className="relative z-10 min-h-screen flex items-center justify-center px-6"
        aria-labelledby="error-heading"
      >
        <div className="text-center space-y-8">
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-9xl font-black text-white font-montserrat"
            aria-hidden="true" 
          >
            404
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h1
              id="error-heading"
              className="text-3xl font-bold text-white font-montserrat uppercase tracking-tight"
            >
              Lost in the Void
            </h1>
            <p className="text-white/50 text-lg font-montserrat max-w-md mx-auto">
              The page you are looking for has drifted beyond the reachable event horizon.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/"
              className="px-8 py-4 bg-cosmic-gold text-cosmic-black font-bold rounded-full hover:bg-cosmic-gold-light transition-all duration-300 hover:shadow-gold-glow"
            >
              Return to Orbit
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}