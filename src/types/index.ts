// Core business card types
export interface BusinessCard {
  id: string;
  userId: string;
  cardName?: string;
  profile: BusinessCardProfile;
  theme: BusinessCardTheme;
  links: BusinessCardLink[];
  settings: BusinessCardSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessCardProfile {
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  bio: string;
  profileImage?: string | undefined;
  profileImagePath?: string | undefined;
  coverPhoto?: string | undefined;
  coverPhotoPath?: string | undefined;
  companyLogo?: string | undefined;
  companyLogoPath?: string | undefined;
  email?: string;
  phone?: string;
  website?: string;
}

export interface BusinessCardTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  layout: 'modern' | 'classic' | 'minimal';
  borderRadius: number;
  shadow: boolean;
}

export interface BusinessCardLink {
  id: string;
  type: LinkType;
  label: string;
  url: string;
  icon?: string;
  customIcon?: string; // URL to custom uploaded icon
  customIconPath?: string; // Firebase Storage path for cleanup
  color?: string;
  backgroundColor?: string;
  order: number;
  isActive: boolean;
  isPublic: boolean;
  style: LinkStyle;
  behavior: LinkBehavior;
  analytics: LinkAnalytics;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type LinkType = 
  | 'email'
  | 'phone'
  | 'website'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'github'
  | 'portfolio'
  | 'resume'
  | 'calendar'
  | 'payment'
  | 'custom';

export interface LinkStyle {
  borderRadius: number;
  fontSize: number;
  fontWeight: number;
  padding: number;
  margin: number;
  shadow: boolean;
  animation?: string;
}

export interface LinkBehavior {
  openInNewTab: boolean;
  trackClicks: boolean;
  requireConfirmation: boolean;
  customAction?: string;
}

export interface LinkAnalytics {
  totalClicks: number;
  lastClicked?: Date;
  clickRate: number;
  conversionRate?: number;
}

export interface BusinessCardSettings {
  isPublic: boolean;
  allowAnalytics: boolean;
  customDomain?: string;
}

// User types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  preferences: UserPreferences;
  settings: UserSettings;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
}

export interface UserSettings {
  isPublic: boolean;
  allowAnalytics: boolean;
  customDomain?: string;
}

// Theme types
export interface ThemeConfig {
  id: string;
  name: string;
  type: 'preset' | 'custom';
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  effects: ThemeEffects;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  link: string;
  border: string;
  shadow: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface ThemeLayout {
  template: 'modern' | 'classic' | 'minimal';
  borderRadius: number;
  padding: number;
  margin: number;
  shadow: boolean;
  shadowIntensity: number;
}

export interface ThemeEffects {
  gradient: GradientConfig | null;
  backgroundImage: string | null;
  animations: AnimationConfig[];
  customCSS: string | null;
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  direction: string;
  colors: string[];
  stops: number[];
}

export interface AnimationConfig {
  element: string;
  property: string;
  duration: number;
  easing: string;
  trigger: 'hover' | 'load' | 'click';
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'minimal' | 'bold';
  preview: string;
  config: ThemeConfig;
  isPopular: boolean;
}

// Form types
export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ClickMetadata {
  timestamp: Date;
  userAgent: string;
  referrer: string;
  location: string;
  device: string;
  sessionId: string;
}

export interface AnalyticsData {
  totalClicks: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  topReferrers: string[];
  deviceBreakdown: Record<string, number>;
  geographicData: Record<string, number>;
} 