import { cancelReservation } from "@/features/reservations/api/cancelReservation";
import {
  testData,
  createMockQueryResult,
  createMockDBError,
} from "./setup.test";

// Mock dependencies
jest.mock("@/lib/db");
jest.mock("@/lib/auth");
jest.mock("next/headers");
jest.mock("next/cache");

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Cast to get access to mock functions
const mockQuery = (db as any).query;
const mockAuth = (auth as any).api.getSession;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<
  typeof revalidatePath
>;

describe("cancelReservation", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    console.error = jest.fn();

    // Mock headers
    mockHeaders.mockResolvedValue(new Headers());
  });

  describe("Authentication", () => {
    it("should return error when user is not authenticated", async () => {
      // Arrange
      mockAuth.mockResolvedValue(null);

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Tidak memiliki otorisasi. Silakan masuk.",
      });
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("should return error when user id is missing", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: undefined },
      });

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Tidak memiliki otorisasi. Silakan masuk.",
      });
    });
  });

  describe("Input Validation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Test User" },
      });
    });

    it("should validate reservation ID", async () => {
      // Act
      const result = await cancelReservation("");

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("ID reservasi yang diberikan tidak valid.");
    });
  });

  describe("Reservation Status Checks", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Test User" },
      });

      // Mock status lookup
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([
          { id: "pending-id", code: "PENDING" },
          { id: "approved-id", code: "APPROVED" },
          { id: "cancelled-id", code: "CANCELLED" },
        ])
      );
    });

    it("should successfully cancel pending reservation", async () => {
      // Arrange
      // Reset mocks to avoid conflicts with beforeEach
      mockQuery.mockReset();
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Status lookup
            { id: "pending-id", code: "PENDING" },
            { id: "approved-id", code: "APPROVED" },
            { id: "cancelled-id", code: "CANCELLED" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Reservation check
            {
              id: "123",
              user_id: "user123",
              status_id: "pending-id",
              title: "Test Meeting",
              start_time: "2024-12-20T10:00:00Z",
              end_time: "2024-12-20T11:00:00Z",
              status_value: "Pending",
              room_name: "Test Room",
              room_slug: "test-room",
            },
          ])
        )
        .mockResolvedValueOnce({ rowCount: 1 }) // Update query
        .mockResolvedValueOnce(createMockQueryResult([])); // Notification insert

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE room_reservation"),
        expect.arrayContaining(["cancelled-id", "123", "user123"])
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/me/bookings");
    });

    it("should successfully cancel approved reservation more than 24 hours away", async () => {
      // Arrange
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2); // 2 days from now

      // Reset mocks to avoid conflicts with beforeEach
      mockQuery.mockReset();
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Status lookup
            { id: "pending-id", code: "PENDING" },
            { id: "approved-id", code: "APPROVED" },
            { id: "cancelled-id", code: "CANCELLED" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Reservation check
            {
              id: "123",
              user_id: "user123",
              status_id: "approved-id",
              title: "Test Meeting",
              start_time: futureDate.toISOString(),
              end_time: new Date(
                futureDate.getTime() + 60 * 60 * 1000
              ).toISOString(),
              status_value: "Approved",
              room_name: "Test Room",
              room_slug: "test-room",
            },
          ])
        )
        .mockResolvedValueOnce({ rowCount: 1 }) // Update query
        .mockResolvedValueOnce(createMockQueryResult([])); // Notification insert

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(true);
    });

    it("should reject cancellation of approved reservation less than 24 hours away", async () => {
      // Arrange
      const nearFutureDate = new Date();
      nearFutureDate.setHours(nearFutureDate.getHours() + 12); // 12 hours from now

      // Reset mocks to avoid conflicts with beforeEach
      mockQuery.mockReset();
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Status lookup
            { id: "pending-id", code: "PENDING" },
            { id: "approved-id", code: "APPROVED" },
            { id: "cancelled-id", code: "CANCELLED" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Reservation check
            {
              id: "123",
              user_id: "user123",
              status_id: "approved-id",
              title: "Test Meeting",
              start_time: nearFutureDate.toISOString(),
              end_time: new Date(
                nearFutureDate.getTime() + 60 * 60 * 1000
              ).toISOString(),
              status_value: "Approved",
              room_name: "Test Room",
              room_slug: "test-room",
            },
          ])
        );

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain(
        "Tidak dapat membatalkan reservasi yang disetujui"
      );
      expect(result.error).toContain("24 jam");
    });

    it("should reject cancellation when reservation not found", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Status lookup
            { id: "pending-id", code: "PENDING" },
            { id: "approved-id", code: "APPROVED" },
            { id: "cancelled-id", code: "CANCELLED" },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([])); // Empty reservation result

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Reservasi tidak ditemukan atau telah dihapus."
      );
    });

    it("should reject cancellation when user does not own reservation", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Status lookup
            { id: "pending-id", code: "PENDING" },
            { id: "approved-id", code: "APPROVED" },
            { id: "cancelled-id", code: "CANCELLED" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Reservation check - different user
            {
              id: "123",
              user_id: "other-user",
              status_id: "pending-id",
              title: "Test Meeting",
              start_time: "2024-12-20T10:00:00Z",
              end_time: "2024-12-20T11:00:00Z",
              status_value: "Pending",
              room_name: "Test Room",
              room_slug: "test-room",
            },
          ])
        );

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Anda tidak memiliki izin untuk membatalkan reservasi ini."
      );
    });
  });

  describe("Database Operations", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Test User" },
      });
    });

    it("should handle status lookup failure", async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce(createMockQueryResult([])); // Empty status result

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Kesalahan konfigurasi sistem. Silakan hubungi dukungan."
      );
    });

    it("should handle update failure", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Status lookup
            { id: "pending-id", code: "PENDING" },
            { id: "approved-id", code: "APPROVED" },
            { id: "cancelled-id", code: "CANCELLED" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Reservation check
            {
              id: "123",
              user_id: "user123",
              status_id: "pending-id",
              title: "Test Meeting",
              start_time: "2024-12-20T10:00:00Z",
              end_time: "2024-12-20T11:00:00Z",
              status_value: "Pending",
              room_name: "Test Room",
              room_slug: "test-room",
            },
          ])
        )
        .mockResolvedValueOnce({ rowCount: 0 }); // Update fails

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Gagal membatalkan reservasi. Mungkin telah dimodifikasi oleh proses lain."
      );
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      mockQuery.mockRejectedValueOnce(new Error("Database connection failed"));

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Terjadi kesalahan yang tidak terduga saat membatalkan reservasi."
      );
    });
  });

  describe("Notification Creation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Test User", email: "test@example.com" },
      });
    });

    it("should create notification for successful cancellation", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Status lookup
            { id: "pending-id", code: "PENDING" },
            { id: "approved-id", code: "APPROVED" },
            { id: "cancelled-id", code: "CANCELLED" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Reservation check
            {
              id: "123",
              user_id: "user123",
              status_id: "pending-id",
              title: "Test Meeting",
              start_time: "2024-12-20T10:00:00Z",
              end_time: "2024-12-20T11:00:00Z",
              status_value: "Pending",
              room_name: "Test Room",
              room_slug: "test-room",
            },
          ])
        )
        .mockResolvedValueOnce({ rowCount: 1 }) // Update query
        .mockResolvedValueOnce(createMockQueryResult([])); // Notification insert

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO notification"),
        expect.arrayContaining([
          "admin",
          "Reservasi Dibatalkan",
          expect.stringContaining("Test User"),
          expect.stringContaining("Test Meeting"),
          expect.stringContaining("Test Room"),
          "admin",
          "/admin/rooms/test-room",
        ])
      );
    });

    it("should continue even if notification creation fails", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Status lookup
            { id: "pending-id", code: "PENDING" },
            { id: "approved-id", code: "APPROVED" },
            { id: "cancelled-id", code: "CANCELLED" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Reservation check
            {
              id: "123",
              user_id: "user123",
              status_id: "pending-id",
              title: "Test Meeting",
              start_time: "2024-12-20T10:00:00Z",
              end_time: "2024-12-20T11:00:00Z",
              status_value: "Pending",
              room_name: "Test Room",
              room_slug: "test-room",
            },
          ])
        )
        .mockResolvedValueOnce({ rowCount: 1 }) // Update query
        .mockRejectedValueOnce(new Error("Notification failed")); // Notification fails

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(true); // Should still succeed
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to create notification"),
        expect.any(Error)
      );
    });
  });

  describe("Path Revalidation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Test User" },
      });
    });

    it("should revalidate relevant paths after successful cancellation", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Status lookup
            { id: "pending-id", code: "PENDING" },
            { id: "approved-id", code: "APPROVED" },
            { id: "cancelled-id", code: "CANCELLED" },
          ])
        )
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Reservation check
            {
              id: "123",
              user_id: "user123",
              status_id: "pending-id",
              title: "Test Meeting",
              start_time: "2024-12-20T10:00:00Z",
              end_time: "2024-12-20T11:00:00Z",
              status_value: "Pending",
              room_name: "Test Room",
              room_slug: "test-room",
            },
          ])
        )
        .mockResolvedValueOnce({ rowCount: 1 }) // Update query
        .mockResolvedValueOnce(createMockQueryResult([])); // Notification insert

      // Act
      const result = await cancelReservation("123");

      // Assert
      expect(result.success).toBe(true);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/me/bookings");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/me/activity");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/rooms");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/dashboard");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/notifications");
    });
  });
});
