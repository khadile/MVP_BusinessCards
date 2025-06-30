import React, { useState } from 'react';
import { CardPreview } from '../../components/preview/CardPreview';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { PLATFORM_OPTIONS } from '../../utils/platforms.tsx';
import { getPlatformLinkUrl } from '../../utils';

interface StepContactsProps {
  goNext: () => void;
  goBack: () => void;
}

// Ensure PLATFORM_OPTIONS[0] is always defined
const DEFAULT_PLATFORM = PLATFORM_OPTIONS[0] ?? {
  type: 'custom',
  label: 'Other',
  icon: <></>,
  placeholder: 'Paste your link',
  defaultTitle: 'Custom Link',
};

export const StepContacts: React.FC<StepContactsProps> = ({ goNext, goBack }) => {
  const {
    name, jobTitle, company, email, phone, links,
    setEmail, setPhone, setLinks
  } = useOnboardingStore();
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<typeof DEFAULT_PLATFORM>(DEFAULT_PLATFORM);
  const [modalLink, setModalLink] = useState({ url: '', title: DEFAULT_PLATFORM.defaultTitle });
  const [localEmail, setLocalEmail] = useState<string>(email);
  const [localPhone, setLocalPhone] = useState<string>(phone);
  const [localLinks, setLocalLinks] = useState<typeof links>(links);
  const [modalStage, setModalStage] = useState<null | 'platforms' | 'add-link'>(null);
  const [search, setSearch] = useState('');

  // List of 10 important platforms for the selection modal
  const IMPORTANT_PLATFORMS = [
    PLATFORM_OPTIONS.find(p => p.type === 'linkedin'),
    PLATFORM_OPTIONS.find(p => p.type === 'website'),
    PLATFORM_OPTIONS.find(p => p.type === 'email'),
    {
      type: 'instagram',
      label: 'Instagram',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#E1306C"/><path d="M16 11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm0 7.8a3 3 0 110-6 3 3 0 010 6zm6.4-7.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zm3.1 1.1c-.1-1.1-.3-1.8-.6-2.4a4.6 4.6 0 00-1.7-1.7c-.6-.3-1.3-.5-2.4-.6-1.1-.1-1.4-.1-4.1-.1s-3 0-4.1.1c-1.1.1-1.8.3-2.4.6a4.6 4.6 0 00-1.7 1.7c-.3.6-.5 1.3-.6 2.4-.1 1.1-.1 1.4-.1 4.1s0 3 .1 4.1c.1 1.1.3 1.8.6 2.4a4.6 4.6 0 001.7 1.7c.6.3 1.3.5 2.4.6 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c1.1-.1 1.8-.3 2.4-.6a4.6 4.6 0 001.7-1.7c.3-.6.5-1.3.6-2.4.1-1.1.1-1.4.1-4.1s0-3-.1-4.1zm-2.2 7.9a2.7 2.7 0 01-1.5 1.5c-.4.2-1.2.4-2.3.5-1 .1-1.3.1-3.9.1s-2.9 0-3.9-.1c-1.1-.1-1.9-.3-2.3-.5a2.7 2.7 0 01-1.5-1.5c-.2-.4-.4-1.2-.5-2.3-.1-1-.1-1.3-.1-3.9s0-2.9.1-3.9c.1-1.1.3-1.9.5-2.3a2.7 2.7 0 011.5-1.5c.4-.2 1.2-.4 2.3-.5 1-.1 1.3-.1 3.9-.1s2.9 0 3.9.1c1.1.1 1.9.3 2.3.5a2.7 2.7 0 011.5 1.5c.2.4.4 1.2.5 2.3.1 1 .1 1.3.1 3.9s0 2.9-.1 3.9c-.1 1.1-.3 1.9-.5 2.3z" fill="#fff"/></svg>
      ),
      placeholder: 'Instagram profile link',
      defaultTitle: 'Instagram',
    },
    {
      type: 'whatsapp',
      label: 'WhatsApp',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#25D366"/><path d="M16 8a8 8 0 00-6.928 12.07l-1.07 3.93 4.03-1.06A8 8 0 1016 8zm4.47 11.53c-.2.56-1.16 1.1-1.6 1.17-.41.07-.93.1-1.5-.1-.34-.11-.78-.25-1.34-.5-2.36-1.02-3.9-3.36-4.02-3.52-.12-.16-.96-1.28-.96-2.45 0-1.17.62-1.75.84-1.98.22-.23.48-.29.64-.29.16 0 .32.01.46.01.15 0 .35-.06.55.42.2.48.68 1.65.74 1.77.06.12.1.27.02.43-.08.16-.12.25-.23.39-.11.14-.23.31-.33.42-.11.11-.22.23-.1.45.12.22.54.89 1.16 1.44.8.71 1.47.93 1.7 1.03.23.1.36.08.49-.05.13-.13.56-.65.71-.87.15-.22.3-.18.5-.11.2.07 1.28.6 1.5.71.22.11.36.17.41.27.05.1.05.58-.15 1.14z" fill="#fff"/></svg>
      ),
      placeholder: 'WhatsApp number',
      defaultTitle: 'WhatsApp',
    },
    {
      type: 'call',
      label: 'Call',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#34C759"/><path d="M22.67 19.13l-2.2-1a1 1 0 00-1.13.21l-1 1a11.36 11.36 0 01-5.33-5.33l1-1a1 1 0 00.21-1.13l-1-2.2A1 1 0 0012 8.67H9.33A1 1 0 008 9.67C8 18.29 13.71 24 22.33 24a1 1 0 001-1V20a1 1 0 00-.66-.87z" fill="#fff"/></svg>
      ),
      placeholder: 'Phone number',
      defaultTitle: 'Call',
    },
    {
      type: 'text',
      label: 'Text',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#34C759"/><path d="M16 8a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1116 9.6a6.4 6.4 0 010 12.8zm0-11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z" fill="#fff"/></svg>
      ),
      placeholder: 'Text number',
      defaultTitle: 'Text',
    },
    {
      type: 'address',
      label: 'Address',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#4285F4"/><path d="M16 8a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1116 9.6a6.4 6.4 0 010 12.8zm0-11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z" fill="#fff"/></svg>
      ),
      placeholder: 'Address',
      defaultTitle: 'Address',
    },
    {
      type: 'facebook',
      label: 'Facebook',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#1877F3"/><path d="M21.5 16h-3v8h-3v-8h-2v-3h2v-2c0-1.7 1.3-3 3-3h2v3h-2c-.6 0-1 .4-1 1v1h3l-.5 3z" fill="#fff"/></svg>
      ),
      placeholder: 'Facebook profile link',
      defaultTitle: 'Facebook',
    },
    {
      type: 'twitter',
      label: 'Twitter',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#1DA1F2"/><path d="M24 10.6c-.6.3-1.2.5-1.8.6.6-.4 1.1-1 1.3-1.7-.6.4-1.3.7-2 .9-.6-.6-1.5-1-2.4-1-1.8 0-3.2 1.5-3.2 3.2 0 .3 0 .6.1.8-2.7-.1-5.1-1.4-6.7-3.4-.3.6-.5 1.2-.5 1.9 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.4-.4v.1c0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.2-.9.2-.2 0-.4 0-.6-.1.4 1.3 1.6 2.2 3 2.2-1.1.9-2.5 1.4-4 1.4-.3 0-.6 0-.8-.1 1.4.9 3.1 1.5 4.9 1.5 5.9 0 9.1-4.9 9.1-9.1v-.4c.6-.4 1.1-1 1.5-1.6z" fill="#fff"/></svg>
      ),
      placeholder: 'Twitter profile link',
      defaultTitle: 'Twitter',
    },
  ].filter(Boolean);

  // Filter out undefined platforms for the modal with a type guard
  const filteredImportantPlatforms = IMPORTANT_PLATFORMS.filter((p): p is typeof DEFAULT_PLATFORM => Boolean(p));

  // Platform categories
  const CATEGORIES = [
    { key: 'recommended', label: 'Recommended', platforms: filteredImportantPlatforms },
    { key: 'contact', label: 'Contact', platforms: [
      PLATFORM_OPTIONS.find(p => p.type === 'text'),
      PLATFORM_OPTIONS.find(p => p.type === 'call'),
      PLATFORM_OPTIONS.find(p => p.type === 'email'),
      PLATFORM_OPTIONS.find(p => p.type === 'address'),
      // Add more contact platforms as needed
    ].filter((p): p is typeof DEFAULT_PLATFORM => Boolean(p)) },
    { key: 'social', label: 'Social Media', platforms: [
      PLATFORM_OPTIONS.find(p => p.type === 'instagram'),
      PLATFORM_OPTIONS.find(p => p.type === 'facebook'),
      PLATFORM_OPTIONS.find(p => p.type === 'twitter'),
      // Add more social platforms as needed
    ].filter((p): p is typeof DEFAULT_PLATFORM => Boolean(p)) },
    // Add more categories as needed
  ];

  // Filter platforms by search
  const getFilteredPlatforms = (platforms: typeof DEFAULT_PLATFORM[]) =>
    platforms.filter(p => p.label.toLowerCase().includes(search.toLowerCase()));

  const handleContinue = () => {
    setEmail(localEmail.trim());
    setPhone(localPhone.trim());
    setLinks(localLinks);
    goNext();
  };

  // Modal open handler
  const openPlatformModal = () => setModalStage('platforms');
  const openAddLinkModal = (platform: typeof DEFAULT_PLATFORM) => {
    setModalPlatform(platform);
    setModalLink({ url: '', title: platform.defaultTitle });
    setModalStage('add-link');
  };
  const closeModal = () => setModalStage(null);

  // Modal add handler
  const handleAddLink = () => {
    if (!modalLink.url.trim()) return;
    setLocalLinks([
      ...localLinks,
      {
        type: modalPlatform.type,
        label: modalLink.title,
        url: modalLink.url,
        icon: modalPlatform.type,
        isActive: true,
      },
    ]);
    setShowLinksModal(false);
  };

  // Modal preview links (add the new one for preview only)
  const previewLinks = [
    ...localLinks,
    showLinksModal && modalLink.url.trim()
      ? [{
          type: modalPlatform.type,
          label: modalLink.title,
          url: modalLink.url,
          icon: modalPlatform.type,
        }]
      : [],
  ].flat();

  // Recommended platforms for StepContacts
  const RECOMMENDED_PLATFORMS = PLATFORM_OPTIONS.filter(p => ['linkedin', 'website', 'custom'].includes(p.type));

  return (
    <div className="flex flex-col md:flex-row gap-20 items-start w-full">
      <div className="flex-1 max-w-xl">
        <h2 className="text-lg font-semibold mb-1">Additional Info</h2>
        <p className="text-gray-500 mb-4 text-xs">Let's add some more info to your card. You can add contact info, social media, payment links and more</p>
        <label className="block mb-1 font-medium text-gray-700 text-xs">Email <span className="text-gray-400 text-xs">Optional</span></label>
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
          type="email"
          value={localEmail}
          onChange={e => setLocalEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <label className="block mb-1 font-medium text-gray-700 text-xs">Phone Number <span className="text-gray-400 text-xs">Optional</span></label>
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
          type="tel"
          value={localPhone}
          onChange={e => setLocalPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
        {/* Add additional links button */}
        <button
          type="button"
          className="text-blue-500 hover:underline text-xs font-medium mb-3"
          onClick={openPlatformModal}
        >
          + Add additional links
        </button>
        {/* Platform section label and buttons */}
        <div className="mb-4">
          <div className="font-medium text-xs mb-2">Recommended Platforms</div>
          <div className="flex gap-3 flex-wrap">
            {RECOMMENDED_PLATFORMS.map(platform => {
              // Find all links for this platform
              const platformLinks = localLinks.filter(link => link.type === platform.type);
              const hasLinks = platformLinks.length > 0;
              return (
                <button
                  key={platform.type}
                  type="button"
                  className={`flex items-center px-4 py-2 rounded-xl border transition bg-white hover:bg-gray-50 focus:outline-none gap-2 min-w-[140px] shadow-sm text-left ${hasLinks ? 'border-blue-400' : 'border-gray-200'}`}
                  onClick={() => openAddLinkModal(platform)}
                >
                  {React.cloneElement(platform.icon, { className: 'w-5 h-5' })}
                  <span className="text-sm font-medium flex-1">{platform.label}</span>
                  {hasLinks && (
                    <>
                      <span className="ml-1 text-blue-400 text-base">↗</span>
                      {platformLinks.length > 1 && (
                        <span className="ml-1 bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 text-xs font-semibold">{platformLinks.length}</span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-5 justify-end">
          <button
            type="button"
            className="px-3 py-1.5 rounded-full border text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm flex items-center gap-1 text-xs"
            onClick={goBack}
          >
            <span className="text-sm">←</span> Back
          </button>
          <button
            type="button"
            className="px-4 py-1.5 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md transition disabled:opacity-50 flex items-center gap-1 text-xs"
            onClick={handleContinue}
          >
            Continue <span className="text-sm">→</span>
          </button>
        </div>
      </div>
      <div className="w-full md:w-64 flex-shrink-0 mt-6 md:mt-0">
        <CardPreview name={name} jobTitle={jobTitle} company={company} email={localEmail} phone={localPhone} links={previewLinks} />
        <div className="text-center text-gray-400 mt-1 pt-2 text-xs">Card Live Preview</div>
      </div>
      {modalStage === 'platforms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl mx-auto h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-10 pt-10 pb-2 bg-white rounded-t-3xl z-10 sticky top-0">
              <h3 className="text-3xl font-bold">Add content</h3>
              <button className="text-gray-400 hover:text-gray-700 text-3xl" onClick={closeModal}>&times;</button>
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
            <div className="flex-1 px-10 overflow-y-auto pb-10">
              {CATEGORIES.map(cat => {
                const filtered = getFilteredPlatforms(cat.platforms);
                if (!filtered.length) return null;
                return (
                  <div key={cat.key} className="mb-2">
                    <div className="text-lg font-semibold mb-3">{cat.label}</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {filtered.map(platform => (
                        <button
                          key={platform.type}
                          className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition group"
                          onClick={() => openAddLinkModal(platform)}
                        >
                          <div className="flex items-center gap-3">
                            {React.cloneElement(platform.icon, { className: 'w-8 h-8' })}
                            <span className="font-medium text-base">{platform.label}</span>
                          </div>
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-2xl text-blue-500 group-hover:bg-blue-50">+</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {modalStage === 'add-link' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-auto p-10 flex flex-col md:flex-row gap-8" style={{ minHeight: '420px', maxHeight: '90vh' }}>
            <div className="flex-1 flex flex-col justify-center">
              <button className="mb-6 text-gray-400 hover:text-gray-700 text-lg flex items-center gap-1 self-start" onClick={openPlatformModal}>
                <span className="text-2xl">←</span> Back
              </button>
              <div className="flex items-center gap-4 mb-6">
                {modalPlatform.icon}
                <span className="text-lg font-semibold">{modalPlatform.label}</span>
              </div>
              <label className="block mb-1 font-medium text-gray-700 text-xs">{modalPlatform.label} link*</label>
              <input
                className="w-full border border-gray-200 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
                type="text"
                value={modalLink.url}
                onChange={e => setModalLink({ ...modalLink, url: e.target.value })}
                placeholder={modalPlatform.placeholder}
              />
              <label className="block mb-1 font-medium text-gray-700 text-xs">Link title</label>
              <input
                className="w-full border border-gray-200 rounded-md px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
                type="text"
                value={modalLink.title}
                onChange={e => setModalLink({ ...modalLink, title: e.target.value })}
                placeholder={modalPlatform.defaultTitle}
              />
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
                <span>Test your link</span>
                {modalLink.url && (
                  <a href={getPlatformLinkUrl(modalPlatform.type, modalLink.url.trim())} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline flex items-center gap-1">
                    {modalPlatform.label} ↗
                  </a>
                )}
              </div>
              <div className="flex gap-3 mt-auto">
                <button
                  className="px-5 py-2 rounded-full border text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm text-xs"
                  onClick={openPlatformModal}
                >
                  Back
                </button>
                <button
                  className="px-5 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md transition disabled:opacity-50 text-xs"
                  disabled={!modalLink.url.trim()}
                  onClick={() => { handleAddLink(); closeModal(); }}
                >
                  Add link
                </button>
              </div>
            </div>
            <div className="w-full md:w-96 flex-shrink-0 mt-6 md:mt-0">
              <CardPreview
                name={name}
                jobTitle={jobTitle}
                company={company}
                email={localEmail}
                phone={localPhone}
                links={[
                  ...localLinks,
                  modalLink.url.trim() ? [{
                    type: modalPlatform.type,
                    label: modalLink.title,
                    url: modalLink.url,
                    icon: modalPlatform.type,
                  }] : [],
                ].flat()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 