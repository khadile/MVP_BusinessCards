import React, { useState } from 'react';
import AppleWalletService, { AppleWalletPassData } from '../../services/appleWallet';
import { Toast } from './Toast';

interface AddToAppleWalletButtonProps {
  passData: AppleWalletPassData;
  className?: string;
}

const AddToAppleWalletButton: React.FC<AddToAppleWalletButtonProps> = ({
  passData,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean; type?: 'info' | 'success' | 'error' }>({ 
    message: '', 
    visible: false,
    type: 'info'
  });
  const walletService = AppleWalletService.getInstance();

  // Don't show button if not iOS
  if (!AppleWalletService.supportsAppleWallet()) {
    return null;
  }

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, visible: true, type });
  };

  const hideToast = () => setToast(t => ({ ...t, visible: false }));

  const handleAddToWallet = async () => {
    setIsLoading(true);
    
    try {
      await walletService.downloadPass(passData);
      showToast('Business card added to Apple Wallet! Check your Wallet app.', 'success');
    } catch (error) {
      console.error('Error adding to Apple Wallet:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's a configuration error from the server
      if (errorMessage.includes('Apple Wallet configuration missing') || 
          errorMessage.includes('certificates not found')) {
        showToast('Apple Wallet is not configured. Please contact support.', 'error');
      } else {
        showToast(`Unable to add to Apple Wallet: ${errorMessage}`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAddToWallet}
        disabled={isLoading}
        className={`
          flex items-center justify-center gap-2 px-4 py-2 
          bg-black text-white rounded-lg font-medium
          hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${className}
        `}
        style={{
          background: 'linear-gradient(135deg, #000 0%, #333 100%)',
          minHeight: '44px', // Apple's recommended minimum touch target
        }}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="flex-shrink-0"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span>Add to Apple Wallet</span>
          </>
        )}
      </button>
      
      <Toast 
        message={toast.message} 
        visible={toast.visible} 
        onClose={hideToast} 
        type={toast.type || 'info'}
      />
    </>
  );
};

export default AddToAppleWalletButton; 