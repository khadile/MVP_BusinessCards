# Authentication Feature Specification

## Overview
Authentication system using Firebase Auth for user registration, login, and profile management. User data will be stored in Firebase Firestore and profile images in Firebase Storage.

## Core Functionality

### User Registration
- Email and password registration
- Email verification required
- Profile setup wizard after registration
- Username/display name selection
- Terms of service acceptance

### User Login
- Email/password authentication
- "Remember me" functionality
- Password reset via email
- Social login options (Google, GitHub) - future enhancement

### Profile Management
- User profile data storage in Firestore
- Profile image upload to Firebase Storage
- Account settings and preferences
- Password change functionality
- Account deletion with data cleanup

## Data Models

### User Profile (Firestore)
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isEmailVerified: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
  };
}
```

### Business Card Data (Firestore)
```typescript
interface BusinessCard {
  id: string;
  userId: string;
  profile: {
    name: string;
    jobTitle: string;
    company: string;
    location: string;
    bio: string;
    profileImage?: string;
    profileImagePath?: string; // Firebase Storage path for cleanup
    coverPhoto?: string;
    coverPhotoPath?: string; // Firebase Storage path for cleanup
    companyLogo?: string;
    companyLogoPath?: string; // Firebase Storage path for cleanup
    email?: string;
    phone?: string;
    website?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: number;
    layout: 'modern' | 'classic' | 'minimal';
  };
  links: BusinessCardLink[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isPublic: boolean;
  shareableUrl?: string;
}
```

## Firebase Configuration

### Authentication Rules
- Email verification required for full access
- Password minimum 8 characters
- Rate limiting on login attempts
- Session timeout after 30 days of inactivity

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Business cards belong to users
    match /businessCards/{cardId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow read: if resource.data.isPublic == true;
    }
  }
}
```

### Storage Rules ✅ **IMPLEMENTED**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Business card images - users can only access their own images
    match /business-cards/{userId}/{cardId}/{imageType} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Profile images - users can only access their own profile images
    match /profile-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Public business card images (for sharing)
    match /public-cards/{cardId}/{allPaths=**} {
      allow read: if true; // Anyone can read public cards
      allow write: if request.auth != null; // Only authenticated users can upload
    }
  }
}
```

## User Interface Components

### Authentication Pages ✅ **COMPLETED**
1. **Sign Up Page** ✅
   - Email and password fields
   - Password strength indicator
   - Terms of service checkbox
   - "Already have an account?" link

2. **Login Page** ✅
   - Email and password fields
   - "Remember me" checkbox
   - "Forgot password?" link
   - "Don't have an account?" link

3. **Email Verification Page**
   - Verification status display
   - Resend verification email option
   - Redirect to dashboard after verification

4. **Password Reset Page** ✅
   - Email input field
   - Confirmation message
   - Return to login link

### Profile Setup Wizard
1. **Step 1: Basic Information**
   - Display name
   - Profile image upload
   - Bio/description

2. **Step 2: Business Information**
   - Job title
   - Company name
   - Location

3. **Step 3: Preferences**
   - Theme preference
   - Notification settings

## State Management

### Authentication Store (Zustand) ✅ **IMPLEMENTED**
```typescript
interface AuthStore {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
}
```

## Error Handling

### Common Error Scenarios
- Invalid email format
- Weak password
- Email already in use
- Invalid login credentials
- Network connectivity issues
- Firebase service unavailability

### User Feedback
- Toast notifications for success/error states
- Loading spinners during authentication
- Clear error messages with actionable guidance
- Graceful degradation for offline scenarios

## Security Considerations

### Data Protection
- All sensitive data encrypted in transit
- User passwords never stored in plain text
- Profile images stored securely in Firebase Storage
- Regular security audits and updates

### Privacy Compliance
- GDPR compliance for EU users
- Clear privacy policy and terms of service
- User data export and deletion capabilities
- Consent management for data processing

## Testing Strategy

### Unit Tests
- Authentication functions
- Form validation
- Error handling
- State management

### Integration Tests
- Firebase Auth integration
- Firestore operations
- Storage uploads
- End-to-end authentication flow

### Security Tests
- Password strength validation
- Input sanitization
- Authorization checks
- Session management

## Performance Considerations

### Optimization
- Lazy loading of authentication components
- Efficient Firebase queries
- Image compression before upload
- Caching of user profile data

### Monitoring
- Authentication success/failure rates
- User registration completion rates
- Profile setup abandonment rates
- Firebase service performance metrics

## Onboarding and Authentication Update ✅ **COMPLETED**

- Users can begin onboarding without authentication.
- Authentication (sign up with Google or email/password) is required only on the final onboarding step ("Complete Sign Up").
- The onboarding flow is branded as IXL, not Popl.
- The onboarding wizard is at `/onboarding` and collects user info before authentication. 

## Planned Feature: Multi-Card Access After Authentication ✅ **IMPLEMENTED**

- After logging in, users can access all their business cards via the dashboard dropdown selector.
- Each card is user-specific and only accessible to the authenticated user.
- Backend integration ensures secure, user-specific card management.
- File uploads are properly isolated per user and card.

## File Upload System ✅ **COMPLETED**

### File Upload Service
- **Image Validation**: File type, size (max 5MB)
- **Image Compression**: Automatic compression to 1200px max dimension
- **Firebase Storage Integration**: Secure file storage with user isolation
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Visual feedback during upload process

### File Management Features ✅ **COMPLETED**
- **Upload Images**: Profile pictures, cover photos, company logos
- **Remove Images**: Red "×" button with confirmation dialog
- **Storage Cleanup**: Automatic deletion from Firebase Storage when removed
- **Preview System**: Real-time preview of uploaded images
- **Drag & Drop**: Support for drag and drop file uploads

### File Structure
```
business-cards/{userId}/{cardId}/
├── profile-{timestamp}.{ext}
├── cover-{timestamp}.{ext}
└── logo-{timestamp}.{ext}
``` 