import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, BarChart3, Users, Instagram, Facebook, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Navbar component with navigation links and active state highlighting.
 */
const Navbar = () => {
  const location = useLocation();

  // Define our navigation links
  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Timeline', path: '/timeline', icon: Clock },
    { name: 'Stats', path: '/stats', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/src/assets/logo.png" 
            alt="KeenKeeper Logo" 
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

/**
 * Footer component with social links and legal info.
 */
const Footer = () => {
  return (
    <footer className="w-full bg-[#1a4731] text-white pt-20 pb-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Brand and Tagline */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight">KeenKeeper</h2>
            <p className="text-sm text-white/70 max-w-2xl mx-auto font-medium">
              Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffffff]">Social Links</h3>
            <div className="flex items-center justify-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a4731] hover:bg-white/90 transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a4731] hover:bg-white/90 transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a4731] hover:bg-white/90 transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Bottom Legal Section */}
          <div className="w-full pt-12 mt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-white/40 font-medium">
            <p>© 2026 KeenKeeper. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/**
 * Main Layout wrapper for the entire app.
 */
export const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
