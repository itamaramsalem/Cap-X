import FadeIn from './FadeIn';
import RsvpModal from './RsvpModal';
import { useState } from 'react';
import { SPEAKERS } from '../../lib/speakers';
import { format, parseISO } from 'date-fns';

export default function SpeakerSchedule() {
  const [selected, setSelected] = useState(null);

  if (SPEAKERS.length === 0) return null;

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-4">Upcoming</p>
            <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold">Speaker Schedule</h2>
          </div>
          <div className="space-y-4">
            {SPEAKERS.map(speaker => (
              <div
                key={speaker.id}
                className="border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setSelected(speaker)}
              >
                <div className="flex items-center gap-4">
                  {speaker.photo && (
                    <img src={speaker.photo} alt={speaker.name} className="w-14 h-14 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="font-playfair text-navy text-xl font-bold">{speaker.name}</p>
                    <p className="font-dm-sans text-muted-text text-sm">{speaker.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-dm-sans text-navy text-sm font-medium">
                      {speaker.date ? format(parseISO(speaker.date), 'MMM d, yyyy') : 'TBD'}
                    </p>
                    <p className="font-dm-sans text-muted-text text-xs uppercase tracking-wide">{speaker.sector}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(speaker); }}
                    className="bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-wider px-4 py-2 hover:bg-gold-dark transition-colors whitespace-nowrap"
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
