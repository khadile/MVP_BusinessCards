import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      console.log('🚀 Initializing authentication...');
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  return <>{children}</>;
}; 