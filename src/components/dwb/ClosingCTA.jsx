import { motion } from 'framer-motion';
import FadeIn from './FadeIn';

export default function ClosingCTA() {
  const handleAttend = (e) => {
    e.preventDefault();
    document.getElementById('attend')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-white border-t border-black/10 py-32 px-8 md:px-16">
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn>
          <h2 className="font-sans font-black text-black text-3xl md:text-5xl uppercase tracking-tight leading-tight mb-8">
            One door opened in the right moment{' '}
            <span className="text-black/25">can change everything.</span>
          </h2>
          <p className="font-sans text-black/40 text-base mb-12 leading-relaxed max-w-xl mx-auto">
            Cap-X exists to create as many of those moments as possible — for every
            student, in every major, at every level. You don't apply. You just show up.
          </p>

          <div className="flex flex-col items-center gap-4">
            <motion.a
              href="/#attend"
              onClick={handleAttend}
              whileHover={{ backgroundColor: '#222' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="inline-block bg-black text-white font-sans font-bold text-[11px] uppercase tracking-[0.2em] px-12 py-5 cursor-pointer"
              style={{ display: 'inline-block' }}
            >
              Reserve Your Seat
            </motion.a>
            <span className="font-sans text-black/20 text-[10px] uppercase tracking-widest">
              Free · No application required
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
