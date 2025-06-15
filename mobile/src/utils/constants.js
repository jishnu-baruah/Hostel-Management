// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'https://hx8k2l2c-5000.inc1.devtunnels.ms/api' // Development URL
  : 'https://your-production-api.com/api';

// App Colors
export const COLORS = {
  primary: '#2E86AB',
  secondary: '#A23B72',
  accent: '#F18F01',
  background: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6C757D',
  lightGray: '#E9ECEF',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
};

// App Fonts
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

// Font Sizes
export const FONT_SIZES = {
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 20,
  title: 24,
  header: 28,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Screen Dimensions
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

// Room Status
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Payment Types
export const PAYMENT_TYPES = {
  RENT: 'rent',
  SECURITY_DEPOSIT: 'security_deposit',
  MAINTENANCE: 'maintenance',
};

// Complaint Status
export const COMPLAINT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Complaint Categories
export const COMPLAINT_CATEGORIES = {
  ELECTRICAL: 'electrical',
  PLUMBING: 'plumbing',
  CLEANLINESS: 'cleanliness',
  SECURITY: 'security',
  OTHER: 'other',
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Notice Categories
export const NOTICE_CATEGORIES = {
  GENERAL: 'general',
  MAINTENANCE: 'maintenance',
  EVENTS: 'events',
  URGENT: 'urgent',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  REMEMBER_ME: 'rememberMe',
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
  NAME_REGEX: /^[a-zA-Z\s]+$/,
  PASSWORD_MIN_LENGTH: 6,
  STUDENT_PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  ADMIN_PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
  ADMIN_PASSWORD_MIN_LENGTH: 8,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

// Image Upload
export const IMAGE_CONFIG = {
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
  QUALITY: 0.8,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
};