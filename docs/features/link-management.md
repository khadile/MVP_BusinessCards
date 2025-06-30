# Link Management Feature Specification

## Overview
Comprehensive link management system for digital business cards that allows users to add, customize, and organize CTA (Call-to-Action) buttons including email, website, social media, and custom links. The system provides a unified platform picker, link validation, real-time preview, and analytics tracking.

## Current Implementation Status

### ✅ Implemented Features

#### Shared Platform System
- **Centralized Platform Definitions**: All platform options are defined in `src/utils/platforms.tsx`
- **Type Safety**: Full TypeScript support with `PlatformOption` interface
- **Consistent Icons**: SVG icons for all platforms with proper branding colors
- **Platform Categories**: Recommended, Contact, Social Media, and Custom platforms

#### Modal Workflow
- **Platform Picker Modal**: Large modal showing all available platforms with search functionality
- **Add/Edit Link Modal**: Dedicated modal for link configuration with live preview
- **Smart Navigation**: Back/close logic that remembers modal origin
- **Real-time Preview**: Card preview updates as user types

#### Link Testing & Validation
- **Smart URL Generation**: Uses `getPlatformLinkUrl` utility for proper URL formatting
- **Platform-Specific Validation**: Different validation rules for each platform type
- **Test Link Functionality**: Click-to-test links that open in new tab
- **URL Sanitization**: Proper URL formatting and validation

#### Dashboard Integration
- **Links Section**: Dedicated section in dashboard for link management
- **Recommended Links**: Quick-add buttons for common platforms
- **Link List**: Visual list of all links with edit/remove functionality
- **Active/Inactive Toggle**: Toggle link visibility on the card
- **Drag & Drop Ready**: UI prepared for future drag-and-drop reordering

#### Onboarding Integration
- **StepContacts**: Integrated link management in onboarding flow
- **Consistent UI/UX**: Same modal workflow as dashboard
- **Live Preview**: Real-time card preview during onboarding

### 🔧 Technical Architecture

#### Shared Platform Options
```typescript
// src/utils/platforms.tsx
export interface PlatformOption {
  type: string;
  label: string;
  icon: JSX.Element;
  placeholder: string;
  defaultTitle: string;
}

export const PLATFORM_OPTIONS: PlatformOption[] = [
  // LinkedIn, Website, Email, Custom, Instagram, WhatsApp, Call, Text, Address, Facebook, Twitter
];
```

#### URL Generation Utility
```typescript
// src/utils/index.ts
export function getPlatformLinkUrl(type: string, value: string = ''): string {
  // Handles LinkedIn usernames, website URLs, email addresses, phone numbers, etc.
  // Returns properly formatted URLs for each platform type
}
```

#### Modal Components
- **PlatformPickerModal**: Large modal with search and categories
- **AddLinkModal**: Form modal with live preview and test functionality

#### State Management
- **Dashboard Store**: Manages link state in dashboard
- **Onboarding Store**: Manages link state during onboarding
- **Local State**: Modal state management for UI interactions

### 🎨 User Experience

#### Platform Picker Modal
- **Search Functionality**: Filter platforms by name
- **Category Organization**: Recommended, Contact, Social Media
- **Visual Platform Cards**: Large cards with icons and labels
- **Add Button**: Clear call-to-action for each platform

#### Add/Edit Link Modal
- **Platform Header**: Shows platform icon and name
- **Form Fields**: URL and title inputs with validation
- **Test Link**: Clickable link to test the URL
- **Live Preview**: Real-time card preview on the right
- **Action Buttons**: Add/Update, Remove (edit mode), Back

#### Dashboard Links Section
- **Quick Add Button**: "Add Links and Contact Info" button
- **Link List**: Visual list with platform icons and labels
- **Toggle Switches**: Active/inactive state for each link
- **Recommended Section**: Quick-add cards for common platforms

### 🔗 Supported Platform Types

#### Currently Implemented
1. **LinkedIn**: Profile links with username validation
2. **Website**: Full URL support with protocol detection
3. **Email**: Mailto links with email validation
4. **Custom**: Generic link support
5. **Instagram**: Profile links with username formatting
6. **WhatsApp**: Phone number with WhatsApp API
7. **Call**: Tel links for phone numbers
8. **Text**: SMS links for text messages
9. **Address**: Location/map links
10. **Facebook**: Profile links with username formatting
11. **Twitter**: Profile links with username formatting

#### URL Formatting Examples
- LinkedIn: `john-doe` → `https://www.linkedin.com/in/john-doe/`
- Website: `example.com` → `https://example.com`
- Email: `user@example.com` → `mailto:user@example.com`
- Phone: `+1234567890` → `tel:+1234567890`
- Instagram: `username` → `https://instagram.com/username`

### 🧪 Testing & Validation

#### Link Testing
- **Real-time Validation**: URL format validation as user types
- **Platform-Specific Rules**: Different validation for each platform
- **Test Link Generation**: Proper URL formatting for testing
- **Click-to-Test**: Opens link in new tab for verification

#### Error Handling
- **Invalid URLs**: Clear feedback for malformed URLs
- **Empty Fields**: Disabled submit button until required fields filled
- **Network Errors**: Graceful handling of test link failures

### 📱 Responsive Design

#### Modal Responsiveness
- **Mobile-First**: Optimized for mobile devices
- **Flexible Layout**: Adapts to different screen sizes
- **Touch-Friendly**: Large touch targets for mobile
- **Scroll Support**: Proper scrolling for long content

#### Dashboard Integration
- **Sidebar Layout**: Links section in dashboard sidebar
- **Card Preview**: Live preview alongside form
- **Responsive Grid**: Platform cards adapt to screen size

### 🔄 State Management

#### Dashboard Store Integration
```typescript
// Link management in dashboard store
interface DashboardStore {
  businessCard: BusinessCard | null;
  links: BusinessCardLink[];
  setLinks: (links: BusinessCardLink[]) => void;
  // ... other dashboard state
}
```

#### Modal State Management
```typescript
// Local state for modal interactions
const [showPlatformModal, setShowPlatformModal] = useState(false);
const [showAddLinkModal, setShowAddLinkModal] = useState(false);
const [selectedPlatform, setSelectedPlatform] = useState<PlatformOption | null>(null);
const [editingLinkIdx, setEditingLinkIdx] = useState<number | null>(null);
```

### 🚀 Performance Optimizations

#### Modal Performance
- **Conditional Rendering**: Modals only render when open
- **Memoized Components**: React.memo for performance
- **Efficient Re-renders**: Minimal state updates

#### URL Generation
- **Cached Validation**: Efficient URL validation
- **Lazy Loading**: Platform data loaded on demand
- **Optimized Icons**: SVG icons for crisp rendering

### 🔒 Security Considerations

#### URL Sanitization
- **Protocol Validation**: Ensures proper URL protocols
- **Domain Validation**: Basic domain format checking
- **XSS Prevention**: Proper URL encoding

#### User Input Validation
- **Type Checking**: TypeScript for compile-time safety
- **Runtime Validation**: Client-side validation
- **Sanitization**: Clean user inputs

### 📊 Analytics & Tracking

#### Link Analytics (Prepared)
- **Click Tracking**: Ready for click analytics
- **Platform Usage**: Track which platforms are most used
- **User Behavior**: Monitor link interaction patterns

### 🔮 Future Enhancements

#### Planned Features
- **Drag & Drop Reordering**: Visual link reordering
- **Link Templates**: Pre-configured link templates
- **Bulk Import/Export**: Import/export link collections
- **Advanced Analytics**: Detailed link performance metrics
- **Link Scheduling**: Schedule link availability
- **A/B Testing**: Test different link variations

#### Integration Possibilities
- **CRM Integration**: Link to CRM systems
- **Calendar Integration**: Direct calendar booking
- **Payment Integration**: Direct payment processing
- **Social Media APIs**: Direct platform integration

## Planned Feature: Multi-Card Link Management

- Each business card will have its own independent set of links.
- The Links section will update to show the links for the currently selected card from the dropdown.
- Creating a new card starts with an empty set of links.
- Switching cards saves any unsaved link changes and loads the selected card's links.
- This will be managed in local state for testing, with backend CRUD integration planned for production.

## Implementation Notes

### File Structure
```
src/
├── components/forms/
│   ├── PlatformPickerModal.tsx    # Large platform selection modal
│   └── AddLinkModal.tsx           # Link configuration modal
├── features/
│   ├── dashboard/
│   │   └── LinksSection.tsx       # Dashboard links management
│   └── onboarding/
│       └── StepContacts.tsx       # Onboarding link management
├── utils/
│   ├── platforms.tsx              # Shared platform definitions
│   └── index.ts                   # URL generation utilities
└── stores/
    ├── dashboardStore.ts          # Dashboard state management
    └── onboardingStore.ts         # Onboarding state management
```

### Key Components
1. **PlatformPickerModal**: Large modal with search and categories
2. **AddLinkModal**: Form modal with live preview and testing
3. **LinksSection**: Dashboard integration for link management
4. **StepContacts**: Onboarding integration for link management

### State Flow
1. User clicks "Add Links" → PlatformPickerModal opens
2. User selects platform → AddLinkModal opens
3. User configures link → Live preview updates
4. User tests link → Opens in new tab
5. User saves link → Link added to card

This implementation provides a comprehensive, user-friendly link management system that integrates seamlessly with both the dashboard and onboarding flows, with robust validation, testing capabilities, and a consistent user experience across all touchpoints. 