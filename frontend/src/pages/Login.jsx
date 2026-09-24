import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Droplet, Lock, Mail, AlertCircle, ArrowRight, Loader2, ShieldCheck, Truck, User } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('nomcebo@aquabophelo.gov.za');
  const [password, setPassword] = useState('Resident#Aqua2026');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // HCI Error Prevention: inline validation
  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
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
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Account Selectors
  const setQuickRole = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#22D3EE]/10 text-[#22D3EE] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Droplet className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#E6EDF7] tracking-tight">AquaBophelo</h1>
          <p className="text-xs text-[#8A9BB8] mt-1">
            Sol Plaatje Municipality — Kimberley, Northern Cape
          </p>
        </div>

        {/* Demo Fast-Login Pills for Testing */}
        <div className="mb-6 p-3 bg-[#0B1220] rounded-xl border border-[#1F2C45]">
          <p className="text-[11px] font-semibold text-[#8A9BB8] uppercase tracking-wider mb-2 text-center">
            Demo Fast-Login (HCI Quick Role Switch)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setQuickRole('nomcebo@aquabophelo.gov.za', 'Resident#Aqua2026')}
              className="py-1.5 px-2 bg-[#111B2E] hover:bg-[#1F2C45] text-xs text-[#22D3EE] rounded-lg border border-[#22D3EE]/30 flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3 h-3" />
              <span>Resident</span>
            </button>
            <button
              type="button"
              onClick={() => setQuickRole('driver@aquabophelo.gov.za', 'Driver#Aqua2026')}
              className="py-1.5 px-2 bg-[#111B2E] hover:bg-[#1F2C45] text-xs text-[#F59E0B] rounded-lg border border-[#F59E0B]/30 flex items-center justify-center gap-1 transition-colors"
            >
              <Truck className="w-3 h-3" />
              <span>Driver</span>
            </button>
            <button
              type="button"
              onClick={() => setQuickRole('admin@aquabophelo.gov.za', 'Admin#Aqua2026')}
              className="py-1.5 px-2 bg-[#111B2E] hover:bg-[#1F2C45] text-xs text-[#22C55E] rounded-lg border border-[#22C55E]/30 flex items-center justify-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg flex items-center space-x-2 text-xs text-[#EF4444]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8A9BB8] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A9BB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. resident@aquabophelo.gov.za"
                className="w-full pl-10 pr-4 py-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] placeholder-[#8A9BB8]/50 focus:outline-hidden focus:border-[#22D3EE] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8A9BB8] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A9BB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] placeholder-[#8A9BB8]/50 focus:outline-hidden focus:border-[#22D3EE] transition-colors"
                required
              />
            </div>
          </div>

          {/* Submit Action Button with 48px touch target */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] mt-2 py-3 px-4 bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0B1220] font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to AquaBophelo</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-4 border-t border-[#1F2C45] text-center">
          <p className="text-xs text-[#8A9BB8]">
            Are you a Sol Plaatje resident without an account?{' '}
            <Link to="/register" className="text-[#22D3EE] hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
