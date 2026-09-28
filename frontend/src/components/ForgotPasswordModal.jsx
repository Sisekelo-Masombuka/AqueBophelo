import React, { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#0E4C8C] border border-[#0A2A4F] rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-[#F0F7FF]">
        <div className="flex items-center justify-between border-b border-[#0A2A4F] pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2991C8]/20 border border-[#2991C8]/40 flex items-center justify-center text-[#2991C8] shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F0F7FF]">Reset Password</h3>
              <p className="text-xs text-[#A3C7EB]">Sol Plaatje Municipal Account Security</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#A3C7EB] hover:text-[#F0F7FF] p-1.5 rounded-lg hover:bg-[#0A2A4F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="p-5 bg-[#2E9E4F]/20 border border-[#2E9E4F]/40 rounded-2xl text-center space-y-3 my-2">
            <CheckCircle2 className="w-10 h-10 text-[#2E9E4F] mx-auto" />
            <p className="text-sm font-bold text-[#F0F7FF]">{successMessage}</p>
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to={`/reset-password?email=${encodeURIComponent(email)}`}
                onClick={handleClose}
                className="w-full py-2.5 bg-[#2E9E4F] hover:bg-[#215E22] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all"
              >
                <span>Enter Reset Code / Token</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Button variant="outline" size="sm" onClick={handleClose} className="w-full text-xs">
                Back to Login
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-[#A3C7EB] leading-relaxed">
              Enter the email address associated with your AquaBophelo account. We will send you a secure password reset token.
            </p>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="e.g. resident@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="pt-2 flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={handleClose} className="text-[#A3C7EB]">
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} className="bg-[#2E9E4F] hover:bg-[#215E22] text-white">
                Send Reset Token
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
