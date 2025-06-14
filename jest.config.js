/**
 * Modern Jest Configuration for Jest 30.0.0+
 * Compatible with VS Code Jest extension and CLI execution
 */
module.exports = {
  // Core configuration
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Transform configuration - updated for Jest 30.0.0
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  
  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.test.ts'],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))',
  ],
  
  // Test file patterns - using testMatch instead of deprecated options
  testMatch: [
    '<rootDir>/tests/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
  ],
  
  // Explicitly exclude certain patterns to avoid conflicts
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/types/**',
    '!src/app/**', // Exclude Next.js app directory
    '!src/components/**', // Focus on business logic
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75,
    },
    './src/features/**/api/': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './src/lib/': {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Performance and behavior settings
  testTimeout: 10000,
  verbose: true,
  
  // Modern Jest 30.0.0 compatibility settings
  extensionsToTreatAsEsm: [],
  globals: {},
  
  // Ensure proper handling of ES modules and CommonJS
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Watch mode configuration for better VS Code integration
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/coverage/',
  ],
  
  // Error handling
  errorOnDeprecated: false, // Set to false to prevent VS Code extension issues
  
  // Cache configuration for better performance
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
};
