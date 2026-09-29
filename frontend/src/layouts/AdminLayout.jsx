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
import BrandLogo from '../components/BrandLogo';
import { useLanguage } from '../context/LanguageContext';

/**
 * AdminLayout
 * Command-center layout container for Sol Plaatje Municipal Admin staff.
 */
export function AdminLayout() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const adminNavItems = [
    { path: '/admin', label: t('overview'), icon: LayoutDashboard, end: true },
    { path: '/admin/dams', label: t('manageDams'), icon: Droplet },
    { path: '/admin/trucks', label: t('manageTrucks'), icon: Truck },
    { path: '/admin/routes', label: t('manageRoutes'), icon: MapPin },
    { path: '/admin/users', label: t('manageUsers'), icon: Users },
    { path: '/admin/alerts', label: t('broadcastAlerts'), icon: AlertTriangle },
    { path: '/admin/reports', label: t('reportsHistory'), icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Municipal Command Banner */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs md:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-3.5">
            <BrandLogo size="lg" showText={false} />
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-slate-700">
                  {t('solPlaatjeMun')}
                </span>
                <span className="flex items-center space-x-1.5 rounded-md bg-[#2e7d32] text-white px-2 py-0.5 text-[11px] font-medium">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  <span>{t('commandCenterActive')}</span>
                </span>
              </div>
              <h1 className="mt-1 font-serif text-xl md:text-2xl font-bold text-[#152e52]">
                {t('utilityOperationsHub')}
              </h1>
              <p className="text-xs text-slate-500 font-normal">
                Kimberley Central · Galeshewe · Roodepan Distribution Grid
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => navigate('/admin/alerts')}
              className="inline-flex w-full items-center justify-center space-x-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 md:w-auto cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{t('broadcastAlerts')}</span>
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
                  `flex items-center space-x-2 whitespace-nowrap rounded-md px-3.5 py-2 text-xs font-medium transition-colors md:text-sm ${
                    isActive
                      ? 'bg-[#152e52] text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#152e52]'
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
