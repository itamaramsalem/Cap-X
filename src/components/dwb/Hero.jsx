import { useNavigate } from 'react-router-dom';
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
    <section className="min-h-screen bg-navy flex items-center px-8 md:px-16 pt-14">
      <div className="w-full max-w-7xl mx-auto relative">

        {/* Cap-X — floated top-right of the content block */}
        <FadeIn>
          <h1 className="font-playfair text-white font-bold leading-none absolute -top-10 left-8 hidden md:block">
            <span className="text-[clamp(4rem,10vw,9rem)]">
              Cap-<em className="text-gold" style={{ fontStyle: 'italic' }}>X</em>
            </span>
          </h1>
        </FadeIn>

        {/* Headline + content */}
        <FadeIn delay={0.1} className="max-w-2xl pt-32 md:pt-48">
          {/* Mobile-only Cap-X */}
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
            <a
              href="/#attend"
              onClick={handleAttend}
              className="bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] px-7 py-4 hover:bg-gold-dark transition-colors cursor-pointer"
            >
              Attend a Session
            </a>
            <span className="font-dm-sans text-white/40 text-sm">
              Free &nbsp;·&nbsp; Open to every major.
            </span>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
