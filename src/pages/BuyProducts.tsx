import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CosmicImage } from '../components/cosmic/CosmicImage';
import { CosmicCard } from '../components/cosmic/CosmicCard';
import { ShoppingBag, Sparkles, ServerCrash } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  category: 'Websites' | 'Robotic Projects' | 'IoT Projects' | 'UI/UX Design';
  price: number;
  thumbnail: string;
  options: string[];
}

const CATEGORIES = ['Websites', 'Robotic Projects', 'IoT Projects', 'UI/UX Design'] as const;

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Websites: 'Ready-made and customisable website templates built for performance and modern design.',
  'Robotic Projects': 'Pre-engineered robotic modules and systems ready to deploy or customise.',
  'IoT Projects': 'Smart IoT solutions and connected device blueprints for rapid deployment.',
  'UI/UX Design': 'Premium UI/UX design systems and interactive prototypes crafted for impact.',
};

export default function BuyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Websites');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Could not connect to the product database. Make sure the server is running.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => p.category === activeCategory);

  const handleAction = (product: Product, option: 'purchase' | 'customise') => {
    navigate('/checkout', { state: { product, option } });
  };

  // Structured data for product listing
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Karana ${activeCategory} — Ready-Made Tech Products`,
    description: CATEGORY_DESCRIPTIONS[activeCategory],
    url: `https://yourdomain.com/products`,
    numberOfItems: filteredProducts.length,
    itemListElement: filteredProducts.map((product, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.thumbnail,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.price.toFixed(2),
          availability: 'https://schema.org/InStock',
          url: `https://yourdomain.com/products`,
        },
      },
    })),
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>{`Buy ${activeCategory} | Karana Ready-Made Tech Products`}</title>
        <meta
          name="description"
          content={`${CATEGORY_DESCRIPTIONS[activeCategory]} Purchase instantly or request custom refinements from Karana's exclusive tech catalog.`}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourdomain.com/products" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Buy ${activeCategory} | Karana Ready-Made Tech`} />
        <meta
          property="og:description"
          content={CATEGORY_DESCRIPTIONS[activeCategory]}
        />
        <meta property="og:url" content="https://yourdomain.com/products" />
        <meta property="og:image" content="https://yourdomain.com/og-products.jpg" />
        <meta property="og:site_name" content="Karana" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Buy ${activeCategory} | Karana`} />
        <meta name="twitter:description" content={CATEGORY_DESCRIPTIONS[activeCategory]} />
        <meta name="twitter:image" content="https://yourdomain.com/og-products.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="relative z-10 min-h-screen px-6 py-24 max-w-7xl mx-auto">
        {/* Background Glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cosmic-gold/5 blur-[150px] rounded-full pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Header */}
        <header className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-cosmic-gold text-xs font-black uppercase tracking-[0.3em] bg-cosmic-gold/10 px-4 py-2 rounded-full inline-block mb-4"
          >
            Exclusive Ready-Made Tech
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black font-montserrat text-white tracking-tight leading-none mb-6"
          >
            READY & <span className="text-cosmic-gold">CUSTOMISABLE</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 font-montserrat max-w-2xl mx-auto text-sm md:text-base"
          >
            Browse our premium catalog of pre-engineered systems, interactive designs, and robotic
            modules. Acquire instantly or request tailored refinements.
          </motion.p>
        </header>

        {/* Category Tabs */}
        <nav aria-label="Product categories" className="flex justify-center flex-wrap gap-2 md:gap-4 mb-16 border-b border-white/5 pb-8">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={isActive}
                aria-label={`Filter by ${cat} (${count} items)`}
                className={`relative px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-cosmic-gold text-cosmic-black shadow-gold-glow'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
                <span
                  aria-hidden="true"
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-cosmic-black/10 text-cosmic-black'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Product Display */}
        <section aria-label={`${activeCategory} products`}>
          {isLoading ? (
            <div
              className="w-full flex flex-col items-center justify-center py-32"
              role="status"
              aria-live="polite"
              aria-label="Loading products"
            >
              <div className="w-16 h-16 border-4 border-cosmic-gold/20 border-t-cosmic-gold rounded-full animate-spin mb-4" />
              <p className="text-white/40 text-xs uppercase tracking-widest font-black">
                Decrypting catalog...
              </p>
            </div>
          ) : error ? (
            <div
              role="alert"
              className="w-full max-w-md mx-auto text-center py-20 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md"
            >
              <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-xl font-bold text-white mb-2">Server Syncing</h2>
              <p className="text-white/60 text-xs font-montserrat">
                Our secure catalog systems are performing a routing synchronization. Please reload
                the page in a few moments.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl mx-auto text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl p-10 backdrop-blur-xl relative overflow-hidden"
              role="status"
              aria-live="polite"
            >
              <div
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px]"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <ShoppingBag className="w-12 h-12 text-cosmic-gold/20 mx-auto mb-6" aria-hidden="true" />
                <h2 className="text-xl md:text-2xl font-black font-montserrat text-white mb-3">
                  CATALOG OFFLINE
                </h2>
                <p className="text-white/40 max-w-sm mx-auto text-xs leading-relaxed mb-6 font-montserrat">
                  We are currently updating the ready-made catalog with next-generation blueprints
                  and modules. Please check back shortly or contact our technical team for custom
                  commissions.
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-cosmic-gold hover:bg-cosmic-gold-light text-cosmic-black text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 hover:shadow-gold-glow"
                >
                  Contact Support
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.article
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    aria-label={`${product.title} — ₹${product.price.toFixed(2)}`}
                  >
                    <CosmicCard className="group overflow-hidden p-0 h-full flex flex-col justify-between border-white/5 bg-white/[0.02]">
                      {/* Thumbnail */}
                      <div className="relative aspect-[16/10] overflow-hidden w-full bg-cosmic-black border-b border-white/5">
                        <CosmicImage
                          src={product.thumbnail}
                          alt={`${product.title} preview thumbnail`}
                          title={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div
                          className="absolute top-4 right-4 bg-cosmic-black/80 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md"
                          aria-hidden="true"
                        >
                          <span className="text-cosmic-gold text-sm font-black font-mono">
                            ₹{product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h2 className="text-xl font-bold font-montserrat text-white mb-3 group-hover:text-cosmic-gold transition-colors duration-300">
                            {product.title}
                          </h2>
                          <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6 font-montserrat line-clamp-3">
                            {product.description}
                          </p>
                          {/* Hidden price for SEO crawlers */}
                          <span className="sr-only">
                            Price: ₹{product.price.toFixed(2)} INR
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 mt-auto">
                          {product.options.includes('purchase') && (
                            <button
                              onClick={() => handleAction(product, 'purchase')}
                              aria-label={`Purchase ${product.title} for ₹${product.price.toFixed(2)}`}
                              className="w-full py-3 bg-cosmic-gold hover:bg-cosmic-gold-light text-cosmic-black font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 hover:shadow-gold-glow flex items-center justify-center gap-2"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" /> Purchase Project
                            </button>
                          )}
                          {product.options.includes('customise') && (
                            <button
                              onClick={() => handleAction(product, 'customise')}
                              aria-label={`Customise and purchase ${product.title}`}
                              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-cosmic-gold" aria-hidden="true" /> Customise & Purchase
                            </button>
                          )}
                        </div>
                      </div>
                    </CosmicCard>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>
    </>
  );
}