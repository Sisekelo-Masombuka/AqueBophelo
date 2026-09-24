import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Droplet, Lock, Mail, User, MapPin, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('Galeshewe');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // HCI Error Prevention: live validation rules
  const isPasswordLongEnough = password.length >= 6;
  const doPasswordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isPasswordLongEnough) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!doPasswordsMatch) {
      setError('Passwords do not match. Please re-check.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({ email, password, fullName, area });
      if (res && res.success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Branding Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#22D3EE]/10 text-[#22D3EE] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Droplet className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#E6EDF7] tracking-tight">Resident Registration</h1>
          <p className="text-xs text-[#8A9BB8] mt-1">
            Join the Sol Plaatje municipal water monitoring network
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="mb-6 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg flex items-center space-x-2 text-xs text-[#EF4444]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8A9BB8] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8A9BB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nomcebo Nkosi"
                className="w-full pl-10 pr-4 py-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] placeholder-[#8A9BB8]/50 focus:outline-hidden focus:border-[#22D3EE]"
                required
              />
            </div>
          </div>

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
                placeholder="nomcebo@example.co.za"
                className="w-full pl-10 pr-4 py-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] placeholder-[#8A9BB8]/50 focus:outline-hidden focus:border-[#22D3EE]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8A9BB8] mb-1.5">
              Municipal Area (Kimberley)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8A9BB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
              >
                <option value="Galeshewe">Galeshewe</option>
                <option value="Kimberley Central">Kimberley Central</option>
                <option value="Roodepan">Roodepan</option>
              </select>
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
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] placeholder-[#8A9BB8]/50 focus:outline-hidden focus:border-[#22D3EE]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8A9BB8] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A9BB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password"
                className="w-full pl-10 pr-4 py-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] placeholder-[#8A9BB8]/50 focus:outline-hidden focus:border-[#22D3EE]"
                required
              />
            </div>
            {/* Live Inline Match Feedback (HCI Heuristic #1) */}
            {confirmPassword && (
              <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${doPasswordsMatch ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {doPasswordsMatch ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Passwords do not match yet</span>
                  </>
                )}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] mt-2 py-3 px-4 bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0B1220] font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#1F2C45] text-center">
          <p className="text-xs text-[#8A9BB8]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#22D3EE] hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
