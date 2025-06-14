import {
  getLookupValue,
  getLookupsByCategory,
  getReservationStatuses,
} from "@/features/application/api/getLookupValue";
import {
  testData,
  createMockQueryResult,
  createMockDBError,
} from "./setup.test";

// Mock the db module
jest.mock("@/lib/db");

import db from "@/lib/db";

// Cast to get access to the mock function
const mockQuery = (db as any).query;

describe("getLookupValue", () => {
  beforeEach(() => {
    mockQuery.mockClear();
    console.error = jest.fn();
  });

  describe("getLookupValue", () => {
    it("should return lookup value when found", async () => {
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([{ value: "Test Value" }])
      );

      const result = await getLookupValue("TEST_CODE");

      expect(result).toBe("Test Value");
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT value FROM lookup WHERE code = $1 AND is_active = TRUE LIMIT 1",
        ["TEST_CODE"]
      );
    });

    it("should return null when no lookup found", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getLookupValue("NONEXISTENT_CODE");

      expect(result).toBeNull();
    });

    it("should return null when code is empty", async () => {
      const result = await getLookupValue("");

      expect(result).toBeNull();
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("should return null on database error", async () => {
      mockQuery.mockRejectedValueOnce(
        createMockDBError("Database connection failed")
      );

      const result = await getLookupValue("TEST_CODE");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching lookup value for code "TEST_CODE":',
        expect.any(Error)
      );
    });

    it("should handle null values properly", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ value: null }]));

      const result = await getLookupValue("NULL_VALUE_CODE");

      expect(result).toBeNull();
    });
  });

  describe("getLookupsByCategory", () => {
    it("should return array of lookup objects for valid category", async () => {
      const mockLookups = [
        { id: 1, value: "Option 1" },
        { id: 2, value: "Option 2" },
      ];

      mockQuery.mockResolvedValueOnce(createMockQueryResult(mockLookups));

      const result = await getLookupsByCategory("test_category");

      expect(result).toEqual(mockLookups);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT id, value"),
        ["test_category"]
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE category = $1 AND is_active = TRUE"),
        ["test_category"]
      );
    });

    it("should return empty array on database error", async () => {
      mockQuery.mockRejectedValueOnce(createMockDBError("Connection timeout"));

      const result = await getLookupsByCategory("error_category");

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching lookup values for category "error_category":',
        expect.any(Error)
      );
    });

    it("should return empty array when no lookups found", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getLookupsByCategory("empty_category");

      expect(result).toEqual([]);
    });

    it("should include sort_order in query", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getLookupsByCategory("sorted_category");

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("ORDER BY sort_order, value"),
        ["sorted_category"]
      );
    });
  });

  describe("getReservationStatuses", () => {
    it("should call getLookupsByCategory with reservation_status", async () => {
      const mockStatuses = [
        { id: 1, value: "PENDING" },
        { id: 2, value: "APPROVED" },
        { id: 3, value: "REJECTED" },
      ];

      mockQuery.mockResolvedValueOnce(createMockQueryResult(mockStatuses));

      const result = await getReservationStatuses();

      expect(result).toEqual(mockStatuses);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE category = $1"),
        ["reservation_status"]
      );
    });

    it("should handle errors gracefully", async () => {
      mockQuery.mockRejectedValueOnce(createMockDBError("Database error"));

      const result = await getReservationStatuses();

      expect(result).toEqual([]);
    });
  });
});
