import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { User, Mail, MapPin, Phone, Lock, ShieldCheck, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ProfilePage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || 'Sisekelo Masombuka');
  const [email] = useState(user?.email || 'resident@solplaatje.gov.za');
  const [area, setArea] = useState(user?.area || 'Galeshewe');
  const [phoneNumber, setPhoneNumber] = useState('082 123 4567');

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsSubmittingProfile(true);

    setTimeout(() => {
      setIsSubmittingProfile(false);
      setProfileSuccess('Profile details updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    }, 600);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSubmittingPassword(true);
    setTimeout(() => {
      setIsSubmittingPassword(false);
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#E6EDF7]">
            Account Profile &amp; Settings
          </h2>
          <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
            Manage your personal details, municipal location, and account security.
          </p>
        </div>

        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#16A34A] bg-[#16A34A]/10 px-3 py-1.5 rounded-full border border-[#16A34A]/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Role: {user?.role || 'Resident'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Badge Summary Card */}
        <div className="bg-[#111B2E] border border-[#1F2C45] rounded-3xl p-6 shadow-md md:col-span-1 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#0284C7]/20 border-2 border-[#0284C7] flex items-center justify-center text-sky-400 font-extrabold text-2xl mb-4 shadow-inner">
            {fullName ? fullName[0].toUpperCase() : 'U'}
          </div>

          <h3 className="font-extrabold text-lg text-[#E6EDF7]">{fullName}</h3>
          <p className="text-xs text-[#8A9BB8] mt-0.5">{email}</p>

          <div className="mt-4 pt-4 border-t border-[#1F2C45] w-full space-y-2 text-left text-xs">
            <div className="flex items-center justify-between text-[#8A9BB8]">
              <span>Municipal Area:</span>
              <span className="font-bold text-[#E6EDF7]">{area}</span>
            </div>
            <div className="flex items-center justify-between text-[#8A9BB8]">
              <span>Timezone Standard:</span>
              <span className="font-bold text-sky-400">CAT (UTC+2)</span>
            </div>
            <div className="flex items-center justify-between text-[#8A9BB8]">
              <span>Account Status:</span>
              <span className="font-bold text-[#16A34A]">Verified</span>
            </div>
          </div>
        </div>

        {/* Edit Forms (2 columns) */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-3xl p-6 shadow-md">
            <h3 className="font-bold text-base text-[#E6EDF7] mb-4 flex items-center space-x-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>Personal Information</span>
            </h3>

            {profileSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Name"
                icon={User}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8A9BB8] mb-1.5">
                    Municipal Suburb / Area
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#8A9BB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#0B1220] border border-[#1F2C45] rounded-xl text-sm text-[#E6EDF7] focus:outline-none focus:border-[#0284C7]"
                    >
                      <option value="Galeshewe">Galeshewe</option>
                      <option value="Kimberley Central">Kimberley Central</option>
                      <option value="Roodepan">Roodepan</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Phone Number (SMS Alerts)"
                  icon={Phone}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="082 123 4567"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" isLoading={isSubmittingProfile} icon={Save}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-3xl p-6 shadow-md">
            <h3 className="font-bold text-base text-[#E6EDF7] mb-4 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-sky-400" />
              <span>Change Password</span>
            </h3>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                icon={Lock}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  icon={Lock}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  icon={Lock}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" isLoading={isSubmittingPassword} icon={Lock}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
