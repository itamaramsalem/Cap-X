import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../api/apiClient';

export default function Hero() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Each layer gets its own rate — short input range = immediate response
  const gridY        = useTransform(scrollY, [0, 600], [0, 180]);
  const blob1Y       = useTransform(scrollY, [0, 400], [0, 320]);   // shoots down fast
  const blob2Y       = useTransform(scrollY, [0, 600], [0, -80]);   // rises (opposite direction)
  const blob3Y       = useTransform(scrollY, [0, 500], [0, 140]);
  const bigTitleY    = useTransform(scrollY, [0, 600], [0, -24]);   // barely moves — "stuck" to bg
  const bigTitleOp   = useTransform(scrollY, [0, 280], [1, 0]);
  const contentY     = useTransform(scrollY, [0, 600], [0, -130]);  // content rushes up
  const quoteY       = useTransform(scrollY, [0, 600], [0, -60]);   // quote drifts at own rate
  const quoteX       = useTransform(scrollY, [0, 400], [0, 50]);
  const quoteOp      = useTransform(scrollY, [0, 220], [1, 0]);
  const indicatorOp  = useTransform(scrollY, [0, 120], [1, 0]);

  const handleAttend = (e) => {
    e.preventDefault();
    const el = document.getElementById('speakers');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#speakers');
    }
  };

  const { data: rsvpCount } = useQuery({
    queryKey: ['rsvp-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count ?? 0;
    },
    refetchInterval: 30_000,
    staleTime: 30_000,
  });

  return (
    <section
      className="min-h-screen bg-navy flex items-center px-8 md:px-16 relative overflow-hidden"
      style={{ paddingTop: 'calc(var(--bar-h, 0px) + 56px)' }}
    >
      {/* ── Layer 0: dot grid (slowest) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(201,168,76,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          y: gridY,
        }}
      />

      {/* ── Layer 1: blobs (each at different speed/direction) ── */}
      <motion.div
        className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full bg-gold opacity-[0.07] blur-[130px] pointer-events-none"
        style={{ y: blob1Y }}
      />
      <motion.div
        className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full bg-gold opacity-[0.04] blur-[80px] pointer-events-none"
        style={{ y: blob2Y }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-gold opacity-[0.03] blur-[100px] pointer-events-none"
        style={{ y: blob3Y }}
      />

      {/* ── Layer 2: large "Cap-X" title — barely moves, fades out ── */}
      <motion.h1
        className="font-playfair text-white font-bold leading-none absolute top-[calc(var(--bar-h,0px)+70px)] left-8 hidden md:block pointer-events-none"
        style={{ y: bigTitleY, opacity: bigTitleOp }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <span className="text-[clamp(4rem,10vw,9rem)]">
          Cap-<em className="text-gold" style={{ fontStyle: 'italic' }}>X</em>
        </span>
      </motion.h1>

      {/* ── Layer 3: main content — moves up fastest ── */}
      <motion.div className="w-full max-w-7xl mx-auto relative" style={{ y: contentY }}>
        <div className="pt-32 md:pt-48">

          {/* Mobile Cap-X */}
          <motion.h1
            className="font-playfair text-white font-bold leading-none mb-6 md:hidden"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="text-[clamp(4rem,16vw,7rem)]">
              Cap-<em className="text-gold" style={{ fontStyle: 'italic' }}>X</em>
            </span>
          </motion.h1>

          <div className="flex flex-col md:flex-row md:items-start md:gap-16">
            {/* Left — headline + content */}
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h2 className="font-playfair text-white text-3xl md:text-5xl font-bold leading-tight mb-6">
                Where Students Meet{' '}
                <em className="text-gold" style={{ fontStyle: 'italic' }}>Industry Leaders</em>
              </h2>

              <p className="font-dm-sans text-white/55 text-base max-w-xl mb-10 leading-relaxed">
                Cap-X connects ambitious students with senior professionals across finance, tech,
                consulting, and entrepreneurship — through intimate speaker series and curated networking.
              </p>

              <div className="flex items-center gap-6 flex-wrap">
                <motion.a
                  href="/#attend"
                  onClick={handleAttend}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="relative inline-block bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] px-7 py-4 cursor-pointer overflow-hidden group"
                >
                  <span className="relative z-10">Attend a Session</span>
                  <span className="absolute inset-0 bg-gold-dark origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
                </motion.a>
                <span className="font-dm-sans text-white/40 text-sm">
                  Free &nbsp;·&nbsp; Open to every major.
                </span>
              </div>

              {rsvpCount != null && rsvpCount > 0 && (
                <p className="font-dm-sans text-white/30 text-xs mt-5">
                  {rsvpCount} student{rsvpCount !== 1 ? 's' : ''} have already pre-registered
                </p>
              )}
            </motion.div>

            {/* ── Layer 4: quote — its own parallax ── */}
            <motion.div
              className="hidden md:flex items-center justify-center self-center flex-1 mt-2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              style={{ y: quoteY, x: quoteX, opacity: quoteOp }}
            >
              <p className="font-playfair text-white/30 text-3xl lg:text-4xl xl:text-5xl leading-relaxed text-center" style={{ fontStyle: 'italic' }}>
                "It's not what you know,<br />it's who you know"
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator — fades out immediately on scroll ── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7, ease: 'easeOut' }}
        style={{ opacity: indicatorOp }}
      >
        <span className="font-dm-sans text-white/25 text-[9px] uppercase tracking-[0.3em]">Scroll</span>
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
