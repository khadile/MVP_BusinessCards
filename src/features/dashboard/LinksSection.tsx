import React, { useState } from 'react';
import { PlatformPickerModal } from '../../components/forms/PlatformPickerModal';
import { AddLinkModal } from '../../components/forms/AddLinkModal';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useAuthStore } from '../../stores/authStore';
import { BusinessCardLink } from '../../types';
import { PLATFORM_OPTIONS } from '../../utils/platforms';
import { deleteFile } from '../../services/fileUpload';
import { Toast } from '../../components/ui/Toast';

const RECOMMENDED_PLATFORMS = [
  {
    type: 'linkedin',
    label: 'LinkedIn',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0A66C2"/><path d="M9.429 12.857h3.143v9.714H9.429v-9.714zm1.571-4.857c1.029 0 1.857.829 1.857 1.857 0 1.029-.829 1.857-1.857 1.857-1.029 0-1.857-.829-1.857-1.857 0-1.029.829-1.857 1.857-1.857zm3.771 4.857h3.014v1.329h.043c.42-.8 1.443-1.643 2.971-1.643 3.177 0 3.771 2.093 3.771 4.814v5.214h-3.143v-4.629c0-1.104-.021-2.529-1.543-2.529-1.543 0-1.779 1.206-1.779 2.45v4.707h-3.143v-9.329z" fill="#fff"/></svg>
    ),
    placeholder: 'LinkedIn profile link',
    defaultTitle: 'LinkedIn',
  },
  {
    type: 'website',
    label: 'Website',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#6366F1"/><path d="M16 8a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1116 9.6a6.4 6.4 0 010 12.8zm0-11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z" fill="#fff"/></svg>
    ),
    placeholder: 'Website URL',
    defaultTitle: 'Website',
  },
  {
    type: 'custom',
    label: 'Other',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#6B7280"/><path d="M16 8a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1116 9.6a6.4 6.4 0 010 12.8zm0-11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z" fill="#fff"/></svg>
    ),
    placeholder: 'Paste your link',
    defaultTitle: 'Custom Link',
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
];

// Map platform type to icon
const PLATFORM_ICONS: Record<string, JSX.Element> = Object.fromEntries(PLATFORM_OPTIONS.map(p => [p.type, p.icon]));

export const LinksSection: React.FC = () => {
  const dashboard = useDashboardStore();
  const { updateBusinessCard } = useAuthStore();
  const links = dashboard.businessCard?.links || [];
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<any | null>(null);
  const [editingLinkIdx, setEditingLinkIdx] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [modalOrigin, setModalOrigin] = useState<'recommended' | 'picker' | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Show toast notification
  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  // Hide toast notification
  const hideToast = () => setToast(t => ({ ...t, visible: false }));

  // Open platform picker modal
  const openPlatformModal = () => {
    setShowPlatformModal(true);
    setModalOrigin(null);
  };
  // Open add link modal for a platform (from recommended links)
  const openAddLinkModal = (platform: any) => {
    setSelectedPlatform(platform);
    setShowAddLinkModal(true);
    setEditingLinkIdx(null);
    setShowPlatformModal(false);
    setModalOrigin('recommended');
  };
  // Open add link modal for a platform (from platform picker)
  const openAddLinkModalFromPicker = (platform: any) => {
    setSelectedPlatform(platform);
    setShowAddLinkModal(true);
    setEditingLinkIdx(null);
    setShowPlatformModal(false);
    setModalOrigin('picker');
  };
  // Open edit link modal for an existing link
  const openEditLinkModal = (idx: number) => {
    const link = links?.[idx];
    if (!link) return;
    const platform = RECOMMENDED_PLATFORMS.find(p => p.type === link.type) || RECOMMENDED_PLATFORMS[3];
    setSelectedPlatform(platform);
    setShowAddLinkModal(true);
    setEditingLinkIdx(idx);
    setShowPlatformModal(false);
    setModalOrigin('recommended');
  };
  // Close all modals
  const closeModals = () => {
    setShowPlatformModal(false);
    setShowAddLinkModal(false);
    setSelectedPlatform(null);
    setEditingLinkIdx(null);
    setModalOrigin(null);
  };
  // Add or update link handler
  const handleAddOrUpdateLink = async (data: { url: string; title: string; customIcon?: string | null; customIconPath?: string | null }) => {
    if (!selectedPlatform || !dashboard.businessCard) return;
    
    try {
      let updatedLinks: BusinessCardLink[];
      let actionMessage: string;

      if (editingLinkIdx !== null) {
        // Update existing link
        const updatedLinksPromises = links.map(async (l, i) => {
          if (i === editingLinkIdx) {
            const existingLink = l;
            
            // Clean up old custom icon if it's being replaced
            if (existingLink.customIconPath && data.customIconPath && existingLink.customIconPath !== data.customIconPath) {
              try {
                await deleteFile(existingLink.customIconPath);
                console.log('✅ Old custom icon deleted from Firebase Storage:', existingLink.customIconPath);
              } catch (error) {
                console.error('❌ Failed to delete old custom icon from Firebase Storage:', error);
              }
            }
            
            const updatedLink: BusinessCardLink = {
              ...l,
              url: data.url,
              label: data.title,
              updatedAt: new Date(),
              ...(data.customIcon && { customIcon: data.customIcon }),
              ...(data.customIconPath && { customIconPath: data.customIconPath })
            };
            return updatedLink;
          }
          return l;
        });
        
        // Wait for all updates to complete
        updatedLinks = await Promise.all(updatedLinksPromises);
        actionMessage = `${data.title} link updated`;
      } else {
        // Add new link
        const now = new Date();
        const newLink: BusinessCardLink = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: selectedPlatform.type,
          label: data.title,
          url: data.url,
          icon: selectedPlatform.type,
          order: links.length,
          isActive: true,
          isPublic: true,
          style: {
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            padding: 8,
            margin: 0,
            shadow: false,
          },
          behavior: {
            openInNewTab: true,
            trackClicks: true,
            requireConfirmation: false,
          },
          analytics: {
            totalClicks: 0,
            clickRate: 0,
          },
          createdAt: now,
          updatedAt: now,
          createdBy: 'user',
          ...(data.customIcon && { customIcon: data.customIcon }),
          ...(data.customIconPath && { customIconPath: data.customIconPath })
        };
        updatedLinks = [...links, newLink];
        actionMessage = `${data.title} link added`;
      }

      // Update dashboard store (cast to expected type)
      dashboard.setLinks(updatedLinks as any);
      
      // Auto-save to Firebase (transform to expected interface)
      const transformedLinks = updatedLinks.map(link => ({
        id: link.id,
        platform: link.type,
        url: link.url,
        isActive: link.isActive
      }));
      
      await updateBusinessCard(dashboard.businessCard.id, {
        links: transformedLinks,
        updatedAt: new Date()
      });

      showToast(actionMessage);
      closeModals();
    } catch (error) {
      console.error('❌ Failed to save link:', error);
      showToast('Failed to save link. Please try again.');
    }
  };
  // Remove link handler
  const handleRemoveLink = async () => {
    if (editingLinkIdx !== null && dashboard.businessCard) {
      const linkToRemove = links[editingLinkIdx];
      const linkName = linkToRemove?.label || 'Link';
      
      try {
        // Clean up custom icon from Firebase Storage if it exists
        if (linkToRemove?.customIconPath) {
          try {
            await deleteFile(linkToRemove.customIconPath);
            console.log('✅ Custom icon deleted from Firebase Storage:', linkToRemove.customIconPath);
          } catch (error) {
            console.error('❌ Failed to delete custom icon from Firebase Storage:', error);
          }
        }
        
        const updatedLinks = links.filter((_, i) => i !== editingLinkIdx);
        
        // Update dashboard store (cast to expected type)
        dashboard.setLinks(updatedLinks as any);
        
        // Auto-save to Firebase (transform to expected interface)
        const transformedLinks = updatedLinks.map(link => ({
          id: link.id,
          platform: link.type,
          url: link.url,
          isActive: link.isActive
        }));
        
        await updateBusinessCard(dashboard.businessCard.id, {
          links: transformedLinks,
          updatedAt: new Date()
        });

        showToast(`${linkName} removed`);
        closeModals();
      } catch (error) {
        console.error('❌ Failed to remove link:', error);
        showToast('Failed to remove link. Please try again.');
      }
    }
  };
  // Toggle active/inactive
  const toggleActive = async (idx: number) => {
    if (!dashboard.businessCard) return;
    
    const link = links[idx];
    const newStatus = !link.isActive;
    const linkName = link?.label || 'Link';
    
    try {
      const updatedLinks = links.map((l, i) => i === idx ? { ...l, isActive: newStatus, updatedAt: new Date() } : l);
      
             // Update dashboard store (cast to expected type)
       dashboard.setLinks(updatedLinks as any);
       
       // Auto-save to Firebase (transform to expected interface)
       const transformedLinks = updatedLinks.map(link => ({
         id: link.id,
         platform: link.type,
         url: link.url,
         isActive: link.isActive
       }));
       
       await updateBusinessCard(dashboard.businessCard.id, {
         links: transformedLinks,
         updatedAt: new Date()
       });

       showToast(`${linkName} turned ${newStatus ? 'on' : 'off'}`);
    } catch (error) {
      console.error('❌ Failed to toggle link:', error);
      showToast('Failed to update link. Please try again.');
    }
  };

  // Smart back handler for AddLinkModal
  const handleAddLinkBack = () => {
    if (modalOrigin === 'picker') {
      setShowAddLinkModal(false);
      setShowPlatformModal(true);
    } else {
      setShowAddLinkModal(false);
      setShowPlatformModal(false);
      setSelectedPlatform(null);
      setEditingLinkIdx(null);
      setModalOrigin(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-bold text-lg text-gray-900 dark:text-white">Links</span>
        <div className="flex gap-2 ml-auto">
          <button className="bg-black dark:bg-gray-700 text-white rounded-full px-4 py-2 font-semibold text-sm hover:bg-gray-900 dark:hover:bg-gray-600 transition" onClick={openPlatformModal}>
            + Add Links and Contact Info
          </button>
        </div>
      </div>
      {/* Links List */}
      <div className="flex flex-col gap-2 mb-6">
        {links?.map((link, idx) => (
          <div key={idx} className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition" onClick={() => openEditLinkModal(idx)}>
            <span className="cursor-move text-gray-300 dark:text-gray-500 mr-2" onClick={e => e.stopPropagation()}>&#8942;</span>
            <span className="w-8 h-8 flex items-center justify-center">
              {link.customIcon ? (
                <img 
                  src={link.customIcon} 
                  alt={`${link.label} icon`} 
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                PLATFORM_ICONS[link.type] || <span className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
              )}
            </span>
            <span className="text-sm font-medium flex-1 text-gray-900 dark:text-white">{link.label}</span>
            <button onClick={e => { e.stopPropagation(); toggleActive(idx); }} className={`w-10 h-6 rounded-full border transition ${link.isActive ? 'bg-black dark:bg-gray-600 border-black dark:border-gray-600' : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}> 
              <span className={`block w-4 h-4 rounded-full bg-white shadow transform transition ${link.isActive ? 'translate-x-4' : 'translate-x-1'}`}></span>
            </button>
          </div>
        ))}
      </div>
      {/* Recommended Links */}
      <div className="mt-6">
        <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Recommended links</div>
        <div className="flex gap-4">
          {RECOMMENDED_PLATFORMS.map(platform => (
            <div key={platform.type} className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-2xl px-6 py-5 gap-2 shadow-sm min-w-[120px] max-w-[140px] w-full">
              {platform.icon}
              <span className="text-base font-medium text-gray-800 dark:text-white mt-2 mb-1">{platform.label}</span>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500 text-2xl text-gray-500 dark:text-gray-300 font-bold mt-2"
                onClick={() => openAddLinkModal(platform)}
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Modals */}
      <PlatformPickerModal
        open={showPlatformModal}
        onClose={closeModals}
        onSelect={openAddLinkModalFromPicker}
        platformOptions={PLATFORM_OPTIONS}
        search={search}
        setSearch={setSearch}
        title="Add Links and Contact Info"
        name={dashboard.businessCard?.profile.name || ''}
        jobTitle={dashboard.businessCard?.profile.jobTitle || ''}

        theme={dashboard.businessCard?.theme.primaryColor || '#FDBA74'}
        linkColor={dashboard.businessCard?.theme.secondaryColor || '#000000'}
        layout={dashboard.businessCard?.theme.layout === 'modern' ? 'Left Aligned' : 'Centered'}
        profileImage={dashboard.activeCardId ? dashboard.tempProfileImageUrls[dashboard.activeCardId] || dashboard.businessCard?.profile.profileImage : dashboard.businessCard?.profile.profileImage}
        coverPhoto={dashboard.activeCardId ? dashboard.tempCoverPhotoUrls[dashboard.activeCardId] || dashboard.businessCard?.profile.coverPhoto : dashboard.businessCard?.profile.coverPhoto}
        companyLogo={dashboard.activeCardId ? dashboard.tempCompanyLogoUrls[dashboard.activeCardId] || dashboard.businessCard?.profile.companyLogo : dashboard.businessCard?.profile.companyLogo}
        location={dashboard.businessCard?.profile.location || ''}
        bio={dashboard.businessCard?.profile.bio || ''}
      />
      {selectedPlatform && (
        <AddLinkModal
          open={showAddLinkModal}
          onClose={closeModals}
          onSubmit={handleAddOrUpdateLink}
          platform={selectedPlatform}
          initialValue={editingLinkIdx !== null && links?.[editingLinkIdx] ? { 
            url: links[editingLinkIdx]!.url, 
            title: links[editingLinkIdx]!.label,
            customIcon: links[editingLinkIdx]!.customIcon || null,
            customIconPath: links[editingLinkIdx]!.customIconPath || null
          } : undefined}
          mode={editingLinkIdx !== null ? 'edit' : 'add'}
          onRemove={editingLinkIdx !== null ? handleRemoveLink : undefined}
          onBack={handleAddLinkBack}
          name={dashboard.businessCard?.profile.name || ''}
          jobTitle={dashboard.businessCard?.profile.jobTitle || ''}
          company={dashboard.businessCard?.profile.company || ''}
          email={dashboard.businessCard?.profile.email || ''}
          phone={dashboard.businessCard?.profile.phone || ''}
          links={links.filter(l => l.isActive)}
          theme={dashboard.businessCard?.theme.primaryColor || '#FDBA74'}
          linkColor={dashboard.businessCard?.theme.secondaryColor || '#000000'}
          layout={dashboard.businessCard?.theme.layout === 'modern' ? 'Left Aligned' : 'Centered'}
          profileImage={dashboard.activeCardId ? dashboard.tempProfileImageUrls[dashboard.activeCardId] || dashboard.businessCard?.profile.profileImage : dashboard.businessCard?.profile.profileImage}
          coverPhoto={dashboard.activeCardId ? dashboard.tempCoverPhotoUrls[dashboard.activeCardId] || dashboard.businessCard?.profile.coverPhoto : dashboard.businessCard?.profile.coverPhoto}
          companyLogo={dashboard.activeCardId ? dashboard.tempCompanyLogoUrls[dashboard.activeCardId] || dashboard.businessCard?.profile.companyLogo : dashboard.businessCard?.profile.companyLogo}
          location={dashboard.businessCard?.profile.location || ''}
          bio={dashboard.businessCard?.profile.bio || ''}
          editingLinkIdx={editingLinkIdx}
        />
      )}
      
      {/* Toast notification */}
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}; 