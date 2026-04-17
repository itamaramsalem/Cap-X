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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function FlipCard({ title, body }) {
  return (
    <motion.div variants={cardVariants} className="h-48 group" style={{ perspective: '1200px' }}>
      <div
        className="relative w-full h-full [transform-style:preserve-3d] [transition:transform_0.6s_ease] group-hover:[transform:rotateY(180deg)]"
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

        {/* Why Cap-X narrative */}
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">Why Cap-X</p>
          <h2 className="font-playfair text-navy text-3xl md:text-5xl font-bold leading-tight mb-10 max-w-4xl">
            Most students graduate without ever having a real conversation with someone who actually built something. Don't be most students.
          </h2>
          <div className="space-y-6 mb-12 max-w-4xl">
            <p className="font-dm-sans text-muted-text text-base leading-relaxed">
              Cap-X is changing this. We bring executives, founders, and professionals into the room
              and let students ask them anything — the real questions, the ones professors can't answer.
              One conversation with the right person can shift your entire trajectory.
            </p>
          </div>
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

        {/* What You Stand to Gain — flip cards */}
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-4">For Students</p>
          <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold mb-14 leading-tight">
            What You Stand to Gain.
          </h2>
        </FadeIn>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {GAINS.map(({ title, body }) => (
            <FlipCard key={title} title={title} body={body} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
