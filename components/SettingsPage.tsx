import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './Navbar';
import { Card } from './ui/Card';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface SettingsPageProps {
  user: User;
  onNavigateHome: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onNavigateHome }) => {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [success, setSuccess] = useState<string | null>(null);

  const handleSaveSettings = () => {
    // In a real app, you would save these to Firebase or local storage
    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(null), 3000);
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

        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Notifications Section */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-400">Receive notifications about code reviews</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive email updates about your activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences Section */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="language" className="text-sm font-medium text-gray-300 mb-2 block">
                    Language
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-400">Toggle dark theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Section */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="text-white font-mono text-xs">{user.uid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Account Created</p>
                  <p className="text-white">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSaveSettings}
            className="w-full bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Save Settings
          </button>
        </div>

        {success && (
          <div className="mt-6 p-4 rounded-md bg-green-900/30 border border-green-800">
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}
      </main>
    </div>
  );
};

