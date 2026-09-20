import { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowRight, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onLaunch: () => void;
  onSignIn: () => void;
}

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Playground', href: '#playground' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
];

export default function Navbar({ onLaunch, onSignIn }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isDemo, signOut } = useAuth();

  const signedIn = !!user && !isDemo;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-2xl shadow-black/40' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="group flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600">
                <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight">
              Omni<span className="text-brand-400">AI</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {signedIn ? (
              <>
                <span className="text-sm font-medium text-white/80">{user!.name}</span>
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors px-3 py-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
                <button
                  onClick={onLaunch}
                  className="group relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onSignIn}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors px-3 py-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
                <button
                  onClick={onLaunch}
                  className="group relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>Launch App</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg glass"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden animate-fade-down glass-strong rounded-xl mt-2 mb-4 p-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {signedIn ? (
                <button
                  onClick={() => { setMobileOpen(false); signOut(); }}
                  className="w-full inline-flex items-center justify-center gap-2 glass glass-hover px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); onSignIn(); }}
                  className="w-full inline-flex items-center justify-center gap-2 glass glass-hover px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
              )}
              <button
                onClick={() => { setMobileOpen(false); onLaunch(); }}
                className="w-full rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}