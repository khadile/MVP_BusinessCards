import React, { useState } from 'react';
import { StepName } from './StepName';
import { StepWork } from './StepWork';
import { StepContacts } from './StepContacts';
import { StepSignUp } from './StepSignUp';
import { useOnboardingStore } from '../../stores/onboardingStore';

const steps = [
  { label: 'Name', component: StepName },
  { label: 'Work', component: StepWork },
  { label: 'Contacts', component: StepContacts },
  { label: 'Sign Up', component: StepSignUp },
];

export const OnboardingWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const totalSteps = steps.length;
  const StepComponent = steps[step].component;

  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-blue-50 flex flex-col">
      {/* Top bar with logo and progress */}
      <div className="flex items-center justify-between w-full px-12 pt-10">
        <img src="/ixl-logo.svg" alt="IXL Logo" className="h-10 w-10" />
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div
              key={s.label}
              className={`h-2 w-12 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-gray-200'}`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500">{step + 1} of {totalSteps}</span>
        </div>
      </div>
      {/* Horizontally spaced, left-aligned content */}
      <div className="flex-1 flex items-center justify-start">
        <div className="w-full max-w-2xl pl-24">
          <StepComponent goNext={goNext} goBack={goBack} />
        </div>
      </div>
    </div>
  );
}; 