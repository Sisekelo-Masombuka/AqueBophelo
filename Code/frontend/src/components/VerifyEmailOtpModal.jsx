import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, MailCheck, RefreshCw } from 'lucide-react';
import api from '../api/client';

export function VerifyEmailOtpModal({ isOpen, onClose, initialEmail = '', onSuccess }) {
  const [email, setEmail] = useState(initialEmail);
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    setEmail(cleanEmail);

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/v1/auth/confirm-email', {
        email: cleanEmail,
        token: otpCode.trim(),
      });
      setSuccessMessage('Email verified successfully! Signing you in...');
      setTimeout(() => {
        onSuccess?.(cleanEmail);
      }, 750);
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Please check the code and try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    setEmail(cleanEmail);

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsResending(true);
    try {
      await api.post('/api/v1/auth/send-otp', {
        email: cleanEmail,
        purpose: 'EmailVerification',
      });
      setSuccessMessage(`A fresh 6-digit code has been dispatched to ${cleanEmail}.`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend code. Please wait a minute and try again.';
      setError(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccessMessage('');
    setOtpCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 shadow-xl relative text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1d70b8] shrink-0">
              <MailCheck className="w-5 h-5 text-[#1d70b8]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#152e52]">Verify Email Address</h2>
              <p className="text-xs text-slate-500">Enter your 6-digit code to activate your account</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="resident@solplaatje.gov.za"
              required
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">
                6-Digit Verification Code (OTP)
              </label>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-xs text-[#1d70b8] hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
              </button>
            </div>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 482915"
              required
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-mono tracking-widest text-center text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
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
              {isSubmitting ? 'Verifying...' : 'Verify & Activate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmailOtpModal;
