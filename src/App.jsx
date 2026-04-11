import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from './lib/query-client';
import { AuthProvider } from './lib/AuthContext';
import { Toaster } from './components/ui/toaster';
import AnnouncementBar from './components/dwb/AnnouncementBar';
import Home from './pages/Home';
import Archive from './pages/Archive';
import Contact from './pages/Contact';
import Join from './pages/Join';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import PageNotFound from './lib/PageNotFound';

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <AuthProvider>
          {/* Announcement bar hidden on admin pages */}
          <Routes>
            <Route path="/admin/*" element={null} />
            <Route path="*" element={<AnnouncementBar />} />
          </Routes>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Navigate to="/" replace />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/join" element={<Join />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}
