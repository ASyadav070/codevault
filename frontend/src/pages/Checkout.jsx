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
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'processing' | 'success' | 'failed'

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

  useEffect(() => {
    if (paymentStatus === 'success') {
      const timer = setTimeout(() => {
        navigate(`/content/${id}`, { replace: true });
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, id, navigate]);

  const handlePayment = async () => {
    setIsPayLoading(true);
    setPaymentStatus('processing');
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
      }).then((result) => {
        // Check for payment success based on CashFree SDK result
        // The exact structure of 'result' might vary slightly based on SDK version and payment method
        // This is a common pattern for success indication
        if (result && result.paymentDetails) { // Assuming paymentDetails indicates success
          setPaymentStatus('success');
        } else {
          // Handle cases where modal closes but payment wasn't successful or was cancelled
          setPaymentStatus('failed');
          setError('Payment was not successful or was cancelled.');
        }
      }).catch((sdkError) => {
        console.error('CashFree SDK error:', sdkError);
        setPaymentStatus('failed');
        setError('Payment processing failed due to an SDK error.');
      });

    } catch (err) {
      console.error('Payment failed', err);
      setError('Payment initiation failed. Please try again.');
      setPaymentStatus('failed'); // Reset status on error
    } finally {
      setIsPayLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error && paymentStatus !== 'failed') return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!content) return null;

  if (paymentStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
        <div className="w-full max-w-md glass-card p-12 rounded-3xl shadow-2xl relative overflow-hidden text-center">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
              <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Payment Successful!</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Welcome to the elite rank. Your transaction was processed successfully. Redirecting you to the mastery...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
        <div className="w-full max-w-md glass-card p-12 rounded-3xl shadow-2xl relative overflow-hidden text-center border-red-500/10">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 blur-[80px] rounded-full" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight text-gradient-red">Payment Failed</h1>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              {error || 'There was an issue processing your payment. Your funds are safe—please try again or contact support if the issue persists.'}
            </p>
            <button
              onClick={() => { setPaymentStatus('idle'); setError(''); }}
              className="w-full py-3 px-6 bg-white text-black rounded-xl font-bold hover:bg-slate-200 active:scale-[0.98] transition-all shadow-xl"
            >
              Retry Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4 animate-fade-in">
      <div className="w-full max-w-2xl glass-card rounded-[2.5rem] shadow-2xl p-12 relative overflow-hidden border-white/5">
        {/* Decorative Glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/5 blur-[120px] rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Order <span className="text-gradient">Summary</span></h1>
            <p className="text-slate-500 text-sm">Review your selection before finalizing membership.</p>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
            Step 2 of 2
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="p-6 bg-slate-900/40 rounded-3xl border border-white/5">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Course Title</span>
                <span className="text-xl font-bold text-white tracking-tight leading-tight">{content.title}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Price</span>
                <span className="text-xl font-bold text-white">₹{content.price}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-center bg-transparent">
              <span className="text-lg font-bold text-slate-300">Total Amount</span>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-bold text-emerald-400 glow-text drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">₹{content.price}</span>
                <span className="text-[10px] text-slate-600 font-medium">All relative taxes included</span>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <button
              onClick={handlePayment}
              disabled={isPayLoading || paymentStatus === 'processing'}
              className="w-full bg-white text-black rounded-2xl font-bold py-4 px-6 text-xl transition-all duration-300 hover:bg-slate-100 hover:scale-[1.01] active:scale-[0.98] shadow-2xl shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isPayLoading || paymentStatus === 'processing' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <span>Processing Securely...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Purchase</span>
                    <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </div>
            </button>
            <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
              <div className="w-8 h-4 bg-slate-500 rounded-sm" />
              <div className="w-8 h-4 bg-slate-500 rounded-sm" />
              <div className="w-8 h-4 bg-slate-500 rounded-sm" />
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">PCI-DSS Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Checkout;
