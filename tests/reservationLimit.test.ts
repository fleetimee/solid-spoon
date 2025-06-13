import type { QueryResult } from "pg";

// Define the interface for lookup results
interface LookupResult {
  value: string | null;
}

// Mock the db module
jest.mock("@/lib/db");

import { getReservationLimit } from "@/features/application/api/getReservationLimit";
// Import the entire mocked module
import db from "@/lib/db";

// Cast to get access to the mock function
const mockQuery = (db as any).query;

describe("getReservationLimit", () => {
  // Store original console.error to restore after tests
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Reset mock calls before each test
    mockQuery.mockClear();

    // Mock console.error to suppress unwanted error messages during tests
    console.error = jest.fn();
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
