import {
  getReservationStats,
  ReservationStats,
} from "@/features/reservations/api/getReservationStats";
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

describe("getReservationStats", () => {
  const mockStatsRow = {
    total_reservations: "25",
    pending_count: "5",
    approved_count: "15",
    rejected_count: "5",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe("Successful Stats Retrieval", () => {
    it("should return reservation statistics", async () => {
      // Arrange
      mockQuery.mockResolvedValue(createMockQueryResult([mockStatsRow]));

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 25,
        pendingCount: 5,
        approvedCount: 15,
        rejectedCount: 5,
      });
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it("should convert string counts to numbers", async () => {
      // Arrange
      const stringStatsRow = {
        total_reservations: "100",
        pending_count: "10",
        approved_count: "75",
        rejected_count: "15",
      };
      mockQuery.mockResolvedValue(createMockQueryResult([stringStatsRow]));

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result.totalReservations).toBe(100);
      expect(result.pendingCount).toBe(10);
      expect(result.approvedCount).toBe(75);
      expect(result.rejectedCount).toBe(15);
      expect(typeof result.totalReservations).toBe("number");
      expect(typeof result.pendingCount).toBe("number");
      expect(typeof result.approvedCount).toBe("number");
      expect(typeof result.rejectedCount).toBe("number");
    });

    it("should handle zero counts", async () => {
      // Arrange
      const zeroStatsRow = {
        total_reservations: "0",
        pending_count: "0",
        approved_count: "0",
        rejected_count: "0",
      };
      mockQuery.mockResolvedValue(createMockQueryResult([zeroStatsRow]));

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
      });
    });

    it("should handle large numbers", async () => {
      // Arrange
      const largeStatsRow = {
        total_reservations: "999999",
        pending_count: "100000",
        approved_count: "800000",
        rejected_count: "99999",
      };
      mockQuery.mockResolvedValue(createMockQueryResult([largeStatsRow]));

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result.totalReservations).toBe(999999);
      expect(result.pendingCount).toBe(100000);
      expect(result.approvedCount).toBe(800000);
      expect(result.rejectedCount).toBe(99999);
    });
  });

  describe("Default Value Handling", () => {
    it("should handle null values", async () => {
      // Arrange
      const nullStatsRow = {
        total_reservations: null,
        pending_count: null,
        approved_count: null,
        rejected_count: null,
      };
      mockQuery.mockResolvedValue(createMockQueryResult([nullStatsRow]));

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
      });
    });

    it("should handle undefined values", async () => {
      // Arrange
      const undefinedStatsRow = {}; // All fields undefined
      mockQuery.mockResolvedValue(createMockQueryResult([undefinedStatsRow]));

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
      });
    });

    it("should handle mixed null and valid values", async () => {
      // Arrange
      const mixedStatsRow = {
        total_reservations: "10",
        pending_count: null,
        approved_count: "8",
        rejected_count: null,
      };
      mockQuery.mockResolvedValue(createMockQueryResult([mixedStatsRow]));

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 10,
        pendingCount: 0,
        approvedCount: 8,
        rejectedCount: 0,
      });
    });

    it("should handle empty string values", async () => {
      // Arrange
      const emptyStatsRow = {
        total_reservations: "",
        pending_count: "",
        approved_count: "",
        rejected_count: "",
      };
      mockQuery.mockResolvedValue(createMockQueryResult([emptyStatsRow]));

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
      });
    });

    it("should handle no result rows", async () => {
      // Arrange
      mockQuery.mockResolvedValue(createMockQueryResult([]));

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
      });
    });
  });

  describe("SQL Query Structure", () => {
    beforeEach(() => {
      mockQuery.mockResolvedValue(createMockQueryResult([mockStatsRow]));
    });

    it("should use correct table joins", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("FROM room_reservation rr");
      expect(query).toContain("JOIN lookup l ON rr.status_id = l.id");
    });

    it("should filter by reservation status category", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("WHERE l.category = 'reservation_status'");
    });

    it("should count total reservations", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("COUNT(*) as total_reservations");
    });

    it("should count pending reservations", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain(
        "COUNT(CASE WHEN l.value = 'Pending' THEN 1 END) as pending_count"
      );
    });

    it("should count approved reservations", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain(
        "COUNT(CASE WHEN l.value = 'Approved' THEN 1 END) as approved_count"
      );
    });

    it("should count rejected and cancelled reservations", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain(
        "COUNT(CASE WHEN l.value IN ('Rejected', 'Cancelled') THEN 1 END) as rejected_count"
      );
    });

    it("should use conditional aggregation", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("CASE WHEN");
      expect(query).toContain("THEN 1 END");
    });
  });

  describe("Error Handling", () => {
    it("should return zero stats on database error", async () => {
      // Arrange
      mockQuery.mockRejectedValue(
        createMockDBError("Database connection failed")
      );

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching reservation stats:",
        expect.any(Error)
      );
    });

    it("should return zero stats on query timeout", async () => {
      // Arrange
      const timeoutError = new Error("Query timeout");
      mockQuery.mockRejectedValue(timeoutError);

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching reservation stats:",
        timeoutError
      );
    });

    it("should return zero stats on constraint violation", async () => {
      // Arrange
      const constraintError = createMockDBError("Constraint violation");
      mockQuery.mockRejectedValue(constraintError);

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
      });
    });

    it("should return zero stats on connection lost", async () => {
      // Arrange
      const connectionError = new Error("Connection lost");
      mockQuery.mockRejectedValue(connectionError);

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result).toEqual({
        totalReservations: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
      });
    });
  });

  describe("Data Integrity", () => {
    it("should ensure total equals sum of individual counts", async () => {
      // Arrange
      const consistentStatsRow = {
        total_reservations: "20", // 5 + 10 + 5 = 20
        pending_count: "5",
        approved_count: "10",
        rejected_count: "5",
      };
      mockQuery.mockResolvedValue(createMockQueryResult([consistentStatsRow]));

      // Act
      const result = await getReservationStats();

      // Assert
      const sum =
        result.pendingCount + result.approvedCount + result.rejectedCount;
      expect(result.totalReservations).toBe(sum);
    });

    it("should handle inconsistent counts gracefully", async () => {
      // Arrange - Intentionally inconsistent data
      const inconsistentStatsRow = {
        total_reservations: "100",
        pending_count: "10",
        approved_count: "20",
        rejected_count: "30",
        // Sum is 60, but total is 100 - this could happen due to data issues
      };
      mockQuery.mockResolvedValue(
        createMockQueryResult([inconsistentStatsRow])
      );

      // Act
      const result = await getReservationStats();

      // Assert
      expect(result.totalReservations).toBe(100);
      expect(result.pendingCount).toBe(10);
      expect(result.approvedCount).toBe(20);
      expect(result.rejectedCount).toBe(30);
      // Function should return what database returns, not validate consistency
    });
  });

  describe("Performance Considerations", () => {
    it("should execute single query for all stats", async () => {
      // Arrange
      mockQuery.mockResolvedValue(createMockQueryResult([mockStatsRow]));

      // Act
      await getReservationStats();

      // Assert
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it("should use aggregation instead of multiple queries", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("COUNT(CASE WHEN");
      expect(query.split("COUNT").length).toBeGreaterThan(1); // Multiple COUNT operations
    });

    it("should not use subqueries for counts", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).not.toContain("SELECT COUNT(*) FROM");
      expect(query.split("SELECT").length).toBe(2); // Only one SELECT
    });
  });

  describe("Status Value Handling", () => {
    it("should handle case-sensitive status values", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("l.value = 'Pending'");
      expect(query).toContain("l.value = 'Approved'");
      expect(query).toContain("l.value IN ('Rejected', 'Cancelled')");
    });

    it("should include both Rejected and Cancelled in rejected count", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("IN ('Rejected', 'Cancelled')");
    });

    it("should use exact string matching", async () => {
      // Act
      await getReservationStats();

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).not.toContain("ILIKE");
      expect(query).not.toContain("LOWER");
      expect(query).toContain("=");
    });
  });

  describe("Return Type Validation", () => {
    it("should return correct TypeScript interface", async () => {
      // Arrange
      mockQuery.mockResolvedValue(createMockQueryResult([mockStatsRow]));

      // Act
      const result: ReservationStats = await getReservationStats();

      // Assert
      expect(result).toHaveProperty("totalReservations");
      expect(result).toHaveProperty("pendingCount");
      expect(result).toHaveProperty("approvedCount");
      expect(result).toHaveProperty("rejectedCount");

      expect(typeof result.totalReservations).toBe("number");
      expect(typeof result.pendingCount).toBe("number");
      expect(typeof result.approvedCount).toBe("number");
      expect(typeof result.rejectedCount).toBe("number");
    });

    it("should not have extra properties", async () => {
      // Arrange
      mockQuery.mockResolvedValue(createMockQueryResult([mockStatsRow]));

      // Act
      const result = await getReservationStats();

      // Assert
      const expectedKeys = [
        "totalReservations",
        "pendingCount",
        "approvedCount",
        "rejectedCount",
      ];
      const actualKeys = Object.keys(result);
      expect(actualKeys).toEqual(expect.arrayContaining(expectedKeys));
      expect(actualKeys.length).toBe(expectedKeys.length);
    });
  });
});
