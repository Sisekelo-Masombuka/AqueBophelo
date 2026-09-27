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
} from 'lucide-react';

export function Sidebar({ currentRole = 'Resident', onClose }) {
  const residentLinks = [
    { id: 'dashboard', path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'dams', path: '/dams', label: 'Dam Monitoring', icon: Droplet },
    { id: 'trucks', path: '/trucks', label: 'Live Trucks', icon: Truck },
    { id: 'alerts', path: '/alerts', label: 'My Alerts', icon: AlertTriangle },
  ];

  const driverLinks = [
    { id: 'mytrip', path: '/driver/trip', label: 'Current Trip', icon: Truck },
    { id: 'stops', path: '/driver/stops', label: 'Route Stops', icon: MapPin },
  ];

  const adminLinks = [
    { id: 'admin-overview', path: '/admin', label: 'Command Center', icon: LayoutDashboard },
    { id: 'manage-dams', path: '/admin/dams', label: 'Dams & Readings', icon: Droplet },
    { id: 'manage-trucks', path: '/admin/trucks', label: 'Fleet & Drivers', icon: Truck },
    { id: 'manage-routes', path: '/admin/routes', label: 'Routes & Stops', icon: MapPin },
    { id: 'manage-users', path: '/admin/users', label: 'Users & Roles', icon: Users },
    { id: 'broadcast-alerts', path: '/admin/alerts', label: 'Broadcast Alert', icon: AlertTriangle },
  ];

  const links = currentRole === 'Admin' ? adminLinks : currentRole === 'Driver' ? driverLinks : residentLinks;

  return (
    <aside className="w-64 bg-[#111B2E] border-r border-[#1F2C45] min-h-screen flex flex-col justify-between p-4 text-[#E6EDF7] select-none">
      <div>
        {/* Logo and Mobile Close */}
        <div className="flex items-center justify-between px-2 py-3 border-b border-[#1F2C45] mb-5">
          <Link to="/landing" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 p-1 bg-[#0284C7]/10 rounded-xl border border-[#0284C7]/30 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="font-extrabold text-base leading-none text-[#E6EDF7] tracking-tight">AquaBophelo</h1>
              <p className="text-[10px] text-[#16A34A] font-semibold italic mt-0.5">Elke druppel tel</p>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-[#8A9BB8] hover:text-[#E6EDF7] hover:bg-[#1F2C45] transition-colors"
              aria-label="Close Navigation Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.id}
                to={link.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0284C7]/15 text-sky-400 border border-[#0284C7]/30 shadow-xs'
                      : 'text-[#8A9BB8] hover:bg-[#0B1220] hover:text-[#E6EDF7]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Role Info & Public Landing Link */}
      <div className="pt-4 border-t border-[#1F2C45] space-y-2">
        <Link
          to="/landing"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#8A9BB8] hover:text-[#E6EDF7] hover:bg-[#0B1220] transition-colors border border-transparent hover:border-[#1F2C45]"
        >
          <span className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>Public Landing Page</span>
          </span>
          <span className="text-[10px] bg-[#0284C7]/20 text-sky-400 px-1.5 py-0.5 rounded-md">View</span>
        </Link>

        <div className="bg-[#0B1220] p-3 rounded-xl border border-[#1F2C45] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#E6EDF7] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Role: {currentRole}</span>
            </p>
            <p className="text-[10px] text-[#8A9BB8] mt-0.5">Sol Plaatje Municipality</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
