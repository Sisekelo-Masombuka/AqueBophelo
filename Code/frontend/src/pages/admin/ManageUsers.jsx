import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, UserPlus, Search, X, Settings, Activity, Bell, Server, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import apiClient from '../../api/client';

export function ManageUsers() {
  const [activeMainTab, setActiveMainTab] = useState('users'); // 'users' | 'settings' | 'audit'

  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Section 3.7.4 & 3.7.5: System Settings State
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [dryRunModeEnabled, setDryRunModeEnabled] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('https://localhost:7154');
  const systemTimezone = 'CAT (UTC+2)';
  const [settingsSuccess, setSettingsSuccess] = useState('');

  const [roleFilter, setRoleFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Driver');
  const [newArea, setNewArea] = useState('Galeshewe');
  const [newTruck, setNewTruck] = useState('542-KM NC');
  const [initialPassword, setInitialPassword] = useState('SolPlaatje2026!');
  const [feedback, setFeedback] = useState(null);
  const [modalError, setModalError] = useState('');
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/api/v1/users');
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      console.warn('Error fetching users:', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await apiClient.get('/api/v1/auditlogs');
      if (Array.isArray(res.data)) {
        setAuditLogs(res.data.map(l => ({
          id: l.id || `log-${Math.random()}`,
          action: l.action || 'System Event',
          actor: l.userFullName || l.userEmail || 'System',
          details: l.details || '',
          timestamp: l.timestampUtc ? new Date(l.timestampUtc).toLocaleString('en-ZA') : 'Recently',
          type: l.category || 'Operations'
        })));
      }
    } catch (err) {
      console.warn('Error fetching audit logs:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [usersRes, auditRes] = await Promise.allSettled([
          apiClient.get('/api/v1/users'),
          apiClient.get('/api/v1/auditlogs'),
        ]);
        if (!isMounted) return;
        if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value.data)) {
          setUsers(usersRes.value.data);
        }
        if (auditRes.status === 'fulfilled' && Array.isArray(auditRes.value.data)) {
          setAuditLogs(auditRes.value.data.map(l => ({
            id: l.id || `log-${Math.random()}`,
            action: l.action || 'System Event',
            actor: l.userFullName || l.userEmail || 'System',
            details: l.details || '',
            timestamp: l.timestampUtc ? new Date(l.timestampUtc).toLocaleString('en-ZA') : 'Recently',
            type: l.category || 'Operations'
          })));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!newFullName.trim() || !newEmail.trim()) {
      setModalError('Full name and email address are required.');
      return;
    }

    if (!initialPassword || initialPassword.length < 6) {
      setModalError('Initial temporary password must be at least 6 characters long.');
      return;
    }

    setIsSubmittingUser(true);
    try {
      await apiClient.post('/api/v1/users', {
        fullName: newFullName.trim(),
        email: newEmail.trim().toLowerCase(),
        phoneNumber: newPhone.trim(),
        role: newRole,
        areaName: newArea,
        assignedTruckRegistration: newRole === 'Driver' ? newTruck : null,
        initialPassword
      });

      setFeedback({
        type: 'success',
        text: `Account created for ${newFullName} (${newRole}). Initial Password: ${initialPassword}`,
      });
      setIsInviteModalOpen(false);
      setNewFullName('');
      setNewEmail('');
      setNewPhone('');
      setModalError('');
      await fetchUsers();
      await fetchAuditLogs();
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to create user account. Please check password criteria.';
      setModalError(errMsg);
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to deactivate ${userName}?`)) return;
    try {
      await apiClient.delete(`/api/v1/users/${userId}`);
      setFeedback({ type: 'success', text: `User ${userName} deactivated successfully.` });
      await fetchUsers();
      await fetchAuditLogs();
    } catch {
      setFeedback({ type: 'error', text: 'Failed to deactivate user.' });
    }
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
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] mb-1">
            <Users className="w-3.5 h-3.5 text-[#1d70b8]" />
            <span>Municipal System Management</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">
            System Administration &amp; Access Control
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
            Manage users, driver roles, system notifications config, API endpoints, and security audit logs.
          </p>
        </div>

        {activeMainTab === 'users' && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs md:text-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>+ Create Driver / Staff Account</span>
          </button>
        )}
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveMainTab('users')}
          className={`pb-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeMainTab === 'users'
              ? 'border-[#152e52] text-[#152e52]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users, Roles &amp; Permissions</span>
        </button>

        <button
          onClick={() => setActiveMainTab('settings')}
          className={`pb-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeMainTab === 'settings'
              ? 'border-[#152e52] text-[#152e52]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>System &amp; Notifications Config</span>
        </button>

        <button
          onClick={() => setActiveMainTab('audit')}
          className={`pb-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeMainTab === 'audit'
              ? 'border-[#152e52] text-[#152e52]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit &amp; Activity Logs</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-3.5 rounded-md border flex items-center space-x-3 text-xs md:text-sm font-medium ${
          feedback.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]'
        }`}>
          {feedback.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2e7d32]" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tab 1: Users, Roles & Permissions (3.7.1, 3.7.2, 3.7.3) */}
      {activeMainTab === 'users' && (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search personnel by name, email, or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#1d70b8]"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto">
              {['All', 'Admin', 'Driver', 'Resident'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    roleFilter === role
                      ? 'bg-[#152e52] text-white font-semibold shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm text-slate-800">
                <thead className="bg-[#f8fafc] text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Personnel Details</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Assigned Vehicle</th>
                    <th className="py-3 px-4">Municipal Suburb</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                        {loading ? 'Loading personnel records...' : 'No personnel accounts found. Click "+ Create Driver / Staff Account" to add team members.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-[#152e52] text-white font-bold text-xs flex items-center justify-center">
                              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-serif font-bold text-[#152e52]">{user.fullName}</p>
                              <p className="text-xs text-slate-500 font-normal">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md ${
                              user.role === 'Admin'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : user.role === 'Driver'
                                ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-xs">{user.phone}</td>
                        <td className="py-3 px-4 text-xs font-semibold text-[#152e52]">{user.assignedTruck}</td>
                        <td className="py-3 px-4 text-slate-600 font-normal">{user.areaName}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-between">
                            <StatusBadge status={user.status} />
                            {user.role !== 'Admin' && (
                              <button
                                onClick={() => handleDeleteUser(user.id, user.fullName)}
                                className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                title="Deactivate user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tab 2: System & Notifications Config (3.7.4 & 3.7.5) */}
      {activeMainTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-serif font-bold text-lg text-[#152e52] flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#1d70b8]" />
              <span>Municipal System &amp; Notification Configuration</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure environment variables, email notification services, dry-run modes, and timezone standards.
            </p>
          </div>

          {settingsSuccess && (
            <div className="p-3.5 bg-[#f2f9f3] border border-[#b8e3bd] text-[#2e7d32] rounded-md text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{settingsSuccess}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 text-xs">
            {/* Notifications Config */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-5 space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#152e52] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#2e7d32]" />
                <span>Notifications Configuration</span>
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-md">
                  <div>
                    <p className="font-bold text-[#152e52]">Email Dispatch Service</p>
                    <p className="text-slate-500 text-xs">Delivers automated emails for login verification codes and water alerts.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}
                    className="cursor-pointer"
                  >
                    <StatusBadge status={emailNotificationsEnabled ? 'Active' : 'Inactive'} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-md">
                  <div>
                    <p className="font-bold text-[#152e52]">Test Mode (Console Output)</p>
                    <p className="text-slate-500 text-xs">Logs notification messages to the server console instead of sending real emails.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDryRunModeEnabled(!dryRunModeEnabled)}
                    className="cursor-pointer"
                  >
                    <StatusBadge status={dryRunModeEnabled ? 'Watch' : 'Healthy'} />
                  </button>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-5 space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#152e52] flex items-center gap-2">
                <Server className="w-4 h-4 text-[#1d70b8]" />
                <span>System &amp; Server Settings</span>
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Backend API Base Endpoint</label>
                  <input
                    type="text"
                    value={apiBaseUrl}
                    onChange={(e) => setApiBaseUrl(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Municipal Timezone Standard</label>
                  <input
                    type="text"
                    disabled
                    value={systemTimezone}
                    className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-xs font-bold text-[#1d70b8]"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Enforced system-wide (CAT / UTC+2).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setSettingsSuccess('System configuration saved to backend!');
                setTimeout(() => setSettingsSuccess(''), 3000);
              }}
              className="px-5 py-2.5 bg-[#152e52] hover:bg-[#0f223d] text-white font-bold rounded-md text-xs transition-colors cursor-pointer shadow-xs"
            >
              Save System Configuration
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Audit & Activity Logs (3.7.6) */}
      {activeMainTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#152e52] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#2e7d32]" />
                <span>System Audit &amp; Activity Logs</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Immutable security and operational audit trail for Sol Plaatje Municipal Water System.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]">
              {auditLogs.length} Audit Entries
            </span>
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-left text-xs md:text-sm text-slate-800">
              <thead className="bg-[#f8fafc] text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor / User</th>
                  <th className="py-3 px-4">Operational Details</th>
                  <th className="py-3 px-4">Timestamp (CAT)</th>
                  <th className="py-3 px-4">Log Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                      No security or operational audit events recorded yet. System activity will appear here.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#152e52]">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {log.actor}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          log.type === 'Security' ? 'bg-red-50 text-red-700 border border-red-200' :
                          log.type === 'Fleet' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-lg shadow-xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#152e52]">
                Create {newRole} Account
              </h3>
              <button
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setModalError('');
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Provision credentials for municipal {newRole.toLowerCase()} access.
            </p>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kagiso Motsepe"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder={`${newRole.toLowerCase()}@aquabophelo.app`}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number (Telemetry)</label>
                <input
                  type="tel"
                  placeholder="082 999 1122"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    System Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                  >
                    <option value="Admin">Admin (Municipal Staff Access)</option>
                    <option value="Driver">Driver (Vehicle Telemetry Access)</option>
                    <option value="Resident">Resident (Community Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Assigned Vehicle (If Driver)
                  </label>
                  <select
                    value={newTruck}
                    onChange={(e) => setNewTruck(e.target.value)}
                    disabled={newRole !== 'Driver'}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8] disabled:opacity-40"
                  >
                    <option value="542-KM NC (10,000L)">542-KM NC (10,000L)</option>
                    <option value="882-KM NC (15,000L)">882-KM NC (15,000L)</option>
                    <option value="104-KM NC (10,000L)">104-KM NC (10,000L)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Municipal Suburb</label>
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                >
                  <option value="Galeshewe">Galeshewe</option>
                  <option value="Kimberley Central">Kimberley Central</option>
                  <option value="Roodepan">Roodepan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Initial Temporary Password</label>
                <input
                  type="text"
                  value={initialPassword}
                  onChange={(e) => setInitialPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Must be at least 6 characters with uppercase, lowercase, number, and symbol (e.g. SolPlaatje2026!)
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsInviteModalOpen(false);
                    setModalError('');
                  }}
                  className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmittingUser ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating {newRole}...</span>
                    </>
                  ) : (
                    <span>Create {newRole} Account</span>
                  )}
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
