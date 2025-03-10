import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 99993 63465',
      href: 'tel:+919999363465'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'strengthgym@gmail.com',
      href: 'mailto:strengthgym@gmail.com'
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Phillaur, Punjab - 144410',
      href: 'https://maps.google.com/?q=Phillaur,Punjab'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: '6:00 AM - 10:00 PM',
      href: '#'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gym-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Contact <span className="text-gym-yellow">Us</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Get in touch with us for any inquiries or to start your fitness journey
          </p>
        </motion.div>

        {/* Centering for Mobile View */}
        <div className="flex flex-col items-center md:grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="flex flex-col items-center w-full max-w-md gap-6">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gym-dark-light p-6 rounded-xl hover:bg-gym-dark-light/80 transition-colors w-full max-w-xs text-center"
              >
                <info.icon className="w-8 h-8 text-gym-yellow mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                <p className="text-gray-400">{info.content}</p>
              </motion.a>
            ))}
          </div>

          {/* Centering Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md flex justify-center"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27573.892290407078!2d75.77388!3d31.02506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5a5747a8c4b1%3A0xea7c44e43cb6c29a!2sPhillaur%2C%20Punjab!5e0!3m2!1sen!2sin!4v1709348799675!5m2!1sen!2sin"
              width="100%"
              height="400px"
              className="rounded-xl"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
