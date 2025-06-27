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
    <div className="flex flex-col md:flex-row gap-8 items-start w-full">
      <div className="flex-1 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-2">Where do you work?</h2>
        <p className="text-gray-500 mb-8">Add job title and company to your digital business card</p>
        <label className="block mb-2 font-medium text-gray-700">Job Title</label>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-4 mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="text"
          value={localJobTitle}
          onChange={e => setLocalJobTitle(e.target.value)}
          placeholder="Job Title"
        />
        <label className="block mb-2 font-medium text-gray-700">Company</label>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-4 mb-10 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="text"
          value={localCompany}
          onChange={e => setLocalCompany(e.target.value)}
          placeholder="Company"
        />
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
            disabled={!localJobTitle.trim() || !localCompany.trim()}
          >
            Continue →
          </button>
        </div>
      </div>
      <div className="w-full md:w-80 flex-shrink-0 mt-10 md:mt-0">
        <CardPreview name={name} jobTitle={localJobTitle} company={localCompany} />
        <div className="text-center text-gray-400 mt-2 text-sm">Card Live Preview</div>
      </div>
    </div>
  );
}; 