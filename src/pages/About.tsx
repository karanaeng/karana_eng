import { motion } from 'framer-motion';
import { Target, Rocket, Shield, Zap } from 'lucide-react';
import { Helmet } from "react-helmet-async";

const values = [
  {
    title: 'Precision Engineering',
    description: 'We don\'t just build; we optimize. Every micron and every millisecond is accounted for in our pursuit of technical perfection.',
    icon: Target,
  },
  {
    title: 'Cosmic Innovation',
    description: 'Drawing inspiration from the vastness of the universe, we apply first-principles thinking to solve the most complex human challenges.',
    icon: Rocket,
  },
  {
    title: 'Uncompromising Integrity',
    description: 'Our work is built on a foundation of absolute reliability. If it doesn\'t pass our rigorous stress-tests, it doesn\'t ship.',
    icon: Shield,
  },
  {
    title: 'Rapid Iteration',
    description: 'Combining the speed of software prototyping with the stability of industrial engineering to accelerate your time-to-market.',
    icon: Zap,
  },
];

export default function About() {
  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>About Karana | Precision Engineering Beyond Limits</title>
        <meta
          name="description"
          content="Karana is a multidisciplinary engineering collective of engineers, designers, and scientists turning theoretical breakthroughs into tangible reality. Built on precision, integrity, and cosmic ambition."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://karana-agency.vercel.app/about" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Karana | Precision Engineering Beyond Limits" />
        <meta
          property="og:description"
          content="We are a multidisciplinary collective of engineers, designers, and scientists dedicated to turning theoretical breakthroughs into tangible reality."
        />
        <meta property="og:url" content="https://yourdomain.com/about" />
        <meta property="og:image" content="https://yourdomain.com/og-about.jpg" />
        <meta property="og:site_name" content="Karana" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Karana | Precision Engineering Beyond Limits" />
        <meta
          name="twitter:description"
          content="Karana operates where technical complexity meets visionary ambition — from ocean depths to the stratosphere."
        />
        <meta name="twitter:image" content="https://yourdomain.com/og-about.jpg" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "name": "About Karana",
              "description":
                "Karana is a multidisciplinary engineering collective turning theoretical breakthroughs into tangible reality.",
              "url": "https://yourdomain.com/about",
              "publisher": {
                "@type": "Organization",
                "name": "Karana",
                "url": "https://yourdomain.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://yourdomain.com/logo.png",
                },
              },
            }),
          }}
        />
      </Helmet>

      <main className="relative z-10 min-h-screen px-6 py-24 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section
          aria-label="About Karana"
          className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-black font-montserrat text-white tracking-tighter">
              BEYOND <span className="text-cosmic-gold">LIMITS.</span>
            </h1>
            <p className="text-white/60 text-xl font-montserrat leading-relaxed">
              Karana was founded on a simple premise: that the most ambitious engineering projects
              require more than just expertise—they require a cosmic perspective.
            </p>
            <p className="text-white/60 text-lg font-montserrat leading-relaxed">
              We are a multidisciplinary collective of engineers, designers, and scientists dedicated
              to turning theoretical breakthroughs into tangible reality. From the depths of the
              ocean to the fringes of the stratosphere, Karana operates where technical complexity
              meets visionary ambition.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square rounded-3xl overflow-hidden border border-white/10"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple-deep to-cosmic-black" />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="w-full h-full rounded-full border-2 border-cosmic-gold/30 animate-ping absolute" />
              <div className="w-3/4 h-3/4 rounded-full border border-cosmic-gold/50 animate-spin-slow absolute" />
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-cosmic-gold rounded-full flex items-center justify-center text-cosmic-black mx-auto mb-6 font-black text-3xl">
                  K
                </div>
                <h2 className="text-white font-bold text-2xl font-montserrat">
                  Engineering the <br />Impossible
                </h2>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Core Values Section */}
        <section aria-labelledby="values-heading" className="space-y-20">
          <div className="text-center">
            <h2
              id="values-heading"
              className="text-3xl md:text-5xl font-black font-montserrat text-white tracking-tight mb-4"
            >
              OUR <span className="text-cosmic-gold">CORE VALUES</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto font-montserrat">
              The principles that guide every simulation, every line of code, and every prototype we
              build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.article
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cosmic-gold/50 transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 bg-cosmic-gold/10 rounded-xl flex items-center justify-center text-cosmic-gold mb-6 group-hover:scale-110 transition-transform"
                  aria-hidden="true"
                >
                  <value.icon size={24} />
                </div>
                <h3 className="text-white font-bold text-lg mb-4 font-montserrat">{value.title}</h3>
                <p className="text-white/60 text-sm font-montserrat leading-relaxed">
                  {value.description}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Karana Standard Section */}
        <section aria-label="The Karana Standard" className="py-32 text-center">
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-3xl mx-auto p-12 rounded-3xl bg-cosmic-gold/10 border border-cosmic-gold/20"
          >
            <h3 className="text-2xl font-black text-white font-montserrat mb-6 uppercase tracking-widest">
              The Karana Standard
            </h3>
            <p className="text-white/70 text-lg font-montserrat italic">
              "We don't just aim for industry standards. We aim for the standard by which the
              industry will be measured for the next decade."
            </p>
          </motion.blockquote>
        </section>
      </main>
    </>
  );
}