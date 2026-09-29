import React, { useState } from 'react';
import { X, Bell, Mail, CheckCircle2, AlertCircle, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg bg-white border border-slate-200 rounded-lg p-6 shadow-xl relative text-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-md bg-[#eaf4fb] border border-[#bcd6ea] text-[#1d70b8]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#152e52]">Municipal Email Alert Preferences</h2>
              <p className="text-xs text-slate-500 font-normal">
                Get real-time email notices &amp; delivery updates for your neighborhood
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-[#f2f9f3] border border-[#b8e3bd] rounded-md text-xs text-[#2e7d32] flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Municipal Area Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Subscribed Suburb / Area
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
            >
              <option value="Galeshewe">Galeshewe (Zones 1-4)</option>
              <option value="Kimberley Central">Kimberley Central</option>
              <option value="Roodepan">Roodepan</option>
            </select>
          </div>

          {/* Primary Email Channel */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Recipient Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="resident@example.co.za"
              required
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
            />
            <p className="text-[11px] text-slate-500 mt-1">Direct email notifications for water tanker dispatches and drought advisories</p>
          </div>

          {/* Alert Trigger Topics */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Email Alert Topics
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 rounded-md bg-[#f8fafc] border border-slate-200 cursor-pointer text-xs text-slate-800">
                <input
                  type="checkbox"
                  checked={lowDamAlerts}
                  onChange={(e) => setLowDamAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#152e52] focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-[#152e52]">Dam Storage Warnings</span>
                  <p className="text-[11px] text-slate-500 font-normal">Notify when Newton or Riverton storage drops below 50%</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-md bg-[#f8fafc] border border-slate-200 cursor-pointer text-xs text-slate-800">
                <input
                  type="checkbox"
                  checked={truckArrivalAlerts}
                  onChange={(e) => setTruckArrivalAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#152e52] focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-[#152e52]">Water Tanker Dispatched to {area}</span>
                  <p className="text-[11px] text-slate-500 font-normal">Get notified when a truck departs for your zone</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-md bg-[#f8fafc] border border-slate-200 cursor-pointer text-xs text-slate-800">
                <input
                  type="checkbox"
                  checked={emergencyAlerts}
                  onChange={(e) => setEmergencyAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#152e52] focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-[#152e52]">Emergency Municipal Announcements</span>
                  <p className="text-[11px] text-slate-500 font-normal">Urgent pipe repairs, maintenance, or boil notices</p>
                </div>
              </label>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Email Subscriptions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AlertSubscriptionsModal;
