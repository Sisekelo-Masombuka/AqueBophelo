import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
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

  // HCI Error Prevention: inline validation
  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid municipal email address.');
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
        setError(res?.error || 'Invalid email or password. Please verify your details.');
      }
    } catch (err) {
      setError(err?.message || 'Unable to connect to AquaBophelo service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4 selection:bg-[#0284C7] selection:text-white">
      <div className="w-full max-w-md bg-[#111B2E] border border-[#1F2C45] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Decorative Gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0284C7]/10 blur-3xl rounded-full pointer-events-none" />

        {/* Branding Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group mb-3">
            <div className="w-16 h-16 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-2xl flex items-center justify-center mx-auto p-2 shadow-lg transition-transform group-hover:scale-105">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-12 h-12 object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#E6EDF7] tracking-tight">AquaBophelo</h1>
          <p className="text-xs text-[#16A34A] font-semibold italic mt-0.5">Elke druppel tel • Metsi ke bophelo</p>
          <p className="text-xs text-[#8A9BB8] mt-1.5">Sol Plaatje Municipality — Kimberley, Northern Cape</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2.5 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. resident@solplaatje.gov.za"
            required
          />

          <div>
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs text-sky-400 hover:underline font-medium inline-flex items-center space-x-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>Forgot Password?</span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full mt-2"
          >
            <span>Sign In to Water Portal</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Registration Link & Civic Trust Footer */}
        <div className="mt-8 pt-5 border-t border-[#1F2C45] text-center space-y-3">
          <p className="text-xs text-[#8A9BB8]">
            Don&apos;t have a resident account yet?{' '}
            <Link to="/register" className="text-sky-400 hover:underline font-bold">
              Sign Up
            </Link>
          </p>

          <div className="inline-flex items-center space-x-1.5 text-[11px] text-[#8A9BB8] bg-[#0B1220] px-3 py-1 rounded-full border border-[#1F2C45]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Official Sol Plaatje Municipal Authentication</span>
          </div>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
    </div>
  );
}

export default Login;
