/**
 * Jest Test Setup and Configuration Tests
 * This file contains setup utilities and configuration tests for the solid-spoon project
 */

// Set up required environment variables BEFORE any imports
(process.env as any).NODE_ENV = "test";
process.env.RESEND_API_KEY = "test_resend_key";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.RECAPTCHA_SECRET_KEY = "test_recaptcha_key";

// Global test setup - runs before all tests
beforeAll(() => {
  // Suppress console warnings in tests unless explicitly needed
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    // Only show warnings in CI or when DEBUG=true
    if (process.env.CI || process.env.DEBUG) {
      originalWarn(...args);
    }
  };
});

// Setup for database mocking
jest.mock("@/lib/db");

/**
 * Test helper functions and utilities
 */

/**
 * Creates a mock database query result
 */
export const createMockQueryResult = <T>(rows: T[], rowCount?: number) => ({
  rows,
  rowCount: rowCount ?? rows.length,
  command: "SELECT",
  oid: 0,
  fields: [],
});

/**
 * Creates a mock database error
 */
export const createMockDBError = (message: string) => {
  const error = new Error(message);
  (error as any).code = "23505"; // Example constraint violation
  return error;
};

/**
 * Test data factories
 */
export const testData = {
  lookup: {
    reservationLimit: { value: "5" },
    appName: { value: "Test App", description: "Test Description" },
    invalidValue: { value: "invalid" },
    nullValue: { value: null },
  },
  user: {
    validUser: {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
    },
  },
  room: {
    validRoom: {
      id: 1,
      name: "Conference Room A",
      location: "Floor 1",
      capacity: 10,
      description: "A modern conference room",
      facilities: "projector,whiteboard",
      slug: "conference-room-a",
      isActive: true,
      createdBy: "admin",
      updatedBy: "admin",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  },
  reservation: {
    validReservation: {
      id: "1",
      title: "Team Meeting",
      description: "Weekly team sync",
      startTime: new Date("2024-12-20T09:00:00Z"),
      endTime: new Date("2024-12-20T10:00:00Z"),
      createdAt: new Date("2024-12-19T10:00:00Z"),
      roomName: "Conference Room A",
      status: "PENDING",
    },
  },
  notification: {
    validNotification: {
      id: 1,
      recipient_id: "admin",
      title: "New Reservation",
      message: "A new reservation needs approval",
      isRead: false,
      type: "admin",
      link: "/admin/reservations",
      timestamp: new Date("2024-12-19T10:00:00Z"),
      priority: "normal",
      created_at: new Date("2024-12-19T10:00:00Z"),
    },
  },
};

describe("Test Setup Configuration", () => {
  it("should have proper test environment setup", () => {
    expect(process.env.NODE_ENV).toBe("test");
  });

  it("should have database mocking configured", async () => {
    const db = await import("@/lib/db");
    expect(db.default.query).toBeDefined();
    expect(jest.isMockFunction(db.default.query)).toBe(true);
  });

  it("should provide test data factories", () => {
    expect(testData.lookup).toBeDefined();
    expect(testData.user).toBeDefined();
    expect(testData.room).toBeDefined();
    expect(testData.reservation).toBeDefined();
    expect(testData.notification).toBeDefined();
  });
});
