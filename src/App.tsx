import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@features/auth/AuthProvider'
import { LandingPage } from '@features/landing/LandingPage'
import { LoginPage } from '@features/auth/LoginPage'
import { PasswordResetPage } from '@features/auth/PasswordResetPage'
import { Dashboard } from '@features/dashboard/Dashboard'
import { ProtectedRoute } from '@features/auth/ProtectedRoute'
import { OnboardingWizard } from '@features/onboarding/OnboardingWizard'
import { PublicCardView } from './features/dashboard/PublicCardView'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<PasswordResetPage />} />
            <Route path="/onboarding" element={<OnboardingWizard />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/card/:cardId" element={<PublicCardView />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App 