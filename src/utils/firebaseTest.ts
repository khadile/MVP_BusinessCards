import { auth} from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const testFirebaseAuth = async () => {
  try {
    console.log('🔍 Testing Firebase Authentication...');
    console.log('📋 Current Firebase config:', {
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    });
    
    // Test Google Sign-In
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    console.log('🔄 Attempting Google Sign-In...');
    const result = await signInWithPopup(auth, provider);
    
    console.log('✅ Google Sign-In successful!', {
      user: result.user.email,
      uid: result.user.uid,
    });
    
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('❌ Firebase Auth test failed:', error);
    
    // Provide specific guidance based on error
    if (error.code === 'auth/unauthorized-domain') {
      console.error('🔧 SOLUTION: Add your domain to Firebase Console → Authentication → Settings → Authorized domains');
      console.error('📝 Required domains:');
      console.error('   - aircardapp1.web.app');
      console.error('   - aircardapp1.firebaseapp.com');
      console.error('   - localhost (for development)');
    }
    
    return { success: false, error };
  }
};

export const checkFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing Firebase environment variables:', missing);
    return false;
  }
  
  console.log('✅ All Firebase environment variables are set');
  return true;
}; 