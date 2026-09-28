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
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_30px_rgba(10,42,79,0.05)] md:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-3.5">
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-brand-blue shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700">
                  Sol Plaatje Municipality
                </span>
                <span className="flex items-center space-x-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>Command Center Active</span>
                </span>
              </div>
              <h1 className="mt-1 text-lg font-bold text-brand-navy-dark md:text-xl">
                Water Utility &amp; Fleet Operations Hub
              </h1>
              <p className="text-xs text-slate-500">
                Kimberley Central · Galeshewe · Roodepan Distribution Grid
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => navigate('/admin/alerts')}
              className="inline-flex w-full items-center justify-center space-x-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 md:w-auto"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Broadcast Emergency Alert</span>
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center space-x-1 overflow-x-auto border-t border-slate-200 pt-4 md:space-x-2 no-scrollbar">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors md:text-sm ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-[0_8px_22px_rgba(14,76,140,0.16)]'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-brand-navy-dark'
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
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
