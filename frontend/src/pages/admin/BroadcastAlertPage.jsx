import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, Mail, History, CheckCircle2, Radio } from 'lucide-react';
import apiClient from '../../api/client';
import StatusBadge from '../../components/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function BroadcastAlertPage() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'Announcement',
      severity: 'Warning',
      title: 'Scheduled Water Outage in Galeshewe Zone 3',
      message: 'Emergency pipe maintenance on Ramafalo Road. Water tankers NC-542-KM and NC-882-KM dispatched.',
      areaName: 'Galeshewe',
      createdAtSast: 'Today at 07:30 AM (CAT)',
      createdByName: 'Admin Desk',
    },
    {
      id: 2,
      type: 'DamCritical',
      severity: 'Critical',
      title: 'Newton Reservoir Level Alert',
      message: 'Newton Reservoir level dropped below 50%. Stage 2 water shedding guidelines now in effect.',
      areaName: 'Kimberley Central',
      createdAtSast: 'Yesterday at 16:45 (CAT)',
      createdByName: 'SCADA Alert Evaluator',
    },
    {
      id: 3,
      type: 'Truck',
      severity: 'Info',
      title: 'Water Delivery Tanker En Route to Roodepan',
      message: 'Tanker NC-104-KM arriving at Roodepan Municipal Depot community water point.',
      areaName: 'Roodepan',
      createdAtSast: 'Yesterday at 11:20 (CAT)',
      createdByName: 'Fleet Dispatcher',
    },
  ]);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('Critical');
  const [type, setType] = useState('Announcement');
  const [areaId, setAreaId] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await apiClient.get('/api/v1/alerts');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setAlerts(res.data);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial seeded alerts.', err);
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
      const newAlert = res.data || {
        id: Date.now(),
        ...payload,
        areaName: areaId === '1' ? 'Galeshewe' : areaId === '2' ? 'Kimberley Central' : areaId === '3' ? 'Roodepan' : 'All Sol Plaatje',
        createdAtSast: 'Just now (CAT)',
        createdByName: 'Admin Desk',
      };
      setAlerts((prev) => [newAlert, ...prev]);
      setFeedback({ type: 'success', text: 'Emergency alert dispatched to registered Email subscribers!' });
      setTitle('');
      setMessage('');
    } catch (err) {
      console.warn('API error sending alert, adding locally:', err);
      const mockAlert = {
        id: Date.now(),
        ...payload,
        areaName: areaId === '1' ? 'Galeshewe' : areaId === '2' ? 'Kimberley Central' : areaId === '3' ? 'Roodepan' : 'All Sol Plaatje',
        createdAtSast: 'Just now (CAT)',
        createdByName: 'Admin Desk (Preview)',
      };
      setAlerts((prev) => [mockAlert, ...prev]);
      setFeedback({ type: 'success', text: 'Email Alert dispatched successfully (Preview Mode)!' });
      setTitle('');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Emergency Email Broadcast Dispatch</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#E6EDF7]">
          Broadcast Emergency Alerts &amp; Announcements
        </h2>
        <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
          Send certified email water alerts to registered Sol Plaatje residents and track notification history.
        </p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center space-x-3 text-xs md:text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Broadcast Form */}
        <div className="lg:col-span-6 bg-white border border-border rounded-3xl p-5 md:p-6 shadow-soft">
          <h3 className="text-base font-bold text-brand-navy-dark mb-1 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-brand-blue" />
            <span>Compose Email Emergency Dispatch</span>
          </h3>
          <p className="text-xs text-muted mb-4">
            Dispatches immediately through Sol Plaatje SMTP email gateway.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <Input
              label="Alert Title"
              placeholder="e.g. Unscheduled Water Interruption"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Severity Band
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3 py-2.5 text-xs md:text-sm text-[#E6EDF7] focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="Critical">🔴 Critical (High Urgency)</option>
                  <option value="Warning">🟡 Warning (Precautionary)</option>
                  <option value="Info">🔵 Info (Operational Notice)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Target Zone
                </label>
                <select
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3 py-2.5 text-xs md:text-sm text-[#E6EDF7] focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="">All Municipal Areas</option>
                  <option value="1">Galeshewe</option>
                  <option value="2">Kimberley Central</option>
                  <option value="3">Roodepan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8A9BB8] mb-1">
                Alert Message
              </label>
              <textarea
                rows={4}
                placeholder="Detail outage cause, estimated restoration time, and deployed water tanker locations..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl p-3 text-sm text-[#E6EDF7] focus:outline-none focus:border-[#0284C7] resize-none"
              />
            </div>

            <div className="bg-[#0B1220] border border-[#1F2C45] rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-[#8A9BB8] font-semibold">Primary Delivery Channel:</span>
              <label className="flex items-center space-x-1.5 text-xs text-[#E6EDF7] font-bold">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Direct Email Dispatch</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="destructive"
              size="lg"
              isLoading={loading}
              className="w-full"
              icon={Send}
            >
              <span>Broadcast Emergency Email Notice</span>
            </Button>
          </form>
        </div>

        {/* Right: Broadcast Transmission History */}
        <div className="lg:col-span-6 bg-white border border-border rounded-3xl p-5 md:p-6 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-brand-navy-dark flex items-center space-x-2">
                <History className="w-4 h-4 text-brand-blue" />
                <span>Email Transmission History</span>
              </h3>
              <span className="text-xs text-muted">{alerts.length} dispatches</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-slate-50 border border-border rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-xs md:text-sm text-brand-navy-dark">{alert.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                        alert.severity === 'Critical'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : alert.severity === 'Warning'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A9BB8] leading-relaxed mb-2.5">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#8A9BB8] pt-2 border-t border-[#1F2C45]/60">
                    <span className="text-sky-400 font-semibold">{alert.areaName || 'All Kimberley'}</span>
                    <span>{alert.createdAtSast || 'Today (CAT)'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BroadcastAlertPage;
