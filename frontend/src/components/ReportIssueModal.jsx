import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Droplet, Send, MapPin, MessageSquare } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function ReportIssueModal({ isOpen, onClose, userArea = 'Galeshewe' }) {
  const [issueType, setIssueType] = useState('No Supply');
  const [area, setArea] = useState(userArea || 'Galeshewe');
  const [description, setDescription] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Water issue logged successfully. Sol Plaatje Municipal Dispatch has been notified.');
      setTimeout(() => {
        setSuccessMessage('');
        setDescription('');
        setStreetAddress('');
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,39,63,0.14)]">
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-navy-dark">Report Water Issue</h3>
              <p className="text-xs text-slate-500">Sol Plaatje Municipal Fault Logging</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-navy-dark"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Feedback */}
        {successMessage ? (
          <div className="p-5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-center space-y-2 my-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-[#E6EDF7]">{successMessage}</p>
            <p className="text-xs text-[#8A9BB8]">Ticket Ref: #SPM-2026-{(Math.floor(Math.random() * 8999) + 1000)}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Issue Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#8A9BB8] mb-1.5">
                Issue Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] focus:outline-none focus:border-[#0284C7]"
              >
                <option value="No Supply">No Water Supply (Interruption)</option>
                <option value="Low Pressure">Low Water Pressure</option>
                <option value="Pipe Leak">High-Pressure Pipe Burst / Leak</option>
                <option value="Water Quality">Water Quality / Discoloration</option>
                <option value="Tanker Delay">Water Tanker Delayed</option>
              </select>
            </div>

            {/* Municipal Area */}
            <div>
              <label className="block text-xs font-semibold text-[#8A9BB8] mb-1.5">
                Municipal Suburb / Area <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#8A9BB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="Galeshewe">Galeshewe</option>
                  <option value="Kimberley Central">Kimberley Central</option>
                  <option value="Roodepan">Roodepan</option>
                </select>
              </div>
            </div>

            <Input
              label="Street Address / Landmark"
              placeholder="e.g. 145 Nobengula Avenue, Zone 3"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-[#8A9BB8] mb-1.5">
                Issue Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue (e.g. water stopped running at 08:00 AM)..."
                className="w-full p-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] placeholder-[#8A9BB8]/50 focus:outline-none focus:border-[#0284C7]"
                required
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} icon={Send}>
                Submit Fault Report
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReportIssueModal;
