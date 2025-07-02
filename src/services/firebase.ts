import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, getDocs, collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

// Test Firebase connection
export async function testFirebaseConnection() {
  try {
    // Try to read a non-existent collection (should not throw if connected)
    const snapshot = await getDocs(collection(db, 'test-connection'));
    console.log('✅ Firebase connection successful. Document count:', snapshot.size);
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
  }
}

// Test Firestore write permissions
export async function testFirestoreWrite() {
  try {
    const testDocRef = doc(db, 'test-write', 'test-doc');
    
    // Try to write a test document
    await setDoc(testDocRef, {
      test: true,
      timestamp: new Date(),
    });
    console.log('✅ Firestore write test successful');
    
    // Clean up - delete the test document
    await deleteDoc(testDocRef);
    console.log('✅ Firestore cleanup successful');
    
    return true;
  } catch (error) {
    console.error('❌ Firestore write test failed:', error);
    return false;
  }
}

// Test authenticated Firestore write
export async function testAuthenticatedWrite(userId: string) {
  try {
    const testDocRef = doc(db, 'businessCards', `test-${userId}`);
    
    // Try to write a test business card
    await setDoc(testDocRef, {
      name: 'Test User',
      jobTitle: 'Test Job',
      company: 'Test Company',
      email: 'test@example.com',
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Authenticated Firestore write test successful');
    
    // Clean up - delete the test document
    await deleteDoc(testDocRef);
    console.log('✅ Authenticated Firestore cleanup successful');
    
    return true;
  } catch (error) {
    console.error('❌ Authenticated Firestore write test failed:', error);
    return false;
  }
} 