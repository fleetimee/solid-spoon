import {
  getUserReservations,
  getUserReservationsLegacy,
  UserReservation,
  PaginatedUserReservations,
  ReservationFilter,
} from "@/features/reservations/api/getUserReservations";
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

describe("getUserReservations (Paginated)", () => {
  beforeEach(() => {
    mockQuery.mockClear();
    console.error = jest.fn();
  });

  const mockReservationRow = {
    id: "1",
    title: "Team Meeting",
    description: "Weekly team sync",
    start_time: "2024-12-20T09:00:00Z",
    end_time: "2024-12-20T10:00:00Z",
    created_at: "2024-12-19T10:00:00Z",
    roomName: "Conference Room A",
    status: "PENDING",
  };

  describe("successful pagination queries", () => {
    it("should fetch user reservations with default pagination", async () => {
      // Mock count query
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      // Mock data query
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockReservationRow])
      );

      const result = await getUserReservations("user-123");

      expect(result.reservations).toHaveLength(1);
      expect(result.pagination).toEqual({
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        pageSize: 12,
      });
      expect(result.reservations[0]).toMatchObject({
        id: "1",
        title: "Team Meeting",
        description: "Weekly team sync",
        startTime: new Date("2024-12-20T09:00:00Z"),
        endTime: new Date("2024-12-20T10:00:00Z"),
        createdAt: new Date("2024-12-19T10:00:00Z"),
        roomName: "Conference Room A",
        status: "PENDING",
      });
    });

    it("should fetch user reservations with custom pagination", async () => {
      // Mock count query
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "25" }]));
      // Mock data query
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockReservationRow])
      );

      const result = await getUserReservations("user-123", {
        page: 2,
        pageSize: 10,
        filter: "approved",
      });

      expect(result.pagination).toEqual({
        totalItems: 25,
        totalPages: 3,
        currentPage: 2,
        pageSize: 10,
      });

      // Verify correct SQL calls
      expect(mockQuery).toHaveBeenCalledTimes(2);
      // First call should be count query
      expect(mockQuery.mock.calls[0][0]).toContain("COUNT(*)");
      // Second call should include OFFSET and LIMIT
      expect(mockQuery.mock.calls[1][0]).toContain("OFFSET");
      expect(mockQuery.mock.calls[1][0]).toContain("LIMIT");
      expect(mockQuery.mock.calls[1][1]).toContain(10); // OFFSET value (page 2, pageSize 10 = offset 10)
      expect(mockQuery.mock.calls[1][1]).toContain(10); // LIMIT value
    });

    it("should handle filter parameters correctly", async () => {
      // Mock count query
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "5" }]));
      // Mock data query
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockReservationRow])
      );

      await getUserReservations("user-123", {
        filter: "approved",
      });

      // Verify filter is applied in both queries
      expect(mockQuery.mock.calls[0][0]).toContain("LOWER(l.value) = $2");
      expect(mockQuery.mock.calls[0][1]).toContain("approved");
      expect(mockQuery.mock.calls[1][0]).toContain("LOWER(l.value) = $2");
      expect(mockQuery.mock.calls[1][1]).toContain("approved");
    });

    it("should handle empty result set with pagination", async () => {
      // Mock count query
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "0" }]));
      // Mock data query
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getUserReservations("user-with-no-reservations");

      expect(result.reservations).toHaveLength(0);
      expect(result.pagination).toEqual({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 12,
      });
    });
  });

  describe("error handling", () => {
    it("should throw error when database query fails", async () => {
      mockQuery.mockRejectedValueOnce(
        createMockDBError("Database connection failed")
      );

      await expect(getUserReservations("user-123")).rejects.toThrow(
        "Database connection failed"
      );
    });

    it("should handle count query failure", async () => {
      // Count query fails
      mockQuery.mockRejectedValueOnce(
        createMockDBError("Database connection failed")
      );

      await expect(getUserReservations("user-123")).rejects.toThrow(
        "Database connection failed"
      );
    });

    it("should handle data query failure", async () => {
      // Count query succeeds
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      // Data query fails
      mockQuery.mockRejectedValueOnce(
        createMockDBError("Database connection failed")
      );

      await expect(getUserReservations("user-123")).rejects.toThrow(
        "Failed to fetch user reservations."
      );

      expect(console.error).toHaveBeenCalledWith(
        "Database Error: Failed to fetch user reservations.",
        expect.any(Error)
      );
    });
  });

  describe("pagination calculations", () => {
    it("should calculate total pages correctly", async () => {
      // Mock count query - 27 total items
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "27" }]));
      // Mock data query
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockReservationRow])
      );

      const result = await getUserReservations("user-123", {
        pageSize: 10,
      });

      expect(result.pagination.totalPages).toBe(3); // Math.ceil(27/10) = 3
    });
  });
});

describe("getUserReservationsLegacy (Backward Compatibility)", () => {
  beforeEach(() => {
    mockQuery.mockClear();
    console.error = jest.fn();
  });

  const mockReservationRow = {
    id: "1",
    title: "Team Meeting",
    description: "Weekly team sync",
    start_time: "2024-12-20T09:00:00Z",
    end_time: "2024-12-20T10:00:00Z",
    created_at: "2024-12-19T10:00:00Z",
    roomName: "Conference Room A",
    status: "PENDING",
  };

  it("should return flat array for backward compatibility", async () => {
    // Mock count query
    mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
    // Mock data query
    mockQuery.mockResolvedValueOnce(
      createMockQueryResult([mockReservationRow])
    );

    const result = await getUserReservationsLegacy("user-123");

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "1",
      title: "Team Meeting",
      description: "Weekly team sync",
      startTime: new Date("2024-12-20T09:00:00Z"),
      endTime: new Date("2024-12-20T10:00:00Z"),
      createdAt: new Date("2024-12-19T10:00:00Z"),
      roomName: "Conference Room A",
      status: "PENDING",
    });
  });

  it("should use large pageSize to fetch all records", async () => {
    // Mock count query
    mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "500" }]));
    // Mock data query
    mockQuery.mockResolvedValueOnce(
      createMockQueryResult([mockReservationRow])
    );

    await getUserReservationsLegacy("user-123");

    // Verify it uses pageSize of 1000
    expect(mockQuery.mock.calls[1][1]).toContain(1000);
  });
});
