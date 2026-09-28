import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../api/client';
import { User, Mail, Phone, Lock, MapPin, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, KeyRound, Clock, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [area, setArea] = useState('Galeshewe');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP Step State & 5-minute Countdown Timer (300s)
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('482915');
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [otpError, setOtpError] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPasswordLongEnough = password.length >= 6;
  const doPasswordsMatch = password && confirmPassword && password === confirmPassword;

  useEffect(() => {
    let interval = null;
    if (isOtpStep && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsOtpExpired(true);
      setOtpError('OTP Code has expired (5-minute limit reached). Please click "Resend New OTP" below.');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOtpStep, otpTimer]);

  const handleInitialSubmit = (e) => {
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
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit South African phone number.');
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

    sendNewOtp();
    setIsOtpStep(true);
  };

  const sendNewOtp = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpTimer(300);
    setIsOtpExpired(false);
    setOtpError('');
    setOtpCode('');

    try {
      await api.post('/auth/send-otp', { email, code });
    } catch (err) {
      console.warn('Backend OTP email dispatch notice:', err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (isOtpExpired) {
      setOtpError('This OTP code has expired. Please click "Resend New OTP" to get a fresh 5-minute code.');
      return;
    }

    if (otpCode !== generatedOtp) {
      setOtpError('Invalid OTP code. Please check the email code sent to you.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({ email, password, fullName, area, phoneNumber });
      if (res && res.success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setOtpError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-blue via-white to-white flex items-center justify-center p-4 selection:bg-brand-accent selection:text-white">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-md relative">
        {/* Header */}
        <div className="text-center mb-6 space-y-2">
          <Link to="/" className="inline-block group">
            <div className="w-16 h-16 bg-surface-blue border border-brand-accent/30 rounded-2xl flex items-center justify-center mx-auto p-2 shadow-xs transition-transform group-hover:scale-105">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-12 h-12 object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-brand-navy tracking-tight">Resident Account Registration</h1>
          <p className="text-xs text-brand-green font-semibold italic">Elke druppel tel • Metsi ke bophelo</p>
          <p className="text-xs text-muted">Sol Plaatje Municipal Water Portal</p>
        </div>

        {isOtpStep ? (
          /* STEP 2: OTP VERIFICATION */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-4 bg-surface-blue border border-brand-accent/30 rounded-xl text-center space-y-2">
              <KeyRound className="w-8 h-8 text-brand-blue mx-auto" />
              <h3 className="font-extrabold text-base text-brand-navy">Verify Email Contact</h3>
              <p className="text-xs text-muted leading-relaxed">
                A 6-digit OTP verification code has been dispatched to <strong className="text-brand-navy">{email}</strong>.
              </p>

              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="text-xs font-mono text-brand-green-dark bg-surface-green px-3 py-1 rounded-full border border-brand-green/30 font-semibold">
                  Demo OTP: {generatedOtp}
                </span>

                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${
                    isOtpExpired
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-blue-50 text-brand-blue border-blue-200'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{isOtpExpired ? 'EXPIRED' : `Expires ${formatTimer(otpTimer)}`}</span>
                </span>
              </div>
            </div>

            {otpError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="leading-relaxed">{otpError}</span>
              </div>
            )}

            <Input
              label="Enter 6-Digit OTP Code"
              placeholder="e.g. 482915"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              disabled={isOtpExpired}
              required
            />

            <Button
              type="submit"
              variant="default"
              size="lg"
              isLoading={isSubmitting}
              disabled={isOtpExpired}
              className="w-full font-bold"
            >
              <span>Verify &amp; Activate Account</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="pt-2 flex items-center justify-between text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="text-muted hover:text-brand-navy transition-colors cursor-pointer"
              >
                ← Edit Contact Details
              </button>

              <button
                type="button"
                onClick={sendNewOtp}
                className="text-brand-blue hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend New OTP</span>
              </button>
            </div>
          </form>
        ) : (
          /* STEP 1: REGISTRATION DETAILS */
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 text-xs text-red-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nomcebo Nkosi"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nomcebo@example.co.za"
              required
            />

            <Input
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 082 123 4567"
              helperText="Used for municipal notification broadcasts"
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-brand-navy">
                Residential Suburb Area <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-white text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                >
                  <option value="Galeshewe">Galeshewe</option>
                  <option value="Kimberley Central">Kimberley Central</option>
                  <option value="Roodepan">Roodepan</option>
                </select>
              </div>
            </div>

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />

            <div>
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password"
                required
              />
              {confirmPassword && (
                <p
                  className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${
                    doPasswordsMatch ? 'text-brand-green-dark' : 'text-red-600'
                  }`}
                >
                  {doPasswordsMatch ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                      <span>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>Passwords do not match</span>
                    </>
                  )}
                </p>
              )}
            </div>

            <Button type="submit" variant="default" size="lg" className="w-full font-bold mt-2">
              <span>Send Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-border text-center space-y-3">
          <p className="text-xs text-muted">
            Already registered?{' '}
            <Link to="/login" className="text-brand-blue hover:underline font-bold">
              Sign In
            </Link>
          </p>

          <div className="inline-flex items-center space-x-1.5 text-[11px] text-muted bg-surface-blue px-3 py-1 rounded-full border border-brand-accent/20 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
            <span>5-Minute Expiring OTP Account Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
