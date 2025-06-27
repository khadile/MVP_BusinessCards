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
    <div className="py-16 flex flex-col items-center justify-center w-full">
      <h2 className="text-2xl font-semibold mb-2 text-center">Let's get started</h2>
      <p className="text-gray-500 mb-6 text-center text-base max-w-md">Create your IXL digital business card in 3 simple steps. Let's start with your name.</p>
      <div className="w-full max-w-sm">
        <label className="block mb-2 font-medium text-gray-700 text-sm">Full Name</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-3 mb-8 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your full name"
        />
        <div className="flex gap-3 justify-center mt-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm flex items-center gap-1 text-sm"
            onClick={goBack}
          >
            <span className="text-lg">←</span> Back
          </button>
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md transition disabled:opacity-50 flex items-center gap-1 text-sm"
            onClick={handleContinue}
            disabled={!name.trim()}
          >
            Continue <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 