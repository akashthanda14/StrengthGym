import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MapPin } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      {/* Top Bar */}
      <div className="bg-gym-dark py-2">
        <div className="container mx-auto px-4">
          <div className="hidden lg:flex justify-between items-center">
            <div className="flex space-x-8">
              <div className="flex items-center text-gray-300 hover:text-gym-yellow transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+91 99993 63465</span>
              </div>
              <div className="flex items-center text-gray-300 hover:text-gym-yellow transition-colors">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Phillaur, Punjab - 144410</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`bg-gym-dark-light/95 backdrop-blur-md  transition-all duration-300`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#home" className="text-2xl font-bold text-gym-yellow">
              <img style={{height:90}} src="https://res.cloudinary.com/dmt4dj8ft/image/upload/v1741628295/gymlogo_cgqsiv.svg" alt="logo" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white  hover:text-gym-yellow transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="tel:+919999363465"
                className="bg-gym-yellow text-gym-dark px-6 py-2 rounded-full font-medium hover:bg-gym-yellow/90 transition-colors"
              >
                Call Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-white text-center hover:text-gym-yellow transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                  <a
                    href="tel:+919999363465"
                    className="bg-gym-yellow text-gym-dark px-6 py-2 rounded-full font-medium hover:bg-gym-yellow/90 transition-colors text-center"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}