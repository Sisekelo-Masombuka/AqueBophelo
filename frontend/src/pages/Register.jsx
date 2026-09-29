import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import api from '../api/client';
import { Droplet, AlertCircle, CheckCircle2, KeyRound, Clock, RefreshCw, MapPin, Eye, EyeOff } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';

export function Register() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [area, setArea] = useState('Galeshewe');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (otpCode.trim() !== generatedOtp.trim() && otpCode.trim().length !== 6) {
      setOtpError('Invalid OTP code. Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ email, password, fullName, area, phoneNumber });
      navigate('/dashboard', { replace: true });
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
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#1d70b8] selection:text-white flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <BrandLogo variant="full" size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
            <Link to="/" className="text-slate-600 hover:text-[#152e52] transition-colors">
              {t('home')}
            </Link>
            <a href="/#water-status" className="text-slate-600 hover:text-[#152e52] transition-colors">
              {t('waterStatus')}
            </a>
            <a href="/#tankers" className="text-slate-600 hover:text-[#152e52] transition-colors">
              {t('liveMap')}
            </a>
            <Link to="/about" className="text-slate-600 hover:text-[#152e52] transition-colors">
              {t('aboutUs')}
            </Link>
            <Link to="/contact" className="text-slate-600 hover:text-[#152e52] transition-colors">
              {t('contactUs')}
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/login" className="text-sm font-medium text-[#152e52]">
              {t('signIn')}
            </Link>
            <Link to="/register">
              <button className="bg-[#152e52] hover:bg-[#0f223d] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer">
                {t('createAccount')}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <div className="flex-1 flex items-center justify-center p-4 py-12 bg-white">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
          {/* Card Header */}
          <div className="mb-6 space-y-2 text-left">
            <h1 className="font-serif text-3xl font-bold text-[#152e52]">{t('registerTitle')}</h1>
            <div className="flex items-center gap-2 border-l-2 border-[#2e7d32] pl-2">
              <span className="text-[#2e7d32] font-medium text-xs italic">
                {t('motto')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              {t('subheading')}
            </p>
          </div>

          {isOtpStep ? (
            /* STEP 2: OTP VERIFICATION */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-4 bg-[#f4f8fb] border border-[#bcd6ea] rounded-md text-center space-y-2">
                <KeyRound className="w-7 h-7 text-[#1d70b8] mx-auto" />
                <h3 className="font-serif font-bold text-base text-[#152e52]">{t('verifyEmail')}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A 6-digit verification code has been dispatched to <strong className="text-[#152e52]">{email}</strong>.
                </p>

                <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setOtpCode(generatedOtp)}
                    className="text-xs font-mono text-[#2e7d32] bg-[#f2f9f3] hover:bg-[#e2f3e4] px-3 py-1 rounded-md border border-[#b8e3bd] font-bold cursor-pointer transition-colors"
                    title="Click to auto-fill OTP code"
                  >
                    Demo OTP: {generatedOtp} (Click to auto-fill)
                  </button>

                  <span
                    className={`text-xs font-mono font-medium px-3 py-1 rounded-md border flex items-center gap-1 ${
                      isOtpExpired
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-blue-50 text-[#1d70b8] border-blue-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isOtpExpired ? 'EXPIRED' : `Expires ${formatTimer(otpTimer)}`}</span>
                  </span>
                </div>
              </div>

              {otpError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-relaxed">{otpError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t('otpLabel')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 482915"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  disabled={isOtpExpired}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isOtpExpired}
                className="w-full bg-[#152e52] hover:bg-[#0f223d] text-white py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Verifying...' : t('verifyButton')}
              </button>

              <div className="pt-2 flex items-center justify-between text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="text-slate-500 hover:text-[#152e52] transition-colors cursor-pointer"
                >
                  ← Edit registration details
                </button>

                <button
                  type="button"
                  onClick={sendNewOtp}
                  className="text-[#1d70b8] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t('resendOtp')}</span>
                </button>
              </div>
            </form>
          ) : (
            /* STEP 1: REGISTRATION DETAILS */
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t('fullName')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nomcebo Nkosi"
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t('emailAddress')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nomcebo@example.co.za"
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t('phoneNumber')}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 082 123 4567"
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('phoneUsageNote')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t('suburbArea')}
                </label>
                <div className="relative">
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
                  >
                    <option value="Galeshewe">Galeshewe</option>
                    <option value="Kimberley Central">Kimberley Central</option>
                    <option value="Roodepan">Roodepan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t('password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={showPassword ? t('hidePassword') : t('showPassword')}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t('confirmPassword')}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    required
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={showConfirmPassword ? t('hidePassword') : t('showPassword')}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <p
                    className={`text-xs font-medium mt-1.5 flex items-center gap-1 ${
                      doPasswordsMatch ? 'text-[#2e7d32]' : 'text-red-600'
                    }`}
                  >
                    {doPasswordsMatch ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
                        <span>{t('passwordsMatch')}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>{t('passwordsDontMatch')}</span>
                      </>
                    )}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#152e52] hover:bg-[#0f223d] text-white py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer mt-2"
              >
                {t('sendVerificationCode')}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-slate-200 text-center space-y-3">
            <p className="text-xs text-slate-500 font-normal">
              {t('alreadyRegistered')}{' '}
              <Link to="/login" className="text-[#1d70b8] hover:underline font-medium">
                {t('signIn')}
              </Link>
            </p>

            <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-normal">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>{t('officialAuth')}</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
