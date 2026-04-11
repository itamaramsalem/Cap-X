import { motion } from 'framer-motion';

// Expo-out easing — fast initial movement, silky settle (same curve OpenAI uses)
const EASE = [0.16, 1, 0.3, 1];

export default function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
