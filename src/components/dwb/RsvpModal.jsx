import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { base44 } from '../../api/apiClient';
import { useToast } from '../ui/use-toast';
import { format, parseISO } from 'date-fns';

export default function RsvpModal({ speaker, onClose }) {
  const [form, setForm] = useState({ scarlet_mail: '', netid: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.scarlet_mail.endsWith('@scarletmail.rutgers.edu')) {
      toast({ title: 'Invalid email', description: 'Please use your @scarletmail.rutgers.edu address.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await base44.entities.Rsvp.create({ ...form, speaker_id: speaker.id });
      setDone(true);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md p-8 z-50">
          <div className="flex items-start justify-between mb-8">
            <div>
              <Dialog.Title className="font-sans font-black text-black text-xl uppercase tracking-tight">
                RSVP
              </Dialog.Title>
              <p className="font-sans text-black/40 text-xs mt-1 uppercase tracking-wider">
                {speaker.name}
                {speaker.date && ` · ${format(parseISO(speaker.date), 'MMM d, yyyy')}`}
              </p>
            </div>
            <button onClick={onClose} className="text-black/30 hover:text-black transition-colors">
              <X size={18} />
            </button>
          </div>

          {done ? (
            <div className="py-6">
              <p className="font-sans font-black text-black text-xl uppercase tracking-tight mb-2">You're confirmed.</p>
              <p className="font-sans text-black/40 text-sm">We'll send details to your email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-sans text-black/40 text-[10px] font-semibold uppercase tracking-[0.15em] block mb-2">
                  Scarlet Mail Address
                </label>
                <input
                  type="email"
                  required
                  value={form.scarlet_mail}
                  onChange={e => setForm(f => ({ ...f, scarlet_mail: e.target.value }))}
                  placeholder="netid@scarletmail.rutgers.edu"
                  className="w-full border border-black/20 text-black placeholder-black/25 font-sans text-sm px-4 py-3 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="font-sans text-black/40 text-[10px] font-semibold uppercase tracking-[0.15em] block mb-2">
                  NetID
                </label>
                <input
                  type="text"
                  required
                  value={form.netid}
                  onChange={e => setForm(f => ({ ...f, netid: e.target.value }))}
                  placeholder="e.g. abc123"
                  className="w-full border border-black/20 text-black placeholder-black/25 font-sans text-sm px-4 py-3 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-sans font-bold text-[10px] uppercase tracking-[0.15em] py-4 hover:bg-black/80 transition-colors disabled:opacity-50"
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
