import { create } from 'zustand';
import { BusinessCard } from '../types';

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
  tempProfileImageUrls: Record<string, string | null>;
  tempCoverPhotoUrls: Record<string, string | null>;
  tempCompanyLogoUrls: Record<string, string | null>;
  
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
  
  // Initialize from auth store data
  initializeFromAuthCard: (authCard: any) => void;
  
  // Initialize from all auth store business cards
  initializeFromBusinessCards: (businessCards: any[], currentCardId?: string) => void;
  
  // Set links
  setLinks: (links: BusinessCard['links']) => void;
  
  // Multi-card management
  cards: BusinessCard[];
  activeCardId: string | null;
  
  // Multi-card actions
  createCard: (card: BusinessCard) => void;
  updateCard: (cardId: string, updates: Partial<BusinessCard>) => void;
  deleteCard: (cardId: string) => void;
  setActiveCard: (cardId: string) => void;
  
  // Clear dashboard state (for user switching)
  clearDashboard: () => void;
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
  tempProfileImageUrls: {},
  tempCoverPhotoUrls: {},
  tempCompanyLogoUrls: {},
  previousProfileImageUrl: null,
  previousCoverPhotoUrl: null,
  previousCompanyLogoUrl: null,
  cards: [],
  activeCardId: null,
  
  // Section navigation
  setActiveSection: (section) => set({ activeSection: section }),
  
  // Business card updates
  updateBusinessCard: (updates) => {
    const { businessCard, unsavedChanges } = get();
    if (!businessCard) return;
    let newProfile = businessCard.profile;
    if (updates.profile) {
      newProfile = {
        ...businessCard.profile,
        ...updates.profile,
        profileImage: ('profileImage' in updates.profile) ? updates.profile.profileImage : businessCard.profile.profileImage,
        coverPhoto: ('coverPhoto' in updates.profile) ? updates.profile.coverPhoto : businessCard.profile.coverPhoto,
        companyLogo: ('companyLogo' in updates.profile) ? updates.profile.companyLogo : businessCard.profile.companyLogo,
      };
    }
    const newBusinessCard = {
      ...businessCard,
      ...updates,
      profile: newProfile,
    };
    set({
      unsavedChanges: { ...unsavedChanges, ...updates },
      isDirty: true,
      businessCard: newBusinessCard,
    });
  },
  
  // Save changes
  saveChanges: async () => {
    const { unsavedChanges, businessCard, cardName, tempProfileImageUrls, tempCoverPhotoUrls, tempCompanyLogoUrls, cards, activeCardId } = get();
    const cardId = typeof activeCardId === 'string' ? activeCardId : '';
    if (!businessCard || (Object.keys(unsavedChanges).length === 0 && !tempProfileImageUrls[cardId] && !tempCoverPhotoUrls[cardId] && !tempCompanyLogoUrls[cardId])) return;
    
    set({ isSaving: true });
    
    try {
      // Update business card with new image URLs if they exist
      const updatedBusinessCard = { ...businessCard, cardName };
      if (updatedBusinessCard.profile) {
        if (tempProfileImageUrls[cardId] !== undefined) {
          updatedBusinessCard.profile.profileImage = tempProfileImageUrls[cardId] ?? undefined;
        }
        if (tempCoverPhotoUrls[cardId] !== undefined) {
          updatedBusinessCard.profile.coverPhoto = tempCoverPhotoUrls[cardId] ?? undefined;
        }
        if (tempCompanyLogoUrls[cardId] !== undefined) {
          updatedBusinessCard.profile.companyLogo = tempCompanyLogoUrls[cardId] ?? undefined;
        }
      }
      
      // Update cards array with the saved card
      const updatedCards = cards.map(card => card.id === cardId ? { ...updatedBusinessCard } : card);
      
      set({ 
        businessCard: updatedBusinessCard,
        lastSavedCard: { ...updatedBusinessCard },
        lastSavedCardName: cardName,
        isDirty: false, 
        unsavedChanges: {},
        isSaving: false,
        // Clear temporary URLs and files after saving
        tempProfileImageUrls: { ...tempProfileImageUrls, [cardId]: null },
        tempCoverPhotoUrls: { ...tempCoverPhotoUrls, [cardId]: null },
        tempCompanyLogoUrls: { ...tempCompanyLogoUrls, [cardId]: null },
        profileImage: null,
        coverPhoto: null,
        companyLogo: null,
        // Clear previous image states after saving
        previousProfileImageUrl: null,
        previousCoverPhotoUrl: null,
        previousCompanyLogoUrl: null,
        cards: updatedCards,
      });
    } catch (error) {
      set({ isSaving: false });
      throw error;
    }
  },
  
  // Discard changes
  discardChanges: () => {
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
        tempProfileImageUrls: {},
        tempCoverPhotoUrls: {},
        tempCompanyLogoUrls: {},
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
        tempProfileImageUrls: {},
        tempCoverPhotoUrls: {},
        tempCompanyLogoUrls: {},
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
        tempProfileImageUrls: {},
        tempCoverPhotoUrls: {},
        tempCompanyLogoUrls: {},
        // Reset previous image states
        previousProfileImageUrl: null,
        previousCoverPhotoUrl: null,
        previousCompanyLogoUrl: null,
      });
    }
  },
  
  // File upload actions
  setProfileImage: (file, url) => {
    const { activeCardId, tempProfileImageUrls, businessCard } = get();
    const cardId = typeof activeCardId === 'string' ? activeCardId : '';
    if (!activeCardId) return;
    const previousUrl = tempProfileImageUrls[cardId] || businessCard?.profile.profileImage || null;
    set({
      profileImage: file,
      tempProfileImageUrls: { ...tempProfileImageUrls, [cardId]: url || null },
      previousProfileImageUrl: previousUrl,
      isDirty: true,
    });
  },
  setCoverPhoto: (file, url) => {
    const { activeCardId, tempCoverPhotoUrls, businessCard } = get();
    const cardId = typeof activeCardId === 'string' ? activeCardId : '';
    if (!activeCardId) return;
    const previousUrl = tempCoverPhotoUrls[cardId] || businessCard?.profile.coverPhoto || null;
    set({
      coverPhoto: file,
      tempCoverPhotoUrls: { ...tempCoverPhotoUrls, [cardId]: url || null },
      previousCoverPhotoUrl: previousUrl,
      isDirty: true,
    });
  },
  setCompanyLogo: (file, url) => {
    const { activeCardId, tempCompanyLogoUrls, businessCard } = get();
    const cardId = typeof activeCardId === 'string' ? activeCardId : '';
    if (!activeCardId) return;
    const previousUrl = tempCompanyLogoUrls[cardId] || businessCard?.profile.companyLogo || null;
    set({
      companyLogo: file,
      tempCompanyLogoUrls: { ...tempCompanyLogoUrls, [cardId]: url || null },
      previousCompanyLogoUrl: previousUrl,
      isDirty: true,
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
    console.log('🎯 Initializing dashboard from onboarding data:', onboardingData);
    
    const businessCard: BusinessCard = {
      id: 'temp-id',
      userId: 'temp-user-id',
      cardName: onboardingData.name || '',
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
    
    set(state => {
      // For onboarding, we typically start fresh, but preserve existing cards if any
      const existingCards = state.cards || [];
      const cardExists = existingCards.some(card => card.id === businessCard.id);
      
      const updatedCards = cardExists 
        ? existingCards.map(card => card.id === businessCard.id ? businessCard : card)
        : [...existingCards, businessCard];
      
      return {
        businessCard, 
        lastSavedCard: { ...businessCard }, // Initialize last saved state
        lastSavedCardName: '',
        cardName: businessCard.cardName || '',
        isDirty: false, 
        unsavedChanges: {},
        cards: updatedCards, // Preserve existing cards
        activeCardId: businessCard.id, // Set as active
      };
    });
  },
  
  // Initialize from auth store data
  initializeFromAuthCard: (authCard) => {
    if (!authCard) {
      console.warn('No auth card provided to initializeFromAuthCard');
      return;
    }
    
    console.log('🔄 Initializing dashboard from auth card:', authCard);
    
    // Clear any existing temporary state when switching users
    const existingCard = get().businessCard;
    if (existingCard && existingCard.userId !== authCard.userId) {
      console.log('🔄 Switching users - clearing temporary state');
    }
    
    const businessCard: BusinessCard = {
      id: authCard.id, // Use the actual Firestore document ID
      userId: authCard.userId || 'temp-user-id',
      cardName: authCard.name || authCard.profile?.name || '',
      profile: {
        name: authCard.name || authCard.profile?.name || '',
        jobTitle: authCard.jobTitle || authCard.profile?.jobTitle || '',
        company: authCard.company || authCard.profile?.company || '',
        location: authCard.profile?.location || '',
        bio: authCard.profile?.bio || '',
        email: authCard.email || authCard.profile?.email || '',
        phone: authCard.phone || authCard.profile?.phone || '',
        website: authCard.profile?.website || '',
        profileImage: authCard.profile?.profileImage,
        coverPhoto: authCard.profile?.coverPhoto,
        companyLogo: authCard.profile?.companyLogo,
      },
      theme: {
        primaryColor: authCard.theme?.primaryColor || '#FDBA74',
        secondaryColor: authCard.theme?.secondaryColor || '#000000',
        backgroundColor: authCard.theme?.backgroundColor || '#FFFFFF',
        textColor: authCard.theme?.textColor || '#000000',
        fontFamily: authCard.theme?.fontFamily || 'Inter',
        fontSize: authCard.theme?.fontSize || 14,
        layout: authCard.theme?.layout || 'modern',
        borderRadius: authCard.theme?.borderRadius || 12,
        shadow: authCard.theme?.shadow !== false,
      },
      links: authCard.links || [],
      settings: {
        isPublic: authCard.isPublic !== false,
        allowAnalytics: authCard.settings?.allowAnalytics !== false,
      },
      createdAt: authCard.createdAt || new Date(),
      updatedAt: authCard.updatedAt || new Date(),
    };
    
    console.log('✅ Dashboard initialized with card ID:', businessCard.id);
    
    set(state => {
      // Check if we already have cards (to avoid replacing existing cards)
      const existingCards = state.cards || [];
      const cardExists = existingCards.some(card => card.id === businessCard.id);
      
      // If card doesn't exist, add it; otherwise update it
      const updatedCards = cardExists 
        ? existingCards.map(card => card.id === businessCard.id ? businessCard : card)
        : [...existingCards, businessCard];
      
      return {
        businessCard, 
        lastSavedCard: { ...businessCard }, // Initialize last saved state
        lastSavedCardName: businessCard.cardName || '',
        cardName: businessCard.cardName || '',
        isDirty: false, 
        unsavedChanges: {},
        cards: updatedCards, // Preserve existing cards, don't replace
        activeCardId: businessCard.id, // Set as active
        // Clear temporary state when switching users
        tempProfileImageUrls: {},
        tempCoverPhotoUrls: {},
        tempCompanyLogoUrls: {},
        profileImage: null,
        coverPhoto: null,
        companyLogo: null,
        previousProfileImageUrl: null,
        previousCoverPhotoUrl: null,
        previousCompanyLogoUrl: null,
      };
    });
  },
  
  // Initialize from all business cards from auth store
  initializeFromBusinessCards: (businessCards, currentCardId) => {
    console.log('🔄 Initializing dashboard from all business cards:', { count: businessCards.length, currentCardId });
    
    if (!businessCards || businessCards.length === 0) {
      console.warn('No business cards provided to initializeFromBusinessCards');
      return;
    }
    
    // Convert auth store business cards to dashboard business cards
    const dashboardCards: BusinessCard[] = businessCards.map(authCard => ({
      id: authCard.id,
      userId: authCard.userId || 'temp-user-id',
      cardName: authCard.cardName || authCard.name || authCard.profile?.name || 'Untitled Card',
      profile: {
        name: authCard.name || authCard.profile?.name || '',
        jobTitle: authCard.jobTitle || authCard.profile?.jobTitle || '',
        company: authCard.company || authCard.profile?.company || '',
        location: authCard.profile?.location || '',
        bio: authCard.profile?.bio || '',
        email: authCard.email || authCard.profile?.email || '',
        phone: authCard.phone || authCard.profile?.phone || '',
        website: authCard.profile?.website || '',
        profileImage: authCard.profile?.profileImage,
        coverPhoto: authCard.profile?.coverPhoto,
        companyLogo: authCard.profile?.companyLogo,
      },
      theme: {
        primaryColor: authCard.theme?.primaryColor || '#FDBA74',
        secondaryColor: authCard.theme?.secondaryColor || '#000000',
        backgroundColor: authCard.theme?.backgroundColor || '#FFFFFF',
        textColor: authCard.theme?.textColor || '#000000',
        fontFamily: authCard.theme?.fontFamily || 'Inter',
        fontSize: authCard.theme?.fontSize || 14,
        layout: authCard.theme?.layout || 'modern',
        borderRadius: authCard.theme?.borderRadius || 12,
        shadow: authCard.theme?.shadow !== false,
      },
      links: authCard.links || [],
      settings: {
        isPublic: authCard.isPublic !== false,
        allowAnalytics: authCard.settings?.allowAnalytics !== false,
      },
      createdAt: authCard.createdAt || new Date(),
      updatedAt: authCard.updatedAt || new Date(),
    }));
    
    // Find the active card (current card or first card)
    const activeCardId = currentCardId || dashboardCards[0]?.id;
    const activeCard = dashboardCards.find(card => card.id === activeCardId) || dashboardCards[0];
    
    console.log('✅ Dashboard initialized with all cards:', { 
      totalCards: dashboardCards.length, 
      activeCardId,
      activeCardName: activeCard?.cardName 
    });
    
    set({
      cards: dashboardCards,
      activeCardId: activeCardId || null,
      businessCard: activeCard || null,
      lastSavedCard: activeCard ? { ...activeCard } : null,
      lastSavedCardName: activeCard?.cardName || '',
      cardName: activeCard?.cardName || '',
      isDirty: false,
      unsavedChanges: {},
      // Clear temporary state
      tempProfileImageUrls: {},
      tempCoverPhotoUrls: {},
      tempCompanyLogoUrls: {},
      profileImage: null,
      coverPhoto: null,
      companyLogo: null,
      previousProfileImageUrl: null,
      previousCoverPhotoUrl: null,
      previousCompanyLogoUrl: null,
    });
  },
  
  // Card management
  setCardName: (name) => set({ cardName: name, isDirty: true }),
  
  // Set links
  setLinks: (links = []) => {
    const { businessCard, activeCardId, cards } = get();
    const cardId = typeof activeCardId === 'string' ? activeCardId : '';
    if (!businessCard || !cardId || !cards) return;
    // Update links on the active card in the cards array
    const updatedCards = cards.map(card =>
      card.id === cardId ? { ...card, links } : card
    );
    set({
      businessCard: businessCard ? { ...businessCard, links } : null,
      cards: updatedCards,
      isDirty: true,
    });
  },
  
  createCard: (card) => {
    set(state => {
      // Check if card already exists to prevent duplicates
      const cardExists = state.cards.some(existingCard => existingCard.id === card.id);
      if (cardExists) {
        console.log('🚫 Card already exists, skipping creation:', card.id);
        return state; // Return current state unchanged
      }

      // Preserve the original cardName instead of overriding with profile.name
      const cardWithName = { ...card, cardName: card.cardName || card.profile.name || 'Untitled Card' };
      console.log('🎯 Creating card:', { cardId: cardWithName.id, cardName: cardWithName.cardName });
      return {
        cards: [...state.cards, cardWithName],
        activeCardId: cardWithName.id,
        businessCard: cardWithName, // for backward compatibility
        lastSavedCard: cardWithName,
        cardName: cardWithName.cardName || '',
        isDirty: false,
        unsavedChanges: {},
      };
    });
  },
  updateCard: (cardId, updates) => {
    set(state => {
      const updatedCards = state.cards.map(card => {
        if (card.id !== cardId) return card;
        let newProfile = card.profile;
        if (updates.profile) {
          newProfile = {
            ...card.profile,
            ...updates.profile,
            profileImage: ('profileImage' in updates.profile) ? updates.profile.profileImage : card.profile.profileImage,
            coverPhoto: ('coverPhoto' in updates.profile) ? updates.profile.coverPhoto : card.profile.coverPhoto,
            companyLogo: ('companyLogo' in updates.profile) ? updates.profile.companyLogo : card.profile.companyLogo,
          };
        }
        return {
          ...card,
          ...updates,
          profile: newProfile,
        };
      });
      const updatedCard = updatedCards.find(card => card.id === cardId);
      return {
        cards: updatedCards,
        businessCard: state.activeCardId === cardId && updatedCard ? updatedCard : state.businessCard,
        isDirty: true,
        unsavedChanges: { ...state.unsavedChanges, ...updates },
      };
    });
  },
  deleteCard: (cardId) => {
    set(state => {
      const newCards = (state.cards || []).filter(card => card.id !== cardId);
      let newActiveId = state.activeCardId;
      if (state.activeCardId === cardId) {
        newActiveId = (newCards && newCards.length > 0) ? newCards[0]?.id ?? null : null;
      }
      const newActiveCard = newActiveId ? (newCards ?? []).find(card => card.id === newActiveId) : null;
      return {
        cards: newCards,
        activeCardId: newActiveId,
        businessCard: newActiveCard || null,
        lastSavedCard: newActiveCard || null,
        cardName: newActiveCard ? newActiveCard.profile.name : '',
        isDirty: false,
        unsavedChanges: {},
      };
    });
  },
  setActiveCard: (cardId) => {
    set(state => {
      const card = state.cards.find(c => c.id === cardId) || null;
      console.log('🎯 Setting active card:', { 
        cardId, 
        cardName: card?.cardName, 
        profileName: card?.profile.name,
        currentActiveId: state.activeCardId,
        availableCards: state.cards.map(c => ({ id: c.id, name: c.cardName || c.profile.name }))
      });
      
      if (!card) {
        console.error('❌ Card not found in cards array:', cardId);
        return state; // Return unchanged state if card not found
      }
      
      return {
        activeCardId: cardId,
        businessCard: card,
        lastSavedCard: card ? { ...card } : null,
        cardName: card?.cardName || card?.profile.name || '',
        isDirty: false,
        unsavedChanges: {},
        // Clear temporary states when switching cards
        tempProfileImageUrls: {},
        tempCoverPhotoUrls: {},
        tempCompanyLogoUrls: {},
        profileImage: null,
        coverPhoto: null,
        companyLogo: null,
        previousProfileImageUrl: null,
        previousCoverPhotoUrl: null,
        previousCompanyLogoUrl: null,
      };
    });
  },
  
  // Clear dashboard state when user switches
  clearDashboard: () => {
    set({
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
      tempProfileImageUrls: {},
      tempCoverPhotoUrls: {},
      tempCompanyLogoUrls: {},
      previousProfileImageUrl: null,
      previousCoverPhotoUrl: null,
      previousCompanyLogoUrl: null,
      cards: [],
      activeCardId: null,
    });
  },
})); 