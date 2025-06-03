import { motion, AnimatePresence } from 'framer-motion';
import { Award, Clock, Users, Dumbbell } from 'lucide-react';
import { useState, useEffect } from 'react';

export function About() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    'https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748935617/gym-3_q6wbyt.jpg',
    'https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748935617/gym-2_fpzznw.jpg',
    'https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748935617/gym-1_trcmpa.jpg',
    'https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748936017/gym-6_swva0l.jpg',
    'https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748936016/gym-4_wuyuq8.jpg',
    'https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748936016/gym-5_xfgwom.jpg'
  ];

  const stats = [
    { icon: Award, label: 'Experience', value: '12+ Years' },
    { icon: Users, label: 'Happy Clients', value: '1000+' },
    { icon: Clock, label: 'Open Hours', value: '6am - 10pm' },
    { icon: Dumbbell, label: 'Equipment', value: 'Viva Fitness' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-20 bg-gym-dark-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center lg:grid lg:grid-cols-2 gap-12">
          {/* Image Slideshow */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-md mx-auto h-[500px] overflow-hidden rounded-2xl"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`Gym Image ${currentImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-gym-dark-light via-transparent to-transparent" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6 w-full"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              About <span className="text-gym-yellow">Strength Gym</span>
            </h2>
            
            <p className="text-gray-300 max-w-lg">
              Led by expert trainer Saurav Makkar with over 12 years of experience, 
              Strength Gym is Phillaur's premier fitness destination. Our facility 
              features top-of-the-line Viva Fitness equipment and provides personalized 
              training programs for all fitness levels.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gym-dark p-6 rounded-xl flex flex-col items-center w-full max-w-xs mx-auto"
                >
                  <stat.icon className="w-8 h-8 text-gym-yellow mb-3" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}