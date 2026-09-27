import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Droplet, Lock, Mail, AlertCircle, ArrowRight, Loader2, ShieldCheck, Truck, User } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        // Role-based initial destination
        const userRole = res.user?.role || 'Resident';
        let targetPath = from;

        if (!from || from === '/' || from === '/dashboard') {
          if (userRole === 'Admin') targetPath = '/admin';
          else if (userRole === 'Driver') targetPath = '/driver/trip';
          else targetPath = '/dashboard';
        }

        navigate(targetPath, { replace: true });
      } else {
        setError(res?.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-2xl flex items-center justify-center mx-auto mb-3 p-1.5 shadow-lg">
            <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-[#E6EDF7] tracking-tight">AquaBophelo</h1>
          <p className="text-xs text-[#8A9BB8] mt-1">
            Sol Plaatje Municipality — Kimberley, Northern Cape
          </p>
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
