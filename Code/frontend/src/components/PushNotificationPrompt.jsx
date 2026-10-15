import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { requestPushPermissionAndRegister } from '../services/firebase';
import { useAuth } from '../auth/AuthContext';

export default function PushNotificationPrompt() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only prompt if logged in, notifications are supported, and user hasn't made a choice yet
    if (!user) return;
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const savedChoice = localStorage.getItem('aquabophelo_push_prompt_choice');
    if (Notification.permission === 'default' && !savedChoice) {
      // Delay prompt slightly for polite UX
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleEnable = async () => {
    setIsSubmitting(true);
    try {
      const res = await requestPushPermissionAndRegister();
      localStorage.setItem('aquabophelo_push_prompt_choice', res.success ? 'granted' : 'denied');
    } catch (e) {
      console.warn('Push registration prompt notice:', e);
    } finally {
      setIsSubmitting(false);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('aquabophelo_push_prompt_choice', 'dismissed');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-4 transition-all duration-300 transform translate-y-0">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
          <Bell className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">Enable Instant Web Push?</h4>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Get instant alerts when a water tanker truck arrives in your neighborhood or a critical dam alert is issued.
          </p>
          
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
            <button
              onClick={handleEnable}
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#152e52] hover:bg-[#0f223d] text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Enabling...</span>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Enable Push</span>
                </>
              )}
            </button>

            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
