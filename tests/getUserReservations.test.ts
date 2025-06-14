import {
  getUserReservations,
  UserReservation,
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

describe("getUserReservations", () => {
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

  it("should fetch user reservations successfully", async () => {
    mockQuery.mockResolvedValueOnce(
      createMockQueryResult([mockReservationRow])
    );

    const result = await getUserReservations("user-123");

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

  it("should use correct SQL query with parameterized user ID", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    await getUserReservations("test-user-id");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringMatching(/WHERE\s+rr\.user_id\s*=\s*\$1/),
      ["test-user-id"]
    );
  });

  it("should join with room and lookup tables", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    await getUserReservations("user-123");

    const calledQuery = mockQuery.mock.calls[0][0];
    expect(calledQuery).toMatch(
      /JOIN\s+room\s+r\s+ON\s+rr\.room_id\s*=\s*r\.id/
    );
    expect(calledQuery).toMatch(
      /JOIN\s+lookup\s+l\s+ON\s+rr\.status_id\s*=\s*l\.id/
    );
    expect(calledQuery).toMatch(/l\.category\s*=\s*'reservation_status'/);
  });

  it("should order by start_time DESC", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    await getUserReservations("user-123");

    const calledQuery = mockQuery.mock.calls[0][0];
    expect(calledQuery).toMatch(/ORDER\s+BY\s+rr\.start_time\s+DESC/);
  });

  it("should handle multiple reservations", async () => {
    const mockRows = [
      {
        ...mockReservationRow,
        id: "1",
        title: "Morning Meeting",
        start_time: "2024-12-20T09:00:00Z",
      },
      {
        ...mockReservationRow,
        id: "2",
        title: "Afternoon Meeting",
        start_time: "2024-12-20T14:00:00Z",
      },
    ];

    mockQuery.mockResolvedValueOnce(createMockQueryResult(mockRows));

    const result = await getUserReservations("user-123");

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Morning Meeting");
    expect(result[1].title).toBe("Afternoon Meeting");
  });

  it("should handle null description", async () => {
    const rowWithNullDescription = {
      ...mockReservationRow,
      description: null,
    };

    mockQuery.mockResolvedValueOnce(
      createMockQueryResult([rowWithNullDescription])
    );

    const result = await getUserReservations("user-123");

    expect(result[0].description).toBeNull();
  });

  it("should convert timestamp strings to Date objects", async () => {
    mockQuery.mockResolvedValueOnce(
      createMockQueryResult([mockReservationRow])
    );

    const result = await getUserReservations("user-123");

    expect(result[0].startTime).toBeInstanceOf(Date);
    expect(result[0].endTime).toBeInstanceOf(Date);
    expect(result[0].createdAt).toBeInstanceOf(Date);
    expect(result[0].startTime.toISOString()).toBe("2024-12-20T09:00:00.000Z");
  });

  it("should handle Date objects from database", async () => {
    const rowWithDateObjects = {
      ...mockReservationRow,
      start_time: new Date("2024-12-20T09:00:00Z"),
      end_time: new Date("2024-12-20T10:00:00Z"),
      created_at: new Date("2024-12-19T10:00:00Z"),
    };

    mockQuery.mockResolvedValueOnce(
      createMockQueryResult([rowWithDateObjects])
    );

    const result = await getUserReservations("user-123");

    expect(result[0].startTime).toBeInstanceOf(Date);
    expect(result[0].endTime).toBeInstanceOf(Date);
    expect(result[0].createdAt).toBeInstanceOf(Date);
  });

  it("should return empty array when no reservations found", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    const result = await getUserReservations("user-with-no-reservations");

    expect(result).toEqual([]);
  });

  it("should throw error on database failure", async () => {
    mockQuery.mockRejectedValueOnce(createMockDBError("Connection failed"));

    await expect(getUserReservations("user-123")).rejects.toThrow(
      "Failed to fetch user reservations."
    );

    expect(console.error).toHaveBeenCalledWith(
      "Database Error: Failed to fetch user reservations.",
      expect.any(Error)
    );
  });

  it("should handle different reservation statuses", async () => {
    const reservationsWithDifferentStatuses = [
      { ...mockReservationRow, id: "1", status: "PENDING" },
      { ...mockReservationRow, id: "2", status: "APPROVED" },
      { ...mockReservationRow, id: "3", status: "REJECTED" },
      { ...mockReservationRow, id: "4", status: "CANCELLED" },
      { ...mockReservationRow, id: "5", status: "COMPLETED" },
    ];

    mockQuery.mockResolvedValueOnce(
      createMockQueryResult(reservationsWithDifferentStatuses)
    );

    const result = await getUserReservations("user-123");

    expect(result).toHaveLength(5);
    expect(result.map((r) => r.status)).toEqual([
      "PENDING",
      "APPROVED",
      "REJECTED",
      "CANCELLED",
      "COMPLETED",
    ]);
  });

  it("should select correct fields with aliases", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    await getUserReservations("user-123");

    const calledQuery = mockQuery.mock.calls[0][0];
    expect(calledQuery).toContain('r.name AS "roomName"');
    expect(calledQuery).toContain("l.value AS status");
    expect(calledQuery).toContain("rr.id");
    expect(calledQuery).toContain("rr.title");
    expect(calledQuery).toContain("rr.description");
    expect(calledQuery).toContain("rr.start_time");
    expect(calledQuery).toContain("rr.end_time");
    expect(calledQuery).toContain("rr.created_at");
  });

  it("should handle edge case with very long room names", async () => {
    const longRoomName = "A".repeat(1000);
    const rowWithLongRoomName = {
      ...mockReservationRow,
      roomName: longRoomName,
    };

    mockQuery.mockResolvedValueOnce(
      createMockQueryResult([rowWithLongRoomName])
    );

    const result = await getUserReservations("user-123");

    expect(result[0].roomName).toBe(longRoomName);
  });

  it("should maintain data types from UserReservation interface", async () => {
    mockQuery.mockResolvedValueOnce(
      createMockQueryResult([mockReservationRow])
    );

    const result = await getUserReservations("user-123");
    const reservation = result[0];

    // Verify types match UserReservation interface
    expect(typeof reservation.id).toBe("string");
    expect(typeof reservation.title).toBe("string");
    expect(typeof reservation.description).toBe("string");
    expect(reservation.startTime).toBeInstanceOf(Date);
    expect(reservation.endTime).toBeInstanceOf(Date);
    expect(reservation.createdAt).toBeInstanceOf(Date);
    expect(typeof reservation.roomName).toBe("string");
    expect(typeof reservation.status).toBe("string");
  });
});
