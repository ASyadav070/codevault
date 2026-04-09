import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/content/${id}`);
        setContent(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch content detail.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  const handleUpgrade = () => {
    navigate(`/checkout/${id}`);
  };

  if (loading) return <div className="text-center py-10">Loading content...</div>;

  const isLocked = content?.accessDenied === true;

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="glass-card p-12 max-w-lg w-full rounded-3xl shadow-2xl relative overflow-hidden text-center">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-white tracking-tight mb-3">Premium Content <span className="text-amber-500">Locked</span></h2>
            <p className="text-slate-400 mb-8 leading-relaxed text-sm">This exclusive content is available only to our premium members. Unlock it to advance your career with industry-level mastery.</p>
            
            <button
              onClick={handleUpgrade}
              className="w-full py-4 px-6 bg-white text-black rounded-xl font-bold text-lg hover:bg-slate-200 active:scale-[0.98] transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2"
            >
              Unlock Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="mt-4 text-xs text-slate-500">Secure payment via CashFree</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="glass-card p-8 rounded-2xl border-red-500/20">
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    </div>
  );

  if (content) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="glass-card p-10 rounded-3xl relative overflow-hidden backdrop-blur-3xl">
           {/* Decorative Glow */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
               <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                Current Lesson
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">{content.title}</h1>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">{content.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="text-center py-20 text-slate-500">Something went wrong.</div>;

};

export default ContentDetail;
