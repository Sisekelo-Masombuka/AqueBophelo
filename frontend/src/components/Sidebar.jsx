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
} from 'lucide-react';

export function Sidebar({ currentRole = 'Resident', onClose }) {
  const residentLinks = [
    { id: 'dashboard', path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'dams', path: '/dams', label: 'Dam Monitoring', icon: Droplet },
    { id: 'trucks', path: '/trucks', label: 'Live Trucks', icon: Truck },
    { id: 'alerts', path: '/alerts', label: 'My Alerts', icon: AlertTriangle },
    { id: 'profile', path: '/profile', label: 'My Profile', icon: User },
  ];

  const driverLinks = [
    { id: 'mytrip', path: '/driver/trip', label: 'Current Trip', icon: Truck },
    { id: 'stops', path: '/driver/stops', label: 'Route Stops', icon: MapPin },
    { id: 'profile', path: '/profile', label: 'My Profile', icon: User },
  ];

  const adminLinks = [
    { id: 'admin-overview', path: '/admin', label: 'Command Center', icon: LayoutDashboard },
    { id: 'manage-dams', path: '/admin/dams', label: 'Dams & Readings', icon: Droplet },
    { id: 'manage-trucks', path: '/admin/trucks', label: 'Fleet & Drivers', icon: Truck },
    { id: 'manage-routes', path: '/admin/routes', label: 'Routes & Stops', icon: MapPin },
    { id: 'manage-users', path: '/admin/users', label: 'Users & Roles', icon: Users },
    { id: 'broadcast-alerts', path: '/admin/alerts', label: 'Broadcast Alert', icon: AlertTriangle },
    { id: 'profile', path: '/profile', label: 'My Profile', icon: User },
  ];

  const links = currentRole === 'Admin' ? adminLinks : currentRole === 'Driver' ? driverLinks : residentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-4 text-slate-700 select-none shadow-sm">
      <div>
        {/* Logo and Title */}
        <div className="flex items-center justify-between px-2 py-3 border-b border-slate-200 mb-5">
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
            <div>
              <h1 className="font-extrabold text-base leading-none text-brand-navy-dark tracking-tight font-heading">AquaBophelo</h1>
              <p className="text-[10px] text-brand-green font-semibold italic mt-0.5">Elke druppel tel</p>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-brand-navy-dark hover:bg-slate-100 transition-colors"
              aria-label="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.id}
                to={link.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-[0_10px_24px_rgba(14,76,140,0.16)] font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-brand-navy-dark'
                  }`
                }
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-brand-blue'}`} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Role Info & Civic Link */}
      <div className="pt-4 border-t border-slate-200 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-navy-dark hover:bg-slate-100 transition-colors"
        >
          <span className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-brand-blue" />
            <span>Public Portal</span>
          </span>
          <span className="text-[10px] bg-brand-accent/10 text-brand-blue px-1.5 py-0.5 rounded-md font-bold">View</span>
        </Link>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-navy-dark flex items-center gap-1 font-heading">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
              <span>Role: {currentRole}</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Sol Plaatje Municipality</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
