import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Droplet, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import Sidebar from '../components/Sidebar';

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
    <div className="min-h-screen bg-[#f5f8fb] text-brand-navy flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar currentRole={currentRole} />
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
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
        <header className="h-16 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_10px_30px_rgba(15,39,63,0.04)]">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-brand-navy hover:bg-slate-100 transition-colors duration-200"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm md:text-base font-extrabold text-brand-navy tracking-tight leading-tight">
                  AquaBophelo
                </h1>
                <p className="text-[10px] md:text-xs text-slate-500">
                  Sol Plaatje Water Operations Portal
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Operations</span>
            </div>

            {/* Role Pill */}
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              {currentRole}
            </span>

            {/* User Avatar Initial */}
            <div
              className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shadow-sm"
              title={user?.fullName || currentRole}
            >
              {user?.fullName ? user.fullName[0].toUpperCase() : currentRole[0]}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
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
