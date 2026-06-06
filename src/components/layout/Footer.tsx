import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-cosmic-black pt-20 pb-10 px-6 border-t border-cosmic-gold/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16 px-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <img
                src="/karana-logo.png"
                alt="Karana Engineering"
                className="h-14 w-auto max-w-[220px] object-contain"
              />
            </div>
            <p className="text-white/50 font-montserrat text-sm leading-relaxed mb-8 md:max-w-[420px]">
              An elite multidisciplinary engineering and technology agency pushing the boundaries of what's possible.
            </p>
          </div>

          <div className="md:col-start-4 md:col-span-1">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Works', 'Services', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="text-white/50 hover:text-cosmic-gold transition-colors duration-300 text-sm font-montserrat">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-start-5 md:col-span-1">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contactkaranaagency@gmail.com" className="flex items-center gap-3 text-white/50 hover:text-cosmic-gold transition-colors duration-300 text-sm font-montserrat">
                  <Mail size={16} /> contactkaranaagency@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+917569274373" className="flex items-center gap-3 text-white/50 hover:text-cosmic-gold transition-colors duration-300 text-sm font-montserrat">
                  <Phone size={16} /> +91 75692 74373
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm font-montserrat">
                <MapPin size={16} /> Amaravati, India
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs font-montserrat">
            © {new Date().getFullYear()} KARANA Engineering. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/30 font-montserrat">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
