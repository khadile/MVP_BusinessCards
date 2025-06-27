import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="/ixl-logo.svg" 
              alt="IXL" 
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to IXL
            </h1>
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
              Digital Business Card Creator
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create beautiful, professional digital business cards in minutes. 
            Share your information instantly with customizable themes and interactive links.
          </p>
          <div className="space-y-4">
            <button 
              onClick={handleGetStarted}
              className="bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
            >
              Create Your Digital Card
            </button>
            <p className="text-sm text-gray-500">
              No account required • Start in seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 