import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Buy Products', path: '/buy' },
  { name: 'Previous Works', path: '/works' },
  { name: 'About', path: '/about' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
      scrolled ? "bg-cosmic-black/80 backdrop-blur-md py-3 border-b border-cosmic-gold/20" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center group" aria-label="Karana Engineering home">
          <img
            src="/karana-logo.png"
            alt="Karana Engineering"
            className="h-12 w-auto max-w-[190px] object-contain transition-opacity duration-300 group-hover:opacity-90 md:h-14 md:max-w-[230px]"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium font-montserrat uppercase tracking-widest transition-all duration-300 hover:text-cosmic-gold",
                location.pathname === link.path ? "text-cosmic-gold" : "text-white/70"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            className="px-5 py-2 bg-cosmic-gold text-cosmic-black font-bold rounded-full text-sm hover:bg-cosmic-gold-light transition-all duration-300 hover:shadow-gold-glow"
          >
            Contact Us
          </Link>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "absolute top-full left-0 right-0 bg-cosmic-black/95 backdrop-blur-xl transition-all duration-300 ease-in-out border-b border-cosmic-gold/20 overflow-hidden",
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-lg font-medium font-montserrat flex items-center justify-between group",
                location.pathname === link.path ? "text-cosmic-gold" : "text-white/70"
              )}
            >
              {link.name}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="w-full py-4 bg-cosmic-gold text-cosmic-black text-center font-bold rounded-xl"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
};
