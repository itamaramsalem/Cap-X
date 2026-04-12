import { motion } from 'framer-motion';
import FadeIn from './FadeIn';

export default function ClosingCTA() {
  const handleAttend = (e) => {
    e.preventDefault();
    document.getElementById('speakers')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-navy py-28 px-8 md:px-16 text-center relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-gold opacity-[0.06] blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <FadeIn>
          <h2 className="font-playfair text-white text-3xl md:text-5xl font-bold mb-8 leading-tight">
            One door opened in the right moment{' '}
            <em className="text-gold" style={{ fontStyle: 'italic' }}>
              can change everything.
            </em>
          </h2>
          <p className="font-dm-sans text-white/55 text-base md:text-lg mb-12 leading-relaxed max-w-2xl mx-auto">
            Cap-X exists to create as many of those moments as possible — for every
            student, in every major, at every level. You don't apply. You just show up.
          </p>

          {/* Button with animated ring on hover */}
          <motion.a
            href="/#attend"
            onClick={handleAttend}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative inline-block bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.2em] px-12 py-5 cursor-pointer overflow-hidden group"
          >
            <span className="relative z-10">Reserve Your Seat</span>
            <span className="absolute inset-0 bg-gold-dark origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
          </motion.a>

          <p className="font-dm-sans text-white/25 text-xs mt-6 uppercase tracking-widest">
            Free · No application
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
