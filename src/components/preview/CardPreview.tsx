import React from 'react';
import 'react/jsx-runtime';
import { getPlatformLinkUrl } from '../../utils';
import { PLATFORM_OPTIONS } from '../../utils/platforms.tsx';

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
  fullScreen?: boolean;
}

// Build a map of platform type to icon from PLATFORM_OPTIONS
const platformIcons: Record<string, JSX.Element> = Object.fromEntries(
  PLATFORM_OPTIONS.map(p => [p.type, p.icon])
);

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
  fullScreen = false,
}: CardPreviewProps) => {
  // Determine if we need to make the links section scrollable
  const maxVisibleLinks = 3;
  const isScrollable = links && links.length > maxVisibleLinks;

  // Generate gradient from theme color
  const getGradientStyle = () => {
    return {
      background: `linear-gradient(135deg, ${theme}20 0%, ${theme}40 100%)`,
    };
  };

  const isCentered = layout === 'Centered';

  // Responsive sizing
  const cardClass = fullScreen
    ? 'w-full h-full max-w-[700px] max-h-[90vh] sm:max-w-[420px] sm:max-h-[700px]'
    : 'w-64 h-96';

  return (
    <div 
      className={`${cardClass} rounded-[1.5rem] overflow-hidden border shadow-2xl mx-auto`}
      style={getGradientStyle()}
    >
      {/* Cover photo as normal block */}
      <div className="h-16 w-full flex items-center justify-center overflow-hidden">
        {coverPhoto ? (
          <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${theme}60` }}>
            <span className="text-xs text-white opacity-70">Cover Photo</span>
          </div>
        )}
      </div>
      {/* Profile section with layout-specific styling, overlapping the cover photo */}
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
      <div className={`pb-3 relative z-10 ${isCentered ? 'px-4 text-center' : 'px-4 text-left'}`}>
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
        
        {/* Links section with layout-specific styling */}
        <div
          className={`space-y-1.5 ${isScrollable ? 'max-h-32 overflow-y-auto pr-1 custom-scrollbar' : ''}`}
          style={isScrollable ? { maxHeight: 128, scrollbarWidth: 'thin', scrollbarColor: 'black #fff' } : {}}
        >
          {links && links.map(link => {
            const href = getPlatformLinkUrl(link.type, link.url || '');
            // Debug log
            console.log('[CardPreview Link]', { label: link.label, type: link.type, url: link.url, href });
            const isInvalid = href === '#';
            return (
              <a
                key={link.type + link.url}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-sm transition hover:bg-gray-100 ${isCentered ? 'justify-center' : 'justify-start'}${isInvalid ? ' border border-red-500' : ''}`}
                style={{ textDecoration: 'underline', color: linkColor }}
              >
                <span style={{ color: linkColor }}>{platformIcons[link.type] || platformIcons.custom}</span>
                <span className="font-medium">{link.label}</span>
                {isInvalid && <span className="text-xs text-red-500 ml-2">Invalid</span>}
              </a>
            );
          })}
        </div>
        {/* Custom scrollbar styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 6px;
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #d1d5db #fff;
          }
        `}</style>
      </div>
    </div>
  );
}; 