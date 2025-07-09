import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useDashboardStore } from '../../stores/dashboardStore';

interface AddToAppleWalletButtonProps {
  cardId?: string;
  className?: string;
}

export const AddToAppleWalletButton: React.FC<AddToAppleWalletButtonProps> = ({ 
  cardId, 
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { businessCard } = useDashboardStore();

  // Use provided cardId or current business card
  const activeCardId = cardId || businessCard?.id;

  const handleAddToWallet = async () => {
    if (!user || !activeCardId) {
      setError('Please sign in to add to Apple Wallet');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call backend API to generate .pkpass file
      const response = await fetch('/api/apple-wallet/generate-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          cardId: activeCardId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Apple Wallet pass');
      }

      // Get the .pkpass file as blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `business-card-${activeCardId}.pkpass`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Apple Wallet pass downloaded successfully');
    } catch (error) {
      console.error('❌ Error adding to Apple Wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to add to Apple Wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if device supports Apple Wallet (iOS Safari)
  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  // Show button for iOS devices or always show for testing
  const shouldShowButton = isIOSDevice || process.env.NODE_ENV === 'development';

  if (!shouldShowButton) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={handleAddToWallet}
        disabled={isLoading || !activeCardId}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
          ${isLoading || !activeCardId 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
          }
        `}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Add to Apple Wallet
          </>
        )}
      </button>
      
      {error && (
        <div className="text-red-600 text-xs text-center max-w-xs">
          {error}
        </div>
      )}
      
      {!isIOSDevice && process.env.NODE_ENV === 'development' && (
        <div className="text-gray-500 text-xs text-center">
          (Development mode - normally iOS only)
        </div>
      )}
    </div>
  );
}; 