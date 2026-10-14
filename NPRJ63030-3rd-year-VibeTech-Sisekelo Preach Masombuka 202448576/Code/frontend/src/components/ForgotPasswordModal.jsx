import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, KeyRound, ArrowRight, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [accountNotFound, setAccountNotFound] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAccountNotFound(false);
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/api/v1/auth/forgot-password', { email });
      setSuccessMessage(response.data?.message || `A password reset code has been sent to ${email}.`);
    } catch (err) {
      if (
        err.response?.data?.notFound ||
        err.response?.status === 404 ||
        err.response?.data?.message?.includes('No account was found')
      ) {
        setAccountNotFound(true);
      } else {
        const errMsg = err.response?.data?.message || 'Failed to request password reset. Please try again.';
        setError(errMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccessMessage('');
    setError('');
    setAccountNotFound(false);
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 shadow-xl relative text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-info-bg border border-info-border flex items-center justify-center text-blue shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-navy">Reset Password</h3>
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

        {accountNotFound ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-left space-y-3 my-2 animate-in fade-in">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-700">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-amber-950">No Account Found</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  We couldn't find an AquaBophelo account linked to <strong className="text-[#152e52]">{email}</strong>.
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To save unnecessary email dispatches, password reset codes are only sent to existing accounts.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                to="/register"
                onClick={handleClose}
                className="flex-1 py-2 px-3 bg-[#152e52] hover:bg-[#0f223d] text-white text-xs font-semibold rounded-md flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create an Account</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setAccountNotFound(false);
                  setEmail('');
                }}
                className="py-2 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Try Another Email
              </button>
            </div>
          </div>
        ) : successMessage ? (
          <div className="p-5 bg-success-bg border border-success-border rounded-md text-center space-y-3 my-2">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
            <p className="text-sm font-medium text-navy">{successMessage}</p>
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to={`/reset-password?email=${encodeURIComponent(email)}`}
                onClick={handleClose}
                className="w-full py-2 bg-navy hover:bg-navy-dark text-white text-xs font-medium rounded-md flex items-center justify-center space-x-2 transition-colors cursor-pointer"
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
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue"
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
                className="px-4 py-2 bg-navy hover:bg-navy-dark text-white rounded-md text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
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
