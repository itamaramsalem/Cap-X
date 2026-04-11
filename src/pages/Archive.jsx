import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { PAST_SPEAKERS } from '../lib/speakers';

export default function Archive() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10 flex items-center px-8 h-14">
        <Link to="/" className="font-sans text-black font-black text-base uppercase tracking-[0.08em] mr-6">
          CAP-X
        </Link>
        <div className="w-px h-4 bg-black/15 mx-2" />
        <span className="font-sans text-black/35 text-[10px] font-semibold uppercase tracking-[0.2em]">Speaker Archive</span>
        <div className="flex-1" />
        <Link
          to="/"
          className="font-sans text-black/35 text-[10px] font-semibold uppercase tracking-[0.15em] flex items-center gap-2 hover:text-black transition-colors"
        >
          <X size={12} />
          Close
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-8 pt-32 pb-24">
        <p className="font-sans text-black/35 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">Past Sessions</p>
        <h1 className="font-sans font-black text-black text-5xl md:text-6xl uppercase tracking-tight mb-5">Speaker Archive</h1>
        <p className="font-sans text-black/45 text-base leading-relaxed mb-16 max-w-xl">
          Every session leaves something behind. Here's who came before — and what
          they left with the room.
        </p>

        {PAST_SPEAKERS.length === 0 ? (
          <div className="border border-black/10 py-24 text-center">
            <p className="font-sans text-black/30 text-sm uppercase tracking-wider">No past sessions yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
            {PAST_SPEAKERS.map(speaker => (
              <div key={speaker.id} className="bg-white p-8">
                <p className="font-sans text-black font-bold text-base uppercase tracking-wide">{speaker.name}</p>
                <p className="font-sans text-black/40 text-xs mt-1">{speaker.title}</p>
                {speaker.sector && (
                  <span className="inline-block mt-3 font-sans text-black/40 text-[10px] font-semibold uppercase tracking-[0.15em] border border-black/15 px-3 py-1">
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
