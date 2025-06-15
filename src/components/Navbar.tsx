import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MapPin } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed w-full z-50 ${scrolled ? 'backdrop-blur-md bg-[#15171b]/90 shadow-lg' : 'bg-[#15171b]/80'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="z-50">
            <img 
              src="https://res.cloudinary.com/dmt4dj8ft/image/upload/v1741628295/gymlogo_cgqsiv.svg" 
              alt="Strength Gym Logo"
              className="h-16" 
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="text-white hover:text-[#8b0000] transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-[#8b0000] text-white px-4 py-2 rounded-full hover:bg-[#a52a2a] transition-colors"
            >
              Join Now
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white z-50"
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden fixed inset-0 bg-[#15171b] pt-20 px-4 flex flex-col items-center space-y-6"
              >
                {links.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-white text-xl hover:text-[#8b0000]"
                  >
                    {link.name}
                  </a>
                ))}
                <a
                  href="#contact"
                  className="bg-[#8b0000] text-white px-6 py-3 rounded-full text-lg mt-4"
                >
                  Get Started
                </a>

                {/* Contact Info */}
                <div className="absolute bottom-8 flex flex-col items-center gap-4 text-white/80">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+91 99993 63465</span>
                  </div>
                  <div className="flex items-center text-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Phillaur, Punjab</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}