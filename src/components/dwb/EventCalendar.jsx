import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44, supabase } from '../../api/apiClient';
import { SPEAKERS } from '../../lib/speakers';
import * as Dialog from '@radix-ui/react-dialog';
import SessionRsvpModal from './SessionRsvpModal';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isToday,
} from 'date-fns';
import FadeIn from './FadeIn';
import { ChevronLeft, ChevronRight, X, Calendar, MapPin, Users } from 'lucide-react';

const SECTOR_COLORS = {
  'Finance & Trading': 'bg-gold/20 text-gold-dark',
  'Technology & AI': 'bg-blue-100 text-blue-700',
  'Consulting': 'bg-green-100 text-green-700',
  'Entrepreneurship': 'bg-purple-100 text-purple-700',
  default: 'bg-navy/10 text-navy',
};

// ──────────────────────────────────────────────
// Event detail modal with live seat count + RSVP
// ──────────────────────────────────────────────
function EventDetailModal({ event, onClose }) {
  const [showRsvp, setShowRsvp] = useState(false);

  // Live RSVP count for this event
  const { data: rsvpCount = null } = useQuery({
    queryKey: ['rsvp-count', event.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id);
      return count ?? 0;
    },
    enabled: !!event.id,
  });

  const capacity = event.capacity ?? null;
  const seatsLeft = capacity !== null && rsvpCount !== null
    ? Math.max(0, capacity - rsvpCount)
    : null;
  const isFull = seatsLeft === 0;

  // Build speaker object for SessionRsvpModal.
  // Prefer the rich static speaker entry if it matches, else synthesise from DB row.
  const speakerObj = SPEAKERS.find(s => s.event_id === event.id) ?? {
    name: event.speaker ?? 'Speaker TBA',
    title: null,
    date: event.date ?? null,
    location: event.location ?? null,
    sector: event.sector ?? null,
    capacity: event.capacity ?? null,
    event_id: event.id,
    bio: null,
    takeaways: [],
    photo: null,
  };

  if (showRsvp) {
    return (
      <SessionRsvpModal
        speaker={speakerObj}
        onClose={() => {
          setShowRsvp(false);
          onClose();
        }}
      />
    );
  }

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-md z-50 overflow-hidden">

          {/* Navy header */}
          <div className="bg-navy px-7 pt-7 pb-6 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {event.sector && (
              <p className="font-dm-sans text-gold text-[10px] uppercase tracking-[0.2em] mb-3">
                {event.sector}
              </p>
            )}

            <Dialog.Title className="font-playfair text-white text-2xl font-bold leading-tight pr-6">
              {event.title}
            </Dialog.Title>

            {event.speaker && (
              <p className="font-dm-sans text-white/60 text-sm mt-1">{event.speaker}</p>
            )}

            {/* Meta row */}
            <div className="mt-5 flex flex-wrap gap-4">
              {event.date && (
                <span className="flex items-center gap-1.5 font-dm-sans text-white/55 text-xs">
                  <Calendar size={12} className="text-gold" />
                  {format(parseISO(event.date), 'MMMM d, yyyy')}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1.5 font-dm-sans text-white/55 text-xs">
                  <MapPin size={12} className="text-gold" />
                  {event.location}
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
          <div className="px-7 py-6 space-y-4">
            {event.description && (
              <p className="font-dm-sans text-navy/75 text-sm leading-relaxed">
                {event.description}
              </p>
            )}

            {/* Show takeaways if we matched a rich speaker */}
            {speakerObj.takeaways?.length > 0 && (
              <div>
                <p className="font-dm-sans text-gold text-[10px] uppercase tracking-[0.18em] mb-2">
                  What You'll Learn
                </p>
                <ul className="space-y-1.5">
                  {speakerObj.takeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                      <span className="font-dm-sans text-navy/70 text-sm leading-snug">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setShowRsvp(true)}
              disabled={isFull}
              className="w-full bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] py-4 hover:bg-gold-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isFull ? 'Session Full' : 'Reserve My Seat'}
            </button>

            {seatsLeft !== null && seatsLeft <= 10 && !isFull && (
              <p className="font-dm-sans text-red-500 text-xs text-center">
                Only {seatsLeft} seat{seatsLeft !== 1 ? 's' : ''} left — RSVP now.
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ──────────────────────────────────────────────
// Calendar
// ──────────────────────────────────────────────
export default function EventCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events = [] } = useQuery({
    queryKey: ['club_events'],
    queryFn: () => base44.entities.ClubEvent.list('date', 100),
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const eventsForDay = (day) =>
    events.filter(e => {
      try { return isSameDay(parseISO(e.date), day); } catch { return false; }
    });

  const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section id="schedule" className="bg-cream py-24 px-8 md:px-16">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-4">Schedule</p>
          <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold mb-12 leading-tight">
            Upcoming Sessions &amp; Workshops
          </h2>

          <div className="border border-navy/15 rounded overflow-hidden">
            {/* Month nav */}
            <div className="bg-navy flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                className="text-white/60 hover:text-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-dm-sans text-white font-semibold text-sm tracking-wide">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                className="text-white/60 hover:text-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-navy/10 bg-white">
              {DAY_HEADERS.map(d => (
                <div key={d} className="text-center font-dm-sans text-muted-text text-xs uppercase tracking-wider py-3">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 bg-white">
              {days.map((day, idx) => {
                const dayEvents = eventsForDay(day);
                const inMonth = isSameMonth(day, currentMonth);
                const today = isToday(day);

                return (
                  <div
                    key={idx}
                    className={`min-h-[90px] border-b border-r border-navy/8 p-2 ${
                      idx % 7 === 6 ? 'border-r-0' : ''
                    } ${idx >= days.length - 7 ? 'border-b-0' : ''}`}
                  >
                    <div className="flex justify-center mb-1">
                      <span
                        className={`font-dm-sans text-sm w-7 h-7 flex items-center justify-center rounded-full ${
                          today
                            ? 'bg-gold text-navy font-semibold'
                            : inMonth
                            ? 'text-navy'
                            : 'text-navy/25'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map(event => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full text-left text-xs rounded px-1.5 py-0.5 truncate font-dm-sans hover:opacity-80 transition-opacity cursor-pointer ${
                            SECTOR_COLORS[event.sector] ?? SECTOR_COLORS.default
                          }`}
                          title={event.title}
                        >
                          {event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
