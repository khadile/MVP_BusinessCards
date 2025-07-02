import React from 'react';

interface PlatformOption {
  type: string;
  label: string;
  icon: JSX.Element;
  placeholder: string;
  defaultTitle: string;
}

interface PlatformPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (platform: PlatformOption) => void;
  platformOptions: PlatformOption[];
  search: string;
  setSearch: (s: string) => void;
  title?: string;
  // Card preview props
  name?: string;
  jobTitle?: string;
  theme?: string;
  linkColor?: string;
  layout?: 'Left Aligned' | 'Centered';
  profileImage?: string | undefined;
  coverPhoto?: string | undefined;
  companyLogo?: string | undefined;
  location?: string;
  bio?: string;
}

// Platform categories matching StepContacts
const CATEGORIES = [
  {
    key: 'recommended',
    label: 'Recommended',
    platforms: ['linkedin', 'website', 'custom', 'call'],
  },
  {
    key: 'contact',
    label: 'Contact',
    platforms: ['email', 'text', 'call', 'address'],
  },
  {
    key: 'social',
    label: 'Social Media',
    platforms: ['instagram', 'facebook', 'twitter', 'whatsapp'],
  },
];

export const PlatformPickerModal: React.FC<PlatformPickerModalProps> = ({
  open,
  onClose,
  onSelect,
  platformOptions,
  search,
  setSearch,
  title = 'Add content',
}) => {
  if (!open) return null;

  // Filter platforms by search
  const getFilteredPlatforms = (platforms: PlatformOption[]) =>
    platforms.filter(p => p.label.toLowerCase().includes(search.toLowerCase()));

  // Group platforms by category
  const getPlatformsByCategory = () => {
    const result: { [key: string]: PlatformOption[] } = {};
    CATEGORIES.forEach(cat => {
      result[cat.key] = platformOptions.filter(p => cat.platforms.includes(p.type));
    });
    return result;
  };

  const platformsByCategory = getPlatformsByCategory();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl mx-auto h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-10 pt-10 pb-2 bg-white rounded-t-3xl z-10 sticky top-0">
          <h3 className="text-3xl font-bold">{title}</h3>
          <button className="text-gray-400 hover:text-gray-700 text-3xl" onClick={onClose}>&times;</button>
        </div>
        <div className="px-10 sticky top-[72px] bg-white z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1">
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Search content..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 px-10 overflow-y-auto pb-10 flex gap-8">
          <div className="flex-1">
            {CATEGORIES.map(cat => {
              const filtered = getFilteredPlatforms(platformsByCategory[cat.key] || []);
              if (!filtered.length) return null;
              return (
                <div key={cat.key} className="mb-8">
                  <div className="text-lg font-semibold mb-4">{cat.label}</div>
                  <div className="flex flex-wrap gap-6">
                    {filtered.map(platform => (
                      <button
                        key={platform.type}
                        className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition min-w-[170px] max-w-[220px] w-full text-left focus:outline-none"
                        onClick={() => onSelect(platform)}
                        style={{ boxSizing: 'border-box' }}
                      >
                        {React.cloneElement(platform.icon, { className: 'w-7 h-7' })}
                        <span className="text-base font-medium flex-1 text-gray-900">{platform.label}</span>
                        <span className="text-2xl text-blue-500 font-bold leading-none">+</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 