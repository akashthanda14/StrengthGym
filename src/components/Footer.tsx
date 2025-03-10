import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Youtube, href: '#' }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-gym-dark-light pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-4">
            <h3 className="text-2xl font-bold text-gym-yellow mb-4">
              STRENGTH GYM
            </h3>
            <p className="text-gray-400 mb-6">
              Your premier fitness destination in Phillaur. Transform your body and mind 
              with expert guidance and state-of-the-art equipment.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-gym-dark flex items-center justify-center text-gray-400 hover:text-gym-yellow transition-colors"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-gym-yellow transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <a href="tel:+919999363465" className="hover:text-gym-yellow transition-colors">
                  +91 99993 63465
                </a>
              </li>
              <li>
                <a href="mailto:strengthgym@gmail.com" className="hover:text-gym-yellow transition-colors">
                  strengthgym@gmail.com
                </a>
              </li>
              <li>Phillaur, Punjab - 144410</li>
              <li>Open: 6:00 AM - 10:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            © {currentYear} Strength Gym. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}