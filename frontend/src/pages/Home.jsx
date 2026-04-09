import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LogoCloud from '../components/LogoCloud';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030711] text-slate-200 selection:bg-emerald-500/30">
      <Navbar />
      <Hero />
      <LogoCloud />
      
      {/* Optional: Add a subtle overlay for extra depth */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.02)_0%,transparent_100%)]" />
    </main>
  );
}