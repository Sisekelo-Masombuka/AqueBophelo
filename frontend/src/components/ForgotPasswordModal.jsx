import React, { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(`Password reset instructions have been sent to ${email}. Please check your inbox.`);
    }, 800);
  };

  const handleClose = () => {
    setSuccessMessage('');
    setError('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[#1F2C45] pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#E6EDF7]">Reset Password</h3>
              <p className="text-xs text-[#8A9BB8]">Sol Plaatje Municipal Account Security</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#8A9BB8] hover:text-[#E6EDF7] p-1.5 rounded-lg hover:bg-[#1F2C45] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="p-5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-center space-y-3 my-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-[#E6EDF7]">{successMessage}</p>
            <Button variant="outline" size="sm" onClick={handleClose} className="mt-2">
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-[#8A9BB8] leading-relaxed">
              Enter the email address associated with your AquaBophelo account. We will send you a secure link to reset your password.
            </p>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="e.g. resident@solplaatje.gov.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="pt-2 flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
