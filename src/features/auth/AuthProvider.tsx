import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const signIn = async (email: string, password: string) => {
    // TODO: Implement Firebase authentication
    console.log('Sign in:', email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    // TODO: Implement Firebase registration
    console.log('Sign up:', email, password, displayName);
  };

  const signOut = async () => {
    // TODO: Implement Firebase sign out
    console.log('Sign out');
  };

  const value = {
    user: null,
    isLoading: false,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 