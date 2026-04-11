import FadeIn from './FadeIn';

export default function ClosingCTA() {
  const handleAttend = (e) => {
    e.preventDefault();
    document.getElementById('attend')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-navy py-28 px-8 md:px-16 text-center">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="font-playfair text-white text-3xl md:text-5xl font-bold mb-8 leading-tight">
            One door opened in the right moment can change everything.
          </h2>
          <p className="font-dm-sans text-white/55 text-base md:text-lg mb-12 leading-relaxed max-w-2xl mx-auto">
            Cap-X exists to create as many of those moments as possible — for every
            student, in every major, at every level. You don't apply. You just show up.
          </p>
          <a
            href="/#attend"
            onClick={handleAttend}
            className="inline-block bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] px-10 py-4 hover:bg-gold-dark transition-colors cursor-pointer"
          >
            Reserve Your Seat
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
