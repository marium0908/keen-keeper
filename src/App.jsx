import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from './components/Layout';

// Page Components
import Home from './pages/Home';
import FriendDetails from './pages/FriendDetails';
import Timeline from './pages/Timeline';
import Stats from './pages/Stats';
import NotFound from './pages/NotFound';

/**
 * Main App Component
 * We use React Router for navigation and a global Layout for the Navbar/Footer.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/friend/:id" element={<FriendDetails />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/stats" element={<Stats />} />
          {/* Catch-all route for 404s */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      {/* Global Toast Notifications */}
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
