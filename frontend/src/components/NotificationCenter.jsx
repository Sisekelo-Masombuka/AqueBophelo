import React, { useState } from 'react';
import { Bell, Check, Trash2, X, AlertTriangle, Truck, Droplet, Info } from 'lucide-react';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Scheduled Water Outage in Galeshewe',
      message: 'Emergency maintenance scheduled for Zone 3 today from 08:00 to 14:00 (CAT).',
      time: '10 mins ago',
      read: false,
      type: 'alert',
    },
    {
      id: 2,
      title: 'Tanker 542-KM NC Dispatched',
      message: 'Water delivery tanker has arrived at Roodepan Community Water Point 2.',
      time: '1 hour ago',
      read: false,
      type: 'truck',
    },
    {
      id: 3,
      title: 'Newton Reservoir Level Update',
      message: 'Newton Reservoir gauge capacity is currently healthy at 62.5%.',
      time: '3 hours ago',
      read: true,
      type: 'dam',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    if (type === 'truck') return <Truck className="w-4 h-4 text-[#2e7d32]" />;
    if (type === 'dam') return <Droplet className="w-4 h-4 text-[#152e52]" />;
    if (type === 'alert') return <AlertTriangle className="w-4 h-4 text-amber-700" />;
    return <Info className="w-4 h-4 text-[#152e52]" />;
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md bg-white border border-slate-300 text-slate-700 hover:text-[#152e52] hover:bg-slate-50 transition-colors relative cursor-pointer"
        aria-label="View In-System Notifications"
      >
        <Bell className="w-4 h-4 text-[#152e52]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-[#f8fafc] border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-[#152e52]" />
                <h3 className="font-serif font-bold text-sm text-[#152e52]">System Notifications</h3>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[#2e7d32] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 font-normal">
                  No active system notifications.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 transition-colors flex items-start justify-between gap-2 ${
                      n.read ? 'bg-white' : 'bg-[#f4f8fb]'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#152e52] leading-snug">{n.title}</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-normal">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-normal block pt-1">{n.time}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeNotification(n.id)}
                      className="text-slate-300 hover:text-red-600 p-1 shrink-0 cursor-pointer"
                      title="Clear Notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#f8fafc] border-t border-slate-200 p-2.5 text-center">
              <span className="text-[11px] text-slate-500 font-normal">
                Synced with Sol Plaatje Municipal Dispatch Server
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationCenter;
