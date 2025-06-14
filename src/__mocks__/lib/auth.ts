/**
 * Mock for the auth module
 * Provides test doubles for authentication functions
 */

// Mock auth object
export const auth = {
  api: {
    getSession: jest.fn(),
  },
};

// Mock types that might be imported
export interface Session {
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

// Default export
export default auth;
