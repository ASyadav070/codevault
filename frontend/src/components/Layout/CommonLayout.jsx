import React from 'react';
import Navbar from '../Navbar';

const CommonLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#030711] text-white font-sans selection:bg-emerald-500/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-white -z-10" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.02)_0%,transparent_100%)]" />
      
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        {children}
      </main>
    </div>
  );
};


export default CommonLayout;
