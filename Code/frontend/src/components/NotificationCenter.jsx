import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X, AlertTriangle, Truck, Droplet, Info } from 'lucide-react';
import apiClient from '../api/client';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isCurrent = true;
    const loadNotifications = async () => {
      try {
        const res = await apiClient.get('/api/v1/alerts');
        if (isCurrent && Array.isArray(res.data)) {
          setNotifications(
            res.data.map((a) => ({
              id: a.id,
              title: a.title || 'Municipal Alert',
              message: a.message || a.description || '',
              time: a.createdAt
                ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Recent',
              read: false,
              type:
                a.type?.toLowerCase() === 'dam'
                  ? 'dam'
                  : a.type?.toLowerCase() === 'truck'
                  ? 'truck'
                  : 'alert',
            }))
          );
        }
      } catch (err) {
        console.warn('Could not load alerts for notification center:', err);
      }
    };
    loadNotifications();
    return () => {
      isCurrent = false;
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    if (type === 'truck') return <Truck className="w-4 h-4 text-success" />;
    if (type === 'dam') return <Droplet className="w-4 h-4 text-navy" />;
    if (type === 'alert') return <AlertTriangle className="w-4 h-4 text-amber-700" />;
    return <Info className="w-4 h-4 text-navy" />;
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md bg-white border border-slate-300 text-slate-700 hover:text-navy hover:bg-slate-50 transition-colors relative cursor-pointer"
        aria-label="View In-System Notifications"
      >
        <Bell className="w-4 h-4 text-navy" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-surface-muted border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-navy" />
                <h3 className="font-serif font-bold text-sm text-navy">System Notifications</h3>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-success hover:underline font-semibold flex items-center gap-1 cursor-pointer"
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
                        <p className="text-xs font-bold text-navy leading-snug">{n.title}</p>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">{n.message}</p>
                        <span className="text-xs text-slate-400 font-normal block pt-1">{n.time}</span>
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
            <div className="bg-surface-muted border-t border-slate-200 p-2.5 text-center">
              <span className="text-xs text-slate-500 font-normal">
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
