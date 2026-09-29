import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccessMessage(response.data?.message || `If an account exists with ${email}, password reset instructions have been sent.`);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to request password reset. Please try again.';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccessMessage('');
    setError('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 shadow-xl relative text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-[#eaf4fb] border border-[#bcd6ea] flex items-center justify-center text-[#1d70b8] shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#152e52]">Reset Password</h3>
              <p className="text-xs text-slate-500">Sol Plaatje Municipal Account Security</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="p-5 bg-[#f2f9f3] border border-[#b8e3bd] rounded-md text-center space-y-3 my-2">
            <CheckCircle2 className="w-10 h-10 text-[#2e7d32] mx-auto" />
            <p className="text-sm font-medium text-[#152e52]">{successMessage}</p>
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to={`/reset-password?email=${encodeURIComponent(email)}`}
                onClick={handleClose}
                className="w-full py-2 bg-[#152e52] hover:bg-[#0f223d] text-white text-xs font-medium rounded-md flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <span>Enter Reset Code / Token</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter the email address associated with your AquaBophelo account. We will send you a secure password reset token.
            </p>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="e.g. resident@solplaatje.gov.za"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#152e52] hover:bg-[#0f223d] text-white rounded-md text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send reset token'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
