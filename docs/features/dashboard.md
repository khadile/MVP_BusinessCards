# Dashboard Feature Specification

## Overview
The main dashboard interface where users can manage their business card information, customize themes, and preview their digital business card in real-time. The dashboard provides an intuitive, drag-and-drop style interface similar to Popl's UI flow.

## Core Functionality

### Profile Information Management
- **Personal Details**: Name, job title, company, location, bio
- **Profile Image**: Upload, crop, and manage profile pictures
- **Contact Information**: Email, phone, website
- **Social Media**: LinkedIn, Twitter, Instagram, etc.

### Real-time Preview
- Live preview of business card changes
- Mobile and desktop view toggles
- Responsive design preview
- Theme customization preview

### Theme Customization
- Color scheme selection with color pickers
- Font family and size options
- Layout variations (modern, classic, minimal)
- Background customization

### Link Management
- Add/edit/remove CTA buttons
- Customize button appearance and order
- Link validation and testing
- Social media integration

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