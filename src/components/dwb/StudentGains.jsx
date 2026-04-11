import FadeIn from './FadeIn';

const GAINS = [
  {
    title: 'Perspective you can\'t buy',
    body: 'Hear from people who\'ve actually built, led, and invested — not from textbooks or case studies written after the fact.',
  },
  {
    title: 'Better questions',
    body: 'You don\'t know what to ask until you\'ve heard someone answer questions you didn\'t know existed.',
  },
  {
    title: 'Real connections',
    body: 'Select sessions include a structured networking window — real facetime with people who can open doors.',
  },
  {
    title: 'Career clarity',
    body: 'Understanding what different careers actually look like day-to-day helps you stop guessing and start choosing.',
  },
  {
    title: 'Professional confidence',
    body: 'Learning to ask good questions, hold a conversation, and show up in a room — skills no class teaches.',
  },
  {
    title: 'Tangible opportunities',
    body: 'Speakers have hired, mentored, and invested in students they met at sessions like these.',
  },
];

export default function StudentGains() {
  return (
    <section id="why-come" className="bg-cream py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-4">For Students</p>
          <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold mb-14 leading-tight">
            What you actually walk out with.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAINS.map(({ title, body }) => (
              <div key={title} className="bg-white p-7 border border-border">
                <h3 className="font-dm-sans text-navy text-sm font-semibold mb-3">{title}</h3>
                <p className="font-dm-sans text-muted-text text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
