import { createReservationAction } from "@/features/reservations/api/createReservation";
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
jest.mock("@/features/reservations/api/sendAdminNotification");

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { sendAdminNotification } from "@/features/reservations/api/sendAdminNotification";

// Cast to get access to mock functions
const mockQuery = (db as any).query;
const mockConnect = (db as any).connect;
const mockAuth = (auth as any).api.getSession;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<
  typeof revalidatePath
>;
const mockSendAdminNotification = sendAdminNotification as jest.MockedFunction<
  typeof sendAdminNotification
>;

describe("createReservation", () => {
  let mockClient: any;
  let mockFormData: FormData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock database client
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };

    mockConnect.mockResolvedValue(mockClient);

    // Mock headers
    mockHeaders.mockResolvedValue(new Headers());

    // Create mock form data
    mockFormData = new FormData();
    mockFormData.append("roomId", "1");
    mockFormData.append("title", "Test Meeting");
    mockFormData.append("description", "Test Description");
    mockFormData.append("start_time", "2024-12-15T10:00:00.000Z");
    mockFormData.append("end_time", "2024-12-15T12:00:00.000Z");

    // Mock sendAdminNotification
    mockSendAdminNotification.mockResolvedValue(true);
  });

  describe("Authentication", () => {
    it("should return authentication error when user is not logged in", async () => {
      // Arrange
      mockAuth.mockResolvedValue(null);

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Autentikasi diperlukan",
      });
      expect(mockConnect).not.toHaveBeenCalled();
    });

    it("should return authentication error when user id is missing", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: undefined },
      });

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Autentikasi diperlukan",
      });
    });
  });

  describe("Input Validation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Test User", email: "test@example.com" },
      });
    });

    it("should validate required fields", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("roomId", "");
      invalidFormData.append("title", "");

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        invalidFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Data tidak valid. Silakan periksa kolom-kolom yang diisi."
      );
      expect(result.fieldErrors).toBeDefined();
    });

    it("should validate end time is after start time", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("roomId", "1");
      invalidFormData.append("title", "Test Meeting");
      invalidFormData.append("description", "Test Description");
      invalidFormData.append("start_time", "2024-12-15T12:00:00.000Z");
      invalidFormData.append("end_time", "2024-12-15T10:00:00.000Z"); // Before start time

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        invalidFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.fieldErrors?.end_time).toContain(
        "Waktu selesai harus setelah waktu mulai"
      );
    });

    it("should validate duration does not exceed 24 hours", async () => {
      // Arrange
      const longDurationFormData = new FormData();
      longDurationFormData.append("roomId", "1");
      longDurationFormData.append("title", "Long Meeting");
      longDurationFormData.append("description", "Very long meeting");
      longDurationFormData.append("start_time", "2024-12-15T10:00:00.000Z");
      longDurationFormData.append("end_time", "2024-12-16T11:00:00.000Z"); // 25 hours later

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        longDurationFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Durasi reservasi tidak boleh melebihi 24 jam."
      );
      expect(result.fieldErrors?.end_time).toContain(
        "Durasi reservasi tidak boleh melebihi 24 jam."
      );
    });
  });

  describe("Database Operations", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Test User", email: "test@example.com" },
      });
    });

    it("should successfully create a reservation", async () => {
      // Arrange
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT reservation
          rows: [{ id: 1 }],
          rowCount: 1,
        })
        .mockResolvedValueOnce({
          // SELECT room info
          rows: [{ slug: "test-room", name: "Test Room" }],
        })
        .mockResolvedValueOnce(undefined) // INSERT notification
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil dibuat!");
      expect(result.reservationId).toBe(1);
      expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
      expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/v/test-room");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/me");
    });

    it("should handle database connection failure", async () => {
      // Arrange
      mockConnect.mockResolvedValue(null);

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Gagal membuat reservasi. Silakan coba lagi nanti."
      );
    });

    it("should handle reservation insertion failure", async () => {
      // Arrange
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT reservation fails
          rows: [],
          rowCount: 0,
        });

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Gagal membuat reservasi. Silakan coba lagi nanti."
      );
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    });

    it("should handle transaction rollback on error", async () => {
      // Arrange
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(new Error("Database error")); // INSERT fails

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Gagal membuat reservasi. Silakan coba lagi nanti."
      );
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("Notification Handling", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Test User", email: "test@example.com" },
      });

      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT reservation
          rows: [{ id: 1 }],
          rowCount: 1,
        })
        .mockResolvedValueOnce({
          // SELECT room info
          rows: [{ slug: "test-room", name: "Test Room" }],
        })
        .mockResolvedValueOnce(undefined) // INSERT notification
        .mockResolvedValueOnce(undefined); // COMMIT
    });

    it("should create notification record successfully", async () => {
      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO notification"),
        expect.arrayContaining([
          "Reservasi Baru Menunggu Persetujuan",
          expect.stringContaining("Test Room"),
          "admin",
          "/admin/rooms/test-room",
        ])
      );
    });

    it("should continue reservation creation even if email notification fails", async () => {
      // Arrange
      mockSendAdminNotification.mockResolvedValue(false);

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Reservasi berhasil dibuat!");
    });

    it("should handle missing room information gracefully", async () => {
      // Arrange - Reset all mocks first
      mockClient.query.mockReset();
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT reservation
          rows: [{ id: 1 }],
          rowCount: 1,
        })
        .mockResolvedValueOnce({
          // SELECT room info - empty result
          rows: [],
        })
        .mockResolvedValueOnce(undefined) // INSERT notification
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO notification"),
        expect.arrayContaining([
          "Reservasi Baru Menunggu Persetujuan",
          expect.stringContaining("ID: 1"), // Fallback to ID
          "admin",
          "/admin/reservations", // Fallback link
        ])
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/me");
    });
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Test User", email: "test@example.com" },
      });
    });

    it("should handle rollback failure gracefully", async () => {
      // Arrange
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(new Error("Insert error")) // INSERT fails
        .mockRejectedValueOnce(new Error("Rollback failed")); // ROLLBACK fails

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Gagal membuat reservasi. Silakan coba lagi nanti."
      );
    });

    it("should handle missing user name in session", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: "user123", email: "test@example.com" }, // No name
      });

      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT reservation
          rows: [{ id: 1 }],
          rowCount: 1,
        })
        .mockResolvedValueOnce({
          // SELECT room info
          rows: [{ slug: "test-room", name: "Test Room" }],
        })
        .mockResolvedValueOnce(undefined) // INSERT notification
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      const result = await createReservationAction(
        {
          success: false,
          message: "",
        },
        mockFormData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO notification"),
        expect.arrayContaining([
          "Reservasi Baru Menunggu Persetujuan",
          expect.stringContaining("user123"), // Falls back to user ID
          "admin",
          "/admin/rooms/test-room",
        ])
      );
    });
  });
});
