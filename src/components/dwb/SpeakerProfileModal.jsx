import * as Dialog from '@radix-ui/react-dialog';
import { X, MapPin, Calendar, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function SpeakerProfileModal({ speaker, seatsLeft, onClose, onRsvp }) {
  const isFull = seatsLeft === 0;

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-lg z-50 max-h-[90vh] overflow-y-auto">

          {/* Navy header band */}
          <div className="bg-navy px-8 pt-8 pb-6 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Session label */}
            <p className="font-dm-sans text-gold text-[10px] uppercase tracking-[0.2em] mb-3">
              Session 01
            </p>

            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              {speaker.photo ? (
                <img
                  src={speaker.photo}
                  alt={speaker.name}
                  className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-white/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shrink-0 border-2 border-white/20">
                  <span className="font-playfair text-white text-2xl font-bold select-none">
                    {speaker.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <Dialog.Title className="font-playfair text-white text-2xl font-bold leading-tight">
                  {speaker.name}
                </Dialog.Title>
                <p className="font-dm-sans text-white/60 text-sm mt-0.5">{speaker.title}</p>
              </div>
            </div>

            {/* Meta: date · location · sector */}
            <div className="mt-5 flex flex-wrap gap-4">
              {speaker.date && (
                <span className="flex items-center gap-1.5 font-dm-sans text-white/55 text-xs">
                  <Calendar size={12} className="text-gold" />
                  {format(parseISO(speaker.date), 'MMMM d, yyyy')}
                </span>
              )}
              {speaker.location && (
                <span className="flex items-center gap-1.5 font-dm-sans text-white/55 text-xs">
                  <MapPin size={12} className="text-gold" />
                  {speaker.location}
                </span>
              )}
              {seatsLeft !== null && (
                <span className={`flex items-center gap-1.5 font-dm-sans text-xs font-semibold ${
                  seatsLeft <= 10 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  <Users size={12} />
                  {seatsLeft} seat{seatsLeft !== 1 ? 's' : ''} remaining
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-7 space-y-6">

            {/* Bio */}
            {speaker.bio && (
              <div>
                <p className="font-dm-sans text-gold text-[10px] uppercase tracking-[0.18em] mb-2">About</p>
                <p className="font-dm-sans text-navy/80 text-sm leading-relaxed">{speaker.bio}</p>
              </div>
            )}

            {/* Takeaways */}
            {speaker.takeaways?.length > 0 && (
              <div>
                <p className="font-dm-sans text-gold text-[10px] uppercase tracking-[0.18em] mb-3">
                  What You'll Learn
                </p>
                <ul className="space-y-2">
                  {speaker.takeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                      <span className="font-dm-sans text-navy/75 text-sm leading-snug">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sector badge */}
            {speaker.sector && (
              <div>
                <span className="font-dm-sans text-xs font-semibold uppercase tracking-widest bg-navy/8 text-navy px-3 py-1.5 rounded">
                  {speaker.sector}
                </span>
              </div>
            )}

            {/* RSVP CTA */}
            <button
              onClick={onRsvp}
              disabled={isFull}
              className="w-full bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] py-4 hover:bg-gold-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isFull ? 'Session Full' : 'Reserve My Seat'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
