import React from 'react';
import { PasswordGate } from './PasswordGate';

interface PasswordProtectedRouteProps {
  children: React.ReactNode;
}

export const PasswordProtectedRoute: React.FC<PasswordProtectedRouteProps> = ({ children }) => {
  return (
    <PasswordGate>
      {children}
    </PasswordGate>
  );
}; 