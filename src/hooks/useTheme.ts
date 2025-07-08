import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export type Theme = 'light' | 'dark' | 'auto';

export function useTheme() {
  const { profile, updateProfile } = useAuthStore();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  
  // Get current theme from user profile or default to 'auto'
  const currentTheme: Theme = profile?.preferences?.theme || 'auto';
  
  // Determine the actual theme to apply
  const actualTheme = currentTheme === 'auto' ? systemTheme : currentTheme;
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(actualTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', actualTheme === 'dark' ? '#0f172a' : '#ffffff');
    }
  }, [actualTheme]);
  
  // Function to set theme
  const setTheme = async (theme: Theme) => {
    try {
      await updateProfile({
        preferences: {
          ...profile?.preferences,
          theme,
          notifications: profile?.preferences?.notifications || true,
        },
      });
    } catch (error) {
      console.error('❌ Error updating theme:', error);
    }
  };
  
  return {
    theme: currentTheme,
    actualTheme,
    systemTheme,
    setTheme,
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light',
    isAuto: currentTheme === 'auto',
  };
} 