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
    <div className="flex flex-col md:flex-row gap-8 items-start w-full">
      <div className="flex-1 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-2">Additional Info</h2>
        <p className="text-gray-500 mb-8">Let's add some more info to your card. You can add contact info, social media, payment links and more</p>
        <label className="block mb-2 font-medium text-gray-700">Email <span className="text-gray-400 text-sm">Optional</span></label>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-4 mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="email"
          value={localEmail}
          onChange={e => setLocalEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <label className="block mb-2 font-medium text-gray-700">Phone Number <span className="text-gray-400 text-sm">Optional</span></label>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-4 mb-8 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="tel"
          value={localPhone}
          onChange={e => setLocalPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Recommended Links <span className="text-gray-400 text-sm">Optional</span></span>
            <button
              type="button"
              className="text-blue-500 hover:underline text-sm font-medium"
              onClick={() => setShowLinksModal(true)}
            >
              + Add additional links
            </button>
          </div>
          <div className="flex gap-4">
            {localLinks.map(link => (
              <div key={link.type} className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50 shadow-sm">
                <span className="text-lg">{link.icon === 'linkedin' ? '🔗' : '🌐'}</span>
                <span>{link.label}</span>
                <button className="ml-2 text-gray-400 hover:text-gray-600">+</button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <button
            type="button"
            className="px-6 py-2 rounded-xl border text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm"
            onClick={goBack}
          >
            Back
          </button>
          <button
            type="button"
            className="px-8 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md transition disabled:opacity-50"
            onClick={handleContinue}
          >
            Continue →
          </button>
        </div>
      </div>
      <div className="w-full md:w-80 flex-shrink-0 mt-10 md:mt-0">
        <CardPreview name={name} jobTitle={jobTitle} company={company} email={localEmail} phone={localPhone} links={localLinks} />
        <div className="text-center text-gray-400 mt-2 text-sm">Card Live Preview</div>
      </div>
      {showLinksModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">Add/Edit Link</h3>
            {/* Link editing form goes here */}
            <button
              className="mt-4 px-6 py-2 rounded-xl border text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm"
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