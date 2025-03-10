import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function Pricing() {
  const plans = [
    {
      duration: '1 Month',
      price: '₹2,000',
      features: [
        'Full gym access',
        'Fitness consultation',
        'Basic workout plan',
        'Access to cardio area'
      ]
    },
    {
      duration: '3 Months',
      price: '₹3,500',
      features: [
        'All monthly plan features',
        'Personal training session',
        'Diet consultation',
        'Locker access'
      ]
    },
    {
      duration: '6 Months',
      price: '₹6,000',
      popular: true,
      features: [
        'All quarterly plan features',
        'Weekly training sessions',
        'Nutrition planning',
        'Progress tracking'
      ]
    },
    {
      duration: '12 Months',
      price: '₹10,000',
      features: [
        'All 6-month plan features',
        'Priority booking',
        'Nutrition planning',
        'Guest passes'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gym-dark-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Membership <span className="text-gym-yellow">Plans</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your fitness journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-gym-dark p-8 rounded-2xl border-2 ${
                plan.popular ? 'border-gym-yellow' : 'border-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gym-yellow text-gym-dark px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="text-gray-400 mb-4">{plan.duration}</div>
                <div className="text-4xl font-bold mb-2">{plan.price}</div>
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-gym-yellow mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="tel:+919999363465"
                className={`mt-8 block text-center py-3 px-6 rounded-xl transition-colors ${
                  plan.popular
                    ? 'bg-gym-yellow text-gym-dark hover:bg-gym-yellow/90'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Get Started
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}