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
    <section className="min-h-screen bg-white flex flex-col pt-14">
      {/* Bull emblem — large, centered, bleed to top */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <FadeIn>
          <img
            src="/capx-bull.jpg"
            alt="Cap-X"
            className="w-56 md:w-80 select-none"
            style={{ mixBlendMode: 'multiply' }}
          />
        </FadeIn>
      </div>

      {/* Bottom content block */}
      <div className="border-t border-black/10 grid grid-cols-1 md:grid-cols-2">
        {/* Left — headline */}
        <div className="px-8 md:px-16 py-12 border-b md:border-b-0 md:border-r border-black/10">
          <FadeIn>
            <h1 className="font-sans font-black text-black text-4xl md:text-5xl leading-tight uppercase tracking-tight mb-6">
              Where Students Meet<br />
              <span className="text-black/40">Industry Leaders</span>
            </h1>
            <div className="flex items-center gap-6 flex-wrap">
              <a
                href="/#attend"
                onClick={handleAttend}
                className="bg-black text-white font-sans font-bold text-[11px] uppercase tracking-[0.15em] px-7 py-4 hover:bg-black/80 transition-colors cursor-pointer"
              >
                Attend a Session
              </a>
              <span className="font-sans text-black/35 text-xs tracking-wide">
                Free · Open to every major.
              </span>
            </div>
          </FadeIn>
        </div>

        {/* Right — subtitle */}
        <div className="px-8 md:px-16 py-12 flex items-center">
          <FadeIn delay={0.1}>
            <p className="font-sans text-black/50 text-base leading-relaxed max-w-sm">
              Cap-X connects ambitious students with senior professionals across finance, tech,
              consulting, and entrepreneurship — through intimate speaker series and curated networking.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
