import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FadeIn from './FadeIn';

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
    <section className="min-h-screen bg-navy flex items-center px-8 md:px-16 pt-14 relative overflow-hidden">

      {/* ── Background layers ── */}

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(201,168,76,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient glow — top-right */}
      <div className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full bg-gold opacity-[0.07] blur-[130px] pointer-events-none" />
      {/* Ambient glow — bottom-left */}
      <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full bg-gold opacity-[0.04] blur-[80px] pointer-events-none" />

      {/* ── Content ── */}
      <div className="w-full max-w-7xl mx-auto relative">

        {/* Large "Cap-X" — desktop only, floated top-left of content */}
        <FadeIn>
          <h1 className="font-playfair text-white font-bold leading-none absolute -top-10 left-8 hidden md:block">
            <span className="text-[clamp(4rem,10vw,9rem)]">
              Cap-<em className="text-gold" style={{ fontStyle: 'italic' }}>X</em>
            </span>
          </h1>
        </FadeIn>

        {/* Headline + body */}
        <FadeIn delay={0.1} className="max-w-2xl pt-32 md:pt-48">

          {/* Mobile Cap-X */}
          <h1 className="font-playfair text-white font-bold leading-none mb-6 md:hidden">
            <span className="text-[clamp(4rem,16vw,7rem)]">
              Cap-<em className="text-gold" style={{ fontStyle: 'italic' }}>X</em>
            </span>
          </h1>

          <h2 className="font-playfair text-white text-3xl md:text-5xl font-bold leading-tight mb-6">
            Where Students Meet{' '}
            <em className="text-gold" style={{ fontStyle: 'italic' }}>Industry Leaders</em>
          </h2>

          <p className="font-dm-sans text-white/55 text-base max-w-xl mb-10 leading-relaxed">
            Cap-X connects ambitious students with senior professionals across finance, tech,
            consulting, and entrepreneurship — through intimate speaker series and curated networking.
          </p>

          <div className="flex items-center gap-6 flex-wrap">
            {/* Gold CTA button with framer-motion press + CSS shimmer overlay */}
            <motion.a
              href="/#attend"
              onClick={handleAttend}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="relative inline-block bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] px-7 py-4 cursor-pointer overflow-hidden group"
            >
              <span className="relative z-10">Attend a Session</span>
              {/* Slide-in dark overlay on hover */}
              <span className="absolute inset-0 bg-gold-dark origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
            </motion.a>

            <span className="font-dm-sans text-white/40 text-sm">
              Free &nbsp;·&nbsp; Open to every major.
            </span>
          </div>
        </FadeIn>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7, ease: 'easeOut' }}
      >
        <span className="font-dm-sans text-white/25 text-[9px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-gold opacity-60"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
      </motion.div>

    </section>
  );
}
