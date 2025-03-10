import { motion } from 'framer-motion';
import { Award, Clock, Users, Dumbbell } from 'lucide-react';

export function About() {
  const stats = [
    { icon: Award, label: 'Experience', value: '12+ Years' },
    { icon: Users, label: 'Happy Clients', value: '1000+' },
    { icon: Clock, label: 'Open Hours', value: '6am - 10pm' },
    { icon: Dumbbell, label: 'Equipment', value: 'Viva Fitness' },
  ];

  return (
    <section id="about" className="py-20 bg-gym-dark-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1605296867424-35fc25c9212a?auto=format&fit=crop&q=80"
              alt="Saurav Makkar - Fitness Trainer"
              className="rounded-2xl w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gym-dark-light via-transparent to-transparent rounded-2xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              About <span className="text-gym-yellow">Strength Gym</span>
            </h2>
            
            <p className="text-gray-300">
              Led by expert trainer Saurav Makkar with over 12 years of experience, 
              Strength Gym is Phillaur's premier fitness destination. Our facility 
              features top-of-the-line Viva Fitness equipment and provides personalized 
              training programs for all fitness levels.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gym-dark p-6 rounded-xl"
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