// Shared constants for CursorFlow application

export const APP_NAME = 'CursorFlow';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'PRD-to-Code platform combining Cursor IDE with v0 Platform API';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/json'
];

// Project Status
export const PROJECT_STATUSES = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'review',
  COMPLETED: 'completed'
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  TEAM_MEMBER: 'team_member'
} as const;

// Industries
export const INDUSTRIES = [
  'E-commerce',
  'SaaS',
  'Healthcare',
  'Education',
  'Finance',
  'Entertainment',
  'Travel',
  'Food & Beverage',
  'Real Estate',
  'Automotive',
  'Technology',
  'Manufacturing',
  'Retail',
  'Media',
  'Non-profit',
  'Other'
] as const;

// Target Audiences
export const TARGET_AUDIENCES = [
  'General Users',
  'Business Users',
  'Developers',
  'Students',
  'Healthcare Professionals',
  'Educators',
  'Financial Advisors',
  'Content Creators',
  'Small Business Owners',
  'Enterprise Users',
  'Mobile Users',
  'Desktop Users',
  'Remote Teams',
  'Local Customers',
  'International Users',
  'Other'
] as const;

// AI Analysis Types
export const AI_ANALYSIS_TYPES = {
  DESIGN: 'design',
  CODE: 'code',
  PERFORMANCE: 'performance',
  ACCESSIBILITY: 'accessibility',
  COMPREHENSIVE: 'comprehensive'
} as const;

// Severity Levels
export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

// Feature Priorities (MoSCoW)
export const FEATURE_PRIORITIES = {
  MUST_HAVE: 'must-have',
  SHOULD_HAVE: 'should-have',
  COULD_HAVE: 'could-have',
  WONT_HAVE: 'won\'t-have'
} as const;

// Effort Levels
export const EFFORT_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

// Risk Levels
export const RISK_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROJECT_CREATED: 'Project created successfully.',
  PROJECT_UPDATED: 'Project updated successfully.',
  PROJECT_DELETED: 'Project deleted successfully.',
  PRD_GENERATED: 'PRD generated successfully.',
  ANALYSIS_COMPLETED: 'Analysis completed successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.'
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_TEAM_SIZE: 1,
  MAX_TEAM_SIZE: 50
} as const;

// Cache Keys
export const CACHE_KEYS = {
  PROJECTS: 'projects',
  PROJECT: 'project',
  USER: 'user',
  PRD: 'prd',
  ANALYSIS: 'analysis',
  SETTINGS: 'settings'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language'
} as const;

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

// Language Options
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  JA: 'ja',
  ZH: 'zh'
} as const; 