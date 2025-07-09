import { create } from 'zustand';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

// Utility function to safely parse timestamps from Firestore
const parseTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  
  // Handle Firestore Timestamp objects
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    try {
      return timestamp.toDate();
    } catch (error) {
      console.warn('Failed to parse Firestore timestamp:', error);
      return new Date();
    }
  }
  
  // Handle JavaScript Date objects
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // Handle string dates
  if (typeof timestamp === 'string') {
    const parsedDate = new Date(timestamp);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }
  
  // Handle timestamp numbers (milliseconds)
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  
  // Fallback to current date
  console.warn('Unknown timestamp format:', timestamp, 'defaulting to current date');
  return new Date();
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
  };
}

export interface BusinessCard {
  id: string;
  userId: string;
  profile: {
    name: string;
    jobTitle: string;
    company: string;
    location: string;
    bio: string;
    profileImage?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: number;
    layout: 'modern' | 'classic' | 'minimal';
  };
  links: Array<{
    id: string;
    platform: string;
    url: string;
    isActive: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  shareableUrl?: string;
}

interface AuthStore {
  // State
  user: User | null;
  profile: UserProfile | null;
  businessCards: BusinessCard[];
  currentCard: BusinessCard | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  initializeAuth: () => void;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  loadUserProfile: (uid: string) => Promise<void>;
  loadBusinessCards: (uid: string) => Promise<void>;
  setCurrentCard: (card: BusinessCard | null) => void;
  updateBusinessCard: (cardId: string, data: Partial<BusinessCard>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  profile: null,
  businessCards: [],
  currentCard: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  // Initialize authentication listener
  initializeAuth: () => {
    set({ isLoading: true });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed:', user?.uid);
      
      if (user) {
        set({ user });
        
        // Load user profile and business cards
        try {
          await get().loadUserProfile(user.uid);
          await get().loadBusinessCards(user.uid);
        } catch (error) {
          console.error('❌ Error loading user data:', error);
          set({ error: 'Failed to load user data' });
        }
      } else {
        set({ 
          user: null, 
          profile: null, 
          businessCards: [], 
          currentCard: null 
        });
      }
      
      set({ isLoading: false, isInitialized: true });
    });

    // Return unsubscribe function for cleanup
    return unsubscribe;
  },

  // Sign out
  signOut: async () => {
    try {
      set({ isLoading: true });
      await firebaseSignOut(auth);
      set({ 
        user: null, 
        profile: null, 
        businessCards: [], 
        currentCard: null,
        error: null 
      });
    } catch (error) {
      console.error('❌ Sign out error:', error);
      set({ error: 'Failed to sign out' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Load user profile from Firestore
  loadUserProfile: async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const profileData: UserProfile = {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          createdAt: parseTimestamp(data.createdAt),
          updatedAt: parseTimestamp(data.updatedAt),
          isEmailVerified: data.isEmailVerified,
          preferences: data.preferences || {
            theme: 'light',
            notifications: true,
          },
        };
        set({ profile: profileData });
        console.log('✅ User profile loaded:', profileData);
      } else {
        // Create default profile if it doesn't exist
        const photoURL = get().user?.photoURL;
        const defaultProfile: UserProfile = {
          uid,
          email: get().user?.email || '',
          displayName: get().user?.displayName || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          isEmailVerified: get().user?.emailVerified || false,
          preferences: {
            theme: 'light',
            notifications: true,
          },
        };
        
        // Only add photoURL if it exists
        if (photoURL) {
          defaultProfile.photoURL = photoURL;
        }
        
        await setDoc(doc(db, 'users', uid), defaultProfile);
        set({ profile: defaultProfile });
        console.log('✅ Default user profile created:', defaultProfile);
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      throw error;
    }
  },

  // Load user's business cards
  loadBusinessCards: async (uid: string) => {
    try {
      const cardsQuery = query(
        collection(db, 'businessCards'),
        where('userId', '==', uid)
      );
      
      const cardsSnapshot = await getDocs(cardsQuery);
      const cards: BusinessCard[] = [];
      
      cardsSnapshot.forEach((doc) => {
        const data = doc.data();
        const card: BusinessCard = {
          id: doc.id,
          userId: data.userId,
          profile: data.profile,
          theme: data.theme,
          links: data.links || [],
          createdAt: parseTimestamp(data.createdAt),
          updatedAt: parseTimestamp(data.updatedAt),
          isPublic: data.isPublic || false,
          shareableUrl: data.shareableUrl,
        };
        cards.push(card);
      });
      
      set({ businessCards: cards });
      
      // Set the first card as current if available
      if (cards.length > 0 && !get().currentCard) {
        const firstCard = cards[0];
        if (firstCard) {
          set({ currentCard: firstCard });
        }
      }
      
      console.log('✅ Business cards loaded:', cards.length);
    } catch (error) {
      console.error('❌ Error loading business cards:', error);
      throw error;
    }
  },

  // Set current business card
  setCurrentCard: (card: BusinessCard | null) => {
    set({ currentCard: card });
  },

  // Update business card
  updateBusinessCard: async (cardId: string, data: Partial<BusinessCard>) => {
    try {
      await updateDoc(doc(db, 'businessCards', cardId), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      
      // Update local state
      const updatedCards = get().businessCards.map(card => 
        card.id === cardId ? { ...card, ...data } : card
      );
      
      set({ businessCards: updatedCards });
      
      // Update current card if it's the one being updated
      const currentCard = get().currentCard;
      if (currentCard?.id === cardId) {
        set({ currentCard: { ...currentCard, ...data } });
      }
      
      console.log('✅ Business card updated:', cardId);
    } catch (error) {
      console.error('❌ Error updating business card:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: Partial<UserProfile>) => {
    try {
      const uid = get().user?.uid;
      
      if (!uid) throw new Error('User not authenticated');
      
      await updateDoc(doc(db, 'users', uid), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      
      // Update local state
      const profile = get().profile;
      if (profile) {
        set({ profile: { ...profile, ...data } });
      }
      
      console.log('✅ User profile updated');
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
})); 