import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Playground from '@/components/Playground';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';
import AuthPage from '@/components/AuthPage';

type View = 'landing' | 'auth' | 'dashboard';
type AuthMode = 'signin' | 'signup';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  if (view === 'dashboard') {
    return (
      <Dashboard
        onExit={() => setView('landing')}
        onSignIn={() => {
          setAuthMode('signin');
          setView('auth');
        }}
      />
    );
  }

  if (view === 'auth') {
    return (
      <AuthPage
        mode={authMode}
        onSwitch={setAuthMode}
        onSuccess={() => setView('dashboard')}
        onBack={() => setView('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 relative">
      <Navbar
        onLaunch={() => setView('dashboard')}
        onSignIn={() => {
          setAuthMode('signin');
          setView('auth');
        }}
      />
      <main>
        <Hero onLaunch={() => setView('dashboard')} />
        <Features />
        <Playground />
        <Pricing onLaunch={() => setView('dashboard')} />
      </main>
      <Footer onLaunch={() => setView('dashboard')} />
    </div>
  );
}