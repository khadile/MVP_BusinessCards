import React, { useState, useRef } from 'react';
import { uploadFile, deleteFile } from '../../services/fileUpload';
import { useAuthStore } from '../../stores/authStore';

interface IconUploadProps {
  currentIcon?: string | null;
  currentIconPath?: string | null;
  onIconChange: (iconUrl: string | null, iconPath: string | null) => void;
  platformIcon: JSX.Element;
  platformLabel: string;
  disabled?: boolean;
}

export const IconUpload: React.FC<IconUploadProps> = ({
  currentIcon,
  currentIconPath,
  onIconChange,
  platformIcon,
  platformLabel,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((state) => state.user);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }

    // Check file size (max 2MB for icons)
    if (file.size > 2 * 1024 * 1024) {
      return 'Image must be smaller than 2MB';
    }

    // Check image dimensions (optional, but recommended for icons)
    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPendingFile(file);
    setShowConfirmation(true);
  };

  const handleConfirmUpload = async () => {
    if (!pendingFile || !user) return;

    setIsUploading(true);
    try {
      // Delete existing icon if it exists
      if (currentIconPath) {
        await deleteFile(currentIconPath);
      }

      // Upload new icon
      const path = `link-icons/${user.uid}/${Date.now()}_${pendingFile.name}`;
      const result = await uploadFile(pendingFile, path);
      const downloadUrl = result.url;

      // Update the icon
      onIconChange(downloadUrl, path);

      // Clean up
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setPendingFile(null);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error uploading icon:', error);
      alert('Failed to upload icon. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPendingFile(null);
    setShowConfirmation(false);
  };

  const handleRemoveIcon = () => {
    setShowRemoveConfirmation(true);
  };

  const handleConfirmRemove = async () => {
    if (currentIconPath) {
      try {
        await deleteFile(currentIconPath);
      } catch (error) {
        console.error('Error deleting icon:', error);
      }
    }
    onIconChange(null, null);
    setShowRemoveConfirmation(false);
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirmation(false);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Icon Display */}
      <div className="relative">
        <div className="w-16 h-16 rounded-xl border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-white dark:bg-gray-700">
          {currentIcon ? (
            <img 
              src={currentIcon} 
              alt="Custom icon" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-8 h-8">
              {platformIcon}
            </div>
          )}
        </div>
        
        {/* Remove button for custom icons */}
        {currentIcon && (
          <button
            onClick={handleRemoveIcon}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
            title="Remove custom icon"
            disabled={disabled}
          >
            ×
          </button>
        )}
      </div>

      {/* Upload/Change Button */}
      <button
        onClick={openFilePicker}
        disabled={disabled || isUploading}
        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : currentIcon ? 'Change Icon' : 'Upload Icon'}
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Change {platformLabel} Icon
            </h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-700 mb-2">
                  <div className="w-8 h-8">{platformIcon}</div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
              </div>
              <div className="text-gray-400 dark:text-gray-500">→</div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-700 mb-2 overflow-hidden">
                  {previewUrl && (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">New</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to change the icon for this {platformLabel} link? This will only affect this specific link.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelUpload}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Change Icon'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Remove Custom Icon
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove the custom icon? This will restore the default {platformLabel} icon.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 