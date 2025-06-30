import React, { useState, useEffect } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { CardPreview } from '../../components/preview/CardPreview';
import { FileUpload } from '../../components/ui/FileUpload';

const SIDEBAR_SECTIONS = [
  { label: 'About', icon: '👤' },
  { label: 'Links', icon: '🔗' },
  { label: 'Sharing', icon: '📤', children: [
    { label: 'QR Code' },
  ] },
];

export const Dashboard: React.FC = () => {
  const onboarding = useOnboardingStore();
  const dashboard = useDashboardStore();
  
  // Initialize dashboard from onboarding data
  useEffect(() => {
    if (!dashboard.businessCard) {
      dashboard.initializeFromOnboarding(onboarding);
    }
  }, [dashboard, onboarding]);

  // Local state for form fields
  const [cardName, setCardName] = useState('');
  const [cardLayout, setCardLayout] = useState<'Left Aligned' | 'Centered'>('Left Aligned');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('#FDBA74');
  const [linkColor, setLinkColor] = useState('#000000');
  const [matchLinkIcons, setMatchLinkIcons] = useState(false);

  // Update local state when business card changes
  useEffect(() => {
    if (dashboard.businessCard) {
      setCardName(dashboard.cardName || '');
      setLocation(dashboard.businessCard.profile.location || '');
      setBio(dashboard.businessCard.profile.bio || '');
      setTheme(dashboard.businessCard.theme.primaryColor);
      setLinkColor(dashboard.businessCard.theme.secondaryColor);
      setCardLayout(dashboard.businessCard.theme.layout === 'modern' ? 'Left Aligned' : 'Centered');
    }
  }, [dashboard.businessCard, dashboard.cardName]);

  // Update business card when form fields change
  const updateBusinessCard = (updates: any) => {
    dashboard.updateBusinessCard(updates);
  };

  // Handle form field changes
  const handleCardNameChange = (value: string) => {
    setCardName(value);
    dashboard.setCardName(value);
    dashboard.updateBusinessCard({}); // Mark as dirty
  };

  const handleNameChange = (value: string) => {
    updateBusinessCard({
      profile: { ...dashboard.businessCard?.profile, name: value }
    });
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
    setLocation(value);
    updateBusinessCard({
      profile: { ...dashboard.businessCard?.profile, location: value }
    });
  };

  const handleBioChange = (value: string) => {
    setBio(value);
    updateBusinessCard({
      profile: { ...dashboard.businessCard?.profile, bio: value }
    });
  };

  const handleThemeChange = (color: string) => {
    setTheme(color);
    updateBusinessCard({
      theme: { ...dashboard.businessCard?.theme, primaryColor: color }
    });
  };

  const handleLinkColorChange = (color: string) => {
    setLinkColor(color);
    updateBusinessCard({
      theme: { ...dashboard.businessCard?.theme, secondaryColor: color }
    });
  };

  const handleLayoutChange = (layout: 'Left Aligned' | 'Centered') => {
    setCardLayout(layout);
    updateBusinessCard({
      theme: { 
        ...dashboard.businessCard?.theme, 
        layout: layout === 'Left Aligned' ? 'modern' : 'classic' 
      }
    });
  };

  // Handle file uploads
  const handleProfileImageSelect = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      dashboard.setProfileImage(file, url);
    } else {
      // When removing image, revert to previous state
      dashboard.setProfileImage(null, dashboard.previousProfileImageUrl);
    }
  };

  const handleCoverPhotoSelect = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      dashboard.setCoverPhoto(file, url);
    } else {
      // When removing image, revert to previous state
      dashboard.setCoverPhoto(null, dashboard.previousCoverPhotoUrl);
    }
  };

  const handleCompanyLogoSelect = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      dashboard.setCompanyLogo(file, url);
    } else {
      // When removing image, revert to previous state
      dashboard.setCompanyLogo(null, dashboard.previousCompanyLogoUrl);
    }
  };

  // Save and cancel handlers
  const handleSave = async () => {
    try {
      await dashboard.saveChanges();
      // Show success feedback
      console.log('Changes saved successfully!');
    } catch (error) {
      console.error('Failed to save changes:', error);
      // Show error feedback
    }
  };

  const handleCancel = () => {
    dashboard.discardChanges();
    // Reset local state to match the discarded changes
    if (dashboard.lastSavedCard) {
      setCardName(dashboard.cardName);
      setLocation(dashboard.lastSavedCard.profile.location || '');
      setBio(dashboard.lastSavedCard.profile.bio || '');
      setTheme(dashboard.lastSavedCard.theme.primaryColor);
      setLinkColor(dashboard.lastSavedCard.theme.secondaryColor);
      setCardLayout(dashboard.lastSavedCard.theme.layout === 'modern' ? 'Left Aligned' : 'Centered');
    }
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = dashboard.isDirty || 
    dashboard.profileImage || 
    dashboard.coverPhoto || 
    dashboard.companyLogo ||
    dashboard.tempProfileImageUrl ||
    dashboard.tempCoverPhotoUrl ||
    dashboard.tempCompanyLogoUrl;

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
      <div>
        <div className="font-bold text-xs text-gray-800 mb-1 tracking-wide">SHARING</div>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 text-gray-700">
          <span className="text-black">{/* black icon */} <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="black" strokeWidth="2"/><polyline points="17 8 12 3 7 8" stroke="black" strokeWidth="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="black" strokeWidth="2"/></svg></span> QR Code
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
            value={cardName} 
            onChange={e => handleCardNameChange(e.target.value)}
            placeholder="Enter card name..."
          />
        </div>
        <div className="flex flex-row items-center gap-2 w-1/2">
          <label className="text-[11px] font-small text-gray-700 whitespace-nowrap">Card Layout:</label>
          <select 
            className="border border-gray-200 bg-gray-100 rounded-xl px-4 py-2 text-xs w-full font-semibold" 
            value={cardLayout} 
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
          label="Profile Picture"
          currentImage={dashboard.tempProfileImageUrl || dashboard.businessCard?.profile.profileImage}
          onFileSelect={handleProfileImageSelect}
          previewClassName="w-16 h-16 rounded-full"
          placeholder="Profile"
        />
        {/* Cover photo */}
        <FileUpload
          label="Cover Photo"
          currentImage={dashboard.tempCoverPhotoUrl || dashboard.businessCard?.profile.coverPhoto}
          onFileSelect={handleCoverPhotoSelect}
          previewClassName="w-48 h-20 rounded-lg"
          placeholder="Cover photo"
        />
        {/* Company logo */}
        <FileUpload
          label="Company Logo"
          currentImage={dashboard.tempCompanyLogoUrl || dashboard.businessCard?.profile.companyLogo}
          onFileSelect={handleCompanyLogoSelect}
          previewClassName="w-16 h-16 rounded-full"
          placeholder="Logo"
        />
      </div>
      {/* Name, Location, Job Title, Company */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Name</label>
          <input 
            className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" 
            value={dashboard.businessCard?.profile.name || ''} 
            onChange={e => handleNameChange(e.target.value)} 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Location</label>
          <input 
            className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" 
            value={location} 
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
          value={bio} 
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
                className={`w-5 h-5 rounded-full border-2 ${theme === color ? 'border-orange-500' : 'border-white'} shadow`}
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
                className={`w-5 h-5 rounded-full border-2 ${linkColor === color ? 'border-orange-500' : 'border-white'} shadow`}
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Outer header container */}
      <header className="w-full flex items-center justify-between px-10 py-5 bg-transparent">
        <div className="flex items-center gap-3">
          <img src="/ixl-logo.svg" alt="ILX Logo" className="h-8 w-8 rounded-full" />
          <span className="font-bold text-xl text-gray-800">{dashboard.businessCard?.profile.name || 'Your Name'}</span>
          {hasUnsavedChanges && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <input 
            className="border rounded-lg px-3 py-1 text-sm bg-white" 
            value={cardName} 
            onChange={e => handleCardNameChange(e.target.value)}
            placeholder="Enter card name..."
          />
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
                    links={dashboard.businessCard?.links || []}
                    theme={theme}
                    linkColor={linkColor}
                    layout={cardLayout}
                    profileImage={dashboard.tempProfileImageUrl || dashboard.businessCard?.profile.profileImage}
                    coverPhoto={dashboard.tempCoverPhotoUrl || dashboard.businessCard?.profile.coverPhoto}
                    companyLogo={dashboard.tempCompanyLogoUrl || dashboard.businessCard?.profile.companyLogo}
                    location={location}
                    bio={bio}
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
    </div>
  );
};