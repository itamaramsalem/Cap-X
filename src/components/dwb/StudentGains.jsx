import FadeIn from './FadeIn';

const GAINS = [
  {
    title: "Perspective you can't buy",
    body: "Hear from people who've actually built, led, and invested — not from textbooks or case studies written after the fact.",
  },
  {
    title: 'Better questions',
    body: "You don't know what to ask until you've heard someone answer questions you didn't know existed.",
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
    <section id="why-come" className="bg-black border-t border-white/10 py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <p className="font-sans text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">For Students</p>
          <h2 className="font-sans font-black text-white text-3xl md:text-4xl uppercase tracking-tight leading-tight mb-14">
            What you actually<br />walk out with.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {GAINS.map(({ title, body }) => (
              <div key={title} className="bg-black p-8">
                <h3 className="font-sans text-white text-sm font-bold uppercase tracking-wide mb-3">{title}</h3>
                <p className="font-sans text-white/40 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
