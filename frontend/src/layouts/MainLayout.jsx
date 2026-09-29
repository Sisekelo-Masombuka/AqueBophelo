import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Droplet, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import Sidebar from '../components/Sidebar';
import BrandLogo from '../components/BrandLogo';
import NotificationCenter from '../components/NotificationCenter';
import LanguageSwitcher from '../components/LanguageSwitcher';

export function MainLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRole = user?.role || 'Resident';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar currentRole={currentRole} />
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar currentRole={currentRole} onClose={() => setMobileDrawerOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header App Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-md text-[#152e52] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <BrandLogo size="md" showText={true} />
              <div className="hidden lg:flex flex-col border-l border-slate-200 pl-3 py-0.5">
                <span className="text-xs font-bold text-[#152e52] tracking-tight">
                  Sol Plaatje Municipal Operations Hub
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Kimberley Central · Galeshewe · Roodepan Grid
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#f2f9f3] border border-[#b8e3bd] text-[#2e7d32] text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse" />
              <span>Live Operations</span>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notification Center */}
            <NotificationCenter />

            {/* Role Pill */}
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              {currentRole}
            </span>

            {/* User Avatar Initial */}
            <div
              className="w-8 h-8 rounded-full bg-[#152e52] text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer hover:bg-[#1f3f6e] transition-colors"
              onClick={() => navigate('/profile')}
              title={user?.fullName || currentRole}
            >
              {user?.fullName ? user.fullName[0].toUpperCase() : currentRole[0]}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* View Page Body */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
