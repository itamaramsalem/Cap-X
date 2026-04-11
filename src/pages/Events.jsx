import Navbar from '../components/dwb/Navbar';
import Footer from '../components/dwb/Footer';
import EventCard from '../components/dwb/EventCard';
import EventModal from '../components/dwb/EventModal';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/apiClient';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['club_events'],
    queryFn: () => base44.entities.ClubEvent.list('-date'),
  });

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="font-playfair text-navy text-5xl font-bold mb-4">Events</h1>
        <p className="text-muted-text font-dm-sans mb-12">Upcoming Cap-X speaker events and workshops.</p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-muted-text font-dm-sans text-center py-20">No events scheduled yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
            ))}
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
      <Footer />
    </div>
  );
}
