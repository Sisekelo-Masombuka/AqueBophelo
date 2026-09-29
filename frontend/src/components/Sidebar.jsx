import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Droplet,
  Truck,
  AlertTriangle,
  LayoutDashboard,
  MapPin,
  Users,
  X,
  Globe,
  ShieldCheck,
  User,
  BarChart3,
  ClipboardCheck,
  History
} from 'lucide-react';

import BrandLogo from './BrandLogo';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

export function Sidebar({ currentRole = 'Resident', onClose }) {
  const { t } = useLanguage();

  const residentLinks = [
    { id: 'dashboard', path: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'dams', path: '/dams', label: t('damMonitoring'), icon: Droplet },
    { id: 'trucks', path: '/trucks', label: t('liveTrucks'), icon: Truck },
    { id: 'alerts', path: '/alerts', label: t('alerts'), icon: AlertTriangle },
    { id: 'profile', path: '/profile', label: t('myProfile'), icon: User },
  ];

  const driverLinks = [
    { id: 'mytrip', path: '/driver/trip', label: t('currentTrip'), icon: Truck },
    { id: 'stops', path: '/driver/stops', label: t('routeStops'), icon: MapPin },
    { id: 'vehicle', path: '/driver/vehicle', label: 'Vehicle & Inspection', icon: ClipboardCheck },
    { id: 'activity', path: '/driver/activity', label: 'My Activity Log', icon: History },
    { id: 'profile', path: '/profile', label: t('myProfile'), icon: User },
  ];

  const adminLinks = [
    { id: 'admin-overview', path: '/admin', label: t('commandCenter'), icon: LayoutDashboard },
    { id: 'manage-dams', path: '/admin/dams', label: t('manageDams'), icon: Droplet },
    { id: 'manage-trucks', path: '/admin/trucks', label: t('manageTrucks'), icon: Truck },
    { id: 'manage-routes', path: '/admin/routes', label: t('manageRoutes'), icon: MapPin },
    { id: 'manage-users', path: '/admin/users', label: t('manageUsers'), icon: Users },
    { id: 'broadcast-alerts', path: '/admin/alerts', label: t('broadcastAlerts'), icon: AlertTriangle },
    { id: 'admin-reports', path: '/admin/reports', label: t('reportsHistory'), icon: BarChart3 },
    { id: 'profile', path: '/profile', label: t('myProfile'), icon: User },
  ];

  const links = currentRole === 'Admin' ? adminLinks : currentRole === 'Driver' ? driverLinks : residentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-4 text-slate-800 select-none shadow-xs">
      <div>
        {/* Logo and Title */}
        <div className="flex items-center justify-between px-2 py-3.5 border-b border-slate-200 mb-5">
          <Link to="/" className="flex items-center group">
            <BrandLogo size="md" showText={true} />
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-md text-slate-500 hover:text-[#152e52] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1" aria-label="Main Navigation">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.id}
                to={link.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#152e52] text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#152e52]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#1d70b8]'}`} />
                    <span>{link.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Role Info, Language Switcher & Civic Link */}
      <div className="pt-4 border-t border-slate-200 space-y-2">
        <div className="flex items-center justify-between px-1 py-1">
          <span className="text-xs font-semibold text-slate-600">{t('preferredLanguage')}:</span>
          <LanguageSwitcher />
        </div>

        <Link
          to="/"
          className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-[#152e52] hover:bg-slate-100 transition-colors"
        >
          <span className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-[#1d70b8]" />
            <span>{t('publicPortal')}</span>
          </span>
          <span className="text-[10px] bg-[#eaf4fb] text-[#1d70b8] border border-[#bcd6ea] px-1.5 py-0.5 rounded-md font-semibold">
            {t('view')}
          </span>
        </Link>

        <Link
          to="/privacy"
          className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-[#152e52] hover:bg-slate-100 transition-colors"
        >
          <span className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
            <span>{t('privacy')}</span>
          </span>
        </Link>

        <div className="bg-[#f8fafc] p-3 rounded-md border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#152e52] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>{t('role')}: {currentRole === 'Admin' ? t('admin') : currentRole === 'Driver' ? t('driver') : t('resident')}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Sol Plaatje Municipality</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
