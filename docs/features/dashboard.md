# Dashboard Feature Specification

## Overview
The dashboard provides a comprehensive interface for users to manage and customize their digital business cards after completing the onboarding process. It features real-time preview, advanced customization options, multi-card management, and seamless integration with the onboarding flow.

## Current Implementation Status

### ✅ Implemented Features

#### Multi-Card Management System ✅ **RECENTLY ENHANCED**
- **Card Dropdown**: Header dropdown for creating, switching, and deleting cards
- **State Synchronization**: Robust sync between dashboard and auth stores
- **Card Creation**: Automatic card activation upon creation
- **Card Switching**: Proper state management during card switches
- **Card Deletion**: Safe deletion with Firebase cleanup and state updates
- **ID Generation**: Enhanced uniqueness with `Date.now() + Math.random()`
- **Duplicate Prevention**: Prevents creation of duplicate cards
- **Debug System**: Comprehensive logging for state tracking

#### Core Dashboard Structure
- **Responsive Layout**: Sidebar navigation with main content area and live preview
- **Section Management**: About and Links sections with smooth transitions
- **Header Integration**: Card name display with proper card switching
- **State Management**: Zustand store with proper dirty state tracking and multi-store sync

#### About Section
- **Card Management**: 
  - Card name (separate from profile name)
  - Card layout selection (Left Aligned/Centered)
- **Profile Information**:
  - Name, job title, company, location, bio
  - Real-time updates with live preview
- **Image Management**:
  - Profile picture upload with preview
  - Cover photo upload with preview  
  - Company logo upload with preview
  - File validation and error handling
  - Remove functionality (X button)
- **Theme Customization**:
  - Primary color picker (card theme)
  - Secondary color picker (link colors)
  - 10 predefined color options
- **Save/Cancel Functionality**:
  - Save changes with proper state management
  - Cancel with full revert to last saved state
  - Unsaved changes detection and UI feedback

#### Links Section Integration
- **Seamless Integration**: LinksSection component with full functionality
- **Shared Platform System**: Uses centralized platform definitions
- **Modal Workflow**: Platform picker and add/edit link modals
- **Real-time Preview**: Links update immediately in card preview
- **Proper Link Management**: "View Card" link now correctly points to card URL

#### Live Preview System
- **Real-time Updates**: All changes reflect immediately in preview
- **Image Preview**: Profile, cover, and company logo display
- **Theme Preview**: Color changes apply instantly
- **Layout Preview**: Left aligned vs centered layout switching
- **Link Preview**: Active links display with proper icons
- **Multi-Card Preview**: Preview updates when switching between cards

#### State Management ✅ **RECENTLY ENHANCED**
- **Zustand Store**: Centralized state management with improved multi-store sync
- **Business Cards Synchronization**: `initializeFromBusinessCards()` method syncs all cards
- **Active Card Management**: Proper switching between multiple cards
- **Dirty State Tracking**: Proper detection of unsaved changes
- **Image State Management**: Temporary URLs for preview, proper revert logic
- **Onboarding Integration**: Automatic initialization from onboarding data
- **User Switching Detection**: Prevents useEffect interference during manual switches

### 🔧 Technical Implementation

#### Multi-Card State Management ✅ **RECENTLY IMPLEMENTED**
- **Store Synchronization**: Dashboard store now syncs with auth store's full `businessCards` array
- **Card Creation Flow**: `handleCreateCard()` with duplicate prevention and auto-activation
- **Card Switching Flow**: `handleSelectCard()` with proper state sync across stores
- **Card Deletion Flow**: `handleDeleteCard()` with Firebase cleanup and state updates
- **Debug Logging**: Comprehensive console.log statements for troubleshooting
- **ID Generation**: `Date.now() + Math.random()` for unique card IDs
- **State Initialization**: `initializeFromBusinessCards()` for proper multi-card setup

#### File Upload System ✅ **UPDATED WITH FIREBASE STORAGE**
- **FileUpload Component**: Reusable component with drag-and-drop
- **Image Validation**: File type and size validation (max 5MB)
- **Image Compression**: Automatic compression to 1200px max dimension
- **Firebase Storage Integration**: Secure file storage with user isolation
- **Preview Generation**: Object URLs for immediate preview
- **Remove Functionality**: X button with confirmation dialog
- **Storage Cleanup**: Automatic deletion from Firebase Storage when removed
- **Error Handling**: User-friendly error messages with toast notifications
- **Loading States**: Visual feedback during upload process

#### Cancel/Revert Logic
- **Full State Revert**: All changes revert to last saved state
- **Image Revert**: Temporary URLs cleared, saved images restored
- **Form Reset**: All form fields reset to saved values
- **Preview Sync**: Preview immediately reflects reverted state
- **Multi-Card Revert**: Proper revert logic for switched cards

#### Onboarding Integration
- **Data Transfer**: Profile info, links, and settings from onboarding
- **State Initialization**: Proper setup of dashboard state with multi-card support
- **Link Activation**: All onboarding links set to active by default

### 🎨 UI/UX Features

#### Card Management UX ✅ **RECENTLY ENHANCED**
- **Dropdown Interface**: Clean card selection dropdown in header
- **Create Card Button**: Prominent "Create New Card" option
- **Card Indicators**: Visual indicators for active card
- **Switch Confirmation**: Smooth card switching with proper feedback
- **Delete Confirmation**: Safety confirmation for card deletion
- **Toast Notifications**: User feedback for all card operations

#### Responsive Design
- **Desktop-First**: Optimized for desktop with responsive elements
- **Sidebar Navigation**: Clean section switching
- **Preview Panel**: Fixed preview with scrollable content
- **Form Layout**: Grid-based form with proper spacing

#### User Feedback
- **Unsaved Changes Indicator**: Visual feedback in header
- **Save/Cancel Buttons**: Clear action buttons with proper states
- **Loading States**: Save operation feedback
- **Error Handling**: Validation and error messages
- **Toast System**: Comprehensive toast notifications for all actions

#### Accessibility
- **Keyboard Navigation**: Proper focus management
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Color Contrast**: WCAG compliant color combinations

### 📋 Data Flow

#### Multi-Card Management Flow ✅ **RECENTLY IMPLEMENTED**
1. **Initialization**: `initializeFromBusinessCards()` syncs all cards from auth store
2. **Card Creation**: User clicks "Create New Card" → `handleCreateCard()` → new card added to both stores → auto-activation
3. **Card Switching**: User selects card → `handleSelectCard()` → both stores updated → preview refreshes
4. **Card Deletion**: User deletes card → confirmation → Firebase deletion → state cleanup → toast notification
5. **State Sync**: Dashboard useEffect monitors auth store changes with user switching detection

#### Save Process
1. User makes changes (forms, images, theme)
2. State marked as dirty
3. Save button triggers `saveChanges()`
4. Temporary URLs become permanent
5. Last saved state updated
6. Dirty state cleared

#### Cancel Process
1. User clicks cancel
2. `discardChanges()` called
3. All temporary state cleared
4. Business card reverted to last saved
5. Preview updates immediately
6. Form fields reset

#### Image Management ✅ **FIREBASE STORAGE INTEGRATED**
1. User uploads image → validation and compression → Firebase Storage upload
2. Preview shows new image immediately via temporary URL
3. User removes image → confirmation dialog → Firebase Storage deletion
4. Preview shows placeholder or previous image
5. Save → storage paths saved to Firestore, temporary URLs become permanent
6. Cancel → temporary URLs cleared, saved images restored from Firebase Storage

### 🔄 Integration Points

#### With Authentication System ✅ **ENHANCED**
- **Business Cards Array**: Dashboard syncs with auth store's full card collection
- **Current Card Tracking**: Proper active card management across stores
- **User State Management**: Seamless integration with user authentication

#### With Onboarding
- **Data Initialization**: Profile, links, and settings transfer
- **Link Management**: Shared platform definitions and workflows
- **State Consistency**: Proper state management between flows

#### With Link Management
- **Shared Components**: PlatformPickerModal and AddLinkModal
- **State Integration**: Links managed in dashboard store
- **Preview Integration**: Links display in real-time preview
- **URL Management**: "View Card" link now properly generates card URLs

### 🚀 Future Enhancements

#### Planned Features
- **QR Code Generation**: Share card via QR code
- **Analytics Dashboard**: View card visit statistics
- **Advanced Themes**: Custom gradient and pattern options
- **Bulk Operations**: Multiple link management across cards
- **Export Options**: PDF and image export

#### Technical Improvements
- **Performance Optimization**: Optimize multi-card state management
- **Caching Strategy**: Improved performance for large card collections
- **Offline Support**: Basic offline functionality for card management
- **Real-time Collaboration**: Multi-user editing (future)

## Testing Strategy

### Unit Tests ✅ **ENHANCED WITH MULTI-CARD TESTS**
- **Store Logic**: State management and business logic including multi-card operations
- **Component Logic**: Form validation and user interactions
- **Utility Functions**: Image handling and data transformation
- **Card Management**: Create, switch, and delete operations

### Integration Tests
- **Multi-Card Flow**: Complete card management workflow
- **Onboarding Integration**: Data transfer and state consistency
- **Link Management**: Modal workflows and state updates
- **Save/Cancel Flow**: Complete user workflows

### E2E Tests
- **Complete User Journey**: Onboarding to dashboard to multi-card management
- **Card Operations**: Create, switch, delete cards end-to-end
- **Image Management**: Upload, preview, remove, revert
- **Theme Customization**: Color changes and preview updates

## Performance Considerations

### Multi-Card Optimization ✅ **RECENTLY IMPLEMENTED**
- **Selective State Updates**: Only update changed cards
- **Efficient Card Switching**: Optimized state transitions
- **Memory Management**: Proper cleanup of unused card data
- **Debug Performance**: Minimal impact from debug logging

### Image Optimization
- **Lazy Loading**: Images load only when needed
- **Object URLs**: Efficient preview generation
- **Memory Management**: Proper cleanup of object URLs

### State Optimization
- **Selective Updates**: Only necessary state updates
- **Debounced Updates**: Form field changes optimized
- **Memoization**: Expensive calculations cached

## Security Considerations

### Multi-Card Security ✅ **IMPLEMENTED**
- **User Isolation**: Each user's cards are properly isolated
- **Firebase Security**: Proper security rules for multi-card access
- **State Validation**: Proper validation of card operations

### File Upload Security ✅ **IMPLEMENTED**
- **File Validation**: Type and size restrictions (max 5MB, image types only)
- **Image Compression**: Automatic compression to prevent large file uploads
- **Firebase Storage Security**: User-isolated storage with proper security rules
- **Content Scanning**: Malware detection (future)
- **Secure Storage**: Encrypted file storage via Firebase Storage

### Data Protection
- **Input Sanitization**: All user inputs validated
- **XSS Prevention**: Proper content encoding
- **CSRF Protection**: Token-based requests (future)

## User Interface Layout

### Main Dashboard Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Header (Logo, User Menu, Save Button)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────────────────────┐   │
│  │                 │  │                                 │   │
│  │   Sidebar       │  │        Preview Panel           │   │
│  │   Navigation    │  │                                 │   │
│  │                 │  │                                 │   │
│  │ • Profile       │  │                                 │   │
│  │ • Appearance    │  │                                 │   │
│  │ • Links         │  │                                 │   │
│  │ • Settings      │  │                                 │   │
│  │                 │  │                                 │   │
│  └─────────────────┘  └─────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar Navigation
1. **Profile Section**
   - Personal Information
   - Profile Image
   - Contact Details
   - Bio/Description

2. **Appearance Section**
   - Theme Selection
   - Color Customization
   - Font Settings
   - Layout Options

3. **Links Section**
   - CTA Button Management
   - Social Media Links
   - Custom Links
   - Link Ordering

4. **Settings Section**
   - Privacy Settings
   - Share Options
   - Analytics (future)
   - Account Settings

## Data Models

### Dashboard State
```typescript
interface DashboardState {
  activeSection: 'profile' | 'appearance' | 'links' | 'settings';
  businessCard: BusinessCard;
  isDirty: boolean;
  isSaving: boolean;
  previewMode: 'mobile' | 'desktop';
  unsavedChanges: Partial<BusinessCard>;
}

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
    email?: string;
    phone?: string;
    website?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    fontSize: number;
    layout: 'modern' | 'classic' | 'minimal';
    borderRadius: number;
    shadow: boolean;
  };
  links: BusinessCardLink[];
  settings: {
    isPublic: boolean;
    allowAnalytics: boolean;
    customDomain?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Component Architecture

### Main Components
1. **DashboardLayout**
   - Header with navigation and actions
   - Sidebar navigation
   - Main content area
   - Preview panel

2. **ProfileSection**
   - PersonalInfoForm
   - ProfileImageUpload
   - ContactInfoForm
   - BioEditor

3. **AppearanceSection**
   - ThemeSelector
   - ColorPicker
   - FontSelector
   - LayoutSelector

4. **LinksSection**
   - LinkManager
   - LinkEditor
   - LinkOrdering
   - SocialMediaLinks

5. **PreviewPanel**
   - BusinessCardPreview
   - DeviceToggle
   - ShareButton
   - QRCodeGenerator

## User Experience Features

### Auto-save Functionality
- Automatic saving of changes every 30 seconds
- Visual indicators for save status
- Conflict resolution for concurrent edits
- Offline support with sync when online

### Drag and Drop Interface
- Reorder links by dragging
- Drag profile image for upload
- Drag color swatches for theme customization
- Visual feedback for drag operations

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save changes
- `Ctrl/Cmd + Z`: Undo changes
- `Ctrl/Cmd + Y`: Redo changes
- `Tab`: Navigate between sections
- `Escape`: Close modals/dropdowns

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Adaptive sidebar (collapsible on mobile)
- Optimized preview for different screen sizes

## State Management

### Dashboard Store (Zustand)
```typescript
interface DashboardStore {
  // State
  activeSection: string;
  businessCard: BusinessCard | null;
  isDirty: boolean;
  isSaving: boolean;
  previewMode: 'mobile' | 'desktop';
  unsavedChanges: Partial<BusinessCard>;
  
  // Actions
  setActiveSection: (section: string) => void;
  updateBusinessCard: (updates: Partial<BusinessCard>) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  setPreviewMode: (mode: 'mobile' | 'desktop') => void;
  resetToLastSaved: () => void;
}
```

## Performance Optimization

### Lazy Loading
- Load sections on demand
- Lazy load preview components
- Optimize image loading and caching
- Code splitting for different sections

### Caching Strategy
- Cache business card data locally
- Cache theme presets
- Cache user preferences
- Implement service worker for offline support

### Real-time Updates
- Debounced auto-save (300ms delay)
- Optimistic UI updates
- Background sync for offline changes
- Efficient re-rendering with React.memo

## Error Handling

### User Feedback
- Toast notifications for save status
- Loading states for async operations
- Error boundaries for component failures
- Graceful degradation for network issues

### Data Validation
- Real-time form validation
- Image upload validation
- Link URL validation
- Theme color validation

## Accessibility Features

### WCAG 2.1 AA Compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- ARIA labels and descriptions

### Inclusive Design
- Color blind friendly themes
- Adjustable font sizes
- Reduced motion support
- Clear visual hierarchy

## Testing Strategy

### Unit Tests
- Component rendering
- State management
- Form validation
- Utility functions

### Integration Tests
- Section navigation
- Auto-save functionality
- Preview updates
- Data persistence

### E2E Tests
- Complete dashboard workflow
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance

## Analytics and Monitoring

### User Behavior Tracking
- Section usage patterns
- Feature adoption rates
- Save frequency
- Preview interaction

### Performance Monitoring
- Page load times
- Auto-save performance
- Preview rendering speed
- Memory usage

## Future Enhancements

### Advanced Features
- Template library
- Bulk link import
- Advanced analytics
- Team collaboration
- White-label options

### Integration Possibilities
- CRM system integration
- Calendar booking
- Payment processing
- Email marketing tools

## Dashboard UI/UX & Feature Breakdown (2024 Update)

### 1. Layout & Navigation
- **Sidebar (Left):**
  - Sections: About, Links, Lead Capture (Lead Capture Form, Follow Up Email), Sharing (QR Code, Virtual Background, Email Signature, Accessories)
  - Clean, icon-based navigation with section grouping
- **Header (Top):**
  - User's card/avatar and name
  - "New Card" dropdown
  - "Share Your Card" button (primary CTA)
  - Overflow menu (…)
- **Main Content (Center):**
  - Section-specific forms and controls (About, Links, etc.)

### 2. About Section
- **Editable Fields:**
  - Card Name (inline edit)
  - Card Layout (dropdown: Left Aligned, etc.)
  - Profile Picture (upload/crop)
  - Cover Photo (upload/crop)
  - Company Logo (upload/crop)
  - Name, Pronouns, Location, Job Title, Company
  - Bio (multi-line)
- **Theme Customization:**
  - Card Theme color picker
  - Link Color picker
  - Toggle: Match Link Icons to Card Theme
  - Font selection (future)
- **Live Card Preview (Right):**
  - Real-time update as user edits fields
  - Shows profile, theme, links, and branding
  - "View card" link (opens public card view)

### 3. Links Section
- Manage CTA buttons (add, edit, reorder, delete)
- Icon selection, color, and label
- Drag-and-drop reordering

### 4. Lead Capture & Sharing
- Lead capture form builder
- Follow-up email template
- QR code generator
- Virtual backgrounds, email signature, accessories

### 5. General UI/UX
- Responsive, modern, and accessible
- Consistent IXL branding (logo, colors, fonts)
- Smooth transitions and feedback (toasts, loaders)
- Error handling and validation
- Save/auto-save status indicators

### 6. State & Data
- All fields should be persisted (auto-save or manual save)
- Zustand store for dashboard state
- Real-time preview sync with form state
- File uploads (profile, cover, logo) to Firebase Storage

### 7. Accessibility
- Keyboard navigation for all controls
- Proper ARIA labels and roles
- Sufficient color contrast
- Focus management

# Data Persistence & Multi-User Cloud Storage (with Authentication)

## Overview
When authentication is implemented, each user's dashboard data (business card, profile, theme, etc.) should be stored and retrieved from a secure cloud backend (e.g., Firebase Firestore, Supabase, etc.), keyed by their unique user ID (UID).

## Data Flow
- **On Login:** Fetch the user's business card/dashboard data from the backend using their UID and populate the UI state/store.
- **On Update:** When the user clicks "Update", send the new data to the backend/cloud, updating their record.
- **On Cancel:** Revert the UI to the last data fetched from the backend (or last successful update).

## Example (Firestore)
- Each user has a document in a `businessCards` collection, keyed by their UID:
  ```json
  businessCards: {
    user123: { cardName: "Sophia", cardLayout: "Left Aligned", ... },
    user456: { ... }
  }
  ```
- On login, fetch `businessCards/{uid}` and populate the dashboard state.
- On update, write the new data to `businessCards/{uid}`.
- On cancel, reload the last-saved data from Firestore (or keep a local copy in state).

## UI Integration
- The dashboard UI should use a global store (e.g., Zustand) that syncs with the backend.
- The "Cancel" button reverts to the last-fetched data.
- The "Update" button saves the current state to the backend and updates the local "last saved" state.

## Security
- Only allow authenticated users to read/write their own data (enforced by backend security rules).

## Best Practices
- Always fetch user data on login and keep the UI in sync with the backend.
- Use optimistic UI updates for responsiveness, but handle errors gracefully.
- Store all user-specific dashboard data under their UID for easy retrieval and security.

---

**Summary:**
- Sidebar: Clean, grouped navigation with icons and section names.
- Header: User avatar, card name, "New Card" dropdown, "Share" button, overflow menu.
- Main Panel: Section-specific forms (About, Links, etc.), with clear labels and helper text.
- Live Preview: Always visible on the right, updates in real time, matches the current theme and content.
- Theme Controls: Color pickers, toggles, and font selectors, visually grouped.
- File Uploads: For profile, cover, and company logo, with drag-and-drop and cropping.
- Modern, minimal, and accessible design.

## Planned Feature: Multi-Card Management

### Overview
- Users can create and manage multiple business cards from a dropdown selector in the dashboard header.
- The card name input becomes a dropdown listing all cards, with a "+ Create New Card" button.
- Selecting a card loads its About, Links, and Preview data; creating a new card resets all sections to blank.

### Key Behaviors
- **Dropdown Selector:** Shows all cards and a create button. If only one card exists, only the create button is shown.
- **Create New Card:** Resets About, Links, and Preview to a blank state. Adds a new card to the list and sets it as active.
- **Switch Cards:** Saves current card if dirty, then loads the selected card's data into all sections.
- **Persistence:** Initially, cards are managed in Zustand/local state for local testing. Backend CRUD integration is planned for production.
- **Edge Cases:** Prompt user to save/discard changes when switching if there are unsaved changes.

### Technical Notes
- Extend Zustand dashboard store to manage an array of cards and activeCardId.
- All About, Links, and Preview components read/write to the active card.
- Backend API endpoints for card CRUD will be integrated after local testing.

### Future Extensions
- Card deletion, duplication, sharing, and team access.
- Pagination or search for large numbers of cards.

---

## RFC: Multi-Card Management Implementation Plan

### 1. State Structure
- Extend Zustand dashboard store:
  - `cards: BusinessCard[]` — array of all cards
  - `activeCardId: string` — ID of the currently selected card
  - CRUD actions: `createCard`, `updateCard`, `deleteCard`, `setActiveCard`
- All About, Links, and Preview components read/write to the active card.

### 2. UI Flow
- Replace card name input with dropdown selector in dashboard header.
- Dropdown lists all cards and a "+ Create New Card" button.
- Selecting a card loads its data into About, Links, and Preview.
- Creating a new card resets all sections to blank and adds a new card to the list.
- Prompt user to save/discard changes if switching with unsaved changes.

### 3. Local Testing
- Implement all logic in Zustand/local state for initial development.
- Use mock data for multiple cards.
- Ensure all sections update correctly when switching cards.

### 4. Backend Integration
- Add API endpoints for card CRUD (create, read, update, delete).
- On login, fetch all user cards and populate store.
- All card actions (create, update, delete, switch) sync with backend.
- Ensure user-specific access and security.

### 5. Edge Cases & Future Extensions
- Card deletion, duplication, sharing, and team access.
- Pagination or search for large numbers of cards.
- Optimistic UI updates and error handling for backend sync.

---

## Card Management
- **Dropdown:** Create, switch, and delete cards from the dashboard header dropdown.
- **Delete:** Only non-active cards can be deleted (if more than one exists). Deletion requires confirmation and triggers a toast notification.
- **Switch:** Switching cards updates all sections and shows a toast.

## Image Handling
- **Per-card images:** Profile, cover, and logo images are stored and previewed per card. Images are never lost on unrelated edits or saves.
- **Image upload:** Images persist until explicitly changed or removed.

## Link Management
- **Instant toggle:** Toggling a link's active state auto-saves immediately—no 'Unsaved Changes' banner appears for this action.

## Toast Notifications
- **Feedback:** Toasts appear at the top center for all major actions: save, discard, create, delete, switch, and errors.

## Recent UX Improvements
- Card deletion with confirmation and toast
- Per-card image isolation and robust save logic
- Instant, silent auto-save for link toggles
- Modern, accessible toast notifications

---

# ...rest of your dashboard feature doc below... 