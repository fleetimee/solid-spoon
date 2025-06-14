import { getAdminDashboardStats } from "@/features/admin/api/getAdminDashboardStats";
import {
  testData,
  createMockQueryResult,
  createMockDBError,
} from "./setup.test";

// Mock dependencies
jest.mock("@/lib/db");

import db from "@/lib/db";

// Cast to get access to mock functions with proper typing
const mockQuery = db.query as jest.MockedFunction<any>;

describe("getAdminDashboardStats", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  describe("Basic Statistics", () => {
    it("should fetch all dashboard statistics successfully", async () => {
      // Arrange
      const mockDate = new Date("2024-12-15T10:00:00Z");
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      // Mock status lookups
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: "pending-id" }])) // PENDING status
        .mockResolvedValueOnce(createMockQueryResult([{ id: "approved-id" }])) // APPROVED status
        .mockResolvedValueOnce(createMockQueryResult([{ id: "completed-id" }])) // COMPLETED status
        .mockResolvedValueOnce(createMockQueryResult([{ count: "5" }])) // Pending reservations count
        .mockResolvedValueOnce(createMockQueryResult([{ count: "100" }])) // Total users count
        .mockResolvedValueOnce(createMockQueryResult([{ count: "20" }])) // Active rooms count
        .mockResolvedValueOnce(createMockQueryResult([{ count: "50" }])) // Total completed (not 45)
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Completed today (not 3)
        .mockResolvedValueOnce(createMockQueryResult([{ count: "75" }])) // Completed this month (not 25)
        .mockResolvedValueOnce(createMockQueryResult([{ count: "50" }])) // Total reservations (not 150)
        .mockResolvedValueOnce(createMockQueryResult([{ avg_hours: null }])) // Avg completion time (null not 24.5)
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Weekly completion data - empty array
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Reservations for charts - strings not Date objects
            { created_at: "2024-12-10T10:00:00.000Z", status: "Pending" },
            { created_at: "2024-12-11T10:00:00.000Z", status: "Approved" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Most active rooms - empty array
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Active rooms list - empty array
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Approved reservations - empty array
          ])
        );

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result).toEqual({
        pendingReservationCount: 5,
        totalUserCount: 100,
        activeRoomCount: 20,
        completionStats: {
          totalCompleted: 50,
          completedToday: 10,
          completedThisMonth: 75,
          completionRate: 100, // 50/50 * 100 = 100%
          averageCompletionTimeHours: null,
          completedLast7Days: expect.any(Array),
        },
        reservationsLast30Days: [
          { created_at: "2024-12-10T10:00:00.000Z", status: "Pending" },
          { created_at: "2024-12-11T10:00:00.000Z", status: "Approved" },
        ],
        mostActiveRooms: [],
        roomUtilization: [],
      });

      // Verify that completedLast7Days has 7 entries (one for each day)
      expect(result.completionStats.completedLast7Days).toHaveLength(7);

      jest.useRealTimers();
    });

    it("should handle missing status IDs gracefully", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([])) // Empty PENDING status
        .mockResolvedValueOnce(createMockQueryResult([])) // Empty APPROVED status
        .mockResolvedValueOnce(createMockQueryResult([])) // Empty COMPLETED status
        .mockResolvedValueOnce(createMockQueryResult([{ count: "100" }])) // Total users
        .mockResolvedValueOnce(createMockQueryResult([{ count: "20" }])) // Active rooms
        .mockResolvedValueOnce(createMockQueryResult([])) // Reservations for charts
        .mockResolvedValueOnce(createMockQueryResult([])); // Most active rooms

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result.pendingReservationCount).toBe(0);
      expect(result.totalUserCount).toBe(100);
      expect(result.activeRoomCount).toBe(20);
      expect(result.completionStats.totalCompleted).toBe(0);
      expect(result.roomUtilization).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Could not find 'PENDING' status ID")
      );
    });
  });

  describe("Completion Statistics", () => {
    it("should calculate completion rates correctly", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: "pending-id" }])) // PENDING
        .mockResolvedValueOnce(createMockQueryResult([{ id: "approved-id" }])) // APPROVED
        .mockResolvedValueOnce(createMockQueryResult([{ id: "completed-id" }])) // COMPLETED
        .mockResolvedValueOnce(createMockQueryResult([{ count: "0" }])) // Pending count
        .mockResolvedValueOnce(createMockQueryResult([{ count: "50" }])) // Users
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Rooms
        .mockResolvedValueOnce(createMockQueryResult([{ count: "75" }])) // Total completed
        .mockResolvedValueOnce(createMockQueryResult([{ count: "5" }])) // Completed today
        .mockResolvedValueOnce(createMockQueryResult([{ count: "30" }])) // Completed this month
        .mockResolvedValueOnce(createMockQueryResult([{ count: "100" }])) // Total reservations
        .mockResolvedValueOnce(createMockQueryResult([{ avg_hours: "12.3" }])) // Avg completion time
        .mockResolvedValueOnce(createMockQueryResult([])) // Weekly completion
        .mockResolvedValueOnce(createMockQueryResult([])) // Chart data
        .mockResolvedValueOnce(createMockQueryResult([])) // Most active rooms
        .mockResolvedValueOnce(createMockQueryResult([])) // Active rooms list
        .mockResolvedValueOnce(createMockQueryResult([])); // Reservations

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result.completionStats).toEqual({
        totalCompleted: 75,
        completedToday: 5,
        completedThisMonth: 30,
        completionRate: 75, // 75/100 * 100 = 75%
        averageCompletionTimeHours: 12.3,
        completedLast7Days: expect.any(Array),
      });
    });

    it("should handle zero total reservations", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: "pending-id" }])) // PENDING
        .mockResolvedValueOnce(createMockQueryResult([{ id: "approved-id" }])) // APPROVED
        .mockResolvedValueOnce(createMockQueryResult([{ id: "completed-id" }])) // COMPLETED
        .mockResolvedValueOnce(createMockQueryResult([{ count: "0" }])) // Pending count
        .mockResolvedValueOnce(createMockQueryResult([{ count: "50" }])) // Users
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Rooms
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Total completed
        .mockResolvedValueOnce(createMockQueryResult([{ count: "1" }])) // Completed today
        .mockResolvedValueOnce(createMockQueryResult([{ count: "5" }])) // Completed this month
        .mockResolvedValueOnce(createMockQueryResult([{ count: "0" }])) // Total reservations = 0
        .mockResolvedValueOnce(createMockQueryResult([{ avg_hours: null }])) // Avg completion time
        .mockResolvedValueOnce(createMockQueryResult([])) // Weekly completion
        .mockResolvedValueOnce(createMockQueryResult([])) // Chart data
        .mockResolvedValueOnce(createMockQueryResult([])) // Most active rooms
        .mockResolvedValueOnce(createMockQueryResult([])) // Active rooms list
        .mockResolvedValueOnce(createMockQueryResult([])); // Reservations

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result.completionStats.completionRate).toBe(0);
      expect(result.completionStats.averageCompletionTimeHours).toBeNull();
    });

    it("should generate weekly completion data correctly", async () => {
      // Arrange
      const mockDate = new Date("2024-12-15T10:00:00Z");
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: "pending-id" }])) // PENDING
        .mockResolvedValueOnce(createMockQueryResult([{ id: "approved-id" }])) // APPROVED
        .mockResolvedValueOnce(createMockQueryResult([{ id: "completed-id" }])) // COMPLETED
        .mockResolvedValueOnce(createMockQueryResult([{ count: "0" }])) // Pending count
        .mockResolvedValueOnce(createMockQueryResult([{ count: "50" }])) // Users
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Rooms
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Total completed
        .mockResolvedValueOnce(createMockQueryResult([{ count: "1" }])) // Completed today
        .mockResolvedValueOnce(createMockQueryResult([{ count: "5" }])) // Completed this month
        .mockResolvedValueOnce(createMockQueryResult([{ count: "20" }])) // Total reservations
        .mockResolvedValueOnce(createMockQueryResult([{ avg_hours: "15.0" }])) // Avg completion time
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Weekly completion with some data
            { completion_date: "2024-12-14", count: "3" },
            { completion_date: "2024-12-12", count: "2" },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([])) // Chart data
        .mockResolvedValueOnce(createMockQueryResult([])) // Active rooms
        .mockResolvedValueOnce(createMockQueryResult([])) // Rooms list
        .mockResolvedValueOnce(createMockQueryResult([])); // Reservations

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result.completionStats.completedLast7Days).toHaveLength(7);
      expect(result.completionStats.completedLast7Days).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            date: expect.any(String),
            count: expect.any(Number),
          }),
        ])
      );

      jest.useRealTimers();
    });
  });

  describe("Room Utilization", () => {
    it("should calculate room utilization correctly", async () => {
      // Arrange
      const mockDate = new Date("2024-12-15T12:00:00Z");
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: "pending-id" }])) // PENDING
        .mockResolvedValueOnce(createMockQueryResult([{ id: "approved-id" }])) // APPROVED
        .mockResolvedValueOnce(createMockQueryResult([{ id: "completed-id" }])) // COMPLETED
        .mockResolvedValueOnce(createMockQueryResult([{ count: "0" }])) // Pending count
        .mockResolvedValueOnce(createMockQueryResult([{ count: "50" }])) // Users
        .mockResolvedValueOnce(createMockQueryResult([{ count: "2" }])) // Active rooms
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Total completed
        .mockResolvedValueOnce(createMockQueryResult([{ count: "1" }])) // Completed today
        .mockResolvedValueOnce(createMockQueryResult([{ count: "5" }])) // Completed this month
        .mockResolvedValueOnce(createMockQueryResult([{ count: "20" }])) // Total reservations
        .mockResolvedValueOnce(createMockQueryResult([{ avg_hours: "15.0" }])) // Avg completion time
        .mockResolvedValueOnce(createMockQueryResult([])) // Weekly completion
        .mockResolvedValueOnce(createMockQueryResult([])) // Chart data
        .mockResolvedValueOnce(createMockQueryResult([])) // Active rooms
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Active rooms list
            { id: 1, name: "Room A" },
            { id: 2, name: "Room B" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Approved reservations
            {
              room_id: 1,
              start_time: "2024-12-14T09:00:00Z",
              end_time: "2024-12-14T11:00:00Z", // 2 hours
            },
            {
              room_id: 2,
              start_time: "2024-12-13T14:00:00Z",
              end_time: "2024-12-13T15:00:00Z", // 1 hour
            },
          ])
        );

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result.roomUtilization).toHaveLength(2);
      expect(result.roomUtilization).toEqual([
        { name: "Room A", utilization: expect.any(Number) },
        { name: "Room B", utilization: expect.any(Number) },
      ]);
      expect(result.roomUtilization[0].utilization).toBeGreaterThanOrEqual(0);
      expect(result.roomUtilization[0].utilization).toBeLessThanOrEqual(100);

      jest.useRealTimers();
    });

    it("should handle empty room utilization when no approved status found", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: "pending-id" }])) // PENDING
        .mockResolvedValueOnce(createMockQueryResult([])) // APPROVED status not found
        .mockResolvedValueOnce(createMockQueryResult([{ id: "completed-id" }])) // COMPLETED
        .mockResolvedValueOnce(createMockQueryResult([{ count: "0" }])) // Pending count
        .mockResolvedValueOnce(createMockQueryResult([{ count: "50" }])) // Users
        .mockResolvedValueOnce(createMockQueryResult([{ count: "2" }])) // Active rooms
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Total completed
        .mockResolvedValueOnce(createMockQueryResult([{ count: "1" }])) // Completed today
        .mockResolvedValueOnce(createMockQueryResult([{ count: "5" }])) // Completed this month
        .mockResolvedValueOnce(createMockQueryResult([{ count: "20" }])) // Total reservations
        .mockResolvedValueOnce(createMockQueryResult([{ avg_hours: "15.0" }])) // Avg completion time
        .mockResolvedValueOnce(createMockQueryResult([])) // Weekly completion
        .mockResolvedValueOnce(createMockQueryResult([])) // Chart data
        .mockResolvedValueOnce(createMockQueryResult([])); // Active rooms

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result.roomUtilization).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Could not find 'Approved' status ID")
      );
    });
  });

  describe("Error Handling", () => {
    it("should return default values when database error occurs", async () => {
      // Arrange
      mockQuery.mockRejectedValueOnce(new Error("Database connection failed"));

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result).toEqual({
        pendingReservationCount: 0,
        totalUserCount: 0,
        activeRoomCount: 0,
        completionStats: {
          totalCompleted: 0,
          completedToday: 0,
          completedThisMonth: 0,
          completionRate: 0,
          averageCompletionTimeHours: null,
          completedLast7Days: [],
        },
        reservationsLast30Days: [],
        mostActiveRooms: [],
        roomUtilization: [],
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching admin dashboard stats:",
        expect.any(Error)
      );
    });

    it("should handle null and undefined values gracefully", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: "pending-id" }])) // PENDING
        .mockResolvedValueOnce(createMockQueryResult([{ id: "approved-id" }])) // APPROVED
        .mockResolvedValueOnce(createMockQueryResult([{ id: "completed-id" }])) // COMPLETED
        .mockResolvedValueOnce(createMockQueryResult([{ count: null }])) // Pending count null
        .mockResolvedValueOnce(createMockQueryResult([{ count: undefined }])) // Users undefined
        .mockResolvedValueOnce(createMockQueryResult([{}])) // Active rooms empty object
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Total completed
        .mockResolvedValueOnce(createMockQueryResult([{ count: "1" }])) // Completed today
        .mockResolvedValueOnce(createMockQueryResult([{ count: "5" }])) // Completed this month
        .mockResolvedValueOnce(createMockQueryResult([{ count: "20" }])) // Total reservations
        .mockResolvedValueOnce(createMockQueryResult([{ avg_hours: "NaN" }])) // Avg completion time NaN
        .mockResolvedValueOnce(createMockQueryResult([])) // Weekly completion
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Chart data with null status
            { created_at: "2024-12-10T10:00:00Z", status: null },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Active rooms with null count
            { name: "Room A", count: null },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([])) // Rooms list
        .mockResolvedValueOnce(createMockQueryResult([])); // Reservations

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result.pendingReservationCount).toBe(0);
      expect(result.totalUserCount).toBe(0);
      expect(result.activeRoomCount).toBe(0);
      expect(result.completionStats.averageCompletionTimeHours).toBeNull();
      expect(result.reservationsLast30Days[0].status).toBe("Unknown");
      expect(result.mostActiveRooms[0].count).toBe(0);
    });
  });

  describe("Data Transformations", () => {
    it("should properly transform reservation data for charts", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: "pending-id" }])) // PENDING
        .mockResolvedValueOnce(createMockQueryResult([{ id: "approved-id" }])) // APPROVED
        .mockResolvedValueOnce(createMockQueryResult([{ id: "completed-id" }])) // COMPLETED
        .mockResolvedValueOnce(createMockQueryResult([{ count: "0" }])) // Pending count
        .mockResolvedValueOnce(createMockQueryResult([{ count: "50" }])) // Users
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Rooms
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Total completed
        .mockResolvedValueOnce(createMockQueryResult([{ count: "1" }])) // Completed today
        .mockResolvedValueOnce(createMockQueryResult([{ count: "5" }])) // Completed this month
        .mockResolvedValueOnce(createMockQueryResult([{ count: "20" }])) // Total reservations
        .mockResolvedValueOnce(createMockQueryResult([{ avg_hours: "15.0" }])) // Avg completion time
        .mockResolvedValueOnce(createMockQueryResult([])) // Weekly completion
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Chart data
            { created_at: "2024-12-10T10:00:00Z", status: "Pending" },
            { created_at: "2024-12-11T15:30:00Z", status: "Approved" },
            { created_at: "2024-12-12T09:15:00Z", status: null }, // Null status
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([])) // Active rooms
        .mockResolvedValueOnce(createMockQueryResult([])) // Rooms list
        .mockResolvedValueOnce(createMockQueryResult([])); // Reservations

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result.reservationsLast30Days).toEqual([
        { created_at: "2024-12-10T10:00:00Z", status: "Pending" },
        { created_at: "2024-12-11T15:30:00Z", status: "Approved" },
        { created_at: "2024-12-12T09:15:00Z", status: "Unknown" },
      ]);
    });

    it("should sort room utilization by utilization percentage", async () => {
      // Arrange
      const mockDate = new Date("2024-12-15T12:00:00Z");
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([{ id: "pending-id" }])) // PENDING
        .mockResolvedValueOnce(createMockQueryResult([{ id: "approved-id" }])) // APPROVED
        .mockResolvedValueOnce(createMockQueryResult([{ id: "completed-id" }])) // COMPLETED
        .mockResolvedValueOnce(createMockQueryResult([{ count: "0" }])) // Pending count
        .mockResolvedValueOnce(createMockQueryResult([{ count: "50" }])) // Users
        .mockResolvedValueOnce(createMockQueryResult([{ count: "3" }])) // Active rooms
        .mockResolvedValueOnce(createMockQueryResult([{ count: "10" }])) // Total completed
        .mockResolvedValueOnce(createMockQueryResult([{ count: "1" }])) // Completed today
        .mockResolvedValueOnce(createMockQueryResult([{ count: "5" }])) // Completed this month
        .mockResolvedValueOnce(createMockQueryResult([{ count: "20" }])) // Total reservations
        .mockResolvedValueOnce(createMockQueryResult([{ avg_hours: "15.0" }])) // Avg completion time
        .mockResolvedValueOnce(createMockQueryResult([])) // Weekly completion
        .mockResolvedValueOnce(createMockQueryResult([])) // Chart data
        .mockResolvedValueOnce(createMockQueryResult([])) // Active rooms
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Active rooms list
            { id: 1, name: "Low Usage Room" },
            { id: 2, name: "High Usage Room" },
            { id: 3, name: "Medium Usage Room" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Approved reservations
            {
              room_id: 2, // High usage
              start_time: "2024-12-14T09:00:00Z",
              end_time: "2024-12-14T17:00:00Z", // 8 hours
            },
            {
              room_id: 3, // Medium usage
              start_time: "2024-12-14T10:00:00Z",
              end_time: "2024-12-14T14:00:00Z", // 4 hours
            },
            {
              room_id: 1, // Low usage
              start_time: "2024-12-14T15:00:00Z",
              end_time: "2024-12-14T16:00:00Z", // 1 hour
            },
          ])
        );

      // Act
      const result = await getAdminDashboardStats();

      // Assert
      expect(result.roomUtilization).toHaveLength(3);
      // Should be sorted by utilization (high to low)
      expect(result.roomUtilization[0].utilization).toBeGreaterThanOrEqual(
        result.roomUtilization[1].utilization
      );
      expect(result.roomUtilization[1].utilization).toBeGreaterThanOrEqual(
        result.roomUtilization[2].utilization
      );

      jest.useRealTimers();
    });
  });
});
