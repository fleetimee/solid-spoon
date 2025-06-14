import {
  deleteRoomAction,
  DeleteRoomFormState,
} from "@/features/rooms/api/deleteRoom";
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
const mockQuery = (db as any).query as jest.MockedFunction<any>;
const mockAuth = auth.api.getSession as jest.MockedFunction<any>;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<
  typeof revalidatePath
>;

describe("deleteRoomAction", () => {
  let mockFormData: FormData;
  const roomId = 123;
  const mockRoom = {
    id: 123,
    name: "Conference Room A",
    slug: "conference-room-a",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();

    // Mock headers
    mockHeaders.mockResolvedValue(new Headers());

    // Create mock form data
    mockFormData = new FormData();
    mockFormData.append("roomName", "Conference Room A");
    mockFormData.append("confirmName", "Conference Room A");
  });

  describe("Authentication", () => {
    it("should reject when user is not logged in", async () => {
      // Arrange
      mockAuth.mockResolvedValue(null);

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "You must be logged in to delete a room",
      });
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("should proceed when user is authenticated", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
        },
      });

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([mockRoom])) // Room lookup
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockResolvedValueOnce(undefined) // UPDATE room_image
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Room deleted successfully");
    });
  });

  describe("Input Validation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
        },
      });
    });

    it("should validate required room name", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("roomName", "");
      invalidFormData.append("confirmName", "Conference Room A");

      // Act
      const result = await deleteRoomAction(roomId, invalidFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Validation error");
      expect(result.error).toBe("Room name is required");
    });

    it("should validate required confirmation", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("roomName", "Conference Room A");
      invalidFormData.append("confirmName", "");

      // Act
      const result = await deleteRoomAction(roomId, invalidFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Validation error");
      expect(result.error).toBe("Confirmation is required");
    });

    it("should validate name confirmation matches", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("roomName", "Conference Room A");
      invalidFormData.append("confirmName", "Different Room Name");

      // Act
      const result = await deleteRoomAction(roomId, invalidFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Validation error");
      expect(result.error).toBe("Room name confirmation doesn't match");
    });

    it("should pass validation with matching names", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([mockRoom]))
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockResolvedValueOnce(undefined) // UPDATE room_image
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result.success).toBe(true);
    });
  });

  describe("Room Existence Validation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
        },
      });
    });

    it("should handle room not found", async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce(createMockQueryResult([])); // No room found

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Room not found or already deleted",
      });
    });

    it("should handle inactive room", async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce(createMockQueryResult([])); // Query filters by is_active = true

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Room not found or already deleted",
      });
    });

    it("should verify room name matches database", async () => {
      // Arrange
      const differentRoom = {
        id: 123,
        name: "Different Room Name",
        slug: "different-room",
      };
      mockQuery.mockResolvedValueOnce(createMockQueryResult([differentRoom]));

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Room name confirmation doesn't match",
        error: "Room name confirmation doesn't match",
      });
    });

    it("should use correct room lookup query", async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));

      // Act
      await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("SELECT id, name"),
        [roomId]
      );

      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("WHERE id = $1 AND is_active = true");
    });
  });

  describe("Database Operations", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
        },
      });

      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
    });

    it("should successfully delete room with transaction", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockResolvedValueOnce(undefined) // UPDATE room_image
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: true,
        message: "Room deleted successfully",
      });

      expect(mockQuery).toHaveBeenCalledWith("BEGIN");
      expect(mockQuery).toHaveBeenCalledWith("COMMIT");
    });

    it("should soft delete room by setting is_active to false", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockResolvedValueOnce(undefined) // UPDATE room_image
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      await deleteRoomAction(roomId, mockFormData);

      // Assert
      const roomUpdateQuery = mockQuery.mock.calls[2][0];
      expect(roomUpdateQuery).toContain("UPDATE room");
      expect(roomUpdateQuery).toContain("SET");
      expect(roomUpdateQuery).toContain("is_active = false");
      expect(roomUpdateQuery).toContain("updated_by = $1");
      expect(roomUpdateQuery).toContain("updated_at = NOW()");
      expect(roomUpdateQuery).toContain("WHERE id = $2");

      expect(mockQuery.mock.calls[2][1]).toEqual(["admin123", roomId]);
    });

    it("should soft delete associated room images", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockResolvedValueOnce(undefined) // UPDATE room_image
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      await deleteRoomAction(roomId, mockFormData);

      // Assert
      const imageUpdateQuery = mockQuery.mock.calls[3][0];
      expect(imageUpdateQuery).toContain("UPDATE room_image");
      expect(imageUpdateQuery).toContain("SET");
      expect(imageUpdateQuery).toContain("is_active = false");
      expect(imageUpdateQuery).toContain("updated_at = NOW()");
      expect(imageUpdateQuery).toContain("WHERE room_id = $1");

      expect(mockQuery.mock.calls[3][1]).toEqual([roomId]);
    });

    it("should rollback on room update error", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(createMockDBError("Room update failed")) // UPDATE room fails
        .mockResolvedValueOnce(undefined); // ROLLBACK

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Failed to delete room. Please try again.",
      });
      expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");
      expect(console.error).toHaveBeenCalledWith(
        "Failed to delete room:",
        expect.any(Error)
      );
    });

    it("should rollback on image update error", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockRejectedValueOnce(createMockDBError("Image update failed")) // UPDATE room_image fails
        .mockResolvedValueOnce(undefined); // ROLLBACK

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Failed to delete room. Please try again.",
      });
      expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");
    });

    it("should rollback on transaction error", async () => {
      // Arrange
      mockQuery.mockRejectedValueOnce(createMockDBError("Transaction failed")); // BEGIN fails

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Failed to delete room. Please try again.",
      });
      expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");
    });
  });

  describe("Path Revalidation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
        },
      });

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([mockRoom]))
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockResolvedValueOnce(undefined) // UPDATE room_image
        .mockResolvedValueOnce(undefined); // COMMIT
    });

    it("should revalidate relevant paths after successful deletion", async () => {
      // Act
      await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/rooms");
      expect(mockRevalidatePath).toHaveBeenCalledWith(
        "/admin/rooms/conference-room-a"
      );
    });

    it("should use room slug for specific path revalidation", async () => {
      // Arrange
      const roomWithDifferentSlug = {
        id: 123,
        name: "Conference Room A",
        slug: "custom-slug-name",
      };
      mockQuery.mockReset();
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([roomWithDifferentSlug]))
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockResolvedValueOnce(undefined) // UPDATE room_image
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(mockRevalidatePath).toHaveBeenCalledWith(
        "/admin/rooms/custom-slug-name"
      );
    });
  });

  describe("Error Scenarios", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
        },
      });
    });

    it("should handle database connection failure", async () => {
      // Arrange
      mockQuery.mockRejectedValue(createMockDBError("Connection failed"));

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Failed to delete room. Please try again.",
      });
    });

    it("should handle query timeout", async () => {
      // Arrange
      const timeoutError = new Error("Query timeout");
      mockQuery.mockRejectedValue(timeoutError);

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Failed to delete room. Please try again.",
      });
      expect(console.error).toHaveBeenCalledWith(
        "Failed to delete room:",
        timeoutError
      );
    });

    it("should handle constraint violation", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([mockRoom]))
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(createMockDBError("Foreign key constraint")); // UPDATE fails

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Failed to delete room. Please try again.",
      });
      expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");
    });
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: {
          id: "admin123",
          name: "Admin User",
          email: "admin@example.com",
        },
      });
    });

    it("should handle room name with special characters", async () => {
      // Arrange
      const specialRoom = {
        id: 123,
        name: "Room with 'quotes' & \"symbols\"",
        slug: "room-with-quotes-symbols",
      };
      const specialFormData = new FormData();
      specialFormData.append("roomName", "Room with 'quotes' & \"symbols\"");
      specialFormData.append("confirmName", "Room with 'quotes' & \"symbols\"");

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([specialRoom]))
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockResolvedValueOnce(undefined) // UPDATE room_image
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      const result = await deleteRoomAction(roomId, specialFormData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should handle very long room names", async () => {
      // Arrange
      const longName = "A".repeat(255);
      const longRoom = {
        id: 123,
        name: longName,
        slug: "long-room-name",
      };
      const longFormData = new FormData();
      longFormData.append("roomName", longName);
      longFormData.append("confirmName", longName);

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([longRoom]))
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockResolvedValueOnce(undefined) // UPDATE room_image
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      const result = await deleteRoomAction(roomId, longFormData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("should handle zero room ID", async () => {
      // Arrange
      const zeroIdFormData = new FormData();
      zeroIdFormData.append("roomName", "Test Room");
      zeroIdFormData.append("confirmName", "Test Room");

      mockQuery.mockResolvedValueOnce(createMockQueryResult([])); // No room found

      // Act
      const result = await deleteRoomAction(0, zeroIdFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Room not found or already deleted",
      });
    });

    it("should handle negative room ID", async () => {
      // Arrange
      const negativeIdFormData = new FormData();
      negativeIdFormData.append("roomName", "Test Room");
      negativeIdFormData.append("confirmName", "Test Room");

      mockQuery.mockResolvedValueOnce(createMockQueryResult([])); // No room found

      // Act
      const result = await deleteRoomAction(-1, negativeIdFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Room not found or already deleted",
      });
    });

    it("should handle missing slug in room data", async () => {
      // Arrange
      const roomWithoutSlug = {
        id: 123,
        name: "Conference Room A",
        slug: null, // Missing slug
      };
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([roomWithoutSlug]))
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce(undefined) // UPDATE room
        .mockResolvedValueOnce(undefined) // UPDATE room_image
        .mockResolvedValueOnce(undefined); // COMMIT

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/rooms");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/rooms/null");
    });
  });

  describe("Security Considerations", () => {
    it("should not allow deletion without authentication", async () => {
      // Arrange
      mockAuth.mockResolvedValue(null);

      // Act
      const result = await deleteRoomAction(roomId, mockFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("should require exact name match for confirmation", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: "admin123" },
      });

      const similarFormData = new FormData();
      similarFormData.append("roomName", "Conference Room A");
      similarFormData.append("confirmName", "conference room a"); // Different case

      // Act
      const result = await deleteRoomAction(roomId, similarFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Room name confirmation doesn't match");
    });

    it("should validate both form data and database data", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: "admin123" },
      });

      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([
          {
            id: 123,
            name: "Database Room Name",
            slug: "database-room",
          },
        ])
      );

      // Form data has different name than database
      const mismatchFormData = new FormData();
      mismatchFormData.append("roomName", "Form Room Name");
      mismatchFormData.append("confirmName", "Form Room Name");

      // Act
      const result = await deleteRoomAction(roomId, mismatchFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "Room name confirmation doesn't match",
        error: "Room name confirmation doesn't match",
      });
    });
  });
});
