# Digital Business Card Creator MVP

A modern web application for creating and customizing digital business cards, similar to Popl's UI flow. Built with React, TypeScript, and Firebase.

## 🚀 Features

- **User Authentication**: Secure sign-up/login with Firebase Auth
- **Profile Management**: Complete profile setup and customization
- **Real-time Preview**: Live preview of business card changes
- **Theme Customization**: Color pickers, fonts, and layout options
- **Link Management**: Add and customize CTA buttons
- **Responsive Design**: Mobile-first approach
- **Auto-save**: Automatic saving of changes

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Hook Form** + **Zod** for forms
- **Radix UI** for accessible components

### Backend & Services
- **Firebase Auth** for authentication
- **Firebase Firestore** for database
- **Firebase Storage** for file uploads
- **Firebase Hosting** for deployment

### Development Tools
- **Vitest** + **React Testing Library** for testing
- **ESLint** + **Prettier** for code quality
- **TypeScript** strict mode
- **Husky** for git hooks

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── forms/          # Form-specific components
│   ├── layout/         # Layout components (header, sidebar, etc.)
│   └── preview/        # Business card preview components
├── features/           # Feature-based modules
│   ├── auth/           # Authentication feature
│   ├── dashboard/      # Dashboard feature
│   ├── preview/        # Business card preview
│   ├── themes/         # Theme customization
│   └── links/          # Link management
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── services/           # API and external service integrations
├── stores/             # State management (Zustand stores)
└── tests/              # Test files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/digital-business-card-mvp.git
   cd digital-business-card-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📚 Documentation

- [Product Requirements Document](docs/PRD.md)
- [Authentication Feature](docs/features/auth.md)
- [Dashboard Feature](docs/features/dashboard.md)
- [Preview Feature](docs/features/preview.md)
- [Theme Customization](docs/features/theme-customization.md)
- [Link Management](docs/features/link-management.md)

## 🧪 Testing

### Run tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests (future)
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test-driven development
We follow TDD principles. Write tests before implementing features:

```typescript
// Example test
describe('BusinessCardPreview', () => {
  test('should render profile information correctly', () => {
    const { getByText } = render(<BusinessCardPreview profile={mockProfile} />);
    expect(getByText('John Doe')).toBeInTheDocument();
  });
});
```

## 🏗 Development Workflow

### Code Style
- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines
- Write comprehensive tests

### Git Workflow
1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and write tests
3. Commit with conventional messages: `feat: add business card preview`
4. Push and create pull request
5. Code review and merge

### Commit Message Format
```
type(scope): description

feat(auth): add email verification
fix(preview): resolve image loading issue
docs(readme): update installation instructions
```

## 🚀 Deployment

### Firebase Hosting
```bash
# Build for production
npm run build

# Deploy to Firebase
npm run deploy
```

### Environment Setup
1. Create Firebase project
2. Enable Authentication, Firestore, and Storage
3. Configure security rules
4. Set up custom domain (optional)

## 📊 Analytics & Monitoring

### User Metrics
- Registration completion rate
- Profile setup completion
- Feature usage analytics
- User retention rates

### Performance Metrics
- Page load times
- Preview render performance
- Error rates
- Core Web Vitals

## 🔒 Security

### Data Protection
- All data encrypted in transit
- Secure Firebase security rules
- Input validation and sanitization
- Regular security audits

### Privacy Compliance
- GDPR compliance
- Clear privacy policy
- User data export/deletion
- Consent management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes and add tests
4. Submit pull request
5. Code review and merge

### Development Guidelines
- Follow `.cursorrules` for code style
- Write tests for all new features
- Update documentation
- Ensure accessibility compliance
- Performance optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](docs/) folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: support@example.com

## 🗺 Roadmap

### Phase 1: MVP (Current)
- [x] User authentication
- [x] Basic dashboard
- [x] Business card preview
- [x] Theme customization
- [x] Link management

### Phase 2: Enhanced Features
- [ ] QR code generation
- [ ] Analytics dashboard
- [ ] Social media integration
- [ ] Advanced themes
- [ ] Team collaboration

### Phase 3: Enterprise Features
- [ ] White-label solutions
- [ ] API access
- [ ] Advanced analytics
- [ ] Custom domains
- [ ] Bulk operations

## 🙏 Acknowledgments

- Inspired by Popl's digital business card platform
- Built with modern web technologies
- Community contributions welcome 