import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthProvider';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { PasswordProtectedRoute } from './features/auth/PasswordProtectedRoute';
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { PasswordResetPage } from './features/auth/PasswordResetPage';
import { OnboardingWizard } from './features/onboarding/OnboardingWizard';
import { Dashboard } from './features/dashboard/Dashboard';
import { PublicCardView } from './features/dashboard/PublicCardView';

function App() {
  // Initialize theme class on app start
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ThemeProvider>
    <AuthProvider>
      <Router>
          <Routes>
            {/* Public card view - no password protection needed */}
            <Route path="/card/:id" element={<PublicCardView />} />
            
            {/* All other routes require password protection */}
            <Route path="/*" element={
              <PasswordProtectedRoute>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/reset-password" element={<PasswordResetPage />} />
                  <Route path="/onboarding/*" element={<OnboardingWizard />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </PasswordProtectedRoute>
            } />
          </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 