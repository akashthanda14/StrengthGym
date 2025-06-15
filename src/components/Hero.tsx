import { motion } from 'framer-motion';
import { Phone, ArrowRight, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex justify-center md:justify-start items-center pt-28 lg:pt-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748933983/ChatGPT_Image_Jun_3_2025_12_29_17_PM_e9e8ue.png"
          alt="Modern gym facility with premium equipment at Strength Gym Phillaur"
          className="w-full h-full object-cover"
          loading="eager"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#15171b] via-[#15171b]/95 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 z-10 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-snug tracking-tight">
              Transform Your Body at <br className="hidden sm:block" />
              <span className="text-[#8b0000] font-extrabold">Strength Gym</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-300 max-w-lg">
              Punjab's premier fitness center with expert training from Saurav Makkar 
              and state of the art equipment. Start your transformation today.
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <div className="flex items-center text-xs sm:text-sm text-white/80 bg-white/5 px-3 py-1.5 rounded-full">
                <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-[#8b0000]" />
                <span>30+ Premium Machines</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-white/80 bg-white/5 px-3 py-1.5 rounded-full">
                <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-[#8b0000]" />
                <span>Certified Trainers</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center bg-[#8b0000] hover:bg-[#a52a2a] text-white px-6 py-3 sm:px-7 sm:py-3.5 rounded-full font-medium sm:font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get Started now- sign up
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/signin"
                className="inline-flex items-center justify-center bg-transparent hover:bg-white/5 text-white px-6 py-3 sm:px-7 sm:py-3.5 rounded-full font-medium text-sm sm:text-base border border-white/20 transition-colors"
              >
                Existing Member? sign in
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Secondary Contact */}
            <div className="pt-2">
              <a
                href="tel:+919999363465"
                className="inline-flex items-center text-xs sm:text-sm text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                Questions? Call +91 99993 63465
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}