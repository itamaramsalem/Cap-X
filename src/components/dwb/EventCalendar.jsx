import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../../api/apiClient';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
  parseISO, isToday,
} from 'date-fns';
import FadeIn from './FadeIn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    events.filter(e => { try { return isSameDay(parseISO(e.date), day); } catch { return false; } });

  const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section id="schedule" className="bg-black border-t border-white/10 py-24 px-8 md:px-16">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="font-sans text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">Schedule</p>
          <h2 className="font-sans font-black text-white text-3xl md:text-4xl uppercase tracking-tight mb-12">
            Upcoming Sessions &amp; Workshops
          </h2>

          <div className="border border-white/15">
            {/* Month nav */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/15">
              <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="text-white/40 hover:text-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="font-sans text-white font-bold text-sm uppercase tracking-[0.15em]">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="text-white/40 hover:text-white transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-white/15">
              {DAY_HEADERS.map(d => (
                <div key={d} className="text-center font-sans text-white/25 text-[10px] uppercase tracking-wider py-3">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7">
              {days.map((day, idx) => {
                const dayEvents = eventsForDay(day);
                const inMonth = isSameMonth(day, currentMonth);
                const today = isToday(day);
                return (
                  <div
                    key={idx}
                    className={`min-h-[80px] p-2 ${idx % 7 !== 6 ? 'border-r border-white/8' : ''} ${idx < days.length - 7 ? 'border-b border-white/8' : ''}`}
                  >
                    <span className={`font-sans text-xs w-6 h-6 flex items-center justify-center font-semibold ${
                      today ? 'bg-white text-black' : inMonth ? 'text-white/70' : 'text-white/15'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.map(event => (
                        <div key={event.id} className="text-[10px] bg-white text-black font-bold uppercase tracking-wide px-1.5 py-0.5 truncate">
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
