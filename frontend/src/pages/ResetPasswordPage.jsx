import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import { Droplet, KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Footer from '../components/Footer';

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
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#1d70b8] selection:text-white flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <BrandLogo variant="full" size="md" />
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/login" className="text-sm font-medium text-[#152e52]">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-12 bg-white">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
          {/* Card Header */}
          <div className="mb-6 space-y-2 text-left">
            <h1 className="font-serif text-3xl font-bold text-[#152e52]">Set New Password</h1>
            <div className="flex items-center gap-2 border-l-2 border-[#2e7d32] pl-2">
              <span className="text-[#2e7d32] font-medium text-xs italic">
                Elke druppel tel • Metsi ke bophelo
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Sol Plaatje Municipal Account Security &amp; Password Reset
            </p>
          </div>

          {success ? (
            <div className="p-6 bg-[#f2f9f3] border border-[#b8e3bd] rounded-lg text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#2e7d32] mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#152e52]">Password Reset Successful!</h3>
              <p className="text-xs text-slate-600">
                Your account credentials have been updated. Redirecting to Login screen...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-relaxed">{error}</span>
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

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Reset code / token
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste the reset token code from your email here..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Confirm new password
                </label>
                <input
                  type="password"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#152e52] hover:bg-[#0f223d] text-white py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Resetting password...' : 'Reset password'}
              </button>

              <div className="pt-2 text-center">
                <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs text-[#1d70b8] hover:underline font-medium">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ResetPasswordPage;
