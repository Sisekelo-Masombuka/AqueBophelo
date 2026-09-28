import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, KeyRound, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res && res.success) {
        const userRole = res.user?.role || 'Resident';
        let targetPath = from;

        if (!from || from === '/' || from === '/dashboard') {
          if (userRole === 'Admin') targetPath = '/admin';
          else if (userRole === 'Driver') targetPath = '/driver/trip';
          else targetPath = '/dashboard';
        }

        navigate(targetPath, { replace: true });
      } else {
        setError(res?.error || 'Invalid email address or password.');
      }
    } catch (err) {
      setError(err?.message || 'Unable to connect to AquaBophelo service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-blue via-white to-white flex items-center justify-center p-4 selection:bg-brand-accent selection:text-white">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-md relative">
        {/* Branding Header */}
        <div className="text-center mb-6 space-y-2">
          <Link to="/" className="inline-block group">
            <div className="w-16 h-16 bg-surface-blue border border-brand-accent/30 rounded-2xl flex items-center justify-center mx-auto p-2 shadow-xs transition-transform group-hover:scale-105">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-12 h-12 object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-brand-navy tracking-tight">AquaBophelo</h1>
          <p className="text-xs text-brand-green font-semibold italic">Elke druppel tel • Metsi ke bophelo</p>
          <p className="text-xs text-muted">Sol Plaatje Municipality — Kimberley Water Portal</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. resident@solplaatje.gov.za"
            required
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs font-semibold text-brand-blue hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3 h-3 text-brand-blue" />
                <span>Forgot Password?</span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            isLoading={isSubmitting}
            className="w-full font-bold mt-2"
          >
            <span>Sign In to Water Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Registration Link & Civic Footer */}
        <div className="mt-8 pt-5 border-t border-border text-center space-y-3">
          <p className="text-xs text-muted">
            Don&apos;t have an account yet?{' '}
            <Link to="/register" className="text-brand-blue hover:underline font-bold">
              Create Account
            </Link>
          </p>

          <div className="inline-flex items-center space-x-1.5 text-[11px] text-muted bg-surface-blue px-3 py-1 rounded-full border border-brand-accent/20 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
            <span>Official Sol Plaatje Municipal Authentication</span>
          </div>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
    </div>
  );
}

export default Login;
