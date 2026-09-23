import React from 'react';
import { Droplet, Truck, AlertTriangle, LayoutDashboard, Settings, MapPin, Users, LogOut } from 'lucide-react';

export function Sidebar({ currentRole = 'Resident', activeTab = 'dashboard', onTabChange }) {
  const residentLinks = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'dams', label: 'Dam Monitoring', icon: Droplet },
    { id: 'trucks', label: 'Live Trucks', icon: Truck },
    { id: 'alerts', label: 'My Alerts', icon: AlertTriangle },
  ];

  const driverLinks = [
    { id: 'mytrip', label: 'Current Trip', icon: Truck },
    { id: 'stops', label: 'Route Stops', icon: MapPin },
  ];

  const adminLinks = [
    { id: 'admin-overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'manage-dams', label: 'Dams & Readings', icon: Droplet },
    { id: 'manage-trucks', label: 'Fleet & Drivers', icon: Truck },
    { id: 'manage-routes', label: 'Routes & Stops', icon: MapPin },
    { id: 'manage-users', label: 'Users & Roles', icon: Users },
    { id: 'broadcast-alerts', label: 'Broadcast Alert', icon: AlertTriangle },
  ];

  const links = currentRole === 'Admin' ? adminLinks : currentRole === 'Driver' ? driverLinks : residentLinks;

  return (
    <aside className="w-64 bg-[#111B2E] border-r border-[#1F2C45] min-h-screen flex flex-col justify-between p-4 text-[#E6EDF7]">
      <div>
        {/* Logo */}
        <div className="flex items-center space-x-3 px-2 py-4 border-b border-[#1F2C45] mb-6">
          <div className="p-2 bg-[#22D3EE]/10 rounded-lg text-[#22D3EE]">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none text-[#E6EDF7]">AquaBophelo</h1>
            <p className="text-[10px] text-[#8A9BB8] mt-1">Sol Plaatje Municipality</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange && onTabChange(link.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30'
                    : 'text-[#8A9BB8] hover:bg-[#0B1220] hover:text-[#E6EDF7]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Pill & User Info */}
      <div className="pt-4 border-t border-[#1F2C45]">
        <div className="bg-[#0B1220] p-3 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#E6EDF7]">Role: {currentRole}</p>
            <p className="text-[10px] text-[#8A9BB8]">Kimberley Region</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
