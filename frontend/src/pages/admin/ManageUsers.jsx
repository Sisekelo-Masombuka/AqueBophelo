import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, Mail, UserCheck, Search, CheckCircle2, UserPlus } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export function ManageUsers() {
  const [users, setUsers] = useState([
    {
      id: 'usr-1',
      fullName: 'Sisekelo "Cuba" Masombuka',
      email: 'admin@aquabophelo.gov.za',
      role: 'Admin',
      areaName: 'Kimberley Central',
      status: 'Active',
      lastLogin: 'Today, 08:30 (SAST)',
    },
    {
      id: 'usr-2',
      fullName: 'Jabulile Shabalala',
      email: 'jabulile@aquabophelo.gov.za',
      role: 'Admin',
      areaName: 'Sol Plaatje Operations',
      status: 'Active',
      lastLogin: 'Today, 08:45 (SAST)',
    },
    {
      id: 'usr-3',
      fullName: 'Sipho Dlamini',
      email: 'sipho.driver@aquabophelo.gov.za',
      role: 'Driver',
      areaName: 'Galeshewe Zone 3',
      status: 'Active',
      lastLogin: 'Today, 07:50 (SAST)',
    },
    {
      id: 'usr-4',
      fullName: 'Lerato Motsepe',
      email: 'lerato.driver@aquabophelo.gov.za',
      role: 'Driver',
      areaName: 'Kimberley Central',
      status: 'Active',
      lastLogin: 'Today, 07:55 (SAST)',
    },
    {
      id: 'usr-5',
      fullName: 'Nomcebo Nkosi',
      email: 'nomcebo.resident@gmail.com',
      role: 'Resident',
      areaName: 'Galeshewe',
      status: 'Active',
      lastLogin: 'Yesterday, 18:20 (SAST)',
    },
  ]);

  const [roleFilter, setRoleFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Driver');
  const [newArea, setNewArea] = useState('Galeshewe');
  const [feedback, setFeedback] = useState(null);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName: newFullName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      areaName: newArea,
      status: 'Active',
      lastLogin: 'Pending First Sign-in',
    };

    setUsers((prev) => [newUser, ...prev]);
    setFeedback({ type: 'success', text: `Account created for ${newFullName} (${newRole}).` });
    setIsInviteModalOpen(false);
    setNewFullName('');
    setNewEmail('');
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
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Personnel &amp; Access Control</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#E6EDF7]">
            User &amp; Role Administration
          </h2>
          <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
            Manage municipal administrators, certified delivery drivers, and resident portal accounts.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0B1220] font-bold text-xs md:text-sm transition-all shadow-md active:scale-95"
        >
          <UserPlus className="w-4 h-4 shrink-0" />
          <span>Add Personnel Account</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] flex items-center space-x-3 text-xs md:text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8A9BB8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search personnel by name, email, or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {['All', 'Admin', 'Driver', 'Resident'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === role
                  ? 'bg-[#22D3EE] text-[#0B1220]'
                  : 'bg-[#0B1220] text-[#8A9BB8] hover:text-[#E6EDF7] border border-[#1F2C45]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm text-[#E6EDF7]">
            <thead className="bg-[#0B1220] text-[#8A9BB8] uppercase text-[11px] font-semibold tracking-wider border-b border-[#1F2C45]">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Municipal Area</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2C45]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#16233B]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] font-bold text-xs flex items-center justify-center border border-[#22D3EE]/30">
                        {user.fullName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-[#E6EDF7]">{user.fullName}</p>
                        <p className="text-xs text-[#8A9BB8]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        user.role === 'Admin'
                          ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                          : user.role === 'Driver'
                          ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                          : 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#8A9BB8]">{user.areaName}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#8A9BB8]">{user.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 w-full max-w-md shadow-2xl text-[#E6EDF7]">
            <h3 className="text-lg font-bold text-[#E6EDF7] mb-1">
              Add Personnel Account
            </h3>
            <p className="text-xs text-[#8A9BB8] mb-4">
              Create an official access account for municipal staff or drivers.
            </p>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kagiso Modise"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  required
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="kagiso.driver@aquabophelo.gov.za"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                    Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3 py-2 text-xs md:text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                  >
                    <option value="Driver">Driver</option>
                    <option value="Admin">Admin</option>
                    <option value="Resident">Resident</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                    Municipal Area
                  </label>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3 py-2 text-xs md:text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                  >
                    <option value="Galeshewe">Galeshewe</option>
                    <option value="Kimberley Central">Kimberley Central</option>
                    <option value="Roodepan">Roodepan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1F2C45]">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A9BB8] hover:text-[#E6EDF7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#22D3EE] text-[#0B1220] font-bold text-xs shadow-md"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
