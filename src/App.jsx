import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from './lib/query-client';
import { Toaster } from './components/ui/toaster';
import AnnouncementBar from './components/dwb/AnnouncementBar';
import Home from './pages/Home';
import Archive from './pages/Archive';
import Contact from './pages/Contact';
import PageNotFound from './lib/PageNotFound';

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        {/* Announcement bar lives outside Routes so it shows on every page */}
        <AnnouncementBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Navigate to="/" replace />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}
