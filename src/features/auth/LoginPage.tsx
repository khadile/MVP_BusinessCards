import React, { useState, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      // Handle specific Firebase errors
      let errorMessage = 'Login failed.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      navigate('/dashboard');
    } catch (err: any) {
      // Handle specific Firebase errors
      let errorMessage = 'Google login failed.';
      
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login was cancelled. Please try again.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked. Please allow pop-ups and try again.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src="/ixl-logo.svg" alt="ILX Logo" className="h-12 w-12 rounded-full" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your digital business cards
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Google Sign In */}
          <button
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 mb-6 bg-white hover:bg-gray-50 shadow-sm font-medium text-sm disabled:opacity-50 transition"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-4 text-gray-400 font-medium text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email/Password Form */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleEmailLogin(); }}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                disabled={loading}
              >
                Forgot your password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={!email.trim() || !password.trim() || loading}
              className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/onboarding"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}; 