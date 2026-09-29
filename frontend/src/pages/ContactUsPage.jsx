import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Phone, Mail, MapPin, CheckCircle2, AlertCircle, Clock, Droplet, Send } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export function ContactUsPage() {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessResponse(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!message.trim()) {
      setError('Please type your inquiry message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/contact', {
        fullName,
        email,
        subject,
        message,
      });

      setSuccessResponse(response.data);
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit inquiry. Please try again.';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col selection:bg-[#1d70b8] selection:text-white">
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
            <Link to="/contact" className="text-[#152e52] font-semibold">
              {t('contactUs')}
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-[#152e52]">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 flex-1 space-y-8 w-full">
        {/* Header Title */}
        <div className="space-y-1 text-left">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#152e52]">
            {t('contactUs')}
          </h1>
          <p className="text-slate-500 text-sm">
            {t('contactDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Emergency Hotlines Card */}
          <div className="md:col-span-4 bg-[#f8fafc] border border-slate-200 rounded-lg p-6 space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#152e52]">{t('emergencyHotlines')}</h2>

            <div className="space-y-5 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#152e52] shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 font-normal">{t('response247')}</p>
                  <p className="font-bold text-[#152e52] text-sm mt-0.5">053 830 6100</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#152e52] shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 font-normal">{t('callCentre')}</p>
                  <p className="font-bold text-[#152e52] text-sm mt-0.5">053 830 6911</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#152e52] shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 font-normal">Official email</p>
                  <p className="font-bold text-[#152e52] text-xs mt-0.5">water@solplaatje.org.za</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#152e52] shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 font-normal">Municipal office location</p>
                  <p className="text-slate-700 text-xs mt-0.5 leading-relaxed">
                    Sol Plaatje Civic Centre, Sol Plaatje Drive, Kimberley, 8301
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200 space-y-1">
              <p className="text-xs font-semibold text-[#152e52] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Response time (CAT)</span>
              </p>
              <p className="text-[11px] text-slate-500">Inquiries submitted online are answered within 24 hours.</p>
            </div>
          </div>

          {/* Send Support Inquiry Card */}
          <div className="md:col-span-8 bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#152e52]">{t('contactTitle')}</h2>

            {successResponse && (
              <div className="p-4 rounded-md bg-[#f2f9f3] border border-[#2e7d32]/30 text-[#2e7d32] space-y-1">
                <p className="font-semibold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
                  <span>{successResponse.message}</span>
                </p>
                <p className="text-xs font-mono">Reference Ticket: <strong>{successResponse.referenceNumber}</strong></p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    {t('yourName')} *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sipho Nkosi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    {t('emailAddress')} *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. sipho@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t('subject')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Water tanker schedule query in Galeshewe"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t('message')} *
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-white border border-slate-300 rounded-md p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1d70b8] resize-y"
                  placeholder="Describe your inquiry or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#152e52] hover:bg-[#0f223d] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : t('sendMessage')}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Shared Municipal Footer */}
      <Footer />
    </div>
  );
}

export default ContactUsPage;
