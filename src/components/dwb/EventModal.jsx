import * as Dialog from '@radix-ui/react-dialog';
import { X, MapPin, Clock, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { base44 } from '../../api/apiClient';
import { useToast } from '../ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function EventModal({ event, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [guestForm, setGuestForm] = useState({ name: '', email: '' });

  const { data: rsvps = [] } = useQuery({
    queryKey: ['event_rsvps', event.id],
    queryFn: () => base44.entities.EventRSVP.filter({ event_id: event.id }),
  });

  const confirmedCount = rsvps.filter(r => r.status === 'confirmed').length;
  const userRsvp = rsvps.find(r => r.user_email === user?.email && r.status === 'confirmed');

  const rsvpMutation = useMutation({
    mutationFn: async () => {
      const payload = isAuthenticated
        ? { event_id: event.id, user_email: user.email, user_name: user.full_name }
        : { event_id: event.id, user_email: guestForm.email, user_name: guestForm.name };
      return base44.entities.EventRSVP.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['event_rsvps', event.id] });
      toast({ title: 'RSVP confirmed!', description: `You're registered for ${event.title}.` });
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => base44.entities.EventRSVP.update(userRsvp.id, { status: 'cancelled' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['event_rsvps', event.id] });
      toast({ title: 'RSVP cancelled' });
    },
  });

  const isFull = event.capacity && confirmedCount >= event.capacity;

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-50">
          {event.image_url && (
            <div className="h-52 overflow-hidden rounded-t-lg">
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <Dialog.Title className="font-playfair text-navy text-2xl font-bold pr-4">
                {event.title}
              </Dialog.Title>
              <button onClick={onClose} className="text-muted-text hover:text-navy shrink-0">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 text-muted-text">
                <Clock size={14} />
                <span className="font-dm-sans text-sm">
                  {format(parseISO(event.date), 'MMMM d, yyyy')} · {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-text">
                <MapPin size={14} />
                <span className="font-dm-sans text-sm">{event.location}</span>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-2 text-muted-text">
                  <Users size={14} />
                  <span className="font-dm-sans text-sm">
                    {confirmedCount} / {event.capacity} registered
                  </span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="font-dm-sans text-muted-text leading-relaxed mb-6">{event.description}</p>
            )}

            {event.speaker && (
              <div className="border border-border rounded p-4 mb-6">
                <p className="font-dm-sans text-navy text-sm font-semibold">{event.speaker}</p>
                {event.speaker_role && (
                  <p className="font-dm-sans text-muted-text text-xs mt-0.5">{event.speaker_role}</p>
                )}
              </div>
            )}

            {/* RSVP area */}
            {event.status === 'upcoming' && (
              <div>
                {userRsvp ? (
                  <div className="space-y-3">
                    <p className="font-dm-sans text-emerald-600 text-sm font-medium">You're registered for this event.</p>
                    <button
                      onClick={() => cancelMutation.mutate()}
                      disabled={cancelMutation.isPending}
                      className="w-full border border-red-200 text-red-500 font-dm-sans text-sm py-3 rounded hover:bg-red-50 transition-colors"
                    >
                      Cancel my RSVP
                    </button>
                  </div>
                ) : isFull ? (
                  <p className="font-dm-sans text-muted-text text-sm text-center py-3">This event is full.</p>
                ) : isAuthenticated ? (
                  <button
                    onClick={() => rsvpMutation.mutate()}
                    disabled={rsvpMutation.isPending}
                    className="w-full bg-gold text-navy font-dm-sans font-semibold text-sm uppercase tracking-wider py-4 hover:bg-gold-dark transition-colors disabled:opacity-60"
                  >
                    {rsvpMutation.isPending ? 'Confirming…' : 'RSVP Now'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      required
                      value={guestForm.name}
                      onChange={e => setGuestForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-input rounded px-4 py-3 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={guestForm.email}
                      onChange={e => setGuestForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-input rounded px-4 py-3 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      onClick={() => rsvpMutation.mutate()}
                      disabled={rsvpMutation.isPending || !guestForm.name || !guestForm.email}
                      className="w-full bg-gold text-navy font-dm-sans font-semibold text-sm uppercase tracking-wider py-4 hover:bg-gold-dark transition-colors disabled:opacity-60"
                    >
                      {rsvpMutation.isPending ? 'Confirming…' : 'RSVP Now'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
