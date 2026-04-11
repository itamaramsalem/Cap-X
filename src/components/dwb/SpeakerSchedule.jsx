import FadeIn from './FadeIn';
import RsvpModal from './RsvpModal';
import { useState } from 'react';
import { Lock } from 'lucide-react';
import { SPEAKERS } from '../../lib/speakers';
import { format, parseISO } from 'date-fns';

/** Teaser card — same layout as real cards but blurred with a lock overlay */
function TeaserCard() {
  const handleAttend = (e) => {
    e.preventDefault();
    document.getElementById('attend')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="border border-border rounded-lg p-6 cursor-pointer relative overflow-hidden hover:shadow-sm transition-shadow"
      onClick={handleAttend}
    >
      {/* Blurred placeholder content — identical structure to real cards */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none pointer-events-none blur-[3px] opacity-25">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-navy/30 shrink-0" />
          <div>
            <p className="font-playfair text-navy text-xl font-bold">Firstname Lastname</p>
            <p className="font-dm-sans text-muted-text text-sm">Senior Executive, Major Company</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-dm-sans text-navy text-sm font-medium">Fall 2025</p>
            <p className="font-dm-sans text-muted-text text-xs uppercase tracking-wide">Finance</p>
          </div>
          <div className="bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-wider px-4 py-2">
            RSVP
          </div>
        </div>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
        <Lock size={16} className="text-navy/35 mb-0.5" />
        <p className="font-dm-sans text-navy text-sm font-semibold">Session 01 — Speaker TBA</p>
        <p className="font-dm-sans text-muted-text text-xs">Pre-register to be notified first.</p>
      </div>
    </div>
  );
}

export default function SpeakerSchedule() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-4">Upcoming</p>
            <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold">Speaker Schedule</h2>
          </div>

          <div className="space-y-4">
            {/* Teaser card always shown first */}
            <TeaserCard />

            {/* Real speaker cards (if any) */}
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
