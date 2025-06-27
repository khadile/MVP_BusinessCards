import React from 'react';
import 'react/jsx-runtime';

interface CardLink {
  type: string;
  label: string;
  url: string;
  icon: string;
}

interface CardPreviewProps {
  name?: string;
  jobTitle?: string;
  company?: string;
  email?: string;
  phone?: string;
  links?: CardLink[];
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
}: CardPreviewProps) => {
  // Determine if we need to make the links section scrollable
  const maxVisibleLinks = 4;
  const isScrollable = links && links.length > maxVisibleLinks;

  return (
    <div className="w-64 h-96 bg-gradient-to-b from-orange-100 to-orange-200 rounded-[1.5rem] overflow-hidden border border-orange-200 shadow-2xl mx-auto">
      {/* Cover photo placeholder */}
      <div className="h-16 w-full bg-orange-300 flex items-center justify-center">
        <span className="text-xs text-white opacity-70">Cover Photo</span>
      </div>
      <div className="flex flex-col items-center -mt-6 mb-2">
        {/* Profile avatar */}
        <div className="w-14 h-14 rounded-full bg-white border-4 border-orange-400 flex items-center justify-center text-xl font-bold text-orange-500 mb-2 shadow-lg">
          <img src="/ixl-logo.svg" alt="ILX" className="w-8 h-8" />
        </div>
        <div className="text-base font-semibold text-gray-900 mt-1">{name || 'Your Name'}</div>
        <div className="text-gray-500 text-xs">{jobTitle || 'Job Title'}</div>
        <div className="text-gray-400 text-xs">{company || 'Company'}</div>
      </div>
      <div className="px-4 pb-3">
        <div className="space-y-1 mb-2">
          {email && <div className="text-xs text-gray-500">{email}</div>}
          {phone && <div className="text-xs text-gray-500">{phone}</div>}
        </div>
        <button className="w-full bg-orange-500 text-white rounded-lg py-1.5 font-semibold mb-2 shadow hover:bg-orange-600 transition text-xs">Save Contact</button>
        <div
          className={`space-y-1.5 ${isScrollable ? 'max-h-36 overflow-y-auto pr-1' : ''}`}
          style={isScrollable ? { scrollbarWidth: 'thin', scrollbarColor: 'black #fff' } : {}}
        >
          {links && links.map(link => (
            <div key={link.type + link.url} className="flex items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-sm">
              <span>{platformIcons[link.type] || platformIcons.custom}</span>
              <span className="font-medium">{link.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 