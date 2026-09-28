import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, Mail, Phone, Truck, Search, CheckCircle2, UserPlus, KeyRound } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function ManageUsers() {
  const [users, setUsers] = useState([
    {
      id: 'usr-1',
      fullName: 'Sisekelo "Cuba" Masombuka',
      email: 'admin@aquabophelo.gov.za',
      phone: '082 111 2233',
      role: 'Admin',
      areaName: 'Kimberley Central',
      assignedTruck: 'Command Desk',
      status: 'Active',
      lastLogin: 'Today, 08:30 (CAT)',
    },
    {
      id: 'usr-2',
      fullName: 'Jabulile Shabalala',
      email: 'jabulile@aquabophelo.gov.za',
      phone: '083 444 5566',
      role: 'Admin',
      areaName: 'Sol Plaatje Operations',
      assignedTruck: 'Command Desk',
      status: 'Active',
      lastLogin: 'Today, 08:45 (CAT)',
    },
    {
      id: 'usr-3',
      fullName: 'Sipho Dlamini',
      email: 'sipho.driver@aquabophelo.gov.za',
      phone: '082 999 1122',
      role: 'Driver',
      areaName: 'Galeshewe Zone 3',
      assignedTruck: 'NC-542-KM (10,000L)',
      status: 'Active',
      lastLogin: 'Today, 07:50 (CAT)',
    },
    {
      id: 'usr-4',
      fullName: 'Lerato Motsepe',
      email: 'lerato.driver@aquabophelo.gov.za',
      phone: '084 777 8899',
      role: 'Driver',
      areaName: 'Kimberley Central',
      assignedTruck: 'NC-882-KM (15,000L)',
      status: 'Active',
      lastLogin: 'Today, 07:55 (CAT)',
    },
    {
      id: 'usr-5',
      fullName: 'Nomcebo Nkosi',
      email: 'nomcebo.resident@gmail.com',
      phone: '082 123 4567',
      role: 'Resident',
      areaName: 'Galeshewe',
      assignedTruck: 'N/A',
      status: 'Active',
      lastLogin: 'Yesterday, 18:20 (CAT)',
    },
  ]);

  const [roleFilter, setRoleFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Driver');
  const [newArea, setNewArea] = useState('Galeshewe');
  const [newTruck, setNewTruck] = useState('NC-542-KM');
  const [initialPassword, setInitialPassword] = useState('SolPlaatje2026!');
  const [feedback, setFeedback] = useState(null);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName: newFullName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || '082 000 0000',
      role: newRole,
      areaName: newArea,
      assignedTruck: newRole === 'Driver' ? newTruck : 'N/A',
      status: 'Active',
      lastLogin: 'Pending First Sign-in',
    };

    setUsers((prev) => [newUser, ...prev]);
    setFeedback({
      type: 'success',
      text: `Account created for ${newFullName} (${newRole}). Initial Password: ${initialPassword}`,
    });
    setIsInviteModalOpen(false);
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.areaName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-blue uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5 text-brand-blue" />
            <span>Personnel &amp; Access Control</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-navy-dark">
            User &amp; Role Administration
          </h2>
          <p className="text-xs md:text-sm text-muted mt-1">
            Create driver accounts, assign water tankers, manage municipal staff, and view resident profiles.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-navy text-white font-bold text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 shrink-0" />
          <span>+ Create Driver / Staff Account</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center space-x-3 text-xs md:text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{feedback.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search personnel by name, email, or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-border rounded-xl pl-10 pr-4 py-2 text-xs text-brand-navy-dark focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {['All', 'Admin', 'Driver', 'Resident'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                roleFilter === role
                  ? 'bg-brand-blue text-white'
                  : 'bg-slate-50 text-muted hover:text-brand-navy-dark border border-border'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm text-brand-navy-dark">
            <thead className="bg-slate-50 text-muted uppercase text-[11px] font-bold tracking-wider border-b border-border">
              <tr>
                <th className="py-3.5 px-4">Personnel Details</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Phone (SMS)</th>
                <th className="py-3.5 px-4">Assigned Vehicle</th>
                <th className="py-3.5 px-4">Municipal Suburb</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-blue/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-accent/10 text-brand-blue font-extrabold text-sm flex items-center justify-center border border-brand-accent/30">
                        {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-brand-navy-dark">{user.fullName}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        user.role === 'Admin'
                          ? 'bg-rose-500/15 text-rose-600 border border-rose-500/20'
                          : user.role === 'Driver'
                          ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/20'
                          : 'bg-sky-500/15 text-sky-700 border border-sky-500/20'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted font-mono text-xs">{user.phone}</td>
                  <td className="py-3.5 px-4 text-xs font-bold text-brand-blue">{user.assignedTruck}</td>
                  <td className="py-3.5 px-4 text-muted">{user.areaName}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={user.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-3xl p-6 w-full max-w-lg shadow-2xl text-[#E6EDF7]">
            <div className="flex items-center space-x-3 mb-4 border-b border-[#1F2C45] pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#0284C7]/20 border border-[#0284C7]/40 flex items-center justify-center text-[#0284C7]">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#E6EDF7]">Create Personnel / Driver Account</h3>
                <p className="text-xs text-[#8A9BB8]">Provision credentials for municipal staff or drivers</p>
              </div>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Sipho Dlamini"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="sipho.driver@aquabophelo.gov.za"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />

              <Input
                label="Phone Number (SMS & WhatsApp Telemetry)"
                placeholder="082 999 1122"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8A9BB8] mb-1">
                    System Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3 py-2.5 text-xs md:text-sm text-[#E6EDF7] focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="Driver">Driver (Vehicle Telemetry Access)</option>
                    <option value="Admin">Admin (Municipal Staff Access)</option>
                    <option value="Resident">Resident (Community Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8A9BB8] mb-1">
                    Assigned Vehicle (If Driver)
                  </label>
                  <select
                    value={newTruck}
                    onChange={(e) => setNewTruck(e.target.value)}
                    disabled={newRole !== 'Driver'}
                    className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3 py-2.5 text-xs md:text-sm text-[#E6EDF7] focus:outline-none focus:border-[#0284C7] disabled:opacity-40"
                  >
                    <option value="NC-542-KM (10,000L)">NC-542-KM (10,000L)</option>
                    <option value="NC-882-KM (15,000L)">NC-882-KM (15,000L)</option>
                    <option value="NC-104-KM (10,000L)">NC-104-KM (10,000L)</option>
                  </select>
                </div>
              </div>

              <Input
                label="Initial Temporary Password"
                icon={KeyRound}
                value={initialPassword}
                onChange={(e) => setInitialPassword(e.target.value)}
                helpText="Driver will use this password on first smartphone login"
                required
              />

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1F2C45]">
                <Button type="button" variant="ghost" onClick={() => setIsInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Personnel Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
