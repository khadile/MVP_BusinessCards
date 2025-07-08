import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeContext } from '../../components/ui/ThemeProvider';
import { Theme } from '../../hooks/useTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, updateProfile } = useAuthStore();
  const { theme, setTheme: setGlobalTheme, systemTheme } = useThemeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme);
  const [notifications, setNotifications] = useState<boolean>(profile?.preferences.notifications || true);

  // Update form state when profile changes
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setSelectedTheme(profile.preferences?.theme || 'auto');
      setNotifications(profile.preferences?.notifications || true);
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Update profile in auth store
      await updateProfile({
        displayName,
        preferences: {
          theme: selectedTheme,
          notifications,
        },
      });
      
      // Update global theme immediately
      await setGlobalTheme(selectedTheme);
      
      setMessage({ text: 'Settings saved successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to save settings', type: 'error' });
      console.error('❌ Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = async (newTheme: Theme) => {
    setSelectedTheme(newTheme);
    // Apply theme immediately for preview
    await setGlobalTheme(newTheme);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.')) {
      // TODO: Implement account deletion
      console.log('Account deletion requested');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Account Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500"
                  placeholder="Enter your display name"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Theme
                </label>
                <select
                  value={selectedTheme}
                  onChange={(e) => handleThemeChange(e.target.value as Theme)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {selectedTheme === 'auto' ? (
                    <>Currently using <strong>{systemTheme}</strong> theme (system preference)</>
                  ) : (
                    <>Currently using <strong>{selectedTheme}</strong> theme</>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Email Notifications
                </label>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Account Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleDeleteAccount}
                className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}; 