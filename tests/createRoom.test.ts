import { createRoomAction } from "@/features/rooms/api/createRoom";
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

describe("createRoom", () => {
  let mockFormData: FormData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    console.error = jest.fn();

    // Mock headers
    mockHeaders.mockResolvedValue(new Headers());

    // Create mock form data
    mockFormData = new FormData();
    mockFormData.append("name", "Test Conference Room");
    mockFormData.append("location", "Building A, Floor 2");
    mockFormData.append("capacity", "10");
    mockFormData.append("description", "A modern conference room");
    mockFormData.append("facilities", "Projector, Whiteboard, WiFi");
    mockFormData.append("imageUrls", "https://example.com/image1.jpg");
    mockFormData.append("imageUrls", "https://example.com/image2.jpg");
  });

  describe("Authentication", () => {
    it("should return error when user is not authenticated", async () => {
      // Arrange
      mockAuth.mockResolvedValue(null);

      // Act
      const result = await createRoomAction(mockFormData);

      // Assert
      expect(result).toEqual({
        success: false,
        message: "You must be logged in to create a room",
      });
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("should proceed when user is authenticated", async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Admin User" },
      });

      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT room
          rows: [
            {
              id: 1,
              name: "Test Conference Room",
              location: "Building A, Floor 2",
              capacity: 10,
              description: "A modern conference room",
              facilities: "Projector, Whiteboard, WiFi",
              isActive: true,
              createdBy: "user123",
              updatedBy: "user123",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })
        .mockResolvedValueOnce(undefined) // INSERT room_image 1
        .mockResolvedValueOnce(undefined) // INSERT room_image 2
        .mockResolvedValueOnce(undefined) // COMMIT
        .mockResolvedValueOnce({
          // SELECT cover image
          rows: [{ imageUrl: "https://example.com/image1.jpg" }],
        });

      // Act
      const result = await createRoomAction(mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Room created successfully");
      expect(result.room).toBeDefined();
      expect(mockAuth).toHaveBeenCalled();
    });
  });

  describe("Input Validation", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Admin User" },
      });
    });

    it("should validate required fields", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("name", ""); // Empty name
      invalidFormData.append("location", ""); // Empty location
      invalidFormData.append("capacity", "0"); // Invalid capacity
      invalidFormData.append("imageUrls", "https://example.com/image1.jpg");

      // Act
      const result = await createRoomAction(invalidFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid room data");
      expect(result.fieldErrors).toBeDefined();
      expect(result.fieldErrors?.name).toContain("Room name is required");
      expect(result.fieldErrors?.location).toContain("Location is required");
      expect(result.fieldErrors?.capacity).toContain(
        "Capacity must be at least 1"
      );
    });

    it("should validate capacity limits", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("name", "Test Room");
      invalidFormData.append("location", "Building A");
      invalidFormData.append("capacity", "1001"); // Exceeds limit
      invalidFormData.append("imageUrls", "https://example.com/image1.jpg");

      // Act
      const result = await createRoomAction(invalidFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.fieldErrors?.capacity).toContain(
        "Capacity cannot exceed 1000"
      );
    });

    it("should require at least one image", async () => {
      // Arrange
      const formDataNoImages = new FormData();
      formDataNoImages.append("name", "Test Room");
      formDataNoImages.append("location", "Building A");
      formDataNoImages.append("capacity", "10");

      // Act
      const result = await createRoomAction(formDataNoImages);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "At least one image must be uploaded for the room"
      );
    });

    it("should handle optional fields", async () => {
      // Arrange
      const minimalFormData = new FormData();
      minimalFormData.append("name", "Minimal Room");
      minimalFormData.append("location", "Building B");
      minimalFormData.append("capacity", "5");
      minimalFormData.append("imageUrls", "https://example.com/image1.jpg");
      // No description or facilities

      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT room
          rows: [
            {
              id: 2,
              name: "Minimal Room",
              location: "Building B",
              capacity: 5,
              description: null,
              facilities: null,
              isActive: true,
              createdBy: "user123",
              updatedBy: "user123",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })
        .mockResolvedValueOnce(undefined) // INSERT room_image
        .mockResolvedValueOnce(undefined) // COMMIT
        .mockResolvedValueOnce({
          // SELECT cover image
          rows: [{ imageUrl: "https://example.com/image1.jpg" }],
        });

      // Act
      const result = await createRoomAction(minimalFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.room?.description).toBeNull();
      expect(result.room?.facilities).toBeNull();
    });
  });

  describe("Database Operations", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Admin User" },
      });
    });

    it("should successfully create room with images", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT room
          rows: [
            {
              id: 1,
              name: "Test Conference Room",
              location: "Building A, Floor 2",
              capacity: 10,
              description: "A modern conference room",
              facilities: "Projector, Whiteboard, WiFi",
              isActive: true,
              createdBy: "user123",
              updatedBy: "user123",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })
        .mockResolvedValueOnce(undefined) // INSERT room_image 1
        .mockResolvedValueOnce(undefined) // INSERT room_image 2
        .mockResolvedValueOnce(undefined) // COMMIT
        .mockResolvedValueOnce({
          // SELECT cover image
          rows: [{ imageUrl: "https://example.com/image1.jpg" }],
        });

      // Act
      const result = await createRoomAction(mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Room created successfully");
      expect(result.room).toEqual({
        id: 1,
        name: "Test Conference Room",
        location: "Building A, Floor 2",
        capacity: 10,
        description: "A modern conference room",
        facilities: "Projector, Whiteboard, WiFi",
        isActive: true,
        createdBy: "user123",
        updatedBy: "user123",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        coverImage: "https://example.com/image1.jpg",
      });

      // Verify room insertion
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room"),
        expect.arrayContaining([
          "Test Conference Room",
          "Building A, Floor 2",
          10,
          "A modern conference room",
          "Projector, Whiteboard, WiFi",
          "user123",
          "user123",
        ])
      );

      // Verify image insertions
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([1, "https://example.com/image1.jpg", true, 0])
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([1, "https://example.com/image2.jpg", false, 1])
      );

      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/rooms");
    });

    it("should handle explicit cover image selection", async () => {
      // Arrange
      const formDataWithCover = new FormData();
      formDataWithCover.append("name", "Test Room");
      formDataWithCover.append("location", "Building A");
      formDataWithCover.append("capacity", "10");
      formDataWithCover.append("imageUrls", "https://example.com/image1.jpg");
      formDataWithCover.append("imageUrls", "https://example.com/image2.jpg");
      formDataWithCover.append("cover_1", "true"); // Second image as cover

      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT room
          rows: [
            { id: 1, name: "Test Room", location: "Building A", capacity: 10 },
          ],
        })
        .mockResolvedValueOnce(undefined) // INSERT room_image 1
        .mockResolvedValueOnce(undefined) // INSERT room_image 2 (cover)
        .mockResolvedValueOnce(undefined) // COMMIT
        .mockResolvedValueOnce({
          // SELECT cover image
          rows: [{ imageUrl: "https://example.com/image2.jpg" }],
        });

      // Act
      const result = await createRoomAction(formDataWithCover);

      // Assert
      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([1, "https://example.com/image1.jpg", false, 0])
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([1, "https://example.com/image2.jpg", true, 1])
      );
    });

    it("should handle transaction rollback on error", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(new Error("Database error")); // INSERT room fails

      // Act
      const result = await createRoomAction(mockFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Failed to create room. Please try again.");
      expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");
    });

    it("should handle duplicate room name error", async () => {
      // Arrange
      const duplicateError = new Error(
        'duplicate key value violates unique constraint "room_name_key"'
      );
      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(duplicateError); // INSERT room fails with duplicate

      // Act
      const result = await createRoomAction(mockFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("A room with this name already exists");
    });
  });

  describe("Image Handling", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Admin User" },
      });
    });

    it("should set first image as cover by default", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT room
          rows: [{ id: 1, name: "Test Room" }],
        })
        .mockResolvedValueOnce(undefined) // INSERT room_image 1 (should be cover)
        .mockResolvedValueOnce(undefined) // INSERT room_image 2
        .mockResolvedValueOnce(undefined) // COMMIT
        .mockResolvedValueOnce({
          // SELECT cover image
          rows: [{ imageUrl: "https://example.com/image1.jpg" }],
        });

      // Act
      const result = await createRoomAction(mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([1, "https://example.com/image1.jpg", true, 0]) // First image is cover
      );
    });

    it("should handle missing cover image in result", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT room
          rows: [{ id: 1, name: "Test Room" }],
        })
        .mockResolvedValueOnce(undefined) // INSERT room_image
        .mockResolvedValueOnce(undefined) // COMMIT
        .mockResolvedValueOnce({ rows: [] }); // No cover image found

      // Act
      const result = await createRoomAction(mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.room?.coverImage).toBeUndefined();
    });

    it("should handle single image upload", async () => {
      // Arrange
      const singleImageFormData = new FormData();
      singleImageFormData.append("name", "Single Image Room");
      singleImageFormData.append("location", "Building C");
      singleImageFormData.append("capacity", "8");
      singleImageFormData.append("imageUrls", "https://example.com/single.jpg");

      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT room
          rows: [{ id: 1, name: "Single Image Room" }],
        })
        .mockResolvedValueOnce(undefined) // INSERT room_image
        .mockResolvedValueOnce(undefined) // COMMIT
        .mockResolvedValueOnce({
          // SELECT cover image
          rows: [{ imageUrl: "https://example.com/single.jpg" }],
        });

      // Act
      const result = await createRoomAction(singleImageFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([1, "https://example.com/single.jpg", true, 0])
      );
    });
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { id: "user123", name: "Admin User" },
      });
    });

    it("should handle capacity as string input", async () => {
      // Arrange
      const stringCapacityFormData = new FormData();
      stringCapacityFormData.append("name", "String Capacity Room");
      stringCapacityFormData.append("location", "Building D");
      stringCapacityFormData.append("capacity", "15"); // String number
      stringCapacityFormData.append(
        "imageUrls",
        "https://example.com/image.jpg"
      );

      mockQuery
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({
          // INSERT room
          rows: [{ id: 1, capacity: 15 }], // Should be converted to number
        })
        .mockResolvedValueOnce(undefined) // INSERT room_image
        .mockResolvedValueOnce(undefined) // COMMIT
        .mockResolvedValueOnce({ rows: [] }); // Cover image

      // Act
      const result = await createRoomAction(stringCapacityFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room"),
        expect.arrayContaining([
          "String Capacity Room",
          "Building D",
          15, // Should be number, not string
          null,
          null,
          "user123",
          "user123",
        ])
      );
    });

    it("should handle empty image URLs array", async () => {
      // Arrange
      const noImageFormData = new FormData();
      noImageFormData.append("name", "No Image Room");
      noImageFormData.append("location", "Building E");
      noImageFormData.append("capacity", "5");
      // No imageUrls appended

      // Act
      const result = await createRoomAction(noImageFormData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "At least one image must be uploaded for the room"
      );
    });
  });
});
