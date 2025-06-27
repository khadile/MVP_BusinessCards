import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@features/auth/AuthProvider'
import { LandingPage } from '@features/landing/LandingPage'
import { Dashboard } from '@features/dashboard/Dashboard'
import { ProtectedRoute } from '@features/auth/ProtectedRoute'
import { OnboardingWizard } from '@features/onboarding/OnboardingWizard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingWizard />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App 