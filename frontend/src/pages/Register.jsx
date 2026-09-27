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

  // HCI Error Prevention: live validation rules
  const isPasswordLongEnough = password.length >= 6;
  const doPasswordsMatch = password && confirmPassword && password === confirmPassword;

  // Active 5-minute countdown timer effect
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
      setError('Please enter a valid 10-digit South African phone number for SMS alerts.');
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

    // Generate random 6-digit OTP and start 5-min timer
    sendNewOtp();
    setIsOtpStep(true);
  };

  const sendNewOtp = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpTimer(300); // Reset to 5 minutes (300 seconds)
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
      setOtpError('Invalid OTP code. Please check the SMS/Email code sent to you.');
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

  // Format seconds into MM:SS format
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4 selection:bg-[#0284C7] selection:text-white">
      <div className="w-full max-w-md bg-[#111B2E] border border-[#1F2C45] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Gradient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#16A34A]/10 blur-3xl rounded-full pointer-events-none" />

        {/* Branding Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group mb-3">
            <div className="w-16 h-16 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-2xl flex items-center justify-center mx-auto p-2 shadow-lg transition-transform group-hover:scale-105">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-12 h-12 object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#E6EDF7] tracking-tight">Resident Registration</h1>
          <p className="text-xs text-[#16A34A] font-semibold italic mt-0.5">Elke druppel tel • Metsi ke bophelo</p>
          <p className="text-xs text-[#8A9BB8] mt-1">Sol Plaatje Municipal Water Portal</p>
        </div>

        {/* STEP 2: OTP VERIFICATION SCREEN WITH 5-MIN EXPIRATION */}
        {isOtpStep ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-2xl text-center space-y-2">
              <KeyRound className="w-8 h-8 text-sky-400 mx-auto" />
              <h3 className="font-extrabold text-base text-[#E6EDF7]">Verify Your Contact Details</h3>
              <p className="text-xs text-[#8A9BB8]">
                A 6-digit OTP verification code has been dispatched to <strong className="text-[#E6EDF7]">{phoneNumber}</strong> and <strong className="text-[#E6EDF7]">{email}</strong>.
              </p>

              {/* Live Countdown & Expiry Indicator */}
              <div className="pt-2 flex items-center justify-center space-x-2">
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  Demo SMS OTP: {generatedOtp}
                </span>

                <span
                  className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border flex items-center space-x-1 ${
                    isOtpExpired
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{isOtpExpired ? 'EXPIRED' : `Expires in ${formatTimer(otpTimer)}`}</span>
                </span>
              </div>
            </div>

            {otpError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{otpError}</span>
              </div>
            )}

            <Input
              label="Enter 6-Digit OTP Code"
              icon={KeyRound}
              placeholder="e.g. 482915"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              disabled={isOtpExpired}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              isDisabled={isOtpExpired}
              className="w-full"
            >
              <span>Verify &amp; Activate Account</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            {/* Resend OTP Action */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="text-[#8A9BB8] hover:text-white font-medium"
              >
                ← Edit Phone/Email
              </button>

              <button
                type="button"
                onClick={sendNewOtp}
                className="text-sky-400 hover:underline font-bold flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend New OTP</span>
              </button>
            </div>
          </form>
        ) : (
          /* STEP 1: REGISTRATION FORM */
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            {error && (
              <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2.5 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <Input
              label="Full Name"
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nomcebo Nkosi"
              required
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nomcebo@example.co.za"
              required
            />

            <Input
              label="Phone Number (SMS Water Alerts)"
              icon={Phone}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 082 123 4567"
              helpText="Required for SMS delivery schedules and pipe burst alerts"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-[#8A9BB8] mb-1.5">
                Municipal Area (Kimberley Suburb) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#8A9BB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] focus:outline-none focus:border-[#0284C7] transition-all"
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
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />

            <div>
              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password"
                required
              />
              {confirmPassword && (
                <p
                  className={`text-[11px] font-medium mt-1.5 flex items-center gap-1 ${
                    doPasswordsMatch ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
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

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
              <span>Send OTP Verification</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#1F2C45] text-center space-y-3">
          <p className="text-xs text-[#8A9BB8]">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-400 hover:underline font-bold">
              Sign In
            </Link>
          </p>

          <div className="inline-flex items-center space-x-1.5 text-[11px] text-[#8A9BB8] bg-[#0B1220] px-3 py-1 rounded-full border border-[#1F2C45]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Public Resident Signup (5-Min OTP Expiry Protected)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
