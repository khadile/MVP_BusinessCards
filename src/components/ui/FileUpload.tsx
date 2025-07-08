import React, { useRef, useState, useCallback, useEffect } from 'react';

interface FileUploadProps {
  label: string;
  currentImage?: string | undefined;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  previewClassName?: string;
  placeholder?: string;
  isUploading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  currentImage,
  onFileSelect,
  accept = 'image/*',
  maxSize = 5, // 5MB default
  className = '',
  previewClassName = '',
  placeholder = 'Upload',
  isUploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    setError(null);
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return false;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }
    
    return true;
  }, [maxSize]);

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      setPreviewUrl(null);
      onFileSelect(null);
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0] || null;
    handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to remove this ${label.toLowerCase()}?`)) {
      setPreviewUrl(null);
      onFileSelect(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onFileSelect, label]);

  // Sync previewUrl with currentImage prop
  useEffect(() => {
    setPreviewUrl(currentImage || null);
  }, [currentImage]);

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className={`relative cursor-pointer transition-all duration-200 ${
          isDragOver ? 'scale-105' : ''
        } ${previewClassName}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Preview container */}
        <div className={`
          ${previewClassName} 
          ${isDragOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'} 
          border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden
          transition-all duration-200 relative group cursor-pointer
        `}>
          {previewUrl ? (
            <>
              <img 
                src={previewUrl} 
                alt={label} 
                className="w-full h-full object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <span className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Click to change
                </span>
              </div>
              {/* Remove button overlay */}
              <button
                type="button"
                onClick={handleRemove}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRemove(e as any);
                  }
                }}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors shadow-sm hover:shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 opacity-80 group-hover:opacity-100"
                title={`Remove ${label.toLowerCase()}`}
                aria-label={`Remove ${label.toLowerCase()}`}
              >
                ×
              </button>
            </>
          ) : (
            <span className="text-[13px] text-gray-400 dark:text-gray-500">{placeholder}</span>
          )}
        </div>
        
        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 dark:bg-blue-400 dark:bg-opacity-30 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Drop image here</span>
          </div>
        )}
        
        {/* Uploading overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-white font-medium text-xs">Uploading...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Upload button */}
      <button
        type="button"
        onClick={handleClick}
        className="text-[11px] text-blue-500 dark:text-blue-400 hover:underline mt-0.5"
      >
        {previewUrl ? 'Change Image' : 'Upload'}
      </button>
      
      {/* Error message */}
      {error && (
        <span className="text-[10px] text-red-500 dark:text-red-400 mt-1">{error}</span>
      )}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}; 