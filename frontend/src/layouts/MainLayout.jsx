import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Droplet, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import Sidebar from '../components/Sidebar';

export function MainLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRole = user?.role || 'Resident';

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E6EDF7] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar currentRole={currentRole} />
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (Slide-out) */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar currentRole={currentRole} onClose={() => setMobileDrawerOpen(false)} />
      </div>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header / App Bar */}
        <header className="h-16 bg-[#111B2E] border-b border-[#1F2C45] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Drawer Toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#8A9BB8] hover:text-[#E6EDF7] hover:bg-[#1F2C45] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <Droplet className="w-5 h-5 text-[#22D3EE] md:hidden" />
              <div>
                <h1 className="text-sm md:text-base font-bold text-[#E6EDF7] tracking-tight">
                  AquaBophelo
                </h1>
                <p className="text-[10px] md:text-xs text-[#8A9BB8]">
                  Sol Plaatje Water Monitoring &amp; Tracking
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Badges: Connection status, Role switcher, User Pill, Logout */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* HCI Status Indicator: Live System Status */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span>System Live</span>
            </div>

            {/* Role Switcher (Allows Cuba, Nomcebo and team to preview role views easily) */}
            <select
              value={currentRole}
              onChange={(e) => switchRole(e.target.value)}
              className="bg-[#0B1220] border border-[#1F2C45] text-xs text-[#E6EDF7] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#22D3EE]"
              aria-label="Preview Role"
            >
              <option value="Resident">Resident View</option>
              <option value="Driver">Driver View</option>
              <option value="Admin">Admin View</option>
            </select>

            {/* User badge with initial */}
            <div
              className="w-8 h-8 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] flex items-center justify-center font-bold text-xs border border-[#22D3EE]/40"
              title={user?.fullName || currentRole}
            >
              {user?.fullName ? user.fullName[0] : currentRole[0]}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#8A9BB8] hover:text-[#EF4444] hover:bg-[#1F2C45] rounded-lg transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
