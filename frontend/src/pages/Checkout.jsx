import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { load } from '@cashfreepayments/cashfree-js';
import { useAuth } from '../hooks/useAuth';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPayLoading, setIsPayLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get(`/content/${id}`);
        if (response.data.accessLevel !== 'PREMIUM') {
          navigate(`/content/${id}`);
        }
        setContent(response.data);
      } catch (err) {
        setError('Failed to fetch content details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id, navigate]);

  const handlePayment = async () => {
    setIsPayLoading(true);
    setPaymentInitiated(true);
    try {
      const orderResponse = await api.post('/payments/create-order', {
        contentId: id,
      });
      const { paymentSessionId } = orderResponse.data;
      const cashfree = await load({ mode: 'sandbox' });
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_modal',
        appearance: {
          theme: 'dark',
          color: {
            primary: '#3b82f6',
            background: '#0f172a',
            text: '#f8fafc',
          },
        },
      });
    } catch (err) {
      console.error('Payment failed', err);
    } finally {
      setIsPayLoading(false);
    }
  };

  const handleVerification = () => {
    navigate(`/content/${id}`, { replace: true });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!content) return null;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-2xl bg-slate-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Order Summary</h1>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Course:</span>
            <span className="text-white font-semibold">{content.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Price:</span>
            <span className="text-white font-semibold">₹{content.price}</span>
          </div>
          <div className="border-t border-slate-700 my-4"></div>
          <div className="flex justify-between items-center text-xl">
            <span className="text-slate-300 font-bold">You Pay:</span>
            <span className="text-amber-400 font-bold">₹{content.price}</span>
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={handlePayment}
            disabled={isPayLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPayLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
        {paymentInitiated && (
          <div className="mt-6 text-center">
            <p className="text-slate-400 mb-3">After completing your payment, click below to access your content.</p>
            <button
              onClick={handleVerification}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Access Your Content
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
