import {
  getReservationById,
  DetailedReservation,
} from "@/features/reservations/api/getReservationById";
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

describe("getReservationById", () => {
  const mockDetailedReservation: DetailedReservation = {
    id: "1",
    title: "Team Meeting",
    description: "Weekly team sync",
    userId: "user-123",
    userName: "John Doe",
    userEmail: "john@example.com",
    userImage: "https://example.com/avatar.jpg",
    roomId: 5,
    roomName: "Conference Room A",
    roomSlug: "conference-room-a",
    startTime: new Date("2024-12-20T09:00:00Z"),
    endTime: new Date("2024-12-20T10:00:00Z"),
    statusId: 1,
    status: "Pending",
    statusColor: "#fbbf24",
    createdAt: new Date("2024-12-19T10:00:00Z"),
    approverId: null,
    approverName: null,
    approvedAt: null,
    rejectionReason: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe("Successful Retrieval", () => {
    it("should return detailed reservation when found", async () => {
      // Arrange
      mockQuery.mockResolvedValue(
        createMockQueryResult([mockDetailedReservation])
      );

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result).toEqual(mockDetailedReservation);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT"),
        ["1"]
      );
    });

    it("should return complete reservation with all fields", async () => {
      // Arrange
      const completeReservation: DetailedReservation = {
        ...mockDetailedReservation,
        approverId: "admin-456",
        approverName: "Admin User",
        approvedAt: new Date("2024-12-19T15:00:00Z"),
        rejectionReason: null,
      };

      mockQuery.mockResolvedValue(createMockQueryResult([completeReservation]));

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result).toEqual(completeReservation);
      expect(result?.approverId).toBe("admin-456");
      expect(result?.approverName).toBe("Admin User");
      expect(result?.approvedAt).toBeInstanceOf(Date);
    });

    it("should return rejected reservation with reason", async () => {
      // Arrange
      const rejectedReservation: DetailedReservation = {
        ...mockDetailedReservation,
        status: "Rejected",
        statusId: 4,
        approverId: "admin-456",
        approverName: "Admin User",
        approvedAt: null,
        rejectionReason: "Room not available at requested time",
      };

      mockQuery.mockResolvedValue(createMockQueryResult([rejectedReservation]));

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result).toEqual(rejectedReservation);
      expect(result?.status).toBe("Rejected");
      expect(result?.rejectionReason).toBe(
        "Room not available at requested time"
      );
      expect(result?.approvedAt).toBeNull();
    });
  });

  describe("Input Validation", () => {
    it("should return null for empty ID", async () => {
      // Act
      const result = await getReservationById("");

      // Assert
      expect(result).toBeNull();
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("should return null for null ID", async () => {
      // Act
      const result = await getReservationById(null as any);

      // Assert
      expect(result).toBeNull();
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("should return null for undefined ID", async () => {
      // Act
      const result = await getReservationById(undefined as any);

      // Assert
      expect(result).toBeNull();
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("should handle numeric ID string", async () => {
      // Arrange
      mockQuery.mockResolvedValue(
        createMockQueryResult([mockDetailedReservation])
      );

      // Act
      const result = await getReservationById("123");

      // Assert
      expect(result).toEqual(mockDetailedReservation);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE rr.id = $1"),
        ["123"]
      );
    });

    it("should handle UUID-style ID", async () => {
      // Arrange
      const uuidId = "550e8400-e29b-41d4-a716-446655440000";
      mockQuery.mockResolvedValue(
        createMockQueryResult([mockDetailedReservation])
      );

      // Act
      const result = await getReservationById(uuidId);

      // Assert
      expect(result).toEqual(mockDetailedReservation);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE rr.id = $1"),
        [uuidId]
      );
    });
  });

  describe("Not Found Cases", () => {
    it("should return null when reservation not found", async () => {
      // Arrange
      mockQuery.mockResolvedValue(createMockQueryResult([]));

      // Act
      const result = await getReservationById("999");

      // Assert
      expect(result).toBeNull();
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE rr.id = $1"),
        ["999"]
      );
    });

    it("should return null when query returns no rows", async () => {
      // Arrange
      mockQuery.mockResolvedValue(createMockQueryResult([], 0));

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("Error Handling", () => {
    it("should return null on database error", async () => {
      // Arrange
      mockQuery.mockRejectedValue(
        createMockDBError("Database connection failed")
      );

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch reservation by ID (1):",
        expect.any(Error)
      );
    });

    it("should return null on query timeout", async () => {
      // Arrange
      const timeoutError = new Error("Query timeout");
      mockQuery.mockRejectedValue(timeoutError);

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch reservation by ID (1):",
        timeoutError
      );
    });

    it("should return null on constraint violation error", async () => {
      // Arrange
      const constraintError = createMockDBError("Constraint violation");
      mockQuery.mockRejectedValue(constraintError);

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch reservation by ID (1):",
        constraintError
      );
    });
  });

  describe("SQL Query Structure", () => {
    beforeEach(() => {
      mockQuery.mockResolvedValue(
        createMockQueryResult([mockDetailedReservation])
      );
    });

    it("should use correct table joins", async () => {
      // Act
      await getReservationById("1");

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("FROM room_reservation rr");
      expect(query).toContain("JOIN room r ON rr.room_id = r.id");
      expect(query).toContain('LEFT JOIN "user" u ON rr.user_id = u.id');
      expect(query).toContain(
        'LEFT JOIN "user" approver_user ON rr.approver_id = approver_user.id'
      );
      expect(query).toContain("JOIN lookup l ON rr.status_id = l.id");
    });

    it("should include lookup category filter", async () => {
      // Act
      await getReservationById("1");

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("AND l.category = 'reservation_status'");
    });

    it("should select all required fields", async () => {
      // Act
      await getReservationById("1");

      // Assert
      const query = mockQuery.mock.calls[0][0];
      const expectedFields = [
        "rr.id",
        "rr.title",
        "rr.description",
        'rr.user_id AS "userId"',
        'u.name AS "userName"',
        'u.email AS "userEmail"',
        'u.image AS "userImage"',
        'rr.room_id AS "roomId"',
        'r.name AS "roomName"',
        'r.slug AS "roomSlug"',
        'rr.start_time AS "startTime"',
        'rr.end_time AS "endTime"',
        'rr.status_id AS "statusId"',
        "l.value AS status",
        'rr.created_at AS "createdAt"',
        'rr.approver_id AS "approverId"',
        'approver_user.name AS "approverName"',
        'rr.approved_at AS "approvedAt"',
        'rr.rejection_reason AS "rejectionReason"',
      ];

      expectedFields.forEach((field) => {
        expect(query).toContain(field);
      });
    });

    it("should filter by reservation ID", async () => {
      // Act
      await getReservationById("test-id");

      // Assert
      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("WHERE rr.id = $1");
      expect(mockQuery.mock.calls[0][1]).toEqual(["test-id"]);
    });
  });

  describe("Data Transformation", () => {
    it("should handle null user fields", async () => {
      // Arrange
      const reservationWithNullUser: DetailedReservation = {
        ...mockDetailedReservation,
        userId: null,
        userName: null,
        userEmail: null,
        userImage: null,
      };

      mockQuery.mockResolvedValue(
        createMockQueryResult([reservationWithNullUser])
      );

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result).toEqual(reservationWithNullUser);
      expect(result?.userId).toBeNull();
      expect(result?.userName).toBeNull();
      expect(result?.userEmail).toBeNull();
      expect(result?.userImage).toBeNull();
    });

    it("should handle null approver fields", async () => {
      // Arrange
      const reservationWithNullApprover: DetailedReservation = {
        ...mockDetailedReservation,
        approverId: null,
        approverName: null,
        approvedAt: null,
      };

      mockQuery.mockResolvedValue(
        createMockQueryResult([reservationWithNullApprover])
      );

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result).toEqual(reservationWithNullApprover);
      expect(result?.approverId).toBeNull();
      expect(result?.approverName).toBeNull();
      expect(result?.approvedAt).toBeNull();
    });

    it("should handle different status values", async () => {
      // Arrange
      const approvedReservation: DetailedReservation = {
        ...mockDetailedReservation,
        status: "Approved",
        statusId: 2,
        statusColor: "#10b981",
      };

      mockQuery.mockResolvedValue(createMockQueryResult([approvedReservation]));

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result?.status).toBe("Approved");
      expect(result?.statusId).toBe(2);
      expect(result?.statusColor).toBe("#10b981");
    });

    it("should handle date field conversion", async () => {
      // Arrange
      const reservationWithDates: DetailedReservation = {
        ...mockDetailedReservation,
        startTime: new Date("2024-12-20T09:00:00Z"),
        endTime: new Date("2024-12-20T17:00:00Z"),
        createdAt: new Date("2024-12-19T08:00:00Z"),
        approvedAt: new Date("2024-12-19T12:00:00Z"),
      };

      mockQuery.mockResolvedValue(
        createMockQueryResult([reservationWithDates])
      );

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result?.startTime).toBeInstanceOf(Date);
      expect(result?.endTime).toBeInstanceOf(Date);
      expect(result?.createdAt).toBeInstanceOf(Date);
      expect(result?.approvedAt).toBeInstanceOf(Date);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long reservation description", async () => {
      // Arrange
      const longDescription = "A".repeat(1000);
      const reservationWithLongDesc: DetailedReservation = {
        ...mockDetailedReservation,
        description: longDescription,
      };

      mockQuery.mockResolvedValue(
        createMockQueryResult([reservationWithLongDesc])
      );

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result?.description).toBe(longDescription);
      expect(result?.description?.length).toBe(1000);
    });

    it("should handle special characters in title and description", async () => {
      // Arrange
      const specialCharsReservation: DetailedReservation = {
        ...mockDetailedReservation,
        title: "Meeting with @#$%^&*()_+ characters",
        description:
          "Description with 'quotes' and \"double quotes\" and \n newlines",
      };

      mockQuery.mockResolvedValue(
        createMockQueryResult([specialCharsReservation])
      );

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result?.title).toBe("Meeting with @#$%^&*()_+ characters");
      expect(result?.description).toContain("'quotes'");
      expect(result?.description).toContain('"double quotes"');
      expect(result?.description).toContain("\n");
    });

    it("should handle minimum required fields only", async () => {
      // Arrange
      const minimalReservation: DetailedReservation = {
        id: "1",
        title: null,
        description: null,
        userId: null,
        userName: null,
        userEmail: null,
        userImage: null,
        roomId: 1,
        roomName: "Room A",
        roomSlug: "room-a",
        startTime: new Date("2024-12-20T09:00:00Z"),
        endTime: new Date("2024-12-20T10:00:00Z"),
        statusId: 1,
        status: "Pending",
        statusColor: null,
        createdAt: new Date("2024-12-19T10:00:00Z"),
        approverId: null,
        approverName: null,
        approvedAt: null,
        rejectionReason: null,
      };

      mockQuery.mockResolvedValue(createMockQueryResult([minimalReservation]));

      // Act
      const result = await getReservationById("1");

      // Assert
      expect(result).toEqual(minimalReservation);
      expect(result?.id).toBe("1");
      expect(result?.roomName).toBe("Room A");
      expect(result?.status).toBe("Pending");
    });
  });
});
