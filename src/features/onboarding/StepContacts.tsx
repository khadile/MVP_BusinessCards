import React, { useState } from 'react';
import { CardPreview } from '../../components/preview/CardPreview';
import { useOnboardingStore } from '../../stores/onboardingStore';

interface StepContactsProps {
  goNext: () => void;
  goBack: () => void;
}

export const StepContacts: React.FC<StepContactsProps> = ({ goNext, goBack }) => {
  const {
    name, jobTitle, company, email, phone, links,
    setEmail, setPhone, setLinks
  } = useOnboardingStore();
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [localEmail, setLocalEmail] = useState<string>(email);
  const [localPhone, setLocalPhone] = useState<string>(phone);
  const [localLinks, setLocalLinks] = useState<typeof links>(links.length ? links : [
    { type: 'linkedin', label: 'LinkedIn', url: '', icon: 'linkedin' },
    { type: 'website', label: 'Website', url: '', icon: 'globe' },
  ]);

  const handleContinue = () => {
    setEmail(localEmail.trim());
    setPhone(localPhone.trim());
    setLinks(localLinks);
    goNext();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start w-full">
      <div className="flex-1 w-full max-w-md">
        <h2 className="text-lg font-bold mb-1">Additional Info</h2>
        <p className="text-gray-500 mb-4 text-sm">Let's add some more info to your card. You can add contact info, social media, payment links and more</p>
        <label className="block mb-1 font-medium text-gray-700 text-xs">Email <span className="text-gray-400 text-xs">Optional</span></label>
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-3 pt-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="email"
          value={localEmail}
          onChange={e => setLocalEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <label className="block mb-1 font-medium text-gray-700 text-xs">Phone Number <span className="text-gray-400 text-xs">Optional</span></label>
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="tel"
          value={localPhone}
          onChange={e => setLocalPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-xs">Recommended Links <span className="text-gray-400 text-xs">Optional</span></span>
            <button
              type="button"
              className="text-blue-500 hover:underline text-xs font-medium"
              onClick={() => setShowLinksModal(true)}
            >
              + Add additional links
            </button>
          </div>
          <div className="flex gap-2">
            {localLinks.map(link => (
              <div key={link.type} className="flex items-center gap-1 border rounded-md px-2 py-1 bg-gray-50 shadow-sm">
                <span className="text-sm">{link.icon === 'linkedin' ? '🔗' : '🌐'}</span>
                <span className="text-xs">{link.label}</span>
                <button className="ml-1 text-gray-400 hover:text-gray-600 text-xs">+</button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-1.5 rounded-md border text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm text-xs"
            onClick={goBack}
          >
            Back
          </button>
          <button
            type="button"
            className="px-5 py-1.5 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md transition disabled:opacity-50 text-xs"
            onClick={handleContinue}
          >
            Continue →
          </button>
        </div>
      </div>
      <div className="w-full md:w-64 flex-shrink-0 mt-6 md:mt-0">
        <CardPreview name={name} jobTitle={jobTitle} company={company} email={localEmail} phone={localPhone} links={localLinks} />
        <div className="text-center text-gray-400 mt-1 text-xs">Card Live Preview</div>
      </div>
      {showLinksModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold mb-3">Add/Edit Link</h3>
            {/* Link editing form goes here */}
            <button
              className="mt-3 px-4 py-1.5 rounded-md border text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm text-xs"
              onClick={() => setShowLinksModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 