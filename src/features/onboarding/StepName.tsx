import React, { useState } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';

interface StepNameProps {
  goNext: () => void;
  goBack: () => void;
}

export const StepName: React.FC<StepNameProps> = ({ goNext, goBack }) => {
  const [name, setName] = useState('');
  const { setName: setStoreName } = useOnboardingStore();

  const handleContinue = () => {
    setStoreName(name.trim());
    goNext();
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <h2 className="text-lg font-semibold mb-1 text-center">Let's get started</h2>
      <p className="text-gray-500 mb-4 text-center text-sm max-w-md">Create your IXL digital business card in 3 simple steps. Let's start with your name.</p>
      <div className="w-full max-w-lg">
        <label className="block mb-1 font-medium text-gray-700 text-xs">Full Name</label>
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your full name"
        />
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
            disabled={!name.trim()}
          >
            Continue <span className="text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 