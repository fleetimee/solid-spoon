import {
  getAllReservations,
  ReservationWithDetails,
} from "@/features/reservations/api/getAllReservations";
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

describe("getAllReservations", () => {
  const mockReservationData: ReservationWithDetails = {
    id: "1",
    title: "Team Meeting",
    description: "Weekly team sync",
    userName: "John Doe",
    userEmail: "john@example.com",
    userImage: "https://example.com/avatar.jpg",
    roomName: "Conference Room A",
    startTime: new Date("2024-12-20T09:00:00Z"),
    endTime: new Date("2024-12-20T10:00:00Z"),
    status: "Pending",
    createdAt: new Date("2024-12-19T10:00:00Z"),
    approverName: null,
    approvedAt: null,
    rejectionReason: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe("Basic Functionality", () => {
    it("should fetch all reservations with default pagination", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ totalCount: "5" }])) // Count query
        .mockResolvedValueOnce(createMockQueryResult([mockReservationData])); // Data query

      // Act
      const result = await getAllReservations();

      // Assert
      expect(result).toEqual({
        data: [mockReservationData],
        totalCount: 5,
      });

      expect(mockQuery).toHaveBeenCalledTimes(2);
      // Check count query
      expect(mockQuery.mock.calls[0][0]).toContain(
        'SELECT COUNT(*) as "totalCount"'
      );
      // Check data query with default pagination
      expect(mockQuery.mock.calls[1][0]).toContain("LIMIT $1 OFFSET $2");
      expect(mockQuery.mock.calls[1][1]).toEqual([10, 0]); // Default pageSize=10, offset=0
    });

    it("should handle empty results", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ totalCount: "0" }]))
        .mockResolvedValueOnce(createMockQueryResult([]));

      // Act
      const result = await getAllReservations();

      // Assert
      expect(result).toEqual({
        data: [],
        totalCount: 0,
      });
    });
  });

  describe("Filtering", () => {
    beforeEach(() => {
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ totalCount: "1" }]))
        .mockResolvedValueOnce(createMockQueryResult([mockReservationData]));
    });

    it("should filter by search term", async () => {
      // Act
      await getAllReservations({ search: "John" });

      // Assert
      const countQuery = mockQuery.mock.calls[0][0];
      const dataQuery = mockQuery.mock.calls[1][0];

      expect(countQuery).toContain(
        "AND (u.name ILIKE '%' || $1 || '%' OR rr.id::text ILIKE '%' || $1 || '%')"
      );
      expect(dataQuery).toContain(
        "AND (u.name ILIKE '%' || $1 || '%' OR rr.id::text ILIKE '%' || $1 || '%')"
      );
      expect(mockQuery.mock.calls[0][1]).toEqual(["John"]);
    });

    it("should filter by room ID", async () => {
      // Act
      await getAllReservations({ roomId: 5 });

      // Assert
      const countQuery = mockQuery.mock.calls[0][0];
      const dataQuery = mockQuery.mock.calls[1][0];

      expect(countQuery).toContain("AND rr.room_id = $1");
      expect(dataQuery).toContain("AND rr.room_id = $1");
      expect(mockQuery.mock.calls[0][1]).toEqual([5]);
    });

    it("should filter by status ID", async () => {
      // Act
      await getAllReservations({ statusId: 2 });

      // Assert
      const countQuery = mockQuery.mock.calls[0][0];
      const dataQuery = mockQuery.mock.calls[1][0];

      expect(countQuery).toContain("AND rr.status_id = $1");
      expect(dataQuery).toContain("AND rr.status_id = $1");
      expect(mockQuery.mock.calls[0][1]).toEqual([2]);
    });

    it("should apply multiple filters", async () => {
      // Act
      await getAllReservations({
        search: "meeting",
        roomId: 3,
        statusId: 1,
      });

      // Assert
      const countParams = mockQuery.mock.calls[0][1];
      const dataParams = mockQuery.mock.calls[1][1];

      expect(countParams).toEqual(["meeting", 3, 1]);
      expect(dataParams).toEqual(["meeting", 3, 1, 10, 0]); // includes pagination
    });
  });

  describe("Sorting", () => {
    beforeEach(() => {
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ totalCount: "1" }]))
        .mockResolvedValueOnce(createMockQueryResult([mockReservationData]));
    });

    it("should sort by user name ascending", async () => {
      // Act
      await getAllReservations({}, { sortBy: "userName", sortOrder: "asc" });

      // Assert
      const dataQuery = mockQuery.mock.calls[1][0];
      expect(dataQuery).toContain("ORDER BY u.name ASC");
      expect(dataQuery).toContain(", rr.start_time ASC"); // Secondary sort
    });

    it("should sort by room name descending", async () => {
      // Act
      await getAllReservations({}, { sortBy: "roomName", sortOrder: "desc" });

      // Assert
      const dataQuery = mockQuery.mock.calls[1][0];
      expect(dataQuery).toContain("ORDER BY r.name DESC");
      expect(dataQuery).toContain(", rr.start_time ASC");
    });

    it("should sort by start time without secondary sort", async () => {
      // Act
      await getAllReservations({}, { sortBy: "startTime", sortOrder: "desc" });

      // Assert
      const dataQuery = mockQuery.mock.calls[1][0];
      expect(dataQuery).toContain("ORDER BY rr.start_time DESC");
      expect(dataQuery).not.toContain(", rr.start_time ASC");
    });

    it("should use default sort when invalid sortBy provided", async () => {
      // Act
      await getAllReservations(
        {},
        { sortBy: "invalidField", sortOrder: "asc" }
      );

      // Assert
      const dataQuery = mockQuery.mock.calls[1][0];
      expect(dataQuery).toContain(
        "ORDER BY rr.created_at DESC, rr.start_time ASC"
      );
    });

    it("should default to ascending when invalid sortOrder provided", async () => {
      // Act
      await getAllReservations(
        {},
        { sortBy: "userName", sortOrder: "invalid" as any }
      );

      // Assert
      const dataQuery = mockQuery.mock.calls[1][0];
      expect(dataQuery).toContain("ORDER BY u.name ASC");
    });
  });

  describe("Pagination", () => {
    beforeEach(() => {
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ totalCount: "25" }]))
        .mockResolvedValueOnce(createMockQueryResult([mockReservationData]));
    });

    it("should handle custom page and page size", async () => {
      // Act
      await getAllReservations({}, {}, { page: 3, pageSize: 5 });

      // Assert
      const dataParams = mockQuery.mock.calls[1][1];
      expect(dataParams).toContain(5); // LIMIT
      expect(dataParams).toContain(10); // OFFSET (page-1)*pageSize = 2*5
    });

    it("should handle page 1 with zero offset", async () => {
      // Act
      await getAllReservations({}, {}, { page: 1, pageSize: 15 });

      // Assert
      const dataParams = mockQuery.mock.calls[1][1];
      expect(dataParams).toContain(15); // LIMIT
      expect(dataParams).toContain(0); // OFFSET
    });

    it("should use default values for undefined pagination", async () => {
      // Act
      await getAllReservations(
        {},
        {},
        { page: undefined, pageSize: undefined }
      );

      // Assert
      const dataParams = mockQuery.mock.calls[1][1];
      expect(dataParams).toContain(10); // Default pageSize
      expect(dataParams).toContain(0); // Default offset
    });
  });

  describe("Error Handling", () => {
    it("should handle count query error", async () => {
      // Arrange
      mockQuery.mockRejectedValueOnce(createMockDBError("Count query failed"));

      // Act
      const result = await getAllReservations();

      // Assert
      expect(result).toEqual({
        data: [],
        totalCount: 0,
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching reservation count:",
        expect.any(Error)
      );
    });

    it("should handle data query error", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ totalCount: "5" }]))
        .mockRejectedValueOnce(createMockDBError("Data query failed"));

      // Act
      const result = await getAllReservations();

      // Assert
      expect(result).toEqual({
        data: [],
        totalCount: 0,
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching reservations:",
        expect.any(Error)
      );
    });

    it("should handle invalid count result", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ totalCount: null }]))
        .mockResolvedValueOnce(createMockQueryResult([mockReservationData]));

      // Act
      const result = await getAllReservations();

      // Assert
      expect(result.totalCount).toBe(0); // Should default to 0
      expect(result.data).toEqual([mockReservationData]);
    });

    it("should handle missing count result", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([]))
        .mockResolvedValueOnce(createMockQueryResult([mockReservationData]));

      // Act
      const result = await getAllReservations();

      // Assert
      expect(result.totalCount).toBe(0);
      expect(result.data).toEqual([mockReservationData]);
    });
  });

  describe("Complex Queries", () => {
    it("should build complex query with all parameters", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ totalCount: "50" }]))
        .mockResolvedValueOnce(createMockQueryResult([mockReservationData]));

      // Act
      await getAllReservations(
        { search: "team", roomId: 2, statusId: 1 },
        { sortBy: "createdAt", sortOrder: "desc" },
        { page: 2, pageSize: 20 }
      );

      // Assert
      const countParams = mockQuery.mock.calls[0][1];
      const dataParams = mockQuery.mock.calls[1][1];

      // Count query should have filter params only
      expect(countParams).toEqual(["team", 2, 1]);

      // Data query should have filter + pagination params
      expect(dataParams).toEqual(["team", 2, 1, 20, 20]); // pageSize=20, offset=20

      const dataQuery = mockQuery.mock.calls[1][0];
      expect(dataQuery).toContain("ORDER BY rr.created_at DESC");
    });

    it("should handle all reservation fields in result", async () => {
      // Arrange
      const completeReservation: ReservationWithDetails = {
        ...mockReservationData,
        approverName: "Admin User",
        approvedAt: new Date("2024-12-19T12:00:00Z"),
        rejectionReason: null,
      };

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ totalCount: "1" }]))
        .mockResolvedValueOnce(createMockQueryResult([completeReservation]));

      // Act
      const result = await getAllReservations();

      // Assert
      expect(result.data[0]).toEqual(completeReservation);
      expect(result.data[0].approverName).toBe("Admin User");
      expect(result.data[0].approvedAt).toBeInstanceOf(Date);
    });
  });

  describe("SQL Query Structure", () => {
    beforeEach(() => {
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ totalCount: "1" }]))
        .mockResolvedValueOnce(createMockQueryResult([mockReservationData]));
    });

    it("should include all required table joins", async () => {
      // Act
      await getAllReservations();

      // Assert
      const dataQuery = mockQuery.mock.calls[1][0];
      expect(dataQuery).toContain("FROM room_reservation rr");
      expect(dataQuery).toContain("JOIN room r ON rr.room_id = r.id");
      expect(dataQuery).toContain('LEFT JOIN "user" u ON rr.user_id = u.id');
      expect(dataQuery).toContain(
        'LEFT JOIN "user" approver_user ON rr.approver_id = approver_user.id'
      );
      expect(dataQuery).toContain("JOIN lookup l ON rr.status_id = l.id");
    });

    it("should select all required fields", async () => {
      // Act
      await getAllReservations();

      // Assert
      const dataQuery = mockQuery.mock.calls[1][0];
      const expectedFields = [
        "rr.id",
        "rr.title",
        "rr.description",
        'u.name AS "userName"',
        'u.email AS "userEmail"',
        'u.image AS "userImage"',
        'r.name AS "roomName"',
        'rr.start_time AS "startTime"',
        'rr.end_time AS "endTime"',
        "l.value AS status",
        'rr.created_at AS "createdAt"',
        'approver_user.name AS "approverName"',
        'rr.approved_at AS "approvedAt"',
        'rr.rejection_reason AS "rejectionReason"',
      ];

      expectedFields.forEach((field) => {
        expect(dataQuery).toContain(field);
      });
    });

    it("should include lookup category filter", async () => {
      // Act
      await getAllReservations();

      // Assert
      const countQuery = mockQuery.mock.calls[0][0];
      const dataQuery = mockQuery.mock.calls[1][0];

      expect(countQuery).toContain("WHERE l.category = 'reservation_status'");
      expect(dataQuery).toContain("WHERE l.category = 'reservation_status'");
    });
  });
});
