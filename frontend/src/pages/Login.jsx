import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      login(token, user);
      navigate('/catalog', { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />
        
        <div className="relative z-10">
          <h2 className="text-center text-3xl font-bold text-white tracking-tight">
            Welcome back to <span className="text-emerald-400">CodeVault</span>
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Sign in to continue your learning journey
          </p>
        </div>

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-slate-400 mb-1 ml-1">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all sm:text-sm"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" name="password" className="block text-sm font-medium text-slate-400 mb-1 ml-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs text-center font-medium bg-red-400/10 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-[0.98] transition-all shadow-xl shadow-white/5"
          >
            Sign In
          </button>
        </form>

        <div className="text-sm text-center relative z-10">
          <Link to="/register" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
            Don't have an account? Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
