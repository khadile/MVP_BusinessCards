# Digital Business Card Creator - MVP

A modern, feature-rich digital business card creation platform built with React, TypeScript, and Tailwind CSS.

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
- **Data Persistence**: State management across onboarding steps

#### Dashboard System
- **Modern Dashboard UI**: Clean, professional interface with sidebar navigation
- **About Section**: Complete profile management with file uploads
- **Links Management**: Full CRUD operations for business card links
- **Theme Customization**: Color schemes and layout options
- **Real-time Preview**: Live card preview with all changes
- **Save/Cancel Logic**: Proper state management with unsaved changes detection

#### Link Management System
- **Shared Platform Definitions**: Centralized platform options in `src/utils/platforms.tsx`
- **Platform Picker Modal**: Large modal with search and categories
- **Add/Edit Link Modal**: Form modal with live preview and testing
- **Smart URL Generation**: Platform-specific URL formatting
- **Test Link Functionality**: Click-to-test links that open in new tab
- **Dashboard Integration**: Seamless integration with dashboard workflow
- **Onboarding Integration**: Consistent experience in onboarding flow

#### File Upload System
- **Profile Picture**: Circular profile image upload with preview
- **Cover Photo**: Landscape cover photo upload
- **Company Logo**: Company branding image upload
- **Image Revert Logic**: Proper handling of image removal and restoration
- **Preview System**: Real-time image preview in card

#### Card Preview System
- **Live Preview**: Real-time updates as user makes changes
- **Theme Support**: Dynamic color scheme application
- **Layout Options**: Left-aligned and centered layouts
- **Interactive Links**: Smart URL formatting for different platforms
- **Responsive Design**: Mobile-friendly card display

### 🔧 Technical Architecture

#### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (FileUpload, etc.)
│   ├── forms/          # Form components (PlatformPickerModal, AddLinkModal)
│   └── preview/        # Card preview components
├── features/           # Feature-based modules
│   ├── auth/           # Authentication feature
│   ├── dashboard/      # Dashboard feature (Dashboard, LinksSection)
│   ├── onboarding/     # Onboarding flow (OnboardingWizard, StepContacts)
│   └── landing/        # Landing page
├── hooks/              # Custom React hooks
├── utils/              # Utility functions (platforms, URL generation)
├── types/              # TypeScript type definitions
├── stores/             # State management (Zustand stores)
└── tests/              # Test files
```

#### State Management
- **Dashboard Store**: Manages dashboard state, business card data, and file uploads
- **Onboarding Store**: Manages onboarding flow state and user progress
- **Local State**: Component-level state for UI interactions

#### Key Components
1. **Dashboard**: Main dashboard with sidebar navigation and content areas
2. **LinksSection**: Comprehensive link management with modal workflow
3. **OnboardingWizard**: Multi-step onboarding with progress tracking
4. **CardPreview**: Live card preview with theme and layout support
5. **FileUpload**: Reusable file upload component with preview
6. **PlatformPickerModal**: Large modal for platform selection
7. **AddLinkModal**: Form modal for link configuration

### 🎨 Design System

#### UI Components
- **Consistent Styling**: Tailwind CSS with custom design tokens
- **Responsive Design**: Mobile-first approach with breakpoint system
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Interactive Elements**: Hover states, transitions, and animations

#### Color Scheme
- **Primary Colors**: Orange-based theme with customizable options
- **Secondary Colors**: Link colors and accent colors
- **Neutral Colors**: Gray scale for text and backgrounds
- **Status Colors**: Success, error, and warning states

### 🔗 Supported Platforms

#### Social Media
- **LinkedIn**: Profile links with username validation
- **Instagram**: Profile links with username formatting
- **Facebook**: Profile links with username formatting
- **Twitter**: Profile links with username formatting

#### Contact & Communication
- **Email**: Mailto links with email validation
- **Phone**: Tel links for phone numbers
- **WhatsApp**: WhatsApp API integration
- **Text**: SMS links for text messages

#### Web & Custom
- **Website**: Full URL support with protocol detection
- **Custom**: Generic link support for any URL
- **Address**: Location/map links

### 🧪 Testing & Quality

#### Testing Setup
- **Vitest**: Fast unit and integration testing
- **React Testing Library**: Component testing utilities
- **Test Coverage**: Comprehensive test coverage for core functionality

#### Code Quality
- **TypeScript**: Strict type checking and IntelliSense
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting and consistency

### 📱 Responsive Design

#### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

#### Mobile Optimizations
- **Touch-Friendly**: Large touch targets and gestures
- **Performance**: Optimized for mobile devices
- **Navigation**: Mobile-optimized navigation patterns

### 🚀 Performance

#### Optimization Strategies
- **Code Splitting**: Lazy loading of components and routes
- **Image Optimization**: Efficient image handling and compression
- **Bundle Optimization**: Minimized bundle size and loading times
- **Caching**: Strategic caching for improved performance

### 🔒 Security

#### Data Protection
- **Input Validation**: Comprehensive input sanitization
- **URL Security**: Safe URL handling and validation
- **File Upload Security**: Secure file upload handling
- **Privacy Compliance**: GDPR and privacy considerations

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd BussinessCard_MVP

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Environment Setup
```bash
# Copy environment variables
cp env.example .env

# Configure your environment variables
# Add Firebase configuration, API keys, etc.
```

### Development Workflow
1. **Feature Development**: Create feature branches for new development
2. **Testing**: Write tests for new functionality
3. **Code Review**: Submit pull requests for review
4. **Documentation**: Update documentation for new features

## 📚 Documentation

### Feature Documentation
- [Link Management](./docs/features/link-management.md) - Comprehensive link management system
- [Dashboard](./docs/features/dashboard.md) - Dashboard functionality and features
- [Onboarding](./docs/features/onboarding.md) - Onboarding flow and user experience
- [Authentication](./docs/features/auth.md) - Authentication and user management

### Technical Documentation
- [Product Requirements](./docs/PRD.md) - Product requirements and specifications
- [RFCs](./rfc/) - Request for Comments and technical proposals

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core platform setup and architecture
- ✅ Authentication and onboarding flow
- ✅ Dashboard with basic functionality
- ✅ Link management system
- ✅ File upload and preview system

### Phase 2 (Next)
- 🔄 QR Code generation and sharing
- 🔄 Advanced analytics and tracking
- 🔄 Social media integration
- 🔄 Payment link support
- 🔄 Calendar integration

### Phase 3 (Future)
- 📋 AI-powered suggestions
- 📋 Advanced customization options
- 📋 Team collaboration features
- 📋 API and third-party integrations
- 📋 Mobile app development

## 🤝 Contributing

### Development Guidelines
- Follow the established code style and architecture
- Write comprehensive tests for new features
- Update documentation for any changes
- Ensure accessibility and responsive design
- Follow security best practices

### Code Standards
- **TypeScript**: Use strict TypeScript configuration
- **React**: Follow React best practices and hooks
- **Testing**: Maintain good test coverage
- **Documentation**: Keep documentation up to date

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation for common solutions
- Review the troubleshooting guide

---

**Built with ❤️ using modern web technologies** 