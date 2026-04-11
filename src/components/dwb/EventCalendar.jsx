import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../../api/apiClient';
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
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SECTOR_COLORS = {
  'Finance & Trading': 'bg-gold/20 text-gold-dark',
  'Technology & AI': 'bg-blue-100 text-blue-700',
  'Consulting': 'bg-green-100 text-green-700',
  'Entrepreneurship': 'bg-purple-100 text-purple-700',
  default: 'bg-navy/10 text-navy',
};

export default function EventCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: events = [] } = useQuery({
    queryKey: ['club_events', 'upcoming'],
    queryFn: () => base44.entities.ClubEvent.filter({ status: 'upcoming' }, 'date'),
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

          {/* Calendar header */}
          <div className="border border-navy/15 rounded overflow-hidden">
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
                        <div
                          key={event.id}
                          className={`text-xs rounded px-1.5 py-0.5 truncate font-dm-sans ${
                            SECTOR_COLORS[event.sector] ?? SECTOR_COLORS.default
                          }`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
