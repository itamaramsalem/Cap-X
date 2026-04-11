import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

export default function Hero() {
  const navigate = useNavigate();

  const handleAttend = (e) => {
    e.preventDefault();
    const el = document.getElementById('attend');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#attend');
    }
  };

  return (
    <section className="min-h-screen bg-white flex flex-col pt-14">

      {/* ── Bull emblem — fills remaining vertical space ── */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden min-h-[50vh]">
        <motion.img
          src="/capx-bull.jpg"
          alt="Cap-X"
          className="w-52 md:w-72 lg:w-80 select-none"
          style={{ mixBlendMode: 'multiply' }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
        />
      </div>

      {/* ── Bottom content — two-column panel ── */}
      <div className="border-t border-black/10 grid grid-cols-1 md:grid-cols-2">

        {/* Left — headline + CTA */}
        <div className="px-8 md:px-16 py-12 border-b md:border-b-0 md:border-r border-black/10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          >
            <h1 className="font-sans font-black text-black text-4xl md:text-5xl leading-[1.05] uppercase tracking-tight mb-8">
              Where Students<br />Meet{' '}
              <span className="text-black/30">Industry<br />Leaders</span>
            </h1>
            <div className="flex items-center gap-6 flex-wrap">
              <motion.a
                href="/#attend"
                onClick={handleAttend}
                whileHover={{ backgroundColor: '#222' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="inline-block bg-black text-white font-sans font-bold text-[11px] uppercase tracking-[0.15em] px-7 py-4 cursor-pointer"
                style={{ display: 'inline-block' }}
              >
                Attend a Session
              </motion.a>
              <span className="font-sans text-black/30 text-xs tracking-wide">
                Free · Every major.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right — description + scroll hint */}
        <div className="px-8 md:px-16 py-12 flex flex-col justify-between gap-8">
          <motion.p
            className="font-sans text-black/40 text-sm leading-relaxed max-w-sm"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
          >
            Cap-X connects ambitious students with senior professionals across finance,
            tech, consulting, and entrepreneurship — through intimate speaker series
            and curated networking.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="hidden md:flex items-center gap-3 self-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <span className="font-sans text-black/20 text-[9px] uppercase tracking-[0.3em]">
              Scroll
            </span>
            <motion.div
              className="w-6 h-px bg-black/20"
              animate={{ scaleX: [1, 1.6, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              style={{ originX: 0 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
