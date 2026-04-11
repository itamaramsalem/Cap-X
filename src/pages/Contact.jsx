import { Mail, Instagram, Linkedin } from 'lucide-react';
import Navbar from '../components/dwb/Navbar';
import Footer from '../components/dwb/Footer';
import FadeIn from '../components/dwb/FadeIn';

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'team@capxrutgers.com', href: 'mailto:team@capxrutgers.com' },
  { icon: Instagram, label: 'Instagram', value: '@capxrutgers', href: 'https://www.instagram.com/capxrutgers/' },
  { icon: Linkedin, label: 'LinkedIn', value: 'Cap-X Rutgers', href: 'https://linkedin.com/company/capxrutgers' },
];

const TEAM = [
  { name: 'Dan Rosenboim', role: 'President', email: 'dir21@scarletmail.rutgers.edu', initial: 'D' },
  { name: 'Itamar Amsalem', role: 'Vice President', email: 'iea25@scarletmail.rutgers.edu', initial: 'I', photo: '/itamar.jpg' },
  { name: 'Jonathan Rotstein', role: 'Treasurer', email: 'Jr2171@scarletmail.rutgers.edu', initial: 'J' },
  { name: 'Adam Rosenman', role: 'Secretary', email: 'ar2410@scarletmail.rutgers.edu', initial: 'A' },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-14">
        {/* Hero */}
        <section className="bg-white px-8 md:px-16 py-24 border-b border-black/10">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <p className="font-sans text-black/35 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">Get in Touch</p>
              <h1 className="font-sans font-black text-black text-5xl md:text-6xl uppercase tracking-tight mb-6">Contact Us</h1>
              <p className="font-sans text-black/45 text-base leading-relaxed max-w-xl mb-14">
                Have a question, want to speak at a session, or just want to connect?
                Reach out — we'd love to hear from you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-black/10">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-8 hover:bg-black group transition-colors"
                  >
                    <Icon size={18} className="text-black/40 group-hover:text-white mb-5 transition-colors" />
                    <p className="font-sans text-black/35 text-[10px] font-semibold uppercase tracking-[0.15em] mb-2 group-hover:text-white/50 transition-colors">{label}</p>
                    <p className="font-sans text-black font-bold text-sm uppercase tracking-wide group-hover:text-white transition-colors">{value}</p>
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Leadership */}
        <section className="bg-black px-8 md:px-16 py-20">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <p className="font-sans text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">Leadership</p>
              <h2 className="font-sans font-black text-white text-4xl uppercase tracking-tight mb-12">Our Team</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
                {TEAM.map(({ name, role, email, initial, photo }) => (
                  <div key={name} className="bg-black p-8">
                    {photo ? (
                      <img
                        src={photo}
                        alt={name}
                        className="w-12 h-12 object-cover object-top mb-6 grayscale"
                      />
                    ) : (
                      <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-6">
                        <span className="font-sans text-white font-black text-base">{initial}</span>
                      </div>
                    )}
                    <p className="font-sans text-white font-bold text-base uppercase tracking-wide mb-1">{name}</p>
                    <p className="font-sans text-white/35 text-[10px] font-semibold uppercase tracking-[0.15em] mb-4">{role}</p>
                    <a
                      href={`mailto:${email}`}
                      className="font-sans text-white/25 text-xs hover:text-white/60 transition-colors break-all"
                    >
                      {email}
                    </a>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
