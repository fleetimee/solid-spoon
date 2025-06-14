import { getPendingReservationCount } from "@/features/reservations/api/getPendingReservationCount";
import {
  testData,
  createMockQueryResult,
  createMockDBError,
} from "./setup.test";

// Mock dependencies
jest.mock("@/lib/db");

import db from "@/lib/db";

// Cast to get access to mock functions
const mockQuery = (db as any).query as jest.MockedFunction<any>;

describe("getPendingReservationCount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe("Successful Count Retrieval", () => {
    it("should return count of pending reservations for user and room", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }])) // Pending status lookup
        .mockResolvedValueOnce(createMockQueryResult([{ count: 3 }])); // Count query

      // Act
      const result = await getPendingReservationCount("user-123", 5);

      // Assert
      expect(result).toBe(3);
      expect(mockQuery).toHaveBeenCalledTimes(2);

      // Check lookup query
      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        "SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1",
        ["reservation_status", "PENDING"]
      );

      // Check count query
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("SELECT count(*)::int"),
        ["user-123", 5, 1]
      );
    });

    it("should return 0 when no pending reservations exist", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 0 }]));

      // Act
      const result = await getPendingReservationCount("user-456", 10);

      // Assert
      expect(result).toBe(0);
    });

    it("should handle null count result", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: null }]));

      // Act
      const result = await getPendingReservationCount("user-789", 15);

      // Assert
      expect(result).toBe(0);
    });

    it("should handle undefined count result", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{}])); // No count field

      // Act
      const result = await getPendingReservationCount("user-101", 20);

      // Assert
      expect(result).toBe(0);
    });

    it("should handle empty result set", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([])); // No rows

      // Act
      const result = await getPendingReservationCount("user-202", 25);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe("Status Lookup Handling", () => {
    it("should return 0 when PENDING status not found", async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce(createMockQueryResult([])); // No status found

      // Act
      const result = await getPendingReservationCount("user-123", 5);

      // Assert
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        "Could not find PENDING status in lookup table"
      );
      expect(mockQuery).toHaveBeenCalledTimes(1); // Only lookup query, no count query
    });

    it("should return 0 when lookup returns null id", async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ id: null }]));

      // Act
      const result = await getPendingReservationCount("user-123", 5);

      // Assert
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        "Could not find PENDING status in lookup table"
      );
    });

    it("should return 0 when lookup returns undefined id", async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{}])); // No id field

      // Act
      const result = await getPendingReservationCount("user-123", 5);

      // Assert
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        "Could not find PENDING status in lookup table"
      );
    });

    it("should use correct status lookup parameters", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 2 }]));

      // Act
      await getPendingReservationCount("user-123", 5);

      // Assert
      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        "SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1",
        ["reservation_status", "PENDING"]
      );
    });
  });

  describe("Parameter Handling", () => {
    beforeEach(() => {
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 1 }]));
    });

    it("should handle string user ID", async () => {
      // Act
      await getPendingReservationCount("user-string-id", 5);

      // Assert
      expect(mockQuery).toHaveBeenNthCalledWith(2, expect.any(String), [
        "user-string-id",
        5,
        1,
      ]);
    });

    it("should handle numeric room ID", async () => {
      // Act
      await getPendingReservationCount("user-123", 999);

      // Assert
      expect(mockQuery).toHaveBeenNthCalledWith(2, expect.any(String), [
        "user-123",
        999,
        1,
      ]);
    });

    it("should handle different status IDs", async () => {
      // Arrange - Reset mocks for different status ID
      mockQuery.mockClear();
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 42 }])) // Different status ID
        .mockResolvedValueOnce(createMockQueryResult([{ count: 5 }]));

      // Act
      await getPendingReservationCount("user-123", 5);

      // Assert
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        ["user-123", 5, 42] // Uses the looked-up status ID
      );
    });
  });

  describe("SQL Query Structure", () => {
    beforeEach(() => {
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 3 }]));
    });

    it("should use correct count query structure", async () => {
      // Act
      await getPendingReservationCount("user-123", 5);

      // Assert
      const countQuery = mockQuery.mock.calls[1][0];
      expect(countQuery).toContain("SELECT count(*)::int");
      expect(countQuery).toContain("FROM room_reservation");
      expect(countQuery).toContain(
        "WHERE user_id = $1 AND room_id = $2 AND status_id = $3"
      );
    });

    it("should cast count to integer", async () => {
      // Act
      await getPendingReservationCount("user-123", 5);

      // Assert
      const countQuery = mockQuery.mock.calls[1][0];
      expect(countQuery).toContain("count(*)::int");
    });

    it("should use parameterized queries", async () => {
      // Act
      await getPendingReservationCount("user-test", 100);

      // Assert
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("$1"),
        expect.arrayContaining(["user-test", 100])
      );
    });
  });

  describe("Error Handling", () => {
    it("should return 0 on lookup query error", async () => {
      // Arrange
      mockQuery.mockRejectedValueOnce(createMockDBError("Lookup query failed"));

      // Act
      const result = await getPendingReservationCount("user-123", 5);

      // Assert
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching pending reservation count:",
        expect.any(Error)
      );
    });

    it("should return 0 on count query error", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockRejectedValueOnce(createMockDBError("Count query failed"));

      // Act
      const result = await getPendingReservationCount("user-123", 5);

      // Assert
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching pending reservation count:",
        expect.any(Error)
      );
    });

    it("should return 0 on database connection error", async () => {
      // Arrange
      const connectionError = new Error("Database connection lost");
      mockQuery.mockRejectedValue(connectionError);

      // Act
      const result = await getPendingReservationCount("user-123", 5);

      // Assert
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching pending reservation count:",
        connectionError
      );
    });

    it("should return 0 on timeout error", async () => {
      // Arrange
      const timeoutError = new Error("Query timeout");
      mockQuery.mockRejectedValue(timeoutError);

      // Act
      const result = await getPendingReservationCount("user-123", 5);

      // Assert
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching pending reservation count:",
        timeoutError
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle large count values", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 999999 }]));

      // Act
      const result = await getPendingReservationCount("user-123", 5);

      // Assert
      expect(result).toBe(999999);
    });

    it("should handle zero room ID", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 0 }]));

      // Act
      const result = await getPendingReservationCount("user-123", 0);

      // Assert
      expect(result).toBe(0);
      expect(mockQuery).toHaveBeenNthCalledWith(2, expect.any(String), [
        "user-123",
        0,
        1,
      ]);
    });

    it("should handle empty user ID", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 0 }]));

      // Act
      const result = await getPendingReservationCount("", 5);

      // Assert
      expect(result).toBe(0);
      expect(mockQuery).toHaveBeenNthCalledWith(2, expect.any(String), [
        "",
        5,
        1,
      ]);
    });

    it("should handle negative room ID", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 0 }]));

      // Act
      const result = await getPendingReservationCount("user-123", -1);

      // Assert
      expect(result).toBe(0);
      expect(mockQuery).toHaveBeenNthCalledWith(2, expect.any(String), [
        "user-123",
        -1,
        1,
      ]);
    });

    it("should handle special characters in user ID", async () => {
      // Arrange
      const specialUserId = "user@domain.com";
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 2 }]));

      // Act
      const result = await getPendingReservationCount(specialUserId, 5);

      // Assert
      expect(result).toBe(2);
      expect(mockQuery).toHaveBeenNthCalledWith(2, expect.any(String), [
        specialUserId,
        5,
        1,
      ]);
    });
  });

  describe("Performance and Optimization", () => {
    it("should use LIMIT 1 in lookup query for performance", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 1 }]));

      // Act
      await getPendingReservationCount("user-123", 5);

      // Assert
      const lookupQuery = mockQuery.mock.calls[0][0];
      expect(lookupQuery).toContain("LIMIT 1");
    });

    it("should use integer casting for count performance", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]))
        .mockResolvedValueOnce(createMockQueryResult([{ count: 5 }]));

      // Act
      await getPendingReservationCount("user-123", 5);

      // Assert
      const countQuery = mockQuery.mock.calls[1][0];
      expect(countQuery).toContain("::int");
    });

    it("should minimize database queries when status not found", async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      // Act
      await getPendingReservationCount("user-123", 5);

      // Assert
      expect(mockQuery).toHaveBeenCalledTimes(1); // Only lookup, no count query
    });
  });
});
