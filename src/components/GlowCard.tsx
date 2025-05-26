import { motion } from 'framer-motion';

interface GlowCardProps {
  children: React.ReactNode;
  index: number;
}

const GlowCard = ({ children, index }: GlowCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative mb-6 group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};

export default GlowCard;