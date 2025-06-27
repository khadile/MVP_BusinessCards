import React, { useState, ChangeEvent } from 'react';
import { CardPreview } from '../../components/preview/CardPreview';
import { useOnboardingStore } from '../../stores/onboardingStore';

interface StepSignUpProps {
  goBack: () => void;
}

export const StepSignUp: React.FC<StepSignUpProps> = ({ goBack }) => {
  const { name, jobTitle, company, email, setEmail, password, setPassword } = useOnboardingStore();
  const [localEmail, setLocalEmail] = useState<string>(email);
  const [localPassword, setLocalPassword] = useState<string>(password);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalEmail(e.target.value);
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalPassword(e.target.value);
    setPassword(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start w-full">
      <div className="flex-1 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-2">Complete sign up</h2>
        <p className="text-gray-500 mb-8">Well done, your digital business card is looking great. Access your card by completing the sign up below. Welcome to IXL!</p>
        <button className="w-full flex items-center justify-center gap-2 border rounded-xl py-4 mb-6 bg-white hover:bg-gray-50 shadow-sm font-medium text-lg">
          <img src="/google.svg" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-4 text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-4 mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="email"
          value={localEmail}
          onChange={handleEmailChange}
          placeholder="Email"
        />
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-4 mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 shadow-sm"
          type="password"
          value={localPassword}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <p className="text-xs text-gray-400 mb-6">
          By signing up, you agree to IXL's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
        </p>
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
            disabled={!localEmail.trim() || !localPassword.trim()}
          >
            Complete Sign Up
          </button>
        </div>
      </div>
      <div className="w-full md:w-80 flex-shrink-0 mt-10 md:mt-0">
        <CardPreview name={name} jobTitle={jobTitle} company={company} email={localEmail} />
        <div className="text-center text-gray-400 mt-2 text-sm">Card Live Preview</div>
      </div>
    </div>
  );
}; 