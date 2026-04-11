import Navbar from '../components/dwb/Navbar';
import Footer from '../components/dwb/Footer';
import AttendSignup from '../components/dwb/AttendSignup';

export default function Register() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-20">
        <AttendSignup />
      </div>
      <Footer />
    </div>
  );
}
