import React, { useState } from 'react';
import { StepName } from './StepName';
import { StepWork } from './StepWork';
import { StepContacts } from './StepContacts';
import { StepSignUp } from './StepSignUp';


const steps = [
  { label: 'Name', component: StepName },
  { label: 'Work', component: StepWork },
  { label: 'Contacts', component: StepContacts },
  { label: 'Sign Up', component: StepSignUp },
];

export const OnboardingWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const totalSteps = steps.length;
  
  // Early return if step is out of bounds
  if (step < 0 || step >= totalSteps) return null;
  
  const currentStep = steps[step];
  if (!currentStep) return null; // Additional safety check
  
  const StepComponent = currentStep.component;

  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-blue-50 flex flex-col">
      {/* Top bar with logo and progress */}
      <div className="flex items-center justify-between w-full px-8 pt-6">
        <img src="/ixl-logo.svg" alt="ILX Logo" className="h-8 w-8" />
        <div className="flex items-center gap-1">
          {steps.map((s, i) => (
            <div
              key={s.label}
              className={`h-1.5 w-8 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-gray-200'}`}
            />
          ))}
          <span className="ml-2 text-xs text-gray-500">{step + 1} of {totalSteps}</span>
        </div>
      </div>
      {/* Content positioned towards the top */}
      <div className="flex-1 flex items-start justify-center pt-16">
        <div className="w-full max-w-3xl">
          <StepComponent goNext={goNext} goBack={goBack} />
        </div>
      </div>
    </div>
  );
}; 