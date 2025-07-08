# Digital Business Card Creator

## Key Features
- **Multi-card management:** Create, switch, and delete multiple business cards per user. Each card is fully independent with robust state synchronization.
- **Robust per-card image handling:** Profile, cover, and logo images are isolated per card and never lost on save or edit.
- **Instant link toggling:** Enable/disable links with a single click—auto-saves instantly, no 'Unsaved Changes' banner.
- **Toast notifications:** Modern, top-center toasts for all major actions (save, discard, create, delete, switch, error).
- **Enhanced keyboard navigation:** Complete keyboard support throughout onboarding with Enter key progression.
- **Modern UX:** Responsive, accessible, and fast. All actions provide immediate feedback.

## Recent Improvements ✅
- **Fixed multi-card state synchronization:** Cards now properly sync between dashboard and auth stores
- **Enhanced card creation flow:** New cards automatically become active upon creation
- **Improved card deletion:** Proper Firebase cleanup and state management
- **Fixed card switching:** Resolved issues with multiple cards showing as "Active"
- **Added keyboard navigation:** Enter key progression throughout onboarding steps
- **Fixed "View Card" link:** Now properly points to the correct card URL
- **Enhanced ID generation:** Improved uniqueness to prevent duplicate cards
- **Added comprehensive debugging:** Better error tracking and state monitoring

## Usage
1. **Create and Manage Cards:**
   - Use the dropdown in the dashboard header to create, switch, or delete cards.
   - Deleting a card (except the active/last card) requires confirmation and shows a toast.
   - New cards automatically become active when created.
2. **Image Uploads:**
   - Upload profile, cover, and logo images per card. Images persist across edits and saves unless explicitly changed.
3. **Links Management:**
   - Add, edit, or remove links. Toggle links on/off instantly—changes are auto-saved.
4. **Keyboard Navigation:**
   - Press Enter in any main input field during onboarding to progress to the next step.
   - All forms support complete keyboard navigation for accessibility.
5. **Saving and Feedback:**
   - Most actions auto-save. Manual save is only needed for About or theme changes.
   - Toast notifications appear for all major actions.

## Screenshots
<!-- Add updated screenshots/gifs here -->

## Architecture & Best Practices
- Feature-based folder structure
- Zustand for state management with proper store synchronization
- Strict TypeScript, accessibility, and modern React patterns
- Comprehensive error handling and user feedback systems

## For Developers
- See `docs/features/dashboard.md` and `docs/features/link-management.md` for detailed flows.
- Recent fixes documented in `docs/features/dashboard.md` under "Multi-Card Management"

## 🚀 Current Status

### ✅ Completed Features

#### Core Platform
- **React + TypeScript**: Modern, type-safe development
- **Tailwind CSS**: Utility-first styling with custom design system
- **Vite**: Fast development and build tooling
- **Zustand**: Lightweight state management
- **Vitest**: Unit and integration testing setup

#### Authentication & Onboarding
- **Multi-step Onboarding**: Guided user experience with progress tracking
- **Profile Information**: Name, job title, company, and contact details
- **Link Management**: Comprehensive social media and contact link system
- **Real-time Preview**: Live card preview during onboarding
- **Smart Navigation**: Back/forward navigation with state preservation

#### Dashboard & Management
- **Comprehensive Dashboard**: Full-featured management interface
- **About Section**: Profile info, images, themes, and layout customization
- **Image Management**: Profile, cover photo, and company logo uploads
- **File Upload System**: Drag-and-drop with validation and preview
- **Theme Customization**: Color pickers for card and link themes
- **Layout Options**: Left aligned vs centered card layouts
- **Save/Cancel System**: Proper state management with revert functionality
- **Unsaved Changes Detection**: Visual feedback for pending changes

#### Link Management System
- **Shared Platform System**: Centralized platform definitions in `src/utils/platforms.tsx`
- **Modal Workflow**: Platform picker and add/edit link modals
- **Smart URL Generation**: Platform-specific URL formatting
- **Link Testing**: "Test your link" functionality with smart navigation
- **Link Activation**: Toggle links on/off with real-time preview
- **Recommended Links**: LinkedIn, Website, Other for quick access
- **Full Platform Support**: All platforms available in modal

#### Real-time Preview System
- **Live Updates**: All changes reflect immediately in preview
- **Image Preview**: Profile, cover, and company logo display
- **Theme Preview**: Color changes apply instantly
- **Layout Preview**: Left aligned vs centered layout switching
- **Link Preview**: Active links with proper platform icons
- **Responsive Design**: Mobile-optimized preview

#### State Management
- **Zustand Stores**: Separate stores for onboarding and dashboard
- **Data Persistence**: Proper state management between flows
- **Dirty State Tracking**: Unsaved changes detection
- **Image State Management**: Temporary URLs with proper revert logic
- **Onboarding Integration**: Seamless data transfer to dashboard

### 🔧 Technical Implementation

#### File Upload System ✅ **FIREBASE STORAGE INTEGRATED**
- **FileUpload Component**: Reusable with drag-and-drop support
- **Image Validation**: File type and size restrictions (max 5MB)
- **Image Compression**: Automatic compression to 1200px max dimension
- **Firebase Storage Integration**: Secure file storage with user isolation
- **Preview Generation**: Object URLs for immediate preview
- **Remove Functionality**: X button with confirmation dialog
- **Storage Cleanup**: Automatic deletion from Firebase Storage when removed
- **Error Handling**: User-friendly validation messages with toast notifications
- **Loading States**: Visual feedback during upload process

#### Cancel/Revert Logic
- **Full State Revert**: All changes revert to last saved state
- **Image Revert**: Temporary URLs cleared, saved images restored
- **Form Reset**: All form fields reset to saved values
- **Preview Sync**: Preview immediately reflects reverted state

#### Platform System
- **TypeScript Interfaces**: Proper type safety for platform definitions
- **Icon Management**: SVG icons for all platforms with branding
- **URL Generation**: Smart URL formatting for different platforms
- **Category Organization**: Recommended, Contact, Social Media groups

### 🎨 UI/UX Features

#### Design System
- **Consistent Styling**: Tailwind-based design system
- **Color Palette**: 10 predefined theme colors
- **Typography**: Proper hierarchy and readability
- **Spacing**: Consistent spacing scale throughout

#### User Experience
- **Intuitive Navigation**: Clear section switching
- **Visual Feedback**: Loading states and error messages
- **Accessibility**: WCAG compliant design
- **Responsive Design**: Mobile-first approach

#### Component Architecture
- **Reusable Components**: FileUpload, CardPreview, modals
- **Feature-based Organization**: Clear separation of concerns
- **Props Interface**: TypeScript interfaces for all components
- **State Management**: Proper prop drilling and state lifting

### 📋 Current Workflow

#### Onboarding Flow
1. **Step 1**: Name and basic info
2. **Step 2**: Work details (job title, company)
3. **Step 3**: Contact information and links
4. **Step 4**: Sign up completion
5. **Transition**: Automatic data transfer to dashboard

#### Dashboard Management
1. **About Section**: Profile info, images, themes
2. **Links Section**: Add, edit, remove, and manage links
3. **Real-time Preview**: Live updates as you make changes
4. **Save/Cancel**: Proper state management with revert

#### Link Management
1. **Platform Selection**: Choose from recommended or full list
2. **Link Configuration**: URL and title setup
3. **Preview**: Real-time preview with smart URL generation
4. **Testing**: Test links before saving
5. **Activation**: Toggle links on/off

### 🔄 Integration Points

#### Onboarding → Dashboard
- **Data Transfer**: Profile, links, and settings
- **State Initialization**: Proper setup of dashboard state
- **Link Activation**: All onboarding links set to active

#### Shared Components
- **PlatformPickerModal**: Used in both onboarding and dashboard
- **AddLinkModal**: Consistent link editing experience
- **CardPreview**: Real-time preview across all flows
- **FileUpload**: Reusable image upload component

### 🚀 Next Steps

#### Immediate Priorities
- **QR Code Generation**: Share card via QR code
- **Analytics Dashboard**: View card visit statistics
- **Advanced Themes**: Custom gradients and patterns
- **Export Options**: PDF and image export

#### Technical Improvements ✅ **FIREBASE STORAGE COMPLETED**
- **File Upload Optimization**: Image compression and Firebase Storage integration ✅
- **Caching Strategy**: Performance improvements
- **Offline Support**: Basic offline functionality
- **Real-time Collaboration**: Multi-user editing

### 🧪 Testing

#### Current Test Setup
- **Vitest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Test Coverage**: Aiming for 80%+ coverage

#### Testing Strategy
- **Unit Tests**: Store logic and utility functions
- **Integration Tests**: Component interactions
- **E2E Tests**: Complete user workflows

### 📚 Documentation

#### Current Documentation
- **Feature Specifications**: Detailed feature docs in `/docs/features/`
- **API Documentation**: TypeScript interfaces and types
- **Component Documentation**: Props and usage examples
- **Architecture Guide**: Project structure and patterns

#### Documentation Status
- ✅ **Link Management**: Complete specification
- ✅ **Dashboard**: Updated with current implementation
- ✅ **Onboarding**: Feature specification
- 🔄 **API Documentation**: In progress
- 🔄 **Component Library**: In progress

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd BussinessCard_MVP
npm install
```

### Development
```bash
npm run dev
```

### Testing
```bash
npm run test
npm run test:coverage
```

### Building
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form-specific components
│   └── preview/        # Preview components
├── features/           # Feature-based modules
│   ├── auth/           # Authentication
│   ├── dashboard/      # Dashboard feature
│   ├── onboarding/     # Onboarding flow
│   └── landing/        # Landing page
├── stores/             # State management
├── utils/              # Utility functions
├── types/              # TypeScript definitions
└── tests/              # Test files
```

## 🤝 Contributing

1. Follow the established architecture patterns
2. Use TypeScript for all new code
3. Write tests for new features
4. Update documentation for changes
5. Follow the commit message conventions

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation for common solutions
- Review the troubleshooting guide

---

**Built with ❤️ using modern web technologies** 