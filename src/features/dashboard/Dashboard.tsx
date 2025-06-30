import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { CardPreview } from '../../components/preview/CardPreview';
import { FileUpload } from '../../components/ui/FileUpload';
import { LinksSection } from './LinksSection';
import { SettingsModal } from './SettingsModal';
import { Toast } from '../../components/ui/Toast';
import { uploadBusinessCardImage, deleteFile } from '../../services/fileUpload';

const SIDEBAR_SECTIONS = [
  { label: 'About', icon: '👤' },
  { label: 'Links', icon: '🔗' },
  { label: 'Sharing', icon: '📤', children: [
    { label: 'QR Code' },
  ] },
];

export const Dashboard: React.FC = () => {
  const { user, currentCard, businessCards, updateBusinessCard: updateAuthCard, signOut } = useAuthStore();
  const dashboard = useDashboardStore();
  
  // Initialize dashboard from auth store data
  useEffect(() => {
    if (currentCard && !dashboard.businessCard) {
      console.log('🔄 Initializing dashboard from auth store:', currentCard);
      dashboard.initializeFromAuthCard(currentCard);
    }
  }, [currentCard, dashboard]);

  // Local state for form fields
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [showSettings, setShowSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
          <span className="text-black">{/* black icon */} <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="black" strokeWidth="2"/></svg></span> About
        </button>
        <button
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition ${dashboard.activeSection === 'Links' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-700'}`}
          onClick={() => dashboard.setActiveSection('Links')}
        >
          <span className="text-black">{/* black icon */} <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17 7a5 5 0 00-7.07 0l-4 4a5 5 0 007.07 7.07l1-1" stroke="black" strokeWidth="2"/><path d="M7 17a5 5 0 007.07 0l4-4a5 5 0 00-7.07-7.07l-1 1" stroke="black" strokeWidth="2"/></svg></span> Links
        </button>
      </div>
      <div className="mb-4">
        <div className="font-bold text-xs text-gray-800 mb-1 tracking-wide">SHARING</div>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 text-gray-700">
          <span className="text-black">{/* black icon */} <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="black" strokeWidth="2"/><polyline points="17 8 12 3 7 8" stroke="black" strokeWidth="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="black" strokeWidth="2"/></svg></span> QR Code
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
      {/* Name, Location, Job Title, Company */}
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
      dashboard.setActiveCard(cardId);
      const card = dashboard.cards.find(c => c.id === cardId);
      showToast(`Switched to card: ${card?.cardName || card?.profile.name || 'Untitled Card'}`);
    }
  };

  const handleCreateNewCard = () => {
    setShowCardDropdown(false);
    // Create a new blank card (generate a unique id, default values)
    const newCard = {
      id: `card-${Date.now()}`,
      userId: 'temp-user-id',
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
    dashboard.createCard(newCard);
    dashboard.setCardName(newCard.cardName);
    dashboard.updateBusinessCard({
      profile: {
        ...newCard.profile,
        location: newCard.profile.location || '',
        bio: newCard.profile.bio || '',
      },
      theme: newCard.theme,
    });
    showToast('Card created.');
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
          <span className="font-bold text-xl text-gray-800">{dashboard.cardName || 'Your Card'}</span>
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
              <span>{dashboard.cardName || 'Your Card'}</span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"/></svg>
            </button>
            {showCardDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl z-50 p-4 flex flex-col gap-2">
                {dashboard.cards.map(card => (
                  <div key={card.id} className="relative">
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm font-medium ${dashboard.activeCardId === card.id ? 'bg-gray-100 text-black' : 'hover:bg-gray-50 text-gray-700'}`}
                      onClick={() => handleSelectCard(card.id)}
                    >
                      <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">{(card.cardName || card.profile.name || 'U').charAt(0).toUpperCase()}</span>
                      <span className="flex-1 truncate">{card.cardName || card.profile.name || 'Untitled Card'}</span>
                      {dashboard.activeCardId === card.id && <span className="ml-2 text-xs text-orange-500">Active</span>}
                    </button>
                    {/* Delete button for non-active cards, only if more than one card exists */}
                    {dashboard.activeCardId !== card.id && dashboard.cards.length > 1 && (
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 p-1"
                        title="Delete card"
                        onClick={e => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
                            dashboard.deleteCard(card.id);
                            showToast('Card deleted.');
                          }
                        }}
                      >
                        <span role="img" aria-label="Delete">🗑️</span>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-full px-5 py-3 font-semibold text-base hover:bg-gray-900 transition mt-2"
                  onClick={handleCreateNewCard}
                >
                  <span className="text-xl">+</span> Create New Card
                </button>
              </div>
            )}
          </div>
          <button className="bg-black text-white rounded-full px-5 py-2 font-semibold text-sm hover:bg-gray-900 transition">Share Your Card</button>
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
                    href="#"
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