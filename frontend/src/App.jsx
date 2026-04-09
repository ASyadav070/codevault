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

import CommonLayout from './components/Layout/CommonLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Other routes wrapped in standard layout */}
        <Route
          path="/*"
          element={
            <CommonLayout>
              <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="catalog" element={<Catalog />} />
                  <Route path="content/:id" element={<ContentDetail />} />
                  <Route path="checkout/:id" element={<Checkout />} />
                </Route>
              </Routes>
            </CommonLayout>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
