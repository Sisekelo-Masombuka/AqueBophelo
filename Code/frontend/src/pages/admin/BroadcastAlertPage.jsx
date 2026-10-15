import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, Mail, History, CheckCircle2, Radio } from 'lucide-react';
import apiClient from '../../api/client';

export function BroadcastAlertPage() {
  const [alerts, setAlerts] = useState([]);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('Critical');
  const type = 'Announcement';
  const [areaId, setAreaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await apiClient.get('/api/v1/alerts');
        if (res.data && Array.isArray(res.data)) {
          setAlerts(res.data);
        }
      } catch (err) {
        console.warn('Could not load live alerts:', err);
      }
    }
    loadAlerts();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const payload = {
      title: title.trim(),
      message: message.trim(),
      severity,
      type,
      areaId: areaId ? parseInt(areaId) : null,
    };

    try {
      setLoading(true);
      const res = await apiClient.post('/api/v1/alerts', payload);
      const newAlert = res.data;
      setAlerts((prev) => [newAlert, ...prev]);
      setFeedback({ type: 'success', text: 'Emergency alert dispatched to registered Email subscribers!' });
      setTitle('');
      setMessage('');
    } catch (err) {
      console.error('API error sending alert:', err);
      setFeedback({ type: 'error', text: 'Failed to broadcast alert. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Emergency Email Broadcast Dispatch</span>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">
          Broadcast Emergency Alerts &amp; Announcements
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
          Send certified email water alerts to registered Sol Plaatje residents and track notification history.
        </p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-md border flex items-center space-x-3 text-xs md:text-sm ${
            feedback.type === 'success'
              ? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Broadcast Form */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 md:p-6 shadow-xs">
          <h3 className="font-serif text-base font-bold text-[#152e52] mb-1 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#1d70b8]" />
            <span>Compose Email Emergency Dispatch</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-normal">
            Dispatches immediately through Sol Plaatje SMTP email gateway.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Alert Title</label>
              <input
                type="text"
                placeholder="e.g. Unscheduled Water Interruption"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Severity Band
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                >
                  <option value="Critical">Critical (High Urgency)</option>
                  <option value="Warning">Warning (Precautionary)</option>
                  <option value="Info">Info (Operational Notice)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Target Zone
                </label>
                <select
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                >
                  <option value="">All Municipal Areas</option>
                  <option value="1">Galeshewe</option>
                  <option value="2">Kimberley Central</option>
                  <option value="3">Roodepan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Alert Message
              </label>
              <textarea
                rows={4}
                placeholder="Detail outage cause, estimated restoration time, and deployed water tanker locations..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-md p-3 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] resize-none"
              />
            </div>

            <div className="bg-[#f8fafc] border border-slate-200 rounded-md p-3 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Primary Delivery Channel:</span>
              <label className="flex items-center space-x-1.5 text-xs text-[#152e52] font-semibold">
                <Mail className="w-4 h-4 text-[#1d70b8]" />
                <span>Direct Email Dispatch</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm py-2.5 rounded-md transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Dispatching...' : 'Broadcast Emergency Email Notice'}</span>
            </button>
          </form>
        </div>

        {/* Right: Broadcast Transmission History */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="font-serif text-base font-bold text-[#152e52] flex items-center space-x-2">
                <History className="w-4 h-4 text-[#1d70b8]" />
                <span>Email Transmission History</span>
              </h3>
              <span className="text-xs text-slate-500 font-normal">{alerts.length} dispatches</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-md bg-slate-50/50">
                  <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No Broadcast History</p>
                  <p className="text-xs text-slate-500 mt-1">Official municipal alert notices dispatched via email will appear here.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-[#f8fafc] border border-slate-200 rounded-md p-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-serif font-bold text-xs md:text-sm text-[#152e52]">{alert.title}</h4>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          alert.severity === 'Critical'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : alert.severity === 'Warning'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-[#eaf4fb] text-[#1d70b8] border border-[#bcd6ea]'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200 font-normal">
                      <span className="text-[#1d70b8] font-medium">{alert.areaName || 'All Kimberley'}</span>
                      <span>{alert.createdAtCAT || 'Today (CAT)'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BroadcastAlertPage;
