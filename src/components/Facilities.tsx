import { motion } from 'framer-motion';
import { Dumbbell, Heart, Users, Timer, ShieldCheck, ShowerHead as Shower, ParkingMeter as Parking, Coffee } from 'lucide-react';

export function Facilities() {
  const facilities = [
    {
      icon: Dumbbell,
      title: 'Premium Equipment',
      description: 'State-of-the-art Viva Fitness machines and free weights'
    },
    {
      icon: Heart,
      title: 'Cardio Zone',
      description: 'Modern treadmills and cardio equipment for effective workouts'
    },
    {
      icon: Users,
      title: 'Expert Training',
      description: 'Personal attention from experienced fitness trainers'
    },
    {
      icon: Timer,
      title: 'Flexible Hours',
      description: 'Open daily from 6 AM to 10 PM for your convenience'
    },
    {
      icon: ShieldCheck,
      title: 'Sanitized Environment',
      description: 'Regular cleaning and sanitization of all equipment'
    },
    {
      icon: Shower,
      title: 'Changing Rooms',
      description: 'Clean and spacious changing facilities'
    },
    {
      icon: Parking,
      title: 'Parking Space',
      description: 'Ample parking space for members'
    },
    {
      icon: Coffee,
      title: 'Refreshments',
      description: 'Access to protein shakes and healthy beverages'
    }
  ];

  return (
    <section id="facilities" className="py-20 bg-gym-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Our <span className="text-gym-yellow">Facilities</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Experience premium fitness with our state-of-the-art facilities and equipment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gym-dark-light p-6 rounded-xl hover:bg-gym-dark-light/80 transition-colors"
            >
              <facility.icon className="w-10 h-10 text-gym-yellow mb-4" />
              <h3 className="text-xl font-semibold mb-2">{facility.title}</h3>
              <p className="text-gray-400">{facility.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}