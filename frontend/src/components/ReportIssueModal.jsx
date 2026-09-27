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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1F2C45] pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#E6EDF7]">Report Water Issue</h3>
              <p className="text-xs text-[#8A9BB8]">Sol Plaatje Municipal Fault Logging</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8A9BB8] hover:text-[#E6EDF7] p-1.5 rounded-lg hover:bg-[#1F2C45] transition-colors"
          >
            <X className="w-5 h-5" />
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
