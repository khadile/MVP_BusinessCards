import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-orange-200 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-100 opacity-40 rounded-full blur-2xl animate-pulse" />
      {/* Top nav/login */}
      <div className="absolute top-0 right-0 p-8 z-10">
        <button
          onClick={handleLogin}
          className="bg-white/80 backdrop-blur border border-gray-200 text-orange-600 font-bold px-6 py-2 rounded-full shadow hover:bg-orange-50 hover:text-orange-700 transition"
        >
          Login
        </button>
      </div>
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl px-10 py-14 max-w-2xl w-full flex flex-col items-center">
          <img 
            src="/ixl-logo.svg" 
            alt="ILX" 
            className="w-20 h-20 mb-6 drop-shadow-xl"
          />
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Welcome to ILX</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Digital Business Card Creator</h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
            Create beautiful, professional digital business cards in minutes.<br />
            Share your information instantly with customizable themes and interactive links.
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-orange-500 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-orange-600 hover:shadow-xl transition mb-2"
          >
            Create Your Digital Card
          </button>
          <p className="text-sm text-gray-500 mt-2">No account required • Start in seconds</p>
        </div>
      </div>
    </div>
  );
}; 