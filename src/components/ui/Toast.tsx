import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  type?: 'error' | 'success' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, visible, onClose, type = 'info' }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
    return undefined; 
  }, [visible, onClose]);

  const borderColor = type === 'error' ? 'border-red-500 dark:border-red-400' : type === 'success' ? 'border-green-500 dark:border-green-400' : 'border-blue-500 dark:border-blue-400';
  const icon = type === 'error'
    ? (
        <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      )
    : type === 'success'
    ? (
        <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      )
    : (
        <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>
      );

  return (
    <div
      className={`fixed left-1/2 top-6 z-50 transform -translate-x-1/2 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8 pointer-events-none'
      }`}
      style={{ width: '100%', maxWidth: '28rem' }}
    >
      <div
        className={`flex items-center bg-white dark:bg-gray-800 border-l-4 ${borderColor} shadow-xl px-6 py-4 rounded-xl text-gray-900 dark:text-white font-medium relative animate-slideDown`}
        style={{ fontFamily: 'Inter, sans-serif', minHeight: 56 }}
      >
        {icon}
        <span className="flex-1 text-sm leading-snug">{message}</span>
        <button
          className="ml-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          onClick={onClose}
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.3s cubic-bezier(0.4,0,0.2,1); }
      `}</style>
    </div>
  );
}; 