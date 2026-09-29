import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Droplet, AlertCircle, KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';

export function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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

      {/* Main Form Body */}
      <div className="flex-1 flex items-center justify-center p-4 py-12 bg-white">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
          {/* Card Header */}
          <div className="mb-6 space-y-2 text-left">
            <h1 className="font-serif text-3xl font-bold text-[#152e52]">AquaBophelo</h1>
            <div className="flex items-center gap-2 border-l-2 border-[#2e7d32] pl-2">
              <span className="text-[#2e7d32] font-medium text-xs italic">
                {t('motto')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              {t('subheading')}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                {t('emailAddress')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. resident@solplaatje.gov.za"
                required
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] focus:ring-1 focus:ring-[#1d70b8]"
              />
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
                  placeholder="Your password"
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
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-medium text-[#1d70b8] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#1d70b8]" />
                  <span>{t('forgotPasswordTitle')}?</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#152e52] hover:bg-[#0f223d] text-white py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Signing in...' : t('loginButton')}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-slate-200 text-center space-y-3">
            <p className="text-xs text-slate-500 font-normal">
              {t('dontHaveAccount')}{' '}
              <Link to="/register" className="text-[#1d70b8] hover:underline font-medium">
                {t('createAccount')}
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
      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
    </div>
  );
}

export default Login;
