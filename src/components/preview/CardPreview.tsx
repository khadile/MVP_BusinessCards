import React from 'react';
import 'react/jsx-runtime';

interface CardLink {
  type: string;
  label: string;
  url: string;
  icon?: string;
}

interface CardPreviewProps {
  name?: string;
  jobTitle?: string;
  company?: string;
  email?: string;
  phone?: string;
  links?: CardLink[];
  // Theme props
  theme?: string;
  linkColor?: string;
  layout?: 'Left Aligned' | 'Centered';
  // Image props
  profileImage?: string | undefined;
  coverPhoto?: string | undefined;
  companyLogo?: string | undefined;
  // Additional profile props
  location?: string;
  bio?: string;
}

// Add SVGs for each platform
const platformIcons: Record<string, JSX.Element> = {
  linkedin: (
    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
  ),
  website: (
    <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#6366F1"/><path d="M16 8a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1116 9.6a6.4 6.4 0 010 12.8zm0-11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z" fill="#fff"/></svg>
  ),
  email: (
    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#EA4335"/><path d="M16 18.667l-8-6V24h16V12.667l-8 6zm8-10.667H8c-1.104 0-2 .896-2 2v.667l10 7.5 10-7.5v-.667c0-1.104-.896-2-2-2z" fill="#fff"/></svg>
  ),
  custom: (
    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a10 10 0 0 1 0 20" /></svg>
  ),
};

export const CardPreview: React.FC<CardPreviewProps> = ({
  name = '',
  jobTitle = '',
  company = '',
  email = '',
  phone = '',
  links = [],
  theme = '#FDBA74',
  linkColor = '#000000',
  layout = 'Left Aligned',
  profileImage,
  coverPhoto,
  companyLogo,
  location = '',
  bio = '',
}: CardPreviewProps) => {
  // Determine if we need to make the links section scrollable
  const maxVisibleLinks = 4;
  const isScrollable = links && links.length > maxVisibleLinks;

  // Generate gradient from theme color
  const getGradientStyle = () => {
    return {
      background: `linear-gradient(135deg, ${theme}20 0%, ${theme}40 100%)`,
    };
  };

  const isCentered = layout === 'Centered';

  return (
    <div 
      className="w-64 h-96 rounded-[1.5rem] overflow-hidden border shadow-2xl mx-auto"
      style={getGradientStyle()}
    >
      {/* Cover photo */}
      <div className="h-16 w-full flex items-center justify-center overflow-hidden">
        {coverPhoto ? (
          <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${theme}60` }}>
            <span className="text-xs text-white opacity-70">Cover Photo</span>
          </div>
        )}
      </div>
      
      {/* Profile section with layout-specific styling */}
      <div className={`-mt-6 mb-2 ${isCentered ? 'text-center' : 'text-left'}`}>
        {/* Profile avatar with layout positioning */}
        <div className={`w-14 h-14 rounded-full bg-white border-4 flex items-center justify-center overflow-hidden shadow-lg ${isCentered ? 'mx-auto' : 'ml-4'} mb-2`} style={{ borderColor: theme }}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <img src="/ixl-logo.svg" alt="ILX" className="w-8 h-8" />
          )}
        </div>
        
        {/* Company logo with layout positioning */}
        {companyLogo && (
          <div className={`w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-md ${isCentered ? 'mx-auto' : 'ml-6'} mb-2`}>
            <img src={companyLogo} alt="Company Logo" className="w-full h-full object-cover" />
          </div>
        )}
        
        {/* Name and title section with layout-specific styling */}
        <div className={`${isCentered ? 'text-center px-4' : 'text-left px-4'}`}>
          <div className="text-base font-semibold text-gray-900">{name || 'Your Name'}</div>
          <div className="text-gray-500 text-xs">{jobTitle || 'Job Title'}</div>
          <div className="text-gray-400 text-xs">{company || 'Company'}</div>
          {location && <div className="text-gray-400 text-xs">{location}</div>}
        </div>
      </div>
      
      {/* Content section with layout-specific styling */}
      <div className={`pb-3 ${isCentered ? 'px-4 text-center' : 'px-4 text-left'}`}>
        {/* Bio with layout-specific styling */}
        {bio && (
          <div className={`text-xs text-gray-600 mb-2 leading-relaxed ${isCentered ? 'text-center' : 'text-left'}`}>
            {bio}
          </div>
        )}
        
        {/* Contact info with layout-specific styling */}
        <div className={`space-y-1 mb-2 ${isCentered ? 'text-center' : 'text-left'}`}>
          {email && <div className="text-xs text-gray-500">{email}</div>}
          {phone && <div className="text-xs text-gray-500">{phone}</div>}
        </div>
        
        {/* Save Contact button */}
        <button 
          className="w-full rounded-lg py-1.5 font-semibold mb-2 shadow hover:opacity-90 transition text-xs text-white" 
          style={{ backgroundColor: theme }}
        >
          Save Contact
        </button>
        
        {/* Links section with layout-specific styling */}
        <div
          className={`space-y-1.5 ${isScrollable ? 'max-h-36 overflow-y-auto pr-1' : ''}`}
          style={isScrollable ? { scrollbarWidth: 'thin', scrollbarColor: 'black #fff' } : {}}
        >
          {links && links.map(link => (
            <div key={link.type + link.url} className={`flex items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-sm ${isCentered ? 'justify-center' : 'justify-start'}`}>
              <span style={{ color: linkColor }}>{platformIcons[link.type] || platformIcons.custom}</span>
              <span className="font-medium" style={{ color: linkColor }}>{link.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 