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
  { name: 'Dan Rosenboim', role: 'President', email: 'dir21@scarletmail.rutgers.edu', initial: 'D', photo: '/dan-rosenboim.jpg' },
  { name: 'Itamar Amsalem', role: 'Vice President', email: 'iea25@scarletmail.rutgers.edu', initial: 'I', photo: '/itamar-amsalem.jpg' },
  { name: 'Jonathan Rotstein', role: 'Treasurer', email: 'Jr2171@scarletmail.rutgers.edu', initial: 'J', photo: '/jonathan-rotstein.jpg' },
  { name: 'Adam Rosenman', role: 'Secretary', email: 'ar2410@scarletmail.rutgers.edu', initial: 'A', photo: '/adam-rosenman.jpg' },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <div style={{ paddingTop: 'calc(var(--bar-h, 0px) + 56px)' }}>
        {/* Hero section */}
        <section className="bg-navy px-8 md:px-16 py-24">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">Get in Touch</p>
              <h1 className="font-playfair text-white text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
              <p className="font-dm-sans text-white/55 text-base leading-relaxed max-w-xl mb-14">
                Have a question, want to speak at a session, or just want to connect?
                Reach out — we'd love to hear from you.
              </p>

              {/* Contact cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-24">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white/15 p-6 hover:border-white/30 transition-colors group"
                  >
                    <Icon size={20} className="text-gold mb-4" />
                    <p className="font-dm-sans text-white/40 text-xs uppercase tracking-widest mb-2">{label}</p>
                    <p className="font-dm-sans text-white text-sm font-medium group-hover:text-gold transition-colors">{value}</p>
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Leadership section */}
        <section className="bg-navy border-t border-white/10 px-8 md:px-16 py-20">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-4">Leadership</p>
              <h2 className="font-playfair text-white text-4xl font-bold mb-12">Our Team</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {TEAM.map(({ name, role, email, initial, photo }) => (
                  <div key={name} className="border border-white/12 p-6">
                    {/* Avatar */}
                    {photo ? (
                      <img src={photo} alt={name} className="w-12 h-12 rounded-full object-cover mb-5" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-navy-light border border-white/20 flex items-center justify-center mb-5">
                        <span className="font-playfair text-gold text-lg font-bold">{initial}</span>
                      </div>
                    )}
                    <p className="font-playfair text-white text-lg font-bold mb-1">{name}</p>
                    <p className="font-dm-sans text-gold text-xs uppercase tracking-widest mb-4">{role}</p>
                    <a
                      href={`mailto:${email}`}
                      className="font-dm-sans text-white/40 text-xs hover:text-white/70 transition-colors break-all"
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
