import {
  rejectReservationAction,
  RejectReservationFormState,
} from "@/features/reservations/api/rejectReservationAction";
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

import db, { withTransaction } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Create mock for withTransaction
const mockWithTransaction = withTransaction as jest.MockedFunction<
  typeof withTransaction
>;

// Cast to get access to mock functions
const mockQuery = (db as any).query as jest.MockedFunction<any>;
const mockAuth = auth.api.getSession as jest.MockedFunction<any>;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<
  typeof revalidatePath
>;

describe("rejectReservationAction", () => {
  let mockFormData: FormData;
  const initialState: RejectReservationFormState = {
    success: false,
    message: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.log = jest.fn();
    console.warn = jest.fn();

    // Mock headers
    mockHeaders.mockResolvedValue(new Headers());

    // Create mock form data
    mockFormData = new FormData();
    mockFormData.append("reservationId", "123");
    mockFormData.append(
      "rejectionReason",
      "Room not available at requested time"
    );

    // Mock fetch for notifications
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    // Mock process.env
    process.env.BETTER_AUTH_URL = "http://localhost:3000";
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  describe("Input Validation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      });
    });

    it("should validate required reservation ID", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("reservationId", "");
      invalidFormData.append("rejectionReason", "Valid reason");

      // Act
      const result = await rejectReservationAction(
        initialState,
        invalidFormData
      );

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Validasi gagal.",
        errors: {
          reservationId: ["ID reservasi diperlukan."],
        },
      });
    });

    it("should validate required rejection reason", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("reservationId", "123");
      invalidFormData.append("rejectionReason", "");

      // Act
      const result = await rejectReservationAction(
        initialState,
        invalidFormData
      );

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Validasi gagal.",
        errors: {
          rejectionReason: ["Alasan penolakan diperlukan."],
        },
      });
    });

    it("should validate both fields when empty", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("reservationId", "");
      invalidFormData.append("rejectionReason", "");

      // Act
      const result = await rejectReservationAction(
        initialState,
        invalidFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Validasi gagal.");
      expect(result.errors?.reservationId).toContain(
        "ID reservasi diperlukan."
      );
      expect(result.errors?.rejectionReason).toContain(
        "Alasan penolakan diperlukan."
      );
    });

    it("should pass validation with valid input", async () => {
      // Arrange - Setup successful flow
      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        };
        return await callback(mockClient);
      });

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Test Room",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([])); // Notification insert

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil ditolak.");
    });
  });

  describe("Authentication & Authorization", () => {
    it("should reject when user is not authenticated", async () => {
      // Arrange
      mockAuth.mockResolvedValue(null);

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Tidak diizinkan: Hanya admin yang dapat menolak reservasi.",
      });
    });

    it("should reject when user ID is missing", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: {
          id: undefined,
          role: "admin",
        },
      });

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Tidak diizinkan: Hanya admin yang dapat menolak reservasi.",
      });
    });

    it("should reject when user is not admin", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: {
          id: "user123",
          name: "Regular User",
          email: "user@example.com",
          role: "user",
        },
      });

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Tidak diizinkan: Hanya admin yang dapat menolak reservasi.",
      });
    });

    it("should proceed when user is admin", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      });

      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        };
        return await callback(mockClient);
      });

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([]));

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil ditolak.");
    });
  });

  describe("Database Operations", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      });
    });

    it("should successfully update reservation status", async () => {
      // Arrange
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 1 }),
      };
      mockWithTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockClient);
      });

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([]));

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil ditolak.");
      expect(mockWithTransaction).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE room_reservation"),
        [4, "Room not available at requested time", "admin123", "123"]
      );
    });

    it("should handle reservation not found", async () => {
      // Arrange
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 0 }),
      };
      mockWithTransaction.mockImplementation(async (callback: any) => {
        await callback(mockClient);
        throw new Error(
          "Reservation with ID 123 not found or could not be updated."
        );
      });

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain("Reservation with ID 123 not found");
    });

    it("should handle transaction errors", async () => {
      // Arrange
      mockWithTransaction.mockRejectedValue(
        new Error("Database transaction failed")
      );

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain("Gagal menolak reservasi");
    });

    it("should use correct rejection status ID", async () => {
      // Arrange
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 1 }),
      };
      mockWithTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockClient);
      });

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Test Room",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([]));

      // Act
      await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("SET status_id = $1"),
        expect.arrayContaining([4]) // Rejected status ID
      );
    });

    it("should set approver and clear approval date", async () => {
      // Arrange
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rowCount: 1 }),
      };
      mockWithTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockClient);
      });

      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([
          {
            userEmail: "user@example.com",
            userName: "Test User",
            roomName: "Test Room",
            userId: "user123",
          },
        ])
      );

      // Act
      await rejectReservationAction(initialState, mockFormData);

      // Assert
      const updateQuery = mockClient.query.mock.calls[0][0];
      expect(updateQuery).toContain("approver_id = $3");
      expect(updateQuery).toContain("approved_at = NULL");
      expect(mockClient.query.mock.calls[0][1]).toContain("admin123");
    });
  });

  describe("Notification Handling", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      });

      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        };
        return await callback(mockClient);
      });
    });

    it("should send email notification after successful rejection", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([]));

      // Act
      await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/reservations/notify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId: "123",
            userEmail: "user@example.com",
            userName: "Test User",
            roomName: "Conference Room A",
            status: "rejected",
            reason: "Room not available at requested time",
          }),
        }
      );
    });

    it("should create notification record", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([]));

      // Act
      await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO notification"),
        [
          "user123",
          "Reservasi Ditolak",
          "Reservasi Anda untuk ruangan 'Conference Room A' telah ditolak. Alasan: Room not available at requested time",
          "user",
          "/me/bookings",
        ]
      );
    });

    it("should continue if email notification fails", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([]));

      (global.fetch as unknown as jest.Mock).mockRejectedValue(
        new Error("Email service down")
      );

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil ditolak.");
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to send notification"),
        expect.any(Error)
      );
    });

    it("should continue if notification record creation fails", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockRejectedValueOnce(createMockDBError("Notification insert failed"));

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil ditolak.");
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to create notification record"),
        expect.any(Error)
      );
    });

    it("should handle missing reservation details gracefully", async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce(createMockQueryResult([])); // No details found

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil ditolak.");
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Could not find details for rejected reservation"
        )
      );
    });

    it("should handle details fetch error gracefully", async () => {
      // Arrange
      mockQuery.mockRejectedValueOnce(
        createMockDBError("Details query failed")
      );

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil ditolak.");
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching details for notification"),
        expect.any(Error)
      );
    });
  });

  describe("Path Revalidation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      });

      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        };
        return await callback(mockClient);
      });

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([]));
    });

    it("should revalidate relevant paths after successful rejection", async () => {
      // Act
      await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(mockRevalidatePath).toHaveBeenCalledWith(
        "/admin/rooms/reservations"
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith(
        "/admin/rooms/reservations/123/reject"
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/me/bookings");
    });
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      });
    });

    it("should handle very long rejection reason", async () => {
      // Arrange
      const longReason = "A".repeat(1000);
      const longReasonFormData = new FormData();
      longReasonFormData.append("reservationId", "123");
      longReasonFormData.append("rejectionReason", longReason);

      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        };
        return await callback(mockClient);
      });

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Test Room",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([]));

      // Act
      const result = await rejectReservationAction(
        initialState,
        longReasonFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(mockWithTransaction).toHaveBeenCalled();
    });

    it("should handle special characters in rejection reason", async () => {
      // Arrange
      const specialReason =
        "Reason with 'quotes' & \"double quotes\" and \n newlines";
      const specialFormData = new FormData();
      specialFormData.append("reservationId", "123");
      specialFormData.append("rejectionReason", specialReason);

      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        };
        return await callback(mockClient);
      });

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Test Room",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([]));

      // Act
      const result = await rejectReservationAction(
        initialState,
        specialFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(mockWithTransaction).toHaveBeenCalled();
    });

    it("should handle missing BETTER_AUTH_URL environment variable", async () => {
      // Arrange
      delete process.env.BETTER_AUTH_URL;

      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        };
        return await callback(mockClient);
      });

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([]));

      // Act
      const result = await rejectReservationAction(initialState, mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/reservations/notify",
        expect.any(Object)
      );
    });
  });
});
