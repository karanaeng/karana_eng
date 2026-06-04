import { SmoothScroll } from './components/animation/SmoothScroll';
import { CosmicScene } from './components/cosmic/CosmicScene';
import ScrollToTop from './components/utils/ScrollToTop';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BuyProducts from './pages/BuyProducts';
import Checkout from './pages/Checkout';
import Works from './pages/Works';
import ServicePage from './pages/ServicePage';
import ProjectPage from './pages/ProjectPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden">
      <ScrollToTop />
      <SmoothScroll />
      <CosmicScene>
        {/* Hero elements can be passed here or handled per page */}
      </CosmicScene>

      <Navbar />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<BuyProducts />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:slug" element={<ProjectPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

