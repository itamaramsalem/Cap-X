import { motion } from 'framer-motion';
import FadeIn from './FadeIn';

export default function WhyCap() {
  const handleAttend = (e) => {
    e.preventDefault();
    document.getElementById('attend')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-cream py-24 px-8 md:px-16 border-t border-navy/10">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">Why Cap-X</p>

          <h2 className="font-playfair text-navy text-3xl md:text-5xl font-bold leading-tight mb-10">
            Most students graduate without ever having a real conversation with someone who built something.
          </h2>

          <div className="space-y-6 mb-12">
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

          <motion.a
            href="/#attend"
            onClick={handleAttend}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="relative inline-block bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] px-7 py-4 cursor-pointer overflow-hidden group"
          >
            <span className="relative z-10">Reserve My Spot</span>
            <span className="absolute inset-0 bg-gold-dark origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
          </motion.a>
        </FadeIn>
      </div>
    </section>
  );
}
