import React, { useState } from 'react';
import { X, Bell, Mail, CheckCircle2, AlertCircle, Loader2, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function AlertSubscriptionsModal({ isOpen, onClose }) {
  const { user } = useAuth();

  const [area, setArea] = useState(user?.area || 'Galeshewe');
  const [receiveEmail, setReceiveEmail] = useState(true);
  const [email, setEmail] = useState(user?.email || 'resident@solplaatje.gov.za');
  const [lowDamAlerts, setLowDamAlerts] = useState(true);
  const [truckArrivalAlerts, setTruckArrivalAlerts] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address for alerts.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(`Email alert subscriptions successfully updated for ${area}!`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1400);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg bg-white border border-border rounded-3xl p-6 shadow-soft relative text-brand-navy-dark max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brand-accent/10 text-brand-blue">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-navy-dark">Municipal Email Alert Preferences</h2>
              <p className="text-xs text-muted">
                Get real-time email notices &amp; delivery updates for your neighborhood
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-brand-navy-dark hover:bg-surface-blue transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Municipal Area Selection */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Select Subscribed Suburb / Area
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-border rounded-xl text-sm text-brand-navy-dark focus:outline-none focus:border-brand-accent"
              >
                <option value="Galeshewe">Galeshewe (Zones 1-4)</option>
                <option value="Kimberley Central">Kimberley Central</option>
                <option value="Roodepan">Roodepan</option>
              </select>
            </div>
          </div>

          {/* Primary Email Channel */}
          <div>
            <Input
              label="Recipient Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="resident@example.co.za"
              helpText="Direct email notifications for water tanker dispatches and drought advisories"
              required
            />
          </div>

          {/* Alert Trigger Topics */}
          <div>
            <label className="block text-xs font-semibold text-[#8A9BB8] uppercase tracking-wider mb-2">
              Email Alert Topics
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-border cursor-pointer text-xs text-brand-navy-dark">
                <input
                  type="checkbox"
                  checked={lowDamAlerts}
                  onChange={(e) => setLowDamAlerts(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-brand-blue"
                />
                <div>
                  <span className="font-bold">Dam Storage Warnings</span>
                  <p className="text-[11px] text-muted">Notify when Newton or Riverton storage drops below 50%</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-border cursor-pointer text-xs text-brand-navy-dark">
                <input
                  type="checkbox"
                  checked={truckArrivalAlerts}
                  onChange={(e) => setTruckArrivalAlerts(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-brand-blue"
                />
                <div>
                  <span className="font-bold">Water Tanker Dispatched to {area}</span>
                  <p className="text-[11px] text-muted">Get notified when a truck departs for your zone</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-border cursor-pointer text-xs text-brand-navy-dark">
                <input
                  type="checkbox"
                  checked={emergencyAlerts}
                  onChange={(e) => setEmergencyAlerts(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-brand-blue"
                />
                <div>
                  <span className="font-bold">Emergency Municipal Announcements</span>
                  <p className="text-[11px] text-muted">Urgent pipe repairs, maintenance, or boil notices</p>
                </div>
              </label>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-[#1F2C45] flex items-center justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} icon={ShieldCheck}>
              Save Email Subscriptions
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AlertSubscriptionsModal;
