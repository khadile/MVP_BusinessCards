import React, { useState, useEffect } from 'react';
import { CardPreview } from '../preview/CardPreview';
import { getPlatformLinkUrl } from '../../utils';

interface PlatformOption {
  type: string;
  label: string;
  icon: JSX.Element;
  placeholder: string;
  defaultTitle: string;
}

interface AddLinkModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { url: string; title: string }) => void;
  platform: PlatformOption;
  initialValue?: { url: string; title: string } | undefined;
  mode?: 'add' | 'edit';
  onRemove?: (() => void) | undefined;
  onBack?: () => void;
  // Card preview props
  name?: string;
  jobTitle?: string;
  company?: string;
  email?: string;
  phone?: string;
  links?: any[];
  theme?: string;
  linkColor?: string;
  layout?: 'Left Aligned' | 'Centered';
  profileImage?: string | undefined;
  coverPhoto?: string | undefined;
  companyLogo?: string | undefined;
  location?: string;
  bio?: string;
  editingLinkIdx?: number | null;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({
  open,
  onClose,
  onSubmit,
  platform,
  initialValue,
  mode = 'add',
  onRemove,
  onBack,
  // Card preview props
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
  editingLinkIdx = null,
}) => {
  const [url, setUrl] = useState(initialValue?.url || '');
  const [title, setTitle] = useState(initialValue?.title || platform.defaultTitle);

  useEffect(() => {
    setUrl(initialValue?.url || '');
    setTitle(initialValue?.title || platform.defaultTitle);
  }, [open, initialValue, platform.defaultTitle]);

  if (!open) return null;

  const isEdit = mode === 'edit';
  
  // Improved URL validation and test link generation
  const getTestUrl = () => {
    if (!url.trim()) return null;
    return getPlatformLinkUrl(platform.type, url.trim());
  };
  
  const testUrl = getTestUrl();
  const isValidUrl = testUrl && testUrl !== '#';

  // Preview links logic
  let previewLinks = links;
  if (mode === 'add' && url.trim()) {
    previewLinks = [
      ...links,
      {
        type: platform.type,
        label: title,
        url: url,
        icon: platform.type,
      },
    ];
  } else if (mode === 'edit' && editingLinkIdx !== null && url.trim()) {
    previewLinks = links.map((l, i) =>
      i === editingLinkIdx
        ? { ...l, type: platform.type, label: title, url: url, icon: platform.type }
        : l
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-auto p-10 flex flex-col md:flex-row gap-8" style={{ minHeight: '420px', maxHeight: '90vh' }}>
        <div className="flex-1 flex flex-col justify-center">
          <button className="mb-6 text-gray-400 hover:text-gray-700 text-lg flex items-center gap-1 self-start" onClick={onBack || onClose}>
            <span className="text-2xl">←</span> Back
          </button>
          <div className="flex items-center gap-4 mb-6">
            {platform.icon}
            <span className="text-lg font-semibold">{platform.label}</span>
          </div>
          <label className="block mb-1 font-medium text-gray-700 text-xs">{platform.label} link*</label>
          <input
            className="w-full border border-gray-200 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={platform.placeholder}
          />
          <label className="block mb-1 font-medium text-gray-700 text-xs">Link title</label>
          <input
            className="w-full border border-gray-200 rounded-md px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={platform.defaultTitle}
          />
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <span>Test your link</span>
            {isValidUrl && (
              <a 
                href={testUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 underline flex items-center gap-1 hover:text-blue-600 transition"
                onClick={(e) => {
                  // Prevent modal from closing when clicking test link
                  e.stopPropagation();
                }}
              >
                {platform.label} ↗
              </a>
            )}
          </div>
          <div className="flex gap-3 mt-auto">
            {isEdit && onRemove && (
              <button
                type="button"
                className="px-5 py-2 rounded-full border text-red-600 bg-white hover:bg-gray-50 font-medium shadow-sm text-xs"
                onClick={onRemove}
              >
                Remove
              </button>
            )}
            <button
              className="px-5 py-2 rounded-full border text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm text-xs"
              onClick={onBack || onClose}
            >
              Back
            </button>
            <button
              className="px-5 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md transition disabled:opacity-50 text-xs"
              disabled={!url.trim()}
              onClick={() => {
                if (!url.trim()) return;
                onSubmit({ url: url.trim(), title: title.trim() });
              }}
            >
              {isEdit ? 'Update' : 'Add link'}
            </button>
          </div>
        </div>
        <div className="w-full md:w-96 flex-shrink-0 mt-6 md:mt-0">
          <CardPreview
            name={name}
            jobTitle={jobTitle}
            company={company}
            email={email}
            phone={phone}
            links={previewLinks}
            theme={theme}
            linkColor={linkColor}
            layout={layout}
            profileImage={profileImage}
            coverPhoto={coverPhoto}
            companyLogo={companyLogo}
            location={location}
            bio={bio}
          />
        </div>
      </div>
    </div>
  );
}; 