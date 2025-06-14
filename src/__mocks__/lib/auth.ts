/**
 * Mock for the auth module
 * Provides test doubles for authentication functions
 */

// Mock Resend to avoid API key issues
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn(),
    },
  })),
}));

// Mock better-auth plugins
jest.mock("better-auth/plugins", () => ({
  admin: jest.fn(),
  captcha: jest.fn(),
}));

jest.mock("better-auth/next-js", () => ({
  nextCookies: jest.fn(),
}));

jest.mock("better-auth", () => ({
  betterAuth: jest.fn().mockReturnValue({
    api: {
      getSession: jest.fn(),
    },
  }),
}));

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
    role?: string;
  };
}

// Default export
export default auth;
