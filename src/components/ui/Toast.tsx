import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed left-1/2 top-4 z-50 transform -translate-x-1/2 transition-all duration-300 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ width: '100%', maxWidth: '28rem' }}
    >
      <div className="bg-gray-800/80 text-white px-8 py-3 rounded-full shadow-lg text-base font-semibold w-full text-center">
        {message}
      </div>
    </div>
  );
}; 