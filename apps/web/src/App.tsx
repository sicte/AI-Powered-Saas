import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Playground from '@/components/Playground';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  if (view === 'dashboard') {
    return <Dashboard onExit={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-ink-950 relative">
      <Navbar onLaunch={() => setView('dashboard')} />
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
