import Navbar from '../components/dwb/Navbar';
import ScrollProgress from '../components/dwb/ScrollProgress';
import Hero from '../components/dwb/Hero';
import StatsBar from '../components/dwb/StatsBar';
import WhyCap from '../components/dwb/WhyCap';
import HowItWorks from '../components/dwb/HowItWorks';
import StudentGains from '../components/dwb/StudentGains';
import Sectors from '../components/dwb/Sectors';
import EventCalendar from '../components/dwb/EventCalendar';
import SpeakerSchedule from '../components/dwb/SpeakerSchedule';
import NewsletterSignup from '../components/dwb/NewsletterSignup';
import ClosingCTA from '../components/dwb/ClosingCTA';
import Footer from '../components/dwb/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <StatsBar />
      {/* WHY CAP-X — between stats bar and How It Works */}
      <WhyCap />
      {/* id="format" is on the section inside HowItWorks */}
      <HowItWorks />
      {/* id="why-come" is on the section inside StudentGains */}
      <StudentGains />
      {/* id="sectors" is on the section inside Sectors */}
      <Sectors />
      {/* id="speakers" wrapper */}
      <div id="speakers">
        <SpeakerSchedule />
      </div>
      {/* id="schedule" is on the section inside EventCalendar */}
      <EventCalendar />
      <NewsletterSignup />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
