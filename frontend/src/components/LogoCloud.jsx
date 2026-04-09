import React from 'react';

const LogoCloud = () => {
  const logos = [
    { name: 'Vercel', color: 'text-white' },
    { name: 'loom', color: 'text-slate-400' },
    { name: 'Cash App', color: 'text-slate-400' },
    { name: 'Loops', color: 'text-slate-400' },
    { name: '_zapier', color: 'text-slate-400' },
    { name: 'ramp', color: 'text-slate-400' },
    { name: 'Raycast', color: 'text-slate-400' },
  ];

  return (
    <div className="py-20 border-t border-white/5 bg-black/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-sm font-medium text-slate-500 mb-12 uppercase tracking-widest">
          Trusted by developers from world-class teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {logos.map((logo) => (
            <div key={logo.name} className={`text-2xl font-bold tracking-tighter ${logo.color} flex items-center gap-2`}>
              <div className="w-2 h-2 rounded-full bg-current" />
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
