import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadResult {
  url: string;
  path: string;
}

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  quality?: number; // for image compression (0-1)
}

// Default options
const defaultOptions: FileUploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  quality: 0.8,
};

// Validate file
export const validateFile = (file: File, options: FileUploadOptions = {}): string | null => {
  const opts = { ...defaultOptions, ...options };
  
  // Check file size
  if (file.size > (opts.maxSize || 0)) {
    return `File size must be less than ${Math.round((opts.maxSize || 0) / 1024 / 1024)}MB`;
  }
  
  // Check file type
  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    return `File type not allowed. Please use: ${opts.allowedTypes.join(', ')}`;
  }
  
  return null;
};

// Compress image if needed
export const compressImage = async (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 1200px width/height)
      const maxSize = 1200;
      let { width, height } = img;
      
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Upload file to Firebase Storage
export const uploadFile = async (
  file: File,
  path: string,
  options: FileUploadOptions = {}
): Promise<UploadResult> => {
  try {
    // Validate file
    const validationError = validateFile(file, options);
    if (validationError) {
      throw new Error(validationError);
    }
    
    // Compress image if it's an image file
    let fileToUpload = file;
    if (file.type.startsWith('image/') && options.quality !== undefined) {
      fileToUpload = await compressImage(file, options.quality);
    }
    
    // Create storage reference
    const storageRef = ref(storage, path);
    
    // Upload file
    console.log('📤 Uploading file to Firebase Storage:', path);
    const snapshot = await uploadBytes(storageRef, fileToUpload);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ File uploaded successfully:', downloadURL);
    
    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
    };
  } catch (error) {
    console.error('❌ File upload failed:', error);
    throw error;
  }
};

// Delete file from Firebase Storage
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log('✅ File deleted successfully:', path);
  } catch (error) {
    console.error('❌ File deletion failed:', error);
    throw error;
  }
};

// Generate storage path for business card images
export const generateImagePath = (
  userId: string,
  cardId: string,
  imageType: 'profile' | 'cover' | 'logo',
  fileName: string
): string => {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  return `business-cards/${userId}/${cardId}/${imageType}-${timestamp}.${extension}`;
};

// Upload business card image
export const uploadBusinessCardImage = async (
  file: File,
  userId: string,
  cardId: string,
  imageType: 'profile' | 'cover' | 'logo',
  options: FileUploadOptions = {}
): Promise<UploadResult> => {
  const path = generateImagePath(userId, cardId, imageType, file.name);
  return uploadFile(file, path, options);
}; 