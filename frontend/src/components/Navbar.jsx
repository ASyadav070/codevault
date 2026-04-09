import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="glass-card flex items-center gap-8 px-6 py-3 rounded-full max-w-5xl w-full justify-between shadow-2xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Shield className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">CodeVault</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>

        {/* Profile / Auth */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 hidden sm:block">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full text-sm font-semibold hover:bg-slate-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-slate-400 hover:text-white transition-colors font-medium text-sm hidden sm:block"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Join Now</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

