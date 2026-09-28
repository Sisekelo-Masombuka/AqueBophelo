import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ContactUsPage() {
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
    <div className="min-h-screen bg-[#EAF6FC] text-[#0A2A4F] flex flex-col font-sans">
      {/* Sol Plaatje Top Civic Banner */}
      <div className="bg-[#0A2A4F] text-[#F0F7FF] text-xs py-2 px-4 border-b border-[#0E4C8C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-2 font-semibold">
            <span className="bg-[#2E9E4F] text-white px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">Official</span>
            <span>SOL PLAATJE MUNICIPALITY — Kimberley, Northern Cape</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-[#A3C7EB]">
            <span>Emergency Water Line: <strong className="text-white">053 830 6100</strong></span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Call Centre: <strong className="text-white">053 830 6911</strong></span>
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <header className="bg-[#0E4C8C] text-white border-b border-[#0A2A4F] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/landing" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 p-1 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shrink-0">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>AquaBophelo</span>
                <span className="text-xs bg-[#2E9E4F] text-white px-2 py-0.5 rounded-full font-bold">SPM</span>
              </div>
              <p className="text-[10px] text-[#A3C7EB] font-semibold italic">Elke druppel tel • Metsi ke bophelo</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-bold text-[#A3C7EB]">
            <Link to="/landing" className="hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="text-white border-b-2 border-[#2E9E4F] pb-1">Contact Us</Link>
            <Link to="/landing#status" className="hover:text-white transition-colors">Dam Levels</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link to="/login" className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0A2A4F] text-white border border-[#2991C8]/40 hover:bg-[#2991C8] transition-all">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2E9E4F] text-white hover:bg-[#215E22] transition-all shadow-md">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-[#2E9E4F]/20 border border-[#2E9E4F]/40 text-[#215E22] text-xs font-bold uppercase tracking-wider">
            Municipal Support Desk
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A2A4F] tracking-tight">
            Contact Sol Plaatje Water Desk
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Have questions about water distribution, tanker schedules, or dam readings in Kimberley? Send us a message or reach out to our emergency hotlines.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Contact Info Sidebar Card */}
          <div className="bg-[#0E4C8C] text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold border-b border-[#2991C8]/40 pb-3">Emergency Hotlines</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#2991C8] shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-[#A3C7EB] font-semibold">24/7 Water Emergency Line</p>
                  <p className="font-extrabold text-white text-base">053 830 6100</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#2E9E4F] shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-[#A3C7EB] font-semibold">Sol Plaatje Call Centre</p>
                  <p className="font-extrabold text-white text-base">053 830 6911</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#2991C8] shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-[#A3C7EB] font-semibold">Official Email</p>
                  <p className="font-bold text-white text-xs">water@solplaatje.org.za</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#2E9E4F] shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-[#A3C7EB] font-semibold">Municipal Office Location</p>
                  <p className="text-xs text-white">Sol Plaatje Civic Centre, Sol Plaatje Drive, Kimberley, 8301</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0A2A4F] p-4 rounded-2xl border border-[#2991C8]/30 space-y-1">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2E9E4F]" />
                <span>Response Time (CAT)</span>
              </p>
              <p className="text-[11px] text-[#A3C7EB]">Inquiries submitted online are answered within 24 hours.</p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-[#2991C8]/20 shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-[#0A2A4F]">Send a Support Inquiry</h2>

            {successResponse && (
              <div className="p-4 rounded-2xl bg-[#EAF6E3] border border-[#2E9E4F]/40 text-[#215E22] space-y-1 animate-in fade-in">
                <p className="font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2E9E4F]" />
                  <span>{successResponse.message}</span>
                </p>
                <p className="text-xs font-mono">Reference Ticket: <strong>{successResponse.referenceNumber}</strong></p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Sipho Nkosi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                />

                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="e.g. sipho@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <Input
                label="Subject (Optional)"
                placeholder="e.g. Water Tanker Schedule Query in Galeshewe"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0A2A4F]">
                  Message Content *
                </label>
                <textarea
                  rows={5}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#2991C8] focus:border-transparent transition-all"
                  placeholder="Describe your inquiry or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#2E9E4F] hover:bg-[#215E22] text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Inquiry...' : 'Submit Support Inquiry'}</span>
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A2A4F] text-[#A3C7EB] border-t border-[#0E4C8C] py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-white">AquaBophelo — Sol Plaatje Municipality Water Monitoring</p>
            <p className="text-[11px] mt-1">Diploma in ICT Capstone Project · Sol Plaatje University, Kimberley</p>
          </div>
          <div className="flex space-x-6 text-xs font-semibold">
            <Link to="/landing" className="hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactUsPage;
