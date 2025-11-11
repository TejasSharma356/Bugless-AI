import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './Navbar';
import { Card } from './ui/Card';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { updateProfile, updateEmail, updatePassword, validatePassword } from '../services/authService';

interface ProfilePageProps {
  user: User;
  onNavigateHome: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigateHome }) => {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await updateProfile(displayName);
      setSuccess('Display name updated successfully!');
      setDisplayName(displayName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update display name.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!currentPasswordForEmail) {
      setError('Current password is required to change email.');
      setIsLoading(false);
      return;
    }

    try {
      await updateEmail(email, currentPasswordForEmail);
      setSuccess('Email updated successfully!');
      setCurrentPasswordForEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!currentPasswordForPassword) {
      setError('Current password is required to change password.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setIsLoading(false);
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid password.');
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword(currentPasswordForPassword, newPassword);
      setSuccess('Password updated successfully!');
      setCurrentPasswordForPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
        <button
          onClick={onNavigateHome}
          className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

        <div className="space-y-6">
          {/* Display Name Section */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Display Name</h2>
              <form onSubmit={handleUpdateName} className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="text-sm font-medium text-gray-300 mb-2 block">
                    Full Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                    placeholder="Your name"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !displayName.trim()}
                  className="w-full bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Name'}
                </button>
              </form>
            </div>
          </Card>

          {/* Email Section */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Email Address</h2>
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-300 mb-2 block">
                    New Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="currentPasswordEmail" className="text-sm font-medium text-gray-300 mb-2 block">
                    Current Password (required)
                  </label>
                  <input
                    id="currentPasswordEmail"
                    type="password"
                    value={currentPasswordForEmail}
                    onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                    placeholder="Enter current password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !email.trim() || !currentPasswordForEmail}
                  className="w-full bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Email'}
                </button>
              </form>
            </div>
          </Card>

          {/* Password Section */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="text-sm font-medium text-gray-300 mb-2 block">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPasswordForPassword}
                    onChange={(e) => setCurrentPasswordForPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="text-sm font-medium text-gray-300 mb-2 block">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 mb-2 block">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !currentPasswordForPassword || !newPassword || !confirmPassword}
                  className="w-full bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </Card>
        </div>

        {(error || success) && (
          <div className={`mt-6 p-4 rounded-md ${error ? 'bg-red-900/30 border border-red-800' : 'bg-green-900/30 border border-green-800'}`}>
            <p className={`text-sm ${error ? 'text-red-400' : 'text-green-400'}`}>
              {error || success}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

