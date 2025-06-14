/**
 * Mock for Next.js headers module
 * Provides test doubles for Next.js server-side headers functionality
 */

export const headers = jest.fn(() => Promise.resolve(new Headers()));

export default { headers };
