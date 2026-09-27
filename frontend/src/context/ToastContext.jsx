import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-[#22D3EE] shrink-0" />;
    }
  };

  const getToastBorder = (type) => {
    switch (type) {
      case 'success':
        return 'border-[#22C55E]/40 bg-[#111B2E] text-[#E6EDF7]';
      case 'error':
        return 'border-[#EF4444]/40 bg-[#111B2E] text-[#E6EDF7]';
      case 'warning':
        return 'border-[#F59E0B]/40 bg-[#111B2E] text-[#E6EDF7]';
      default:
        return 'border-[#22D3EE]/40 bg-[#111B2E] text-[#E6EDF7]';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Floating Toast Notification Container (HCI Heuristic #9: Clear Error & Status Feedback) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs animate-slide-up transition-all ${getToastBorder(
              toast.type
            )}`}
            role="alert"
          >
            <div className="flex items-center space-x-2.5">
              {getToastIcon(toast.type)}
              <span className="font-medium leading-relaxed">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8A9BB8] hover:text-[#E6EDF7] p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;
