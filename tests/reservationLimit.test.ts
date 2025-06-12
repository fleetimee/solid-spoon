import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import { getReservationLimit } from "@/features/application/api/getReservationLimit";
import type { QueryResult } from "pg";

// Define the interface for lookup results
interface LookupResult {
  value: string | null;
}

// Create a properly typed mock function that matches PostgreSQL's QueryResult interface
const mockQuery = mock<(...args: any[]) => Promise<QueryResult<LookupResult>>>(
  () =>
    Promise.resolve({
      rows: [] as LookupResult[],
      rowCount: 0,
      command: "SELECT",
      oid: 0,
      fields: [],
    })
);

// Mock the entire db module
mock.module("@/lib/db", () => ({
  default: {
    query: mockQuery,
  },
}));

describe("getReservationLimit", () => {
  // Store original console.error to restore after tests
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Reset mock calls before each test
    mockQuery.mockClear();

    // Mock console.error to suppress unwanted error messages during tests
    console.error = () => {
      // Error messages are suppressed during tests for clean output
    };
  });

  afterEach(() => {
    // Restore original console.error after each test
    console.error = originalConsoleError;
  });

  it("returns the limit from the database when available", async () => {
    // Mock successful database query
    mockQuery.mockResolvedValueOnce({
      rows: [{ value: "5" }],
      rowCount: 1,
      command: "SELECT",
      oid: 0,
      fields: [],
    });

    const result = await getReservationLimit();

    expect(result).toBe(5);
    expect(mockQuery).toHaveBeenCalledWith(
      `SELECT value FROM lookup WHERE category = 'application' AND code = 'RESERVATION_LIMIT' AND is_active = true LIMIT 1;`
    );
  });

  it("falls back to the default limit when query fails", async () => {
    // Mock database query failure
    mockQuery.mockRejectedValueOnce(new Error("db error"));

    const result = await getReservationLimit();

    expect(result).toBe(3);
    expect(mockQuery).toHaveBeenCalledWith(
      `SELECT value FROM lookup WHERE category = 'application' AND code = 'RESERVATION_LIMIT' AND is_active = true LIMIT 1;`
    );
  });

  it("falls back to default when no rows returned", async () => {
    // Mock empty result
    mockQuery.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
      command: "SELECT",
      oid: 0,
      fields: [],
    });

    const result = await getReservationLimit();

    expect(result).toBe(3);
  });

  it("falls back to default when value is null", async () => {
    // Mock null value
    mockQuery.mockResolvedValueOnce({
      rows: [{ value: null }],
      rowCount: 1,
      command: "SELECT",
      oid: 0,
      fields: [],
    });

    const result = await getReservationLimit();

    expect(result).toBe(3);
  });

  it("falls back to default when value is not a valid number", async () => {
    // Mock invalid number value
    mockQuery.mockResolvedValueOnce({
      rows: [{ value: "invalid" }],
      rowCount: 1,
      command: "SELECT",
      oid: 0,
      fields: [],
    });

    const result = await getReservationLimit();

    expect(result).toBe(3);
  });
});
