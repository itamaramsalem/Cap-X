import FadeIn from './FadeIn';
import RsvpModal from './RsvpModal';
import { useState } from 'react';
import { SPEAKERS } from '../../lib/speakers';
import { format, parseISO } from 'date-fns';

export default function SpeakerSchedule() {
  const [selected, setSelected] = useState(null);

  if (SPEAKERS.length === 0) return null;

  return (
    <section className="bg-white border-t border-black/10 py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <p className="font-sans text-black/35 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">Upcoming</p>
          <h2 className="font-sans font-black text-black text-3xl md:text-4xl uppercase tracking-tight mb-12">Speaker Schedule</h2>
          <div className="divide-y divide-black/10">
            {SPEAKERS.map(speaker => (
              <div
                key={speaker.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 cursor-pointer hover:bg-black/2 transition-colors px-2"
                onClick={() => setSelected(speaker)}
              >
                <div className="flex items-center gap-4">
                  {speaker.photo && (
                    <img src={speaker.photo} alt={speaker.name} className="w-12 h-12 object-cover" />
                  )}
                  <div>
                    <p className="font-sans text-black font-bold text-base uppercase tracking-wide">{speaker.name}</p>
                    <p className="font-sans text-black/40 text-xs mt-0.5">{speaker.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-sans text-black text-xs font-semibold uppercase tracking-wider">
                      {speaker.date ? format(parseISO(speaker.date), 'MMM d, yyyy') : 'TBD'}
                    </p>
                    <p className="font-sans text-black/35 text-[10px] uppercase tracking-widest mt-0.5">{speaker.sector}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(speaker); }}
                    className="bg-black text-white font-sans font-bold text-[10px] uppercase tracking-[0.12em] px-5 py-2.5 hover:bg-black/80 transition-colors"
                  >
                    RSVP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
      {selected && <RsvpModal speaker={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
