import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import { KeyRound, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email || !email.includes('@')) {
      setError('Please enter your valid email address.');
      return;
    }
    if (!token.trim()) {
      setError('Please paste the Reset Token received in your email.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-check.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        token,
        newPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Password reset failed. Please check your reset token.';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A2A4F] text-[#F0F7FF] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#0E4C8C] border border-[#0A2A4F] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#2991C8]/20 border border-[#2991C8]/40 text-[#2991C8] flex items-center justify-center mx-auto shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#F0F7FF] tracking-tight">Set New Password</h1>
          <p className="text-xs text-[#A3C7EB]">Sol Plaatje Municipal Account Security</p>
        </div>

        {success ? (
          <div className="p-6 bg-[#2E9E4F]/20 border border-[#2E9E4F]/40 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#2E9E4F] mx-auto" />
            <h3 className="font-bold text-base text-[#F0F7FF]">Password Reset Successful!</h3>
            <p className="text-xs text-[#A3C7EB]">Your account credentials have been updated. Redirecting to Login screen...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Email Address *"
              type="email"
              icon={Mail}
              placeholder="e.g. resident@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#F0F7FF]">Reset Code / Token *</label>
              <textarea
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1B5D9E] bg-[#0A2A4F] text-[#F0F7FF] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2991C8]"
                placeholder="Paste the reset token code from your email here..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>

            <Input
              label="New Password *"
              type="password"
              icon={Lock}
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password *"
              type="password"
              icon={Lock}
              placeholder="Re-type new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-3 bg-[#2E9E4F] hover:bg-[#215E22] text-white font-bold rounded-xl shadow-md cursor-pointer transition-all"
            >
              Reset Password
            </Button>

            <div className="pt-2 text-center">
              <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs text-[#A3C7EB] hover:text-[#F0F7FF] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
