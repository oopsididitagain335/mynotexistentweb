// pages/dashboard/settings.tsx
import React, { useState } from 'react';
import Layout from '@components/Layout';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '@lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Settings: React.FC = () => {
  const { userProfile, refreshUserProfile } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const changePassword = async () => {
    // Firebase handles password change
    alert('Password change not implemented in demo.');
  };

  const logoutAll = async () => {
    await signOut(auth);
    // In prod, revoke all sessions
  };

  const deleteAccount = async () => {
    if (confirm('Are you sure? This cannot be undone.')) {
      await updateDoc(doc(db, 'users', userProfile!.uid), { deleted: true, deletedAt: new Date() });
      await signOut(auth);
      alert('Account marked for deletion.');
    }
  };

  return (
    <Layout title="Settings — thebiolink.lol">
      <div className="dashboard-container space-y-6">
        <div className="card">
          <h3 className="text-lg font-bold">Appearance</h3>
          <div className="mt-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              Dark Mode
            </label>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold">Privacy</h3>
          <div className="mt-3">
            <label>Privacy Tier</label>
            <select
              value={userProfile?.privacy}
              className="input w-full mt-1"
              disabled
            >
              <option>public</option>
              <option>followers</option>
              <option>friends</option>
              <option>hidden</option>
            </select>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold">Password</h3>
          <div className="mt-3 space-y-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="input w-full"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="input w-full"
            />
            <button onClick={changePassword} className="btn btn-secondary">
              Change Password
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold">Sessions</h3>
          <button onClick={logoutAll} className="btn btn-secondary">
            Log Out All Devices
          </button>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-danger">Danger Zone</h3>
          <button onClick={deleteAccount} className="btn btn-danger mt-2">
            Delete Account (7-day grace)
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
