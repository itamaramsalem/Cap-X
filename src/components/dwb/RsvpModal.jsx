import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { base44 } from '../../api/apiClient';
import { useToast } from '../ui/use-toast';
import { format, parseISO } from 'date-fns';

export default function RsvpModal({ speaker, onClose }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.Rsvp.create({ ...form, speaker_id: speaker.id });
      setDone(true);
      toast({ title: 'RSVP confirmed!', description: `See you at the ${speaker.name} event.` });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-md p-8 z-50">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="font-playfair text-navy text-2xl font-bold">
                RSVP
              </Dialog.Title>
              <p className="font-dm-sans text-muted-text text-sm mt-1">
                {speaker.name}
                {speaker.date && ` · ${format(parseISO(speaker.date), 'MMM d, yyyy')}`}
              </p>
            </div>
            <button onClick={onClose} className="text-muted-text hover:text-navy transition-colors">
              <X size={20} />
            </button>
          </div>

          {done ? (
            <div className="text-center py-6">
              <p className="font-playfair text-navy text-xl font-bold mb-2">You're confirmed.</p>
              <p className="font-dm-sans text-muted-text text-sm">We'll send details to your email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-dm-sans text-navy text-sm font-medium block mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-input rounded px-4 py-3 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="font-dm-sans text-navy text-sm font-medium block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-input rounded px-4 py-3 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-navy font-dm-sans font-semibold text-sm uppercase tracking-wider py-4 hover:bg-gold-dark transition-colors disabled:opacity-60"
              >
                {loading ? 'Confirming…' : 'Confirm RSVP'}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
