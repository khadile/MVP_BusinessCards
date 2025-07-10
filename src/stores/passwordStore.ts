import { create } from 'zustand';

interface PasswordState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  authenticate: (password: string) => boolean;
  logout: () => void;
  checkAuthStatus: () => void;
  clearError: () => void;
}

// The master password for the site from environment variable
const MASTER_PASSWORD = import.meta.env.VITE_MASTER_PASSWORD;

// Storage key for password authentication
const PASSWORD_AUTH_KEY = 'ilx-password-auth';

export const usePasswordStore = create<PasswordState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Check if user is already authenticated (from sessionStorage)
  checkAuthStatus: () => {
    try {
      const storedAuth = sessionStorage.getItem(PASSWORD_AUTH_KEY);
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        const isValid = authData.timestamp && (Date.now() - authData.timestamp) < 24 * 60 * 60 * 1000; // 24 hours
        
        if (isValid) {
          set({ isAuthenticated: true, error: null });
        } else {
          // Clear expired authentication
          sessionStorage.removeItem(PASSWORD_AUTH_KEY);
          set({ isAuthenticated: false });
        }
      }
    } catch (error) {
      console.error('Error checking password auth status:', error);
      sessionStorage.removeItem(PASSWORD_AUTH_KEY);
      set({ isAuthenticated: false });
    }
  },

  // Authenticate with password
  authenticate: (password: string) => {
    set({ isLoading: true, error: null });
    
    // Simple password validation
    if (password.trim() === MASTER_PASSWORD) {
      // Store authentication in sessionStorage
      const authData = {
        authenticated: true,
        timestamp: Date.now()
      };
      sessionStorage.setItem(PASSWORD_AUTH_KEY, JSON.stringify(authData));
      
      set({ isAuthenticated: true, isLoading: false, error: null });
      return true;
    } else {
      set({ 
        isAuthenticated: false, 
        isLoading: false, 
        error: 'Incorrect password. Please try again.' 
      });
      return false;
    }
  },

  // Logout and clear authentication
  logout: () => {
    sessionStorage.removeItem(PASSWORD_AUTH_KEY);
    set({ isAuthenticated: false, error: null });
  },

  // Clear error message
  clearError: () => {
    set({ error: null });
  }
})); 