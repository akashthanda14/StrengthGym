import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex justify-center md:justify-start items-center pt-32 lg:pt-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80"
          alt="Gym Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gym-dark via-gym-dark/95 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Transform Your Body at{' '}
              <span className="text-gym-yellow">Strength Gym</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
              Join the premier fitness center in Phillaur. Expert training with Saurav Makkar 
              and premium Viva Fitness equipment for your fitness journey.
            </p>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 pt-4">
              <a
                href="tel:+919999363465"
                className="inline-flex items-center justify-center bg-gym-yellow hover:bg-gym-yellow/90 text-gym-dark px-8 py-4 rounded-full font-semibold transition-colors group"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
              
              <a
  href="https://wa.me/+919999363465"
  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold transition-colors group"
>
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
    alt="WhatsApp" 
    className="w-6 h-6 mr-2"
  />
  Join on WhatsApp
  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
</a>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
