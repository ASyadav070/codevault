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
    <div>
      <h1 className="text-4xl font-bold mb-8 text-white">Content Catalog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.map((item) => (
          <div 
            key={item.id} 
            className="bg-slate-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20"
          >
            <div className="p-6 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
                <p className="text-slate-400 mb-4 h-24 overflow-hidden">{item.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                {item.accessLevel === 'PREMIUM' ? (
                  renderPremiumButton(item)
                ) : (
                  <Link 
                    to={`/content/${item.id}`} 
                    className="inline-block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Start Learning
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
