import { useState, useEffect } from 'react';
import FadeIn from './FadeIn';
import SpeakerProfileModal from './SpeakerProfileModal';
import SessionRsvpModal from './SessionRsvpModal';
import { Users } from 'lucide-react';
import { SPEAKERS } from '../../lib/speakers';
import { supabase } from '../../api/apiClient';
import { format, parseISO } from 'date-fns';

export default function SpeakerSchedule() {
  const [profileSpeaker, setProfileSpeaker] = useState(null);
  const [rsvpSpeaker, setRsvpSpeaker] = useState(null);
  const [rsvpCounts, setRsvpCounts] = useState({});
  const [photoOverrides, setPhotoOverrides] = useState({});

  useEffect(() => {
    const eventIds = SPEAKERS.filter(s => s.event_id).map(s => s.event_id);
    if (eventIds.length === 0) return;

    Promise.all(
      eventIds.map(async (event_id) => {
        const { count } = await supabase
          .from('event_rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event_id);
        return { event_id, count: count ?? 0 };
      })
    ).then((results) => {
      const counts = {};
      results.forEach(({ event_id, count }) => { counts[event_id] = count; });
      setRsvpCounts(counts);
    });

    // Fetch admin-uploaded speaker photo overrides
    supabase
      .from('speaker_photos')
      .select('*')
      .then(({ data }) => {
        const map = {};
        (data ?? []).forEach(p => { map[p.speaker_id] = p.photo_url; });
        setPhotoOverrides(map);
      });
  }, []);

  const seatsLeftFor = (speaker) => {
    const count = speaker.event_id ? (rsvpCounts[speaker.event_id] ?? null) : null;
    return speaker.capacity != null && count !== null
      ? Math.max(0, speaker.capacity - count)
      : null;
  };

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-4">Upcoming</p>
            <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold">Speaker Schedule</h2>
          </div>

          <div className="space-y-4">
            {SPEAKERS.map((speaker, i) => {
              const seatsLeft = seatsLeftFor(speaker);
              const isFull = seatsLeft === 0;
              const photo = photoOverrides[speaker.id] || speaker.photo;

              return (
                <div
                  key={speaker.id}
                  className="border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => setProfileSpeaker({ ...speaker, photo })}
                >
                  {/* Left: avatar + name */}
                  <div className="flex items-center gap-4">
                    {photo ? (
                      <img
                        src={photo}
                        alt={speaker.name}
                        className="w-14 h-14 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                        <span className="font-playfair text-navy text-xl font-bold select-none">
                          {speaker.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-dm-sans text-gold text-[10px] uppercase tracking-[0.18em] mb-0.5">
                        Session {String(i + 1).padStart(2, '0')}
                      </p>
                      <p className="font-playfair text-navy text-xl font-bold">{speaker.name}</p>
                      <p className="font-dm-sans text-muted-text text-sm">{speaker.title}</p>
                    </div>
                  </div>

                  {/* Right: date + seats + RSVP */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-dm-sans text-navy text-sm font-medium">
                        {speaker.date ? format(parseISO(speaker.date), 'MMM d, yyyy') : 'TBD'}
                      </p>
                      <p className="font-dm-sans text-muted-text text-xs uppercase tracking-wide mt-0.5">
                        {speaker.sector}
                      </p>
                      {seatsLeft !== null && (
                        <p className={`font-dm-sans text-xs flex items-center justify-end gap-1 mt-1 font-medium ${
                          seatsLeft <= 10 ? 'text-red-500' : 'text-emerald-600'
                        }`}>
                          <Users size={10} />
                          {seatsLeft} seat{seatsLeft !== 1 ? 's' : ''} left
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); setRsvpSpeaker({ ...speaker, photo }); }}
                      disabled={isFull}
                      className="bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-wider px-4 py-2 hover:bg-gold-dark transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isFull ? 'Full' : 'RSVP'}
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="border border-dashed border-navy/15 rounded-lg p-5 text-center">
              <p className="font-dm-sans text-navy/40 text-sm">
                More sessions announced on a rolling basis — check back soon.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>

      {profileSpeaker && (
        <SpeakerProfileModal
          speaker={profileSpeaker}
          seatsLeft={seatsLeftFor(profileSpeaker)}
          onClose={() => setProfileSpeaker(null)}
          onRsvp={() => {
            setRsvpSpeaker(profileSpeaker);
            setProfileSpeaker(null);
          }}
        />
      )}

      {rsvpSpeaker && (
        <SessionRsvpModal
          speaker={rsvpSpeaker}
          onClose={() => setRsvpSpeaker(null)}
        />
      )}
    </section>
  );
}
