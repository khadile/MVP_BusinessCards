import React, { useState, ChangeEvent } from 'react';
import { CardPreview } from '../../components/preview/CardPreview';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useNavigate } from 'react-router-dom';
import { auth, db, testFirestoreWrite, testAuthenticatedWrite } from '../../services/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Toast } from '../../components/ui/Toast';
// import { useToast } from '../../components/ui/ToastContext'; // Uncomment if you have a Toast context

interface StepSignUpProps {
  goBack: () => void;
}

export const StepSignUp: React.FC<StepSignUpProps> = ({ goBack }) => {
  const {
    name,
    jobTitle,
    company,
    email,
    phone,
    links,
    password,
    setPassword,
    // ...other setters
  } = useOnboardingStore();
  const [localEmail, setLocalEmail] = useState<string>('');
  const [localPassword, setLocalPassword] = useState<string>(password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const navigate = useNavigate();
  // const toast = useToast();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalPassword(e.target.value);
    setPassword(e.target.value);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, localEmail, localPassword);
      const user = userCredential.user;
      
      console.log('✅ User created successfully:', user.uid);
      
      // 2. Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email || localEmail,
        displayName: name || user.displayName || '',
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isEmailVerified: user.emailVerified,
        preferences: {
          theme: 'light' as const,
          notifications: true,
        },
      };
      
      console.log('📝 Creating user profile...');
      await setDoc(doc(db, 'users', user.uid), userProfile);
      console.log('✅ User profile created successfully');
      
      // 3. Save onboarding data to Firestore under user's UID
      const cardData = {
        profile: {
          name,
          jobTitle,
          company,
          email,
          phone,
          bio: '', // Add onboarding bio if available
        },
        links,
        theme: {
          primaryColor: '#FDBA74',
          secondaryColor: '#000000',
          fontFamily: 'Inter',
          fontSize: 14,
          layout: 'modern',
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
        isPublic: true,
      };
      
      console.log('📝 Saving card data to Firestore...');
      await setDoc(doc(db, 'businessCards', `card-${user.uid}`), cardData);
      console.log('✅ Card data saved successfully');
      
      // 4. Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Sign up error:', err);
      setError(err.message || 'Sign up failed.');
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Starting Google sign up...');
      
      // First, test basic Firestore connection
      console.log('🧪 Testing Firestore connection...');
      const writeTest = await testFirestoreWrite();
      if (!writeTest) {
        throw new Error('Firestore connection test failed');
      }
      
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      console.log('✅ Google sign in successful:', user.uid);
      console.log('👤 User email:', user.email);
      console.log('🔐 User email verified:', user.emailVerified);
      
      // Verify user is authenticated
      if (!user || !user.uid) {
        throw new Error('User authentication failed');
      }
      
      // Test authenticated write
      console.log('🧪 Testing authenticated Firestore write...');
      const authWriteTest = await testAuthenticatedWrite(user.uid);
      if (!authWriteTest) {
        throw new Error('Authenticated Firestore write test failed');
      }
      
      // Wait a moment to ensure auth state is fully propagated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || name || '',
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isEmailVerified: user.emailVerified,
        preferences: {
          theme: 'light' as const,
          notifications: true,
        },
      };
      
      console.log('📝 Creating user profile...');
      await setDoc(doc(db, 'users', user.uid), userProfile);
      console.log('✅ User profile created successfully');
      
      // Save onboarding data to Firestore
      const cardData = {
        profile: {
          name,
          jobTitle,
          company,
          email: user.email || email, // Use Google email if available
          phone,
          bio: '', // Add onboarding bio if available
        },
        links,
        theme: {
          primaryColor: '#FDBA74',
          secondaryColor: '#000000',
          fontFamily: 'Inter',
          fontSize: 14,
          layout: 'modern',
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
        isPublic: true,
      };
      
      console.log('📝 Saving card data to Firestore...');
      console.log('📄 Card data:', cardData);
      
      await setDoc(doc(db, 'businessCards', `card-${user.uid}`), cardData);
      console.log('✅ Card data saved successfully');
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Google sign up error:', err);
      
      // Handle specific Firebase errors
      let errorMessage = 'Google sign up failed.';
      
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign up was cancelled. Please try again.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked. Please allow pop-ups and try again.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your Firebase configuration and security rules.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-20 items-start w-full">
      <div className="flex-1 max-w-xl">
        <h2 className="text-lg font-semibold mb-1">Complete sign up</h2>
        <p className="text-gray-500 mb-4 text-xs">Well done, your digital business card is looking great. Access your card by completing the sign up below. Welcome to ILX!</p>
        <button
          className="w-full flex items-center justify-center gap-2 border rounded-md py-2 mb-4 bg-white hover:bg-gray-50 shadow-sm font-medium text-xs disabled:opacity-50"
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          <img src="/google.svg" alt="Google" className="h-4 w-4" />
          Continue with Google
        </button>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-3 text-gray-400 font-medium text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
          type="email"
          value={localEmail}
          onChange={handleEmailChange}
          placeholder="Email"
          disabled={loading}
        />
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
          type="password"
          value={localPassword}
          onChange={handlePasswordChange}
          placeholder="Password"
          disabled={loading}
        />
        {error && (
          <div className="text-red-500 text-sm mt-2">Firebase: Error ({error})</div>
        )}
        <p className="text-xs text-gray-400 mb-5">
          By signing up, you agree to ILX's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
        </p>
        <div className="flex gap-5 justify-end mt-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-full border text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm flex items-center gap-1 text-xs"
            onClick={goBack}
            disabled={loading}
          >
            <span className="text-sm">←</span> Back
          </button>
          <button
            type="button"
            className="px-4 py-1.5 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md transition disabled:opacity-50 flex items-center gap-1 text-xs"
            disabled={!localEmail.trim() || !localPassword.trim() || loading}
            onClick={handleSignUp}
          >
            {loading ? 'Signing Up...' : <>Complete Sign Up <span className="text-sm">→</span></>}
          </button>
        </div>
      </div>
      <div className="w-full md:w-64 flex-shrink-0 mt-6 md:mt-0">
        <CardPreview name={name} jobTitle={jobTitle} company={company} email={email} phone={phone} links={links} />
        <div className="text-center text-gray-400 mt-1 pt-2 text-xs">Card Live Preview</div>
      </div>
      <Toast message={error || ''} visible={toastVisible} onClose={() => setToastVisible(false)} type="error" />
    </div>
  );
}; 