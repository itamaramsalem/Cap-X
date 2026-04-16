import { motion } from 'framer-motion';

const INITIAL = {
  up:    { opacity: 0, y: 36 },
  down:  { opacity: 0, y: -36 },
  left:  { opacity: 0, x: -48 },
  right: { opacity: 0, x: 48 },
  scale: { opacity: 0, scale: 0.93 },
};

const ANIMATE = {
  up:    { opacity: 1, y: 0 },
  down:  { opacity: 1, y: 0 },
  left:  { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
};

export default function FadeIn({ children, delay = 0, className = '', direction = 'up' }) {
  return (
    <motion.div
      initial={INITIAL[direction]}
      whileInView={ANIMATE[direction]}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
