import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import ContentDetail from './pages/ContentDetail';
import Checkout from './pages/Checkout';
import Navigation from './components/Common/Navigation';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white font-sans">
        <Navigation />
        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/content/:id" element={<ContentDetail />} />
              <Route path="/checkout/:id" element={<Checkout />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
