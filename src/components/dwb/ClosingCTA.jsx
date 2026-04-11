import FadeIn from './FadeIn';

export default function ClosingCTA() {
  const handleAttend = (e) => {
    e.preventDefault();
    document.getElementById('attend')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-white border-t border-black/10 py-28 px-8 md:px-16 text-center">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="font-sans font-black text-black text-3xl md:text-5xl uppercase tracking-tight leading-tight mb-8">
            One door opened in the right moment can change everything.
          </h2>
          <p className="font-sans text-black/45 text-base mb-12 leading-relaxed max-w-2xl mx-auto">
            Cap-X exists to create as many of those moments as possible — for every
            student, in every major, at every level. You don't apply. You just show up.
          </p>
          <a
            href="/#attend"
            onClick={handleAttend}
            className="inline-block bg-black text-white font-sans font-bold text-[11px] uppercase tracking-[0.15em] px-10 py-4 hover:bg-black/80 transition-colors cursor-pointer"
          >
            Reserve Your Seat
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
