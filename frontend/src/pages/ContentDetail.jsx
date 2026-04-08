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
      <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-10 max-w-lg w-full">
          <div className="text-amber-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Premium Content Locked</h2>
          <p className="text-slate-400 mb-6">This exclusive content is available only to our premium members.</p>
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  if (content) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{content.title}</h1>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{content.description}</p>
        {/* Render the actual content here */}
      </div>
    );
  }

  return <div className="text-center py-10">Something went wrong.</div>;
};

export default ContentDetail;
