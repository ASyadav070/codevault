import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Catalog = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('/content');
        setContent(response.data);
      } catch (err) {
        setError('Failed to fetch content.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  const renderPremiumButton = (item) => {
    const userOwnsCourse = item.isPurchased === true || item.purchased === true; // Bulletproof check

    if (userOwnsCourse) {
      return (
        <>
          <span className="text-lg font-semibold text-emerald-400">Purchased</span>
          <Link 
            to={`/content/${item.id}`} 
            className="inline-block text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Continue Learning
          </Link>
        </>
      );
    }
    return (
      <>
        <span className="text-2xl font-bold text-amber-400">₹{item.price}</span>
        <Link 
          to={`/content/${item.id}`} 
          className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Explore
        </Link>
      </>
    );
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
            Explore <span className="text-gradient">Catalog</span>
          </h1>
          <p className="text-slate-400">Master new skills with our premium compiled content.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {content.length} Courses Available
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.map((item) => {
          const isPurchased = item.isPurchased === true || item.purchased === true;
          return (
            <div 
              key={item.id} 
              className="group glass-card rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col"
            >
              <div className="p-8 flex flex-col justify-between h-full relative overflow-hidden">
                 {/* Decorative Glow */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.accessLevel === 'PREMIUM' ? (isPurchased ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20') : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {item.accessLevel === 'PREMIUM' && isPurchased ? 'Purchased' : item.accessLevel}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{item.title}</h2>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/5 relative z-10">
                  {isPurchased ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-emerald-500 uppercase tracking-widest font-bold">Lifetime Access</span>
                      <span className="text-2xl font-bold text-white">Unlocked</span>
                    </div>
                  ) : item.accessLevel === 'PREMIUM' ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Premium Access</span>
                      <span className="text-2xl font-bold text-white">₹{item.price}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Free Access</span>
                      <span className="text-2xl font-bold text-emerald-400">Free</span>
                    </div>
                  )}
                  
                  <Link 
                    to={`/content/${item.id}`} 
                    className={`px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${isPurchased ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20' : item.accessLevel === 'PREMIUM' ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                  >
                    {isPurchased ? 'Continue Learning' : 'Explore'}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );

};

export default Catalog;
