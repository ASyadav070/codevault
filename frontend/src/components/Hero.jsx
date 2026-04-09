import React from 'react';
import { ArrowRight, Play, Database, Code, Shield, Cpu, Binary } from 'lucide-react';

const Node = ({ icon: Icon, label, sublabel, position, delay = "0s", className = "" }) => (
  <div 
    className={`absolute flex flex-col items-center gap-2 group animate-float cursor-pointer transition-all ${className}`}
    style={{ ...position, animationDelay: delay }}
  >
    <div className="relative">
      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/40 transition-all duration-500" />
      <div className="relative w-12 h-12 glass-card rounded-xl flex items-center justify-center border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-emerald-400" />
      </div>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors">{label}</span>
      {sublabel && <span className="text-slate-500 text-[10px] tracking-widest uppercase">{sublabel}</span>}
    </div>
  </div>
);

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-40 pb-20">

      {/* Background Aura */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: '-2s' }} />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-white -z-10" />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 mb-8 animate-fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">Level up your coding skills!</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
          <span className="text-white block">One-click for</span>
          <span className="text-gradient">Career Defense</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Dive into premium educational content where innovative pedagogy meets industry expertise. Master the craft of software engineering.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-xl glow-box">
            Start Learning
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Floating Nodes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:block hidden">
        <Node 
          icon={Database} 
          label="Data Structures" 
          sublabel="20.945 Courses" 
          position={{ top: '15%', left: '8%' }} 
          delay="0s"
          className="pointer-events-auto"
        />
        <Node 
          icon={Binary} 
          label="Algorithms" 
          sublabel="2.945 Masteries" 
          position={{ top: '20%', right: '8%' }} 
          delay="-1.5s"
          className="pointer-events-auto"
        />
        <Node 
          icon={Code} 
          label="Backend Dev" 
          sublabel="19.346 Lessons" 
          position={{ bottom: '15%', left: '12%' }} 
          delay="-3.2s"
          className="pointer-events-auto"
        />
        <Node 
          icon={Cpu} 
          label="System Design" 
          sublabel="440 Lectures" 
          position={{ bottom: '20%', right: '12%' }} 
          delay="-4.8s"
          className="pointer-events-auto"
        />
      </div>

      {/* Decorative Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20% 30% Q 35% 40% 50% 50%" stroke="url(#gradient)" strokeWidth="1" fill="none" strokeDasharray="5,5" />
        <path d="M 80% 35% Q 65% 45% 50% 50%" stroke="url(#gradient)" strokeWidth="1" fill="none" strokeDasharray="5,5" />
        <path d="M 25% 75% Q 40% 65% 50% 50%" stroke="url(#gradient)" strokeWidth="1" fill="none" strokeDasharray="5,5" />
        <path d="M 75% 70% Q 60% 60% 50% 50%" stroke="url(#gradient)" strokeWidth="1" fill="none" strokeDasharray="5,5" />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
};

export default Hero;
