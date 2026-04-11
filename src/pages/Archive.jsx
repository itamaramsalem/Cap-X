import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { PAST_SPEAKERS } from '../lib/speakers';

export default function Archive() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-navy/10 flex items-center px-8 h-14">
        <Link to="/" className="font-playfair text-navy text-lg font-bold tracking-wide">
          Cap-X
        </Link>
        <div className="w-px h-4 bg-navy/20 mx-5" />
        <span className="font-dm-sans text-navy/50 text-xs uppercase tracking-[0.2em]">Speaker Archive</span>
        <div className="flex-1" />
        <Link
          to="/"
          className="font-dm-sans text-navy/50 text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:text-navy transition-colors"
        >
          <X size={14} />
          Close
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">Past Sessions</p>
        <h1 className="font-playfair text-navy text-5xl md:text-6xl font-bold mb-5">Speaker Archive</h1>
        <p className="font-dm-sans text-muted-text text-base leading-relaxed mb-16 max-w-xl">
          Every session leaves something behind. Here's who came before — and what
          they left with the room.
        </p>

        {PAST_SPEAKERS.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-dm-sans text-muted-text text-sm">No past sessions yet — check back after our first event.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAST_SPEAKERS.map(speaker => (
              <div key={speaker.id} className="bg-white p-6 border border-navy/10">
                <p className="font-playfair text-navy text-xl font-bold">{speaker.name}</p>
                <p className="font-dm-sans text-muted-text text-sm mt-1">{speaker.title}</p>
                {speaker.sector && (
                  <span className="inline-block mt-3 font-dm-sans text-gold text-xs uppercase tracking-widest border border-gold/30 px-2.5 py-0.5">
                    {speaker.sector}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
