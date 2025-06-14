import { acceptReservationAction } from "@/features/reservations/api/acceptReservationAction";
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
jest.mock("@/features/application/api/getLookupValue");

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getLookupsByCategory } from "@/features/application/api/getLookupValue";

// Cast to get access to mock functions
const mockQuery = (db as any).query;
const mockAuth = (auth as any).api.getSession;

// Get mockWithTransaction from the mock module
const mockWithTransaction = jest.fn();
// Override the db's withTransaction with our mock
(db as any).withTransaction = mockWithTransaction;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<
  typeof revalidatePath
>;
const mockGetLookupsByCategory = getLookupsByCategory as jest.MockedFunction<
  typeof getLookupsByCategory
>;

describe("acceptReservationAction", () => {
  let mockFormData: FormData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    console.error = jest.fn();
    console.log = jest.fn();

    // Mock headers
    mockHeaders.mockResolvedValue(new Headers());

    // Create mock form data
    mockFormData = new FormData();
    mockFormData.append("reservationId", "123");

    // Mock fetch for notifications
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  describe("Authentication & Authorization", () => {
    it("should reject when user is not authenticated", async () => {
      // Arrange
      mockAuth.mockResolvedValue(null);

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Tidak diizinkan: Hanya admin yang dapat menerima reservasi.",
      });
    });

    it("should reject when user is not admin", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: "user123", role: "user" }, // Not admin
      });

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Tidak diizinkan: Hanya admin yang dapat menerima reservasi.",
      });
    });

    it("should proceed when user is admin", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: "admin123", role: "admin" },
      });

      mockGetLookupsByCategory.mockResolvedValue([
        { id: "approved-id", value: "Approved", code: "APPROVED" },
      ]);

      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        };
        return await callback(mockClient);
      });

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Fetch details
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
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil diterima.");
    });
  });

  describe("Input Validation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "admin123", role: "admin" },
      });
    });

    it("should validate reservation ID", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("reservationId", ""); // Empty ID

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        invalidFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Validasi gagal.");
      expect(result.errors?.reservationId).toContain(
        "ID reservasi diperlukan."
      );
    });
  });

  describe("Status Configuration", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "admin123", role: "admin" },
      });
    });

    it("should handle missing approved status", async () => {
      // Arrange
      mockGetLookupsByCategory.mockResolvedValue([]); // No statuses found

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Kesalahan konfigurasi: Status 'Approved' tidak ditemukan."
      );
    });

    it("should handle wrong status value", async () => {
      // Arrange
      mockGetLookupsByCategory.mockResolvedValue([
        { id: "pending-id", value: "Pending", code: "PENDING" },
        // Missing Approved status
      ]);

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Kesalahan konfigurasi: Status 'Approved' tidak ditemukan."
      );
    });
  });

  describe("Database Operations", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "admin123", role: "admin" },
      });

      mockGetLookupsByCategory.mockResolvedValue([
        { id: "approved-id", value: "Approved", code: "APPROVED" },
      ]);
    });

    it("should successfully update reservation status", async () => {
      // Arrange
      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        };
        return await callback(mockClient);
      });

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Fetch details
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([])); // Notification insert

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil diterima.");
      expect(mockWithTransaction).toHaveBeenCalled();
    });

    it("should handle reservation not found", async () => {
      // Arrange
      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 0 }), // No rows updated
        };
        return await callback(mockClient);
      });

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain("Reservation with ID 123 not found");
    });

    it("should handle database transaction errors", async () => {
      // Arrange
      mockWithTransaction.mockRejectedValue(new Error("Database error"));

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain("Gagal menerima reservasi");
    });
  });

  describe("Notification Handling", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "admin123", role: "admin" },
      });

      mockGetLookupsByCategory.mockResolvedValue([
        { id: "approved-id", value: "Approved", code: "APPROVED" },
      ]);

      mockWithTransaction.mockImplementation(async (callback: any) => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        };
        return await callback(mockClient);
      });
    });

    it("should send email notification successfully", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Fetch details
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([])); // Notification insert

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/reservations/notify"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining('"status":"approved"'),
        })
      );
    });

    it("should create notification record", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Fetch details
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([])); // Notification insert

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO notification"),
        expect.arrayContaining([
          "user123",
          "Reservasi Disetujui",
          expect.stringContaining("Conference Room A"),
          "user",
          "/me/bookings",
        ])
      );
    });

    it("should continue even if email notification fails", async () => {
      // Arrange
      global.fetch = jest
        .fn()
        .mockRejectedValue(new Error("Email service down"));

      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Fetch details
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockResolvedValueOnce(createMockQueryResult([])); // Notification insert

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true); // Should still succeed
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to send notification"),
        expect.any(Error)
      );
    });

    it("should continue even if notification record creation fails", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(
          createMockQueryResult([
            // Fetch details
            {
              userEmail: "user@example.com",
              userName: "Test User",
              roomName: "Conference Room A",
              userId: "user123",
            },
          ])
        )
        .mockRejectedValueOnce(new Error("Notification insert failed"));

      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true); // Should still succeed
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to create notification record"),
        expect.any(Error)
      );
    });
  });

  describe("Path Revalidation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "admin123", role: "admin" },
      });

      mockGetLookupsByCategory.mockResolvedValue([
        { id: "approved-id", value: "Approved", code: "APPROVED" },
      ]);

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

    it("should revalidate relevant paths", async () => {
      // Act
      const result = await acceptReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(mockRevalidatePath).toHaveBeenCalledWith(
        "/admin/rooms/reservations"
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith(
        "/admin/rooms/reservations/123/confirmation"
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/me/bookings");
    });
  });
});
