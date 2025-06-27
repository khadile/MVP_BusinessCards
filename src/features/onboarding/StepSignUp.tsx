import React, { useState, ChangeEvent } from 'react';
import { CardPreview } from '../../components/preview/CardPreview';
import { useOnboardingStore } from '../../stores/onboardingStore';

interface StepSignUpProps {
  goBack: () => void;
}

export const StepSignUp: React.FC<StepSignUpProps> = ({ goBack }) => {
  const { name, jobTitle, company, email, phone, links, password, setPassword } = useOnboardingStore();
  // The sign-up email is only for authentication, not for the card preview
  const [localEmail, setLocalEmail] = useState<string>('');
  const [localPassword, setLocalPassword] = useState<string>(password);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalEmail(e.target.value);
    // Do NOT call setEmail here
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalPassword(e.target.value);
    setPassword(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-20 items-start w-full">
      <div className="flex-1 max-w-xl">
        <h2 className="text-lg font-semibold mb-1">Complete sign up</h2>
        <p className="text-gray-500 mb-4 text-xs">Well done, your digital business card is looking great. Access your card by completing the sign up below. Welcome to ILX!</p>
        <button className="w-full flex items-center justify-center gap-2 border rounded-md py-2 mb-4 bg-white hover:bg-gray-50 shadow-sm font-medium text-xs">
          <img src="/google.svg" alt="Google" className="h-4 w-4" />
          Continue with Google
        </button>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-3 text-gray-400 font-medium text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
          type="email"
          value={localEmail}
          onChange={handleEmailChange}
          placeholder="Email"
        />
        <input
          className="w-full border border-gray-200 rounded-md px-3 py-2 mb-5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 shadow-sm placeholder:text-xs"
          type="password"
          value={localPassword}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <p className="text-xs text-gray-400 mb-5">
          By signing up, you agree to ILX's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
        </p>
        <div className="flex gap-5 justify-end mt-2">
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
            disabled={!localEmail.trim() || !localPassword.trim()}
          >
            Complete Sign Up <span className="text-sm">→</span>
          </button>
        </div>
      </div>
      <div className="w-full md:w-64 flex-shrink-0 mt-6 md:mt-0">
        <CardPreview name={name} jobTitle={jobTitle} company={company} email={email} phone={phone} links={links} />
        <div className="text-center text-gray-400 mt-1 pt-2 text-xs">Card Live Preview</div>
      </div>
    </div>
  );
}; 