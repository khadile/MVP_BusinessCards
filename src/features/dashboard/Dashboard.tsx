import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { CardPreview } from '../../components/preview/CardPreview';
import { FileUpload } from '../../components/ui/FileUpload';
import { LinksSection } from './LinksSection';
import { SettingsModal } from './SettingsModal';
import { Toast } from '../../components/ui/Toast';
import { uploadBusinessCardImage, deleteFile } from '../../services/fileUpload';
import { QRCodeCanvas } from 'qrcode.react';

const QR_COLORS = [
  '#000000', '#F87171', '#F59E42', '#4ADE80', '#60A5FA', '#818CF8'
];

const QRCodeSection: React.FC<{ cardId: string }> = ({ cardId }) => {
  const [color, setColor] = React.useState('#000000');
  const [isDownloading, setIsDownloading] = React.useState(false);
  const publicUrl = `${window.location.origin}/card/${cardId}`;
  
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Find the existing QR code canvas element
      const qrCanvas = document.querySelector('canvas[data-testid="qr-code"]') as HTMLCanvasElement;
      if (!qrCanvas) {
        console.error('QR code canvas not found');
        setIsDownloading(false);
        return;
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `business-card-qr-${cardId}.png`;
      link.href = qrCanvas.toDataURL('image/png');
      link.click();
      
      setIsDownloading(false);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full items-center justify-center py-10">
      <div className="text-xl font-semibold mb-2">QR Code</div>
      <div className="flex flex-row gap-3 items-center mb-4">
        {QR_COLORS.map(c => (
          <button
            key={c}
            className={`w-7 h-7 rounded-full border-2 ${color === c ? 'border-blue-500' : 'border-gray-200'}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label={`Choose color ${c}`}
          />
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <QRCodeCanvas 
          value={publicUrl} 
          size={192} 
          fgColor={color} 
          bgColor="#fff" 
          includeMargin={true}
          data-testid="qr-code"
        />
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download QR Code'}
        </button>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user, currentCard, businessCards, updateBusinessCard: updateAuthCard, signOut } = useAuthStore();
  const dashboard = useDashboardStore();
  const onboarding = useOnboardingStore();
  
  // Debug logging for dashboard state changes
  useEffect(() => {
    console.log('📊 Dashboard state changed:', {
      activeCardId: dashboard.activeCardId,
      businessCardId: dashboard.businessCard?.id,
      businessCardName: dashboard.businessCard?.cardName || dashboard.businessCard?.profile.name,
      totalCards: dashboard.cards.length,
      cardNames: dashboard.cards.map(c => c.cardName || c.profile.name)
    });
  }, [dashboard.activeCardId, dashboard.businessCard?.id, dashboard.cards.length]);
  
  // Track current user to detect user changes
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  // Track if user is manually switching cards to prevent useEffect interference
  const [isUserSwitching, setIsUserSwitching] = useState(false);
  
  // Initialize dashboard from onboarding data or auth store data
  useEffect(() => {
    const userId = user?.uid || null;
    const hasUserChanged = currentUserId !== userId;
    
    // Check if we have onboarding data available
    const hasOnboardingData = onboarding.name.trim() || onboarding.jobTitle.trim() || onboarding.company.trim();
    
    console.log('🔄 Dashboard effect triggered:', { 
      userId, 
      currentUserId, 
      hasUserChanged, 
      currentCard: !!currentCard,
      businessCardsCount: businessCards?.length || 0,
      dashboardCardsCount: dashboard.cards.length,
      dashboardUserId: dashboard.businessCard?.userId,
      hasOnboardingData
    });
    
    // Update tracked user ID
    setCurrentUserId(userId);
    
    // Priority 1: Use onboarding data for new users or fresh sessions
    if (hasOnboardingData && userId) {
      console.log('🎯 Initializing dashboard from onboarding data:', {
        name: onboarding.name,
        jobTitle: onboarding.jobTitle,
        company: onboarding.company
      });
      
      // Initialize from onboarding data
      dashboard.initializeFromOnboarding({
        name: onboarding.name,
        jobTitle: onboarding.jobTitle,
        company: onboarding.company,
        email: onboarding.email,
        phone: onboarding.phone,
        links: onboarding.links
      });
      
      // Clear onboarding data after using it
      onboarding.reset();
      return;
    }
    
          // Priority 2: Use auth store business cards for existing users (only if not manually switching)
    if (businessCards && businessCards.length > 0 && userId && !isUserSwitching) {
      const dashboardNeedsSync = dashboard.cards.length !== businessCards.length ||
                                dashboard.cards.some(dashCard => !businessCards.find(authCard => authCard.id === dashCard.id)) ||
                                businessCards.some(authCard => !dashboard.cards.find(dashCard => dashCard.id === authCard.id));
      
      if (dashboardNeedsSync) {
        console.log('🔄 Syncing dashboard with all business cards from auth store');
        dashboard.initializeFromBusinessCards(businessCards, currentCard?.id);
      } else if (currentCard && dashboard.activeCardId !== currentCard.id && hasUserChanged) {
        // Only auto-switch when user changes (not for every mismatch)
        console.log('🔄 Auto-switching to current card for new user:', currentCard.id);
        dashboard.setActiveCard(currentCard.id);
      }
    }
    
    // Reset user switching flag after a short delay
    if (isUserSwitching) {
      const timer = setTimeout(() => setIsUserSwitching(false), 100);
      return () => clearTimeout(timer);
    }
    
    // Return undefined for consistency
    return undefined;
  }, [user?.uid, currentCard, businessCards, dashboard, currentUserId, onboarding, isUserSwitching]);

  // Clear dashboard when user logs out
  useEffect(() => {
    if (!user && currentUserId !== null) {
      console.log('🧹 Clearing dashboard for user logout');
      dashboard.clearDashboard();
      setCurrentUserId(null);
    }
  }, [user, dashboard, currentUserId]);

  // Local state for form fields
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [showSettings, setShowSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  // Update business card when form fields change
  const updateBusinessCard = (updates: any) => {
    dashboard.updateBusinessCard(updates);
  };

  // Handle form field changes
  const handleCardNameChange = (value: string) => {
    dashboard.setCardName(value);
    if (dashboard.businessCard) {
      dashboard.updateBusinessCard({ cardName: value });
    }
    if (dashboard.activeCardId) {
      dashboard.updateCard(dashboard.activeCardId, { cardName: value });
    }
  };

  const handleNameChange = (value: string) => {
    const profile = {
      name: value,
      jobTitle: dashboard.businessCard?.profile.jobTitle || '',
      company: dashboard.businessCard?.profile.company || '',
      location: dashboard.businessCard?.profile.location || '',
      bio: dashboard.businessCard?.profile.bio || '',
      email: dashboard.businessCard?.profile.email || '',
      phone: dashboard.businessCard?.profile.phone || '',
      website: dashboard.businessCard?.profile.website || '',
      profileImage: dashboard.businessCard?.profile.profileImage,
      coverPhoto: dashboard.businessCard?.profile.coverPhoto,
      companyLogo: dashboard.businessCard?.profile.companyLogo,
    };
    updateBusinessCard({ profile });
    if (dashboard.activeCardId) {
      dashboard.updateCard(dashboard.activeCardId, { profile });
    }
  };

  const handleJobTitleChange = (value: string) => {
    updateBusinessCard({
      profile: { ...dashboard.businessCard?.profile, jobTitle: value }
    });
  };

  const handleCompanyChange = (value: string) => {
    updateBusinessCard({
      profile: { ...dashboard.businessCard?.profile, company: value }
    });
  };

  const handleLocationChange = (value: string) => {
    updateBusinessCard({
      profile: { ...dashboard.businessCard?.profile, location: value }
    });
  };

  const handleBioChange = (value: string) => {
    updateBusinessCard({
      profile: { ...dashboard.businessCard?.profile, bio: value }
    });
  };

  const handleThemeChange = (color: string) => {
    updateBusinessCard({
      theme: { ...dashboard.businessCard?.theme, primaryColor: color }
    });
  };

  const handleLinkColorChange = (color: string) => {
    updateBusinessCard({
      theme: { ...dashboard.businessCard?.theme, secondaryColor: color }
    });
  };

  const handleLayoutChange = (layout: 'Left Aligned' | 'Centered') => {
    updateBusinessCard({
      theme: { 
        ...dashboard.businessCard?.theme, 
        layout: layout === 'Left Aligned' ? 'modern' : 'classic' 
      }
    });
  };

  const handleEmailChange = (value: string) => {
    updateBusinessCard({
      profile: { ...dashboard.businessCard?.profile, email: value }
    });
  };

  const handlePhoneChange = (value: string) => {
    updateBusinessCard({
      profile: { ...dashboard.businessCard?.profile, phone: value }
    });
  };

  // Handle file uploads with Firebase Storage
  const handleProfileImageSelect = async (file: File | null) => {
    if (!user || !currentCard) return;
    
    if (file) {
      setIsUploading(true);
      try {
        // Upload to Firebase Storage
        const result = await uploadBusinessCardImage(file, user.uid, currentCard.id, 'profile');
        
        // Update dashboard with the uploaded URL
        dashboard.setProfileImage(file, result.url);
        
        // Store the storage path for future deletion if needed
        const currentProfile = dashboard.businessCard?.profile;
        if (currentProfile) {
          dashboard.updateBusinessCard({
            profile: { 
              ...currentProfile,
              profileImage: result.url,
              profileImagePath: result.path,
            }
          });
        }
        
        showToast('Profile image uploaded successfully!');
      } catch (error) {
        console.error('❌ Profile image upload failed:', error);
        showToast('Failed to upload profile image');
      } finally {
        setIsUploading(false);
      }
    } else {
      // Remove image
      dashboard.setProfileImage(null, null);
      const currentProfile = dashboard.businessCard?.profile;
      if (currentProfile) {
        // Delete from Firebase Storage if path exists
        if (currentProfile.profileImagePath) {
          try {
            await deleteFile(currentProfile.profileImagePath);
            console.log('✅ Profile image deleted from Firebase Storage');
          } catch (error) {
            console.error('❌ Failed to delete profile image from storage:', error);
            // Continue with removal even if storage deletion fails
          }
        }
        
        dashboard.updateBusinessCard({
          profile: { 
            ...currentProfile,
            profileImage: undefined,
            profileImagePath: undefined,
          }
        });
        showToast('Profile image removed');
      }
    }
  };

  const handleCoverPhotoSelect = async (file: File | null) => {
    if (!user || !currentCard) return;
    
    if (file) {
      setIsUploading(true);
      try {
        // Upload to Firebase Storage
        const result = await uploadBusinessCardImage(file, user.uid, currentCard.id, 'cover');
        
        // Update dashboard with the uploaded URL
        dashboard.setCoverPhoto(file, result.url);
        
        // Store the storage path for future deletion if needed
        const currentProfile = dashboard.businessCard?.profile;
        if (currentProfile) {
          dashboard.updateBusinessCard({
            profile: { 
              ...currentProfile,
              coverPhoto: result.url,
              coverPhotoPath: result.path,
            }
          });
        }
        
        showToast('Cover photo uploaded successfully!');
      } catch (error) {
        console.error('❌ Cover photo upload failed:', error);
        showToast('Failed to upload cover photo');
      } finally {
        setIsUploading(false);
      }
    } else {
      // Remove image
      dashboard.setCoverPhoto(null, null);
      const currentProfile = dashboard.businessCard?.profile;
      if (currentProfile) {
        // Delete from Firebase Storage if path exists
        if (currentProfile.coverPhotoPath) {
          try {
            await deleteFile(currentProfile.coverPhotoPath);
            console.log('✅ Cover photo deleted from Firebase Storage');
          } catch (error) {
            console.error('❌ Failed to delete cover photo from storage:', error);
            // Continue with removal even if storage deletion fails
          }
        }
        
        dashboard.updateBusinessCard({
          profile: { 
            ...currentProfile,
            coverPhoto: undefined,
            coverPhotoPath: undefined,
          }
        });
        showToast('Cover photo removed');
      }
    }
  };

  const handleCompanyLogoSelect = async (file: File | null) => {
    if (!user || !currentCard) return;
    
    if (file) {
      setIsUploading(true);
      try {
        // Upload to Firebase Storage
        const result = await uploadBusinessCardImage(file, user.uid, currentCard.id, 'logo');
        
        // Update dashboard with the uploaded URL
        dashboard.setCompanyLogo(file, result.url);
        
        // Store the storage path for future deletion if needed
        const currentProfile = dashboard.businessCard?.profile;
        if (currentProfile) {
          dashboard.updateBusinessCard({
            profile: { 
              ...currentProfile,
              companyLogo: result.url,
              companyLogoPath: result.path,
            }
          });
        }
        
        showToast('Company logo uploaded successfully!');
      } catch (error) {
        console.error('❌ Company logo upload failed:', error);
        showToast('Failed to upload company logo');
      } finally {
        setIsUploading(false);
      }
    } else {
      // Remove image
      dashboard.setCompanyLogo(null, null);
      const currentProfile = dashboard.businessCard?.profile;
      if (currentProfile) {
        // Delete from Firebase Storage if path exists
        if (currentProfile.companyLogoPath) {
          try {
            await deleteFile(currentProfile.companyLogoPath);
            console.log('✅ Company logo deleted from Firebase Storage');
          } catch (error) {
            console.error('❌ Failed to delete company logo from storage:', error);
            // Continue with removal even if storage deletion fails
          }
        }
        
        dashboard.updateBusinessCard({
          profile: { 
            ...currentProfile,
            companyLogo: undefined,
            companyLogoPath: undefined,
          }
        });
        showToast('Company logo removed');
      }
    }
  };

  // Save and cancel handlers
  const handleSave = async () => {
    try {
      if (currentCard && dashboard.businessCard) {
        // Update the card in Firestore via auth store
        const updates: any = {
          profile: {
            name: dashboard.businessCard.profile.name,
            jobTitle: dashboard.businessCard.profile.jobTitle,
            company: dashboard.businessCard.profile.company,
            location: dashboard.businessCard.profile.location,
            bio: dashboard.businessCard.profile.bio,
            email: dashboard.businessCard.profile.email,
            phone: dashboard.businessCard.profile.phone,
            website: dashboard.businessCard.profile.website,
          },
          theme: dashboard.businessCard.theme,
          links: dashboard.businessCard.links,
        };
        
        // Only add optional properties if they exist
        if (dashboard.businessCard.profile.profileImage) {
          updates.profile.profileImage = dashboard.businessCard.profile.profileImage;
          updates.profile.profileImagePath = dashboard.businessCard.profile.profileImagePath;
        }
        if (dashboard.businessCard.profile.coverPhoto) {
          updates.profile.coverPhoto = dashboard.businessCard.profile.coverPhoto;
          updates.profile.coverPhotoPath = dashboard.businessCard.profile.coverPhotoPath;
        }
        if (dashboard.businessCard.profile.companyLogo) {
          updates.profile.companyLogo = dashboard.businessCard.profile.companyLogo;
          updates.profile.companyLogoPath = dashboard.businessCard.profile.companyLogoPath;
        }
        if (dashboard.businessCard.cardName) {
          updates.cardName = dashboard.businessCard.cardName;
        }
        
        await updateAuthCard(currentCard.id, updates);
        
        // Also update local dashboard store
        await dashboard.saveChanges();
        showToast('Changes saved successfully!');
        console.log('✅ Changes saved to Firestore');
      }
    } catch (error) {
      showToast('Error saving changes.');
      console.error('❌ Failed to save changes:', error);
    }
  };

  const handleCancel = () => {
    dashboard.discardChanges();
    showToast('Changes discarded.');
  };

  // Check if there are unsaved changes
  const tempProfileImageUrl = dashboard.activeCardId ? dashboard.tempProfileImageUrls[dashboard.activeCardId] : null;
  const tempCoverPhotoUrl = dashboard.activeCardId ? dashboard.tempCoverPhotoUrls[dashboard.activeCardId] : null;
  const tempCompanyLogoUrl = dashboard.activeCardId ? dashboard.tempCompanyLogoUrls[dashboard.activeCardId] : null;

  const hasUnsavedChanges = dashboard.isDirty || 
    dashboard.profileImage || 
    dashboard.coverPhoto || 
    dashboard.companyLogo ||
    tempProfileImageUrl ||
    tempCoverPhotoUrl ||
    tempCompanyLogoUrl;

  // Sidebar rendering
  const renderSidebar = () => (
    <aside className="w-48 bg-white border-r min-h-full flex flex-col py-6 px-6 gap-1">
      <div className="mb-4">
        <div className="font-bold text-xs text-gray-800 mb-1 tracking-wide">CONTENT</div>
        <button
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition ${dashboard.activeSection === 'About' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-700'}`}
          onClick={() => dashboard.setActiveSection('About')}
        >
          <span className="text-black"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="black" strokeWidth="2"/></svg></span> About
        </button>
        <button
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition ${dashboard.activeSection === 'Links' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-700'}`}
          onClick={() => dashboard.setActiveSection('Links')}
        >
          <span className="text-black"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17 7a5 5 0 00-7.07 0l-4 4a5 5 0 007.07 7.07l1-1" stroke="black" strokeWidth="2"/><path d="M7 17a5 5 0 007.07 0l4-4a5 5 0 00-7.07-7.07l-1 1" stroke="black" strokeWidth="2"/></svg></span> Links
        </button>
      </div>
      <div className="mb-4">
        <div className="font-bold text-xs text-gray-800 mb-1 tracking-wide">SHARING</div>
        <button 
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition ${dashboard.activeSection === 'QR Code' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-700'}`}
          onClick={() => dashboard.setActiveSection('QR Code')}
        >
          <span className="text-black"> <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="black" strokeWidth="2"/><polyline points="17 8 12 3 7 8" stroke="black" strokeWidth="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="black" strokeWidth="2"/></svg></span> QR Code
        </button>
      </div>
      <div className="mt-auto">
        <div className="font-bold text-xs text-gray-800 mb-1 tracking-wide">ACCOUNT</div>
        <button 
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 text-gray-700"
          onClick={handleSettings}
        >
          <span className="text-black">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" stroke="black" strokeWidth="2"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="black" strokeWidth="2"/>
            </svg>
          </span> Settings
        </button>
        <button 
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium hover:bg-red-50 text-red-600 mt-1"
          onClick={handleSignOut}
        >
          <span className="text-red-600">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </span> Sign Out
        </button>
      </div>
    </aside>
  );

  // About section form (main content)
  const renderAboutSection = () => (
    <div className="flex flex-col gap-6 w-full relative min-h-[600px]">
      {/* About Title */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900">About</h2>
      </div>
      {/* Card Name and Layout */}
      <div className="flex flex-row gap-x-8 w-full">
        <div className="flex flex-row items-center gap-2 w-1/2">
          <label className="text-[11px] font-small text-gray-700 whitespace-nowrap">Card Name:</label>
          <input 
            className="border border-gray-200 bg-gray-100 rounded-xl px-4 py-2 text-xs w-full font-semibold" 
            value={dashboard.businessCard?.cardName || ''} 
            onChange={e => handleCardNameChange(e.target.value)}
            placeholder="Enter card name..."
          />
        </div>
        <div className="flex flex-row items-center gap-2 w-1/2">
          <label className="text-[11px] font-small text-gray-700 whitespace-nowrap">Card Layout:</label>
          <select 
            className="border border-gray-200 bg-gray-100 rounded-xl px-4 py-2 text-xs w-full font-semibold" 
            value={dashboard.businessCard?.theme.layout === 'modern' ? 'Left Aligned' : 'Centered'} 
            onChange={e => handleLayoutChange(e.target.value as 'Left Aligned' | 'Centered')}
          >
            <option>Left Aligned</option>
            <option>Centered</option>
          </select>
        </div>
      </div>
      {/* Profile, Cover, Logo */}
      <div className="flex flex-row gap-20 items-center justify-center w-full">
        {/* Profile picture */}
        <FileUpload
          key={(dashboard.activeCardId || 'none') + '-profile'}
          label="Profile Picture"
          currentImage={tempProfileImageUrl || dashboard.businessCard?.profile.profileImage}
          onFileSelect={handleProfileImageSelect}
          previewClassName="w-16 h-16 rounded-full"
          placeholder="Profile"
          isUploading={isUploading}
        />
        {/* Cover photo */}
        <FileUpload
          key={(dashboard.activeCardId || 'none') + '-cover'}
          label="Cover Photo"
          currentImage={tempCoverPhotoUrl || dashboard.businessCard?.profile.coverPhoto}
          onFileSelect={handleCoverPhotoSelect}
          previewClassName="w-48 h-20 rounded-lg"
          placeholder="Cover photo"
          isUploading={isUploading}
        />
        {/* Company logo */}
        <FileUpload
          key={(dashboard.activeCardId || 'none') + '-logo'}
          label="Company Logo"
          currentImage={tempCompanyLogoUrl || dashboard.businessCard?.profile.companyLogo}
          onFileSelect={handleCompanyLogoSelect}
          previewClassName="w-16 h-16 rounded-full"
          placeholder="Logo"
          isUploading={isUploading}
        />
      </div>
      {/* Name, Location, Job Title, Company, Email, Phone */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full mt-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Name</label>
          <input 
            className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" 
            value={dashboard.businessCard?.profile.name || ''} 
            onChange={e => handleNameChange(e.target.value)} 
            placeholder="Enter your name..."
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Location</label>
          <input 
            className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" 
            value={dashboard.businessCard?.profile.location || ''} 
            onChange={e => handleLocationChange(e.target.value)} 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Job Title</label>
          <input 
            className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" 
            value={dashboard.businessCard?.profile.jobTitle || ''} 
            onChange={e => handleJobTitleChange(e.target.value)} 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Company</label>
          <input 
            className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" 
            value={dashboard.businessCard?.profile.company || ''} 
            onChange={e => handleCompanyChange(e.target.value)} 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Email</label>
          <input 
            className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" 
            value={dashboard.businessCard?.profile.email || ''} 
            onChange={e => handleEmailChange(e.target.value)} 
            placeholder="Enter your email..."
            type="email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Phone</label>
          <input 
            className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" 
            value={dashboard.businessCard?.profile.phone || ''} 
            onChange={e => handlePhoneChange(e.target.value)} 
            placeholder="Enter your phone number..."
            type="tel"
          />
        </div>
      </div>
      {/* Bio */}
      <div className="flex flex-col gap-1 w-full">
        <label className="text-[11px] font-medium text-gray-600">Bio</label>
        <textarea 
          className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs min-h-[36px] w-full" 
          value={dashboard.businessCard?.profile.bio || ''} 
          onChange={e => handleBioChange(e.target.value)} 
          placeholder="PR & Media Communications\nLet's work!" 
        />
      </div>
      {/* Theme pickers */}
      <div className="w-full mt-1">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
          <label className="text-[11px] font-medium text-gray-600 col-span-1 row-span-1 self-center">Card Theme</label>
          <div className="flex gap-x-3">
            {["#000000", "#F59E42", "#FDBA74", "#FDE68A", "#4ADE80", "#60A5FA", "#818CF8", "#F472B6", "#F87171", "#FACC15"].map(color => (
              <button
                key={color}
                className={`w-5 h-5 rounded-full border-2 ${dashboard.businessCard?.theme.primaryColor === color ? 'border-orange-500' : 'border-white'} shadow`}
                style={{ background: color }}
                onClick={() => handleThemeChange(color)}
              />
            ))}
          </div>
          <label className="text-[11px] font-medium text-gray-600 col-span-1 row-span-1 self-center">Link Color</label>
          <div className="flex gap-x-3">
            {["#000000", "#F59E42", "#FDBA74", "#FDE68A", "#4ADE80", "#60A5FA", "#818CF8", "#F472B6", "#F87171", "#FACC15"].map(color => (
              <button
                key={color}
                className={`w-5 h-5 rounded-full border-2 ${dashboard.businessCard?.theme.secondaryColor === color ? 'border-orange-500' : 'border-white'} shadow`}
                style={{ background: color }}
                onClick={() => handleLinkColorChange(color)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="justify-end bottom-0 flex gap-4 p-4">
        <button
          className="px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-500 font-semibold text-xs hover:bg-gray-100 transition disabled:opacity-50"
          onClick={handleCancel}
          disabled={dashboard.isSaving || !hasUnsavedChanges}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition shadow disabled:opacity-50"
          onClick={handleSave}
          disabled={dashboard.isSaving || !hasUnsavedChanges}
        >
          {dashboard.isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const handleSelectCard = (cardId: string) => {
    setShowCardDropdown(false);
    if (dashboard.activeCardId !== cardId) {
      console.log('🎯 User manually switching to card:', cardId);
      setIsUserSwitching(true); // Prevent useEffect interference
      
      // Update dashboard state
      dashboard.setActiveCard(cardId);
      
      // Also update auth store's current card to keep them in sync
      const card = dashboard.cards.find(c => c.id === cardId);
      if (card && businessCards) {
        const { setCurrentCard } = useAuthStore.getState();
        // Find the matching card in the auth store's business cards array
        const authCard = businessCards.find(bc => bc.id === cardId);
        if (authCard) {
          setCurrentCard(authCard);
          console.log('🔄 Updated auth store current card to:', cardId);
        }
      }
      
      showToast(`Switched to card: ${card?.cardName || card?.profile.name || 'Untitled Card'}`);
    }
  };

  const handleCreateNewCard = async () => {
    setShowCardDropdown(false);
    
    // Prevent rapid clicks
    if (isCreatingCard) {
      console.log('🚫 Card creation already in progress');
      return;
    }

    // Check if user is logged in
    if (!user?.uid) {
      showToast('Please log in to create a new card.');
      return;
    }
    
    setIsCreatingCard(true);
    
    try {
      // Create a new blank card with proper user ID and unique ID
      const uniqueId = `card-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newCard = {
        id: uniqueId,
        userId: user.uid, // Use actual user ID
        cardName: 'Untitled Card',
        profile: {
          name: '',
          jobTitle: '',
          company: '',
          location: '',
          bio: '',
          email: '',
          phone: '',
          website: '',
        },
        theme: {
          primaryColor: '#FDBA74',
          secondaryColor: '#000000',
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
          fontFamily: 'Inter',
          fontSize: 14,
          layout: 'modern' as 'modern',
          borderRadius: 12,
          shadow: true,
        },
        links: [],
        settings: {
          isPublic: true,
          allowAnalytics: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Save to Firebase first - use setDoc for creating new cards
      const cardData = {
        userId: newCard.userId,
        profile: newCard.profile,
        theme: newCard.theme,
        links: newCard.links,
        isPublic: newCard.settings.isPublic,
        createdAt: newCard.createdAt,
        updatedAt: newCard.updatedAt,
      };
      
      // Import required Firebase functions
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../services/firebase');
      
      await setDoc(doc(db, 'businessCards', newCard.id), cardData);
      
      // Reload business cards from Firebase to ensure consistency
      if (user.uid) {
        const { loadBusinessCards, setCurrentCard } = useAuthStore.getState();
        await loadBusinessCards(user.uid);
        
        // Set the new card as current card in auth store
        const firebaseCard = {
          id: newCard.id,
          userId: newCard.userId,
          profile: newCard.profile,
          theme: newCard.theme,
          links: newCard.links,
          createdAt: newCard.createdAt,
          updatedAt: newCard.updatedAt,
          isPublic: newCard.settings.isPublic,
        };
        setCurrentCard(firebaseCard);
        
        // Small delay to ensure auth store state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Immediately switch dashboard to the new card
        dashboard.setActiveCard(newCard.id);
      }
      
      // Let the Dashboard useEffect handle card initialization via the auth store
      // The setCurrentCard() above will trigger the useEffect to initialize the dashboard
      console.log('✅ New card created and saved to Firebase:', {
        cardId: newCard.id,
        userId: newCard.userId
      });
      
      showToast('Card created successfully!');
    } catch (error) {
      console.error('❌ Failed to create new card:', error);
      showToast('Failed to create new card. Please try again.');
    } finally {
      setIsCreatingCard(false);
    }
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => setToast(t => ({ ...t, visible: false }));

  // Handle sign out
  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out? Any unsaved changes will be lost.')) {
      try {
        await signOut();
        showToast('Signed out successfully');
      } catch (error) {
        showToast('Error signing out');
        console.error('❌ Sign out error:', error);
      }
    }
  };

  // Handle settings
  const handleSettings = () => {
    setShowSettings(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Outer header container */}
      <header className="w-full flex items-center justify-between px-10 py-5 bg-transparent">
        <div className="flex items-center gap-3">
          <img src="/ixl-logo.svg" alt="ILX Logo" className="h-8 w-8 rounded-full" />
          <span className="font-bold text-xl text-gray-800">{dashboard.businessCard?.cardName || dashboard.businessCard?.profile.name || 'Your Card'}</span>
          {hasUnsavedChanges && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              className="flex items-center gap-2 border rounded-lg px-3 py-1 text-sm bg-white font-bold text-gray-800 min-w-[120px]"
              onClick={() => setShowCardDropdown((v) => !v)}
              type="button"
            >
              <span>{dashboard.businessCard?.cardName || dashboard.businessCard?.profile.name || 'Your Card'}</span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"/></svg>
            </button>
            {showCardDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl z-50 p-4 flex flex-col gap-2">
                {dashboard.cards.map((card, index) => {
                  const isActive = dashboard.activeCardId === card.id;
                  console.log(`🔍 Card ${index + 1}: ID=${card.id}, ActiveID=${dashboard.activeCardId}, IsActive=${isActive}, BusinessCard=${dashboard.businessCard?.id}`);
                  
                  return (
                    <div key={card.id} className="relative">
                      <button
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm font-medium ${isActive ? 'bg-gray-100 text-black' : 'hover:bg-gray-50 text-gray-700'}`}
                        onClick={() => {
                          console.log('🖱️ Card clicked:', card.id);
                          handleSelectCard(card.id);
                        }}
                      >
                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">{(card.cardName || card.profile.name || 'U').charAt(0).toUpperCase()}</span>
                        <span className="flex-1 truncate">{card.cardName || card.profile.name || 'Untitled Card'}</span>
                        {isActive && <span className="ml-2 text-xs text-orange-500">Active</span>}
                      </button>
                      {/* Delete button for non-active cards, only if more than one card exists */}
                      {!isActive && dashboard.cards.length > 1 && (
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 p-1"
                          title="Delete card"
                          onClick={async e => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
                              try {
                                // Delete from Firebase first
                                const { doc, deleteDoc } = await import('firebase/firestore');
                                const { db } = await import('../../services/firebase');
                                await deleteDoc(doc(db, 'businessCards', card.id));
                                
                                // Then delete from local state
                                dashboard.deleteCard(card.id);
                                
                                // Reload business cards to ensure consistency
                                if (user?.uid) {
                                  const { loadBusinessCards } = useAuthStore.getState();
                                  await loadBusinessCards(user.uid);
                                }
                                
                                showToast('Card deleted successfully.');
                                console.log('✅ Card deleted:', card.id);
                              } catch (error) {
                                console.error('❌ Failed to delete card:', error);
                                showToast('Failed to delete card. Please try again.');
                              }
                            }
                          }}
                        >
                          <span role="img" aria-label="Delete">🗑️</span>
                        </button>
                      )}
                    </div>
                  );
                })}
                <button
                  className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-full px-5 py-3 font-semibold text-base hover:bg-gray-900 transition mt-2 disabled:opacity-50"
                  onClick={handleCreateNewCard}
                  disabled={isCreatingCard}
                >
                  {isCreatingCard ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">+</span> Create New Card
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          <button
            className="bg-black text-white rounded-full px-5 py-2 font-semibold text-sm hover:bg-gray-900 transition"
            onClick={() => {
              if (currentCard?.id) {
                window.open(`/card/${currentCard.id}`, '_blank', 'noopener,noreferrer');
              }
            }}
            disabled={!currentCard?.id}
          >
            Share Your Card
          </button>
        </div>
      </header>
      {/* Main dashboard container */}
      <div className="flex flex-1 justify-center items-start w-full px-3 pb-1">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg flex flex-row min-h-[700px] mt-2 overflow-hidden">
          {renderSidebar()}
          <main className="flex-1 flex flex-row gap-0 px-10 py-10 overflow-y-auto">
            <div className="flex-1 flex flex-col">
              {dashboard.activeSection === 'About' && renderAboutSection()}
              {dashboard.activeSection === 'Links' && <LinksSection />}
              {dashboard.activeSection === 'QR Code' && currentCard && <QRCodeSection cardId={currentCard.id} />}
              {/* Add more sections as needed */}
            </div>
            <div className="w-[350px] flex-shrink-0 flex flex-col">
              <div className="sticky top-10">
                <div className="p-0 bg-transparent shadow-none border-none">
                  <CardPreview
                    name={dashboard.businessCard?.profile.name || ''}
                    jobTitle={dashboard.businessCard?.profile.jobTitle || ''}
                    company={dashboard.businessCard?.profile.company || ''}
                    email={dashboard.businessCard?.profile.email || ''}
                    phone={dashboard.businessCard?.profile.phone || ''}
                    links={dashboard.businessCard?.links?.filter(l => l.isActive) || []}
                    theme={dashboard.businessCard?.theme.primaryColor || '#FDBA74'}
                    linkColor={dashboard.businessCard?.theme.secondaryColor || '#000000'}
                    layout={dashboard.businessCard?.theme.layout === 'modern' ? 'Left Aligned' : 'Centered'}
                    profileImage={tempProfileImageUrl || dashboard.businessCard?.profile.profileImage}
                    coverPhoto={tempCoverPhotoUrl || dashboard.businessCard?.profile.coverPhoto}
                    companyLogo={tempCompanyLogoUrl || dashboard.businessCard?.profile.companyLogo}
                    location={dashboard.businessCard?.profile.location || ''}
                    bio={dashboard.businessCard?.profile.bio || ''}

                  />
                  <div className="text-center text-gray-400 mt-2 text-xs">Card live preview</div>
                  <a
                    href={dashboard.businessCard?.id ? `/card/${dashboard.businessCard.id}` : '#'}
                    className="block text-center text-blue-500 text-xs mt-1 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View card ↗
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Toast notification */}
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};