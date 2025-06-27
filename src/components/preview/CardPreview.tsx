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

export const CardPreview: React.FC<CardPreviewProps> = ({
  name = '',
  jobTitle = '',
  company = '',
  email = '',
  phone = '',
  links = [],
}: CardPreviewProps) => {
  return (
    <div className="rounded-3xl shadow-2xl bg-gradient-to-b from-orange-100 to-orange-200 p-0 w-72 mx-auto overflow-hidden border border-orange-200">
      {/* Cover photo placeholder */}
      <div className="h-20 w-full bg-orange-300 flex items-center justify-center">
        <span className="text-xs text-white opacity-70">Cover Photo</span>
      </div>
      <div className="flex flex-col items-center -mt-8 mb-2">
        {/* Profile avatar */}
        <div className="w-16 h-16 rounded-full bg-white border-4 border-orange-400 flex items-center justify-center text-2xl font-bold text-orange-500 mb-2 shadow-lg">
          <img src="/ixl-logo.svg" alt="IXL" className="w-10 h-10" />
        </div>
        {/* Company logo placeholder */}
        <div className="absolute right-4 top-4 w-10 h-10 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center text-xs text-orange-400 shadow">
          <span>Logo</span>
        </div>
        <div className="text-lg font-semibold text-gray-900 mt-2">{name || 'Your Name'}</div>
        <div className="text-gray-500 text-sm">{jobTitle || 'Job Title'}</div>
        <div className="text-gray-400 text-sm">{company || 'Company'}</div>
      </div>
      <div className="px-6 pb-4">
        <div className="space-y-1 mb-2">
          {email && <div className="text-xs text-gray-500">{email}</div>}
          {phone && <div className="text-xs text-gray-500">{phone}</div>}
        </div>
        <button className="w-full bg-orange-500 text-white rounded-xl py-2 font-semibold mb-3 shadow hover:bg-orange-600 transition">Save Contact</button>
        <div className="space-y-2">
          {links && links.map(link => (
            <div key={link.type} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow text-sm">
              <span>{link.icon === 'linkedin' ? (
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a10 10 0 0 1 0 20" /></svg>
              )}</span>
              <span>{link.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 