import FadeIn from './FadeIn';

export default function Problem() {
  return (
    <section className="bg-cream py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-4">The Problem</p>
          <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold mb-6">
            The Gap Between Campus and Career
          </h2>
          <p className="font-dm-sans text-muted-text text-lg leading-relaxed max-w-2xl mx-auto">
            Textbooks teach theory. Internships start too late. Most students graduate without ever
            having a real conversation with a senior professional in their field — and that gap costs
            them years of career momentum.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
