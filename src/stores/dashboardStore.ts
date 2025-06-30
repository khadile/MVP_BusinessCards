import { create } from 'zustand';
import { BusinessCard, BusinessCardProfile, BusinessCardTheme } from '../types';

interface DashboardState {
  // Active section and UI state
  activeSection: string;
  isDirty: boolean;
  isSaving: boolean;
  previewMode: 'mobile' | 'desktop';
  
  // Business card data
  businessCard: BusinessCard | null;
  lastSavedCard: BusinessCard | null; // Track last saved state
  lastSavedCardName: string; // Track last saved card name
  unsavedChanges: Partial<BusinessCard>;
  
  // Card management
  cardName: string; // Separate from profile name
  
  // File upload states
  profileImage: File | null;
  coverPhoto: File | null;
  companyLogo: File | null;
  isUploading: boolean;
  
  // Temporary file URLs for preview (will be cleared on save/cancel)
  tempProfileImageUrl: string | null;
  tempCoverPhotoUrl: string | null;
  tempCompanyLogoUrl: string | null;
  
  // Previous image states for proper revert functionality
  previousProfileImageUrl: string | null;
  previousCoverPhotoUrl: string | null;
  previousCompanyLogoUrl: string | null;
  
  // Actions
  setActiveSection: (section: string) => void;
  updateBusinessCard: (updates: Partial<BusinessCard>) => void;
  setCardName: (name: string) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  setPreviewMode: (mode: 'mobile' | 'desktop') => void;
  resetToLastSaved: () => void;
  
  // File upload actions
  setProfileImage: (file: File | null, url?: string | null) => void;
  setCoverPhoto: (file: File | null, url?: string | null) => void;
  setCompanyLogo: (file: File | null, url?: string | null) => void;
  uploadFiles: () => Promise<void>;
  
  // Initialize from onboarding data
  initializeFromOnboarding: (onboardingData: any) => void;
  
  // Set links
  setLinks: (links: BusinessCard['links']) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  activeSection: 'About',
  isDirty: false,
  isSaving: false,
  previewMode: 'mobile',
  businessCard: null,
  lastSavedCard: null,
  lastSavedCardName: '',
  unsavedChanges: {},
  cardName: '',
  profileImage: null,
  coverPhoto: null,
  companyLogo: null,
  isUploading: false,
  tempProfileImageUrl: null,
  tempCoverPhotoUrl: null,
  tempCompanyLogoUrl: null,
  previousProfileImageUrl: null,
  previousCoverPhotoUrl: null,
  previousCompanyLogoUrl: null,
  
  // Section navigation
  setActiveSection: (section) => set({ activeSection: section }),
  
  // Business card updates
  updateBusinessCard: (updates) => {
    const { businessCard, unsavedChanges } = get();
    const newUnsavedChanges = { ...unsavedChanges, ...updates };
    
    set({
      unsavedChanges: newUnsavedChanges,
      isDirty: true,
      businessCard: businessCard ? { ...businessCard, ...updates } : null,
    });
  },
  
  // Save changes
  saveChanges: async () => {
    const { unsavedChanges, businessCard, cardName, tempProfileImageUrl, tempCoverPhotoUrl, tempCompanyLogoUrl } = get();
    if (!businessCard || (Object.keys(unsavedChanges).length === 0 && !tempProfileImageUrl && !tempCoverPhotoUrl && !tempCompanyLogoUrl)) return;
    
    set({ isSaving: true });
    
    try {
      // TODO: Implement actual API call to save changes
      // await updateBusinessCard(businessCard.id, unsavedChanges);
      
      // Update business card with new image URLs if they exist
      const updatedBusinessCard = { ...businessCard };
      if (tempProfileImageUrl !== undefined) {
        updatedBusinessCard.profile.profileImage = tempProfileImageUrl || undefined;
      }
      if (tempCoverPhotoUrl !== undefined) {
        updatedBusinessCard.profile.coverPhoto = tempCoverPhotoUrl || undefined;
      }
      if (tempCompanyLogoUrl !== undefined) {
        updatedBusinessCard.profile.companyLogo = tempCompanyLogoUrl || undefined;
      }
      
      // Update last saved state
      set({ 
        businessCard: updatedBusinessCard,
        lastSavedCard: { ...updatedBusinessCard },
        lastSavedCardName: cardName,
        isDirty: false, 
        unsavedChanges: {},
        isSaving: false,
        // Clear temporary URLs and files after saving
        tempProfileImageUrl: null,
        tempCoverPhotoUrl: null,
        tempCompanyLogoUrl: null,
        profileImage: null,
        coverPhoto: null,
        companyLogo: null,
        // Clear previous image states after saving
        previousProfileImageUrl: null,
        previousCoverPhotoUrl: null,
        previousCompanyLogoUrl: null,
      });
    } catch (error) {
      set({ isSaving: false });
      throw error;
    }
  },
  
  // Discard changes
  discardChanges: () => {
    const { lastSavedCard, lastSavedCardName, previousProfileImageUrl, previousCoverPhotoUrl, previousCompanyLogoUrl } = get();
    if (lastSavedCard) {
      set({ 
        businessCard: { ...lastSavedCard },
        cardName: lastSavedCardName,
        isDirty: false, 
        unsavedChanges: {},
        // Clear all uploaded files and temporary URLs
        profileImage: null,
        coverPhoto: null,
        companyLogo: null,
        tempProfileImageUrl: null,
        tempCoverPhotoUrl: null,
        tempCompanyLogoUrl: null,
        // Reset previous image states
        previousProfileImageUrl: null,
        previousCoverPhotoUrl: null,
        previousCompanyLogoUrl: null,
      });
    } else {
      set({ 
        isDirty: false, 
        unsavedChanges: {},
        // Clear all uploaded files and temporary URLs
        profileImage: null,
        coverPhoto: null,
        companyLogo: null,
        tempProfileImageUrl: null,
        tempCoverPhotoUrl: null,
        tempCompanyLogoUrl: null,
        // Reset previous image states
        previousProfileImageUrl: null,
        previousCoverPhotoUrl: null,
        previousCompanyLogoUrl: null,
      });
    }
  },
  
  // Preview mode
  setPreviewMode: (mode) => set({ previewMode: mode }),
  
  // Reset to last saved
  resetToLastSaved: () => {
    const { lastSavedCard, lastSavedCardName } = get();
    if (lastSavedCard) {
      set({ 
        businessCard: { ...lastSavedCard },
        cardName: lastSavedCardName,
        isDirty: false, 
        unsavedChanges: {},
        // Clear all uploaded files and temporary URLs
        profileImage: null,
        coverPhoto: null,
        companyLogo: null,
        tempProfileImageUrl: null,
        tempCoverPhotoUrl: null,
        tempCompanyLogoUrl: null,
        // Reset previous image states
        previousProfileImageUrl: null,
        previousCoverPhotoUrl: null,
        previousCompanyLogoUrl: null,
      });
    }
  },
  
  // File upload actions
  setProfileImage: (file, url) => {
    const { businessCard, tempProfileImageUrl } = get();
    const previousUrl = tempProfileImageUrl || businessCard?.profile.profileImage || null;
    
    set({ 
      profileImage: file, 
      tempProfileImageUrl: url || null,
      previousProfileImageUrl: previousUrl,
      isDirty: true 
    });
  },
  setCoverPhoto: (file, url) => {
    const { businessCard, tempCoverPhotoUrl } = get();
    const previousUrl = tempCoverPhotoUrl || businessCard?.profile.coverPhoto || null;
    
    set({ 
      coverPhoto: file, 
      tempCoverPhotoUrl: url || null,
      previousCoverPhotoUrl: previousUrl,
      isDirty: true 
    });
  },
  setCompanyLogo: (file, url) => {
    const { businessCard, tempCompanyLogoUrl } = get();
    const previousUrl = tempCompanyLogoUrl || businessCard?.profile.companyLogo || null;
    
    set({ 
      companyLogo: file, 
      tempCompanyLogoUrl: url || null,
      previousCompanyLogoUrl: previousUrl,
      isDirty: true 
    });
  },
  
  // Upload files
  uploadFiles: async () => {
    set({ isUploading: true });
    
    try {
      // TODO: Implement actual file upload to Firebase Storage
      // const profileUrl = profileImage ? await uploadToStorage(profileImage, 'profile') : null;
      // const coverUrl = coverPhoto ? await uploadToStorage(coverPhoto, 'cover') : null;
      // const logoUrl = companyLogo ? await uploadToStorage(companyLogo, 'logo') : null;
      
      // Update business card with new URLs
      // get().updateBusinessCard({
      //   profile: { ...get().businessCard?.profile, profileImage: profileUrl },
      //   // Add cover and logo URLs
      // });
      
      set({ isUploading: false });
    } catch (error) {
      set({ isUploading: false });
      throw error;
    }
  },
  
  // Initialize from onboarding data
  initializeFromOnboarding: (onboardingData) => {
    const businessCard: BusinessCard = {
      id: 'temp-id',
      userId: 'temp-user-id',
      profile: {
        name: onboardingData.name || '',
        jobTitle: onboardingData.jobTitle || '',
        company: onboardingData.company || '',
        location: '',
        bio: '',
        email: onboardingData.email || '',
        phone: onboardingData.phone || '',
        website: '',
      },
      theme: {
        primaryColor: '#FDBA74',
        secondaryColor: '#000000',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        fontFamily: 'Inter',
        fontSize: 14,
        layout: 'modern',
        borderRadius: 12,
        shadow: true,
      },
      links: onboardingData.links || [],
      settings: {
        isPublic: true,
        allowAnalytics: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set({ 
      businessCard, 
      lastSavedCard: { ...businessCard }, // Initialize last saved state
      lastSavedCardName: '',
      cardName: '',
      isDirty: false, 
      unsavedChanges: {},
    });
  },
  
  // Card management
  setCardName: (name) => set({ cardName: name, isDirty: true }),
  
  // Set links
  setLinks: (links) => {
    const { businessCard } = get();
    if (!businessCard) return;
    set({
      businessCard: { ...businessCard, links },
      isDirty: true,
      unsavedChanges: { ...get().unsavedChanges, links },
    });
  },
})); 