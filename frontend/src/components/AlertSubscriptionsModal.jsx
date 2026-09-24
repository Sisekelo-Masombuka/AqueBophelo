import React, { useState } from 'react';
import { X, Bell, Mail, Phone, CheckCircle2, AlertCircle, Loader2, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export function AlertSubscriptionsModal({ isOpen, onClose }) {
  const { user } = useAuth();

  const [area, setArea] = useState(user?.area || 'Galeshewe');
  const [receiveSms, setReceiveSms] = useState(true);
  const [receiveEmail, setReceiveEmail] = useState(true);
  const [phone, setPhone] = useState('+27 82 456 7890');
  const [email, setEmail] = useState(user?.email || 'nomcebo@aquabophelo.gov.za');
  const [lowDamAlerts, setLowDamAlerts] = useState(true);
  const [truckArrivalAlerts, setTruckArrivalAlerts] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // HCI Error Prevention: validate South African phone & email
  const validate = () => {
    if (!receiveSms && !receiveEmail) {
      setErrorMessage('Please select at least one notification channel (SMS or Email).');
      return false;
    }
    if (receiveSms) {
      const cleanPhone = phone.replace(/\s+/g, '');
      if (!cleanPhone.startsWith('+27') && !cleanPhone.startsWith('0')) {
        setErrorMessage('Phone number must start with +27 or 0 (South Africa format).');
        return false;
      }
      if (cleanPhone.length < 10) {
        setErrorMessage('Please provide a valid 10-digit South African mobile number.');
        return false;
      }
    }
    if (receiveEmail && (!email || !email.includes('@'))) {
      setErrorMessage('Please provide a valid email address.');
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API persistence with feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Alert preferences successfully updated for Sol Plaatje notifications!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1400);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 shadow-2xl relative text-[#E6EDF7] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1F2C45] mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#22D3EE]/10 text-[#22D3EE]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#E6EDF7]">Municipal Alert Preferences</h2>
              <p className="text-xs text-[#8A9BB8]">
                Get real-time SMS &amp; Email alerts for your neighborhood
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8A9BB8] hover:text-[#E6EDF7] hover:bg-[#1F2C45] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl text-xs text-[#EF4444] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl text-xs text-[#22C55E] flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Municipal Area Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#8A9BB8] uppercase tracking-wider mb-2">
              Select Your Subscribed Area
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8A9BB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
              >
                <option value="Galeshewe">Galeshewe (Zones 1-4)</option>
                <option value="Kimberley Central">Kimberley Central</option>
                <option value="Roodepan">Roodepan</option>
              </select>
            </div>
          </div>

          {/* Delivery Channels */}
          <div>
            <label className="block text-xs font-semibold text-[#8A9BB8] uppercase tracking-wider mb-2">
              Notification Channels
            </label>
            <div className="space-y-3">
              {/* SMS Option */}
              <div className="p-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2.5">
                    <Phone className="w-4 h-4 text-[#22D3EE]" />
                    <span className="text-sm font-medium text-[#E6EDF7]">SMS Alerts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={receiveSms}
                    onChange={(e) => setReceiveSms(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-[#22D3EE]"
                  />
                </label>
                {receiveSms && (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 123 4567"
                    className="w-full px-3 py-2 bg-[#111B2E] border border-[#1F2C45] rounded-lg text-xs text-[#E6EDF7] placeholder-[#8A9BB8]/50 focus:outline-hidden focus:border-[#22D3EE]"
                  />
                )}
              </div>

              {/* Email Option */}
              <div className="p-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2.5">
                    <Mail className="w-4 h-4 text-[#22D3EE]" />
                    <span className="text-sm font-medium text-[#E6EDF7]">Email Bulletins</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={receiveEmail}
                    onChange={(e) => setReceiveEmail(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-[#22D3EE]"
                  />
                </label>
                {receiveEmail && (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="resident@example.co.za"
                    className="w-full px-3 py-2 bg-[#111B2E] border border-[#1F2C45] rounded-lg text-xs text-[#E6EDF7] placeholder-[#8A9BB8]/50 focus:outline-hidden focus:border-[#22D3EE]"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Alert Trigger Topics */}
          <div>
            <label className="block text-xs font-semibold text-[#8A9BB8] uppercase tracking-wider mb-2">
              Alert Trigger Types
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#0B1220] cursor-pointer text-xs text-[#E6EDF7]">
                <input
                  type="checkbox"
                  checked={lowDamAlerts}
                  onChange={(e) => setLowDamAlerts(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-[#22D3EE]"
                />
                <div>
                  <span className="font-medium">Dam Storage Warnings</span>
                  <p className="text-[11px] text-[#8A9BB8]">Notify when storage drops below 50% or 30%</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#0B1220] cursor-pointer text-xs text-[#E6EDF7]">
                <input
                  type="checkbox"
                  checked={truckArrivalAlerts}
                  onChange={(e) => setTruckArrivalAlerts(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-[#22D3EE]"
                />
                <div>
                  <span className="font-medium">Water Tanker Dispatched to {area}</span>
                  <p className="text-[11px] text-[#8A9BB8]">Get notified when a truck departs for your zone</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#0B1220] cursor-pointer text-xs text-[#E6EDF7]">
                <input
                  type="checkbox"
                  checked={emergencyAlerts}
                  onChange={(e) => setEmergencyAlerts(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-[#22D3EE]"
                />
                <div>
                  <span className="font-medium">Emergency Municipal Announcements</span>
                  <p className="text-[11px] text-[#8A9BB8]">Urgent pipe repairs, maintenance, or boil notices</p>
                </div>
              </label>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-[#1F2C45] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8A9BB8] hover:text-[#E6EDF7] hover:bg-[#0B1220] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] px-5 py-2.5 bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0B1220] font-semibold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving preferences...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Save Alert Subscriptions</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AlertSubscriptionsModal;
