import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme, Theme } from '../../hooks/useTheme';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => Promise<void>;
  isDark: boolean;
  isLight: boolean;
  isAuto: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeData = useTheme();
  
  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}; 