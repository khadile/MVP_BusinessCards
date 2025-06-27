import React, { useState } from 'react';
import { CardPreview } from '../../components/preview/CardPreview';
import { useOnboardingStore } from '../../stores/onboardingStore';

interface StepWorkProps {
  goNext: () => void;
  goBack: () => void;
}

export const StepWork: React.FC<StepWorkProps> = ({ goNext, goBack }) => {
  const { name, jobTitle, company, setJobTitle, setCompany } = useOnboardingStore();
  const [localJobTitle, setLocalJobTitle] = useState(jobTitle);
  const [localCompany, setLocalCompany] = useState(company);

  const handleContinue = () => {
    setJobTitle(localJobTitle.trim());
    setCompany(localCompany.trim());
    goNext();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start w-full">
      <div className="flex-1 w-full max-w-md">
        <h2 className="text-lg font-bold mb-1">Where do you work?</h2>
        <p className="text-gray-500 mb-4 text-sm">Add job title and company to your digital business card</p>
        <label className="block mb-1 font-medium text-gray-700 text-xs">Job Title</label>
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="text"
          value={localJobTitle}
          onChange={e => setLocalJobTitle(e.target.value)}
          placeholder="Job Title"
        />
        <label className="block mb-1 font-medium text-gray-700 text-xs">Company</label>
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="text"
          value={localCompany}
          onChange={e => setLocalCompany(e.target.value)}
          placeholder="Company"
        />
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
            disabled={!localJobTitle.trim() || !localCompany.trim()}
          >
            Continue →
          </button>
        </div>
      </div>
      <div className="w-full md:w-64 flex-shrink-0 mt-6 md:mt-0">
        <CardPreview name={name} jobTitle={localJobTitle} company={localCompany} />
        <div className="text-center text-gray-400 mt-1 text-xs">Card Live Preview</div>
      </div>
    </div>
  );
}; 