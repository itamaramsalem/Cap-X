import { format, parseISO } from 'date-fns';
import { MapPin, Clock } from 'lucide-react';

export default function EventCard({ event, onClick }) {
  const statusColors = {
    upcoming: 'text-emerald-600 bg-emerald-50',
    past: 'text-gray-500 bg-gray-100',
    cancelled: 'text-red-500 bg-red-50',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
    >
      {event.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`font-dm-sans text-xs uppercase tracking-widest px-2 py-1 rounded ${statusColors[event.status] ?? statusColors.upcoming}`}>
            {event.status}
          </span>
          {event.sector && (
            <span className="font-dm-sans text-xs text-muted-text uppercase tracking-widest">
              {event.sector}
            </span>
          )}
        </div>
        <h3 className="font-playfair text-navy text-xl font-bold mb-2">{event.title}</h3>
        {event.description && (
          <p className="font-dm-sans text-muted-text text-sm leading-relaxed mb-4 line-clamp-2">
            {event.description}
          </p>
        )}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-muted-text">
            <Clock size={13} />
            <span className="font-dm-sans text-xs">
              {format(parseISO(event.date), 'MMMM d, yyyy')} · {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-text">
            <MapPin size={13} />
            <span className="font-dm-sans text-xs">{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
