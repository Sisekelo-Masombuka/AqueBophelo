import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplet,
  Truck,
  MapPin,
  Users,
  AlertTriangle,
  Building2,
  BarChart3,
} from 'lucide-react';

/**
 * AdminLayout
 * Dedicated command-center layout container for Sol Plaatje Municipal Admin staff.
 */
export function AdminLayout() {
  const navigate = useNavigate();

  const adminNavItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/admin/dams', label: 'Dams & Readings', icon: Droplet },
    { path: '/admin/trucks', label: 'Fleet & Drivers', icon: Truck },
    { path: '/admin/routes', label: 'Routes & Stops', icon: MapPin },
    { path: '/admin/users', label: 'Users & Roles', icon: Users },
    { path: '/admin/alerts', label: 'Broadcast Alert', icon: AlertTriangle },
    { path: '/admin/reports', label: 'Reports & History', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Municipal Command Banner */}
      <div className="bg-gradient-to-r from-[#111B2E] via-[#16233B] to-[#111B2E] border border-[#1F2C45] rounded-2xl p-4 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-[#0284C7]/15 border border-[#0284C7]/30 rounded-xl text-[#0284C7] shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold tracking-wider uppercase text-sky-400 bg-[#0284C7]/10 px-2 py-0.5 rounded border border-[#0284C7]/20">
                  Sol Plaatje Municipality
                </span>
                <span className="flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Command Center Active</span>
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-[#E6EDF7] mt-1">
                Water Utility &amp; Fleet Operations Hub
              </h1>
              <p className="text-xs text-[#8A9BB8]">
                Kimberley Central · Galeshewe · Roodepan Distribution Grid
              </p>
            </div>
          </div>

          {/* Quick Action: Direct Emergency SMS/Email Broadcast */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => navigate('/admin/alerts')}
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/40 font-semibold text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Broadcast Emergency Alert</span>
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Sub-tabs */}
        <div className="mt-5 pt-4 border-t border-[#1F2C45] flex items-center space-x-1 md:space-x-2 overflow-x-auto no-scrollbar">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#0284C7] text-white font-bold shadow-md shadow-[#0284C7]/20'
                      : 'text-[#8A9BB8] hover:text-[#E6EDF7] hover:bg-[#0B1220]/60'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Nested Admin Content */}
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
