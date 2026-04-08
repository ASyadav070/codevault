import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="sticky top-0 bg-slate-800/60 backdrop-blur-lg shadow-lg z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/catalog" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
            CodeVault
          </Link>
          <div className="flex items-center space-x-4">
            {user && <span className="text-sm text-slate-400">Welcome, {user.email}!</span>}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-300 hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-300 hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
