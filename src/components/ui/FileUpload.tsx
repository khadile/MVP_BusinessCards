import React, { useRef, useState, useCallback } from 'react';

interface FileUploadProps {
  label: string;
  currentImage?: string | undefined;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  previewClassName?: string;
  placeholder?: string;
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
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

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
          ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} 
          border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden
          transition-all duration-200
        `}>
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt={label} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[13px] text-gray-400">{placeholder}</span>
          )}
        </div>
        
        {/* Remove button */}
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            ×
          </button>
        )}
        
        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">Drop image here</span>
          </div>
        )}
      </div>
      
      {/* Upload button */}
      <button
        type="button"
        onClick={handleClick}
        className="text-[11px] text-blue-500 hover:underline mt-0.5"
      >
        {previewUrl ? 'Change' : 'Upload'}
      </button>
      
      {/* Error message */}
      {error && (
        <span className="text-[10px] text-red-500 mt-1">{error}</span>
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