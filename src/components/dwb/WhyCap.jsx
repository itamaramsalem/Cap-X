import { motion } from 'framer-motion';
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

// Cards alternate: left / right / up across the 3-column grid
const CARD_DIRECTIONS = ['left', 'up', 'right', 'right', 'up', 'left'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function FlipCard({ title, body, direction = 'up' }) {
  const initial = direction === 'left'  ? { opacity: 0, x: -50 }
                : direction === 'right' ? { opacity: 0, x: 50 }
                :                         { opacity: 0, y: 40 };
  const visible = direction === 'left'  ? { opacity: 1, x: 0 }
                : direction === 'right' ? { opacity: 1, x: 0 }
                :                         { opacity: 1, y: 0 };

  return (
    <motion.div
      variants={{ hidden: initial, visible: { ...visible, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } } }}
      className="h-48 group"
      style={{ perspective: '1200px' }}
    >
      <div
        className="relative w-full h-full [transform-style:preserve-3d] [transition:transform_0.65s_ease] group-hover:[transform:rotateY(180deg)]"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute inset-0 bg-navy flex items-center justify-center p-7 border border-white/10 [backface-visibility:hidden]">
          <h3 className="font-dm-sans text-white text-lg font-bold text-center leading-snug">{title}</h3>
        </div>
        <div className="absolute inset-0 bg-white flex items-center p-7 border border-gold/40 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="font-dm-sans text-navy text-sm leading-relaxed">{body}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function WhyCap() {
  const handleAttend = (e) => {
    e.preventDefault();
    document.getElementById('speakers')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="why-come" className="bg-cream py-24 px-8 md:px-16 border-t border-navy/10">
      <div className="max-w-7xl mx-auto">

        {/* Label — slides in from left */}
        <FadeIn direction="left">
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">Why Cap-X</p>
        </FadeIn>

        {/* Headline — slides in from left, slightly delayed */}
        <FadeIn direction="left" delay={0.05}>
          <h2 className="font-playfair text-navy text-3xl md:text-5xl font-bold leading-tight mb-10 max-w-4xl">
            Most students graduate without ever having a real conversation with someone who built something.
          </h2>
        </FadeIn>

        {/* Body paragraphs — slide in from right */}
        <FadeIn direction="right" delay={0.1}>
          <div className="space-y-6 mb-12 max-w-4xl">
            <p className="font-dm-sans text-muted-text text-base leading-relaxed">
              At Cap X, you get access to people most students never hear from. Entrepreneurs, executives,
              and professionals come in and talk about what they actually went through, the risks they took,
              what failed, and what finally worked after years of figuring it out. You are not just listening,
              you are putting yourself in the room with people and opportunities that most people never get near.
            </p>
            <p className="font-dm-sans text-muted-text text-base leading-relaxed">
              What happens next is completely up to you. You can sit there and just listen, or you can use it
              to change how you think, who you talk to, and what you go after. We are only opening the door,
              whether you walk through it or not is on you.
            </p>
            <p className="font-dm-sans text-muted-text text-base leading-relaxed">
              The goal is simple. One conversation can push someone to take action, start something, learn
              something new, or reach out to someone they would have never approached before. That moment is
              there, but only for the people who decide to show up and take it seriously.
            </p>
          </div>
        </FadeIn>

        {/* CTA — scale in */}
        <FadeIn direction="scale" delay={0.15}>
          <motion.a
            href="/#speakers"
            onClick={handleAttend}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="relative inline-block bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] px-7 py-4 cursor-pointer overflow-hidden group mb-20"
          >
            <span className="relative z-10">Reserve My Spot</span>
            <span className="absolute inset-0 bg-gold-dark origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
          </motion.a>
        </FadeIn>

        {/* "What You Stand to Gain" heading */}
        <FadeIn direction="left">
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-4">For Students</p>
          <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold mb-14 leading-tight">
            What You Stand to Gain.
          </h2>
        </FadeIn>

        {/* Cards — alternate left/up/right */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {GAINS.map(({ title, body }, i) => (
            <FlipCard key={title} title={title} body={body} direction={CARD_DIRECTIONS[i]} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
