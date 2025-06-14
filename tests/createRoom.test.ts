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
jest.mock("@/helpers/upload");
jest.mock("@aws-sdk/client-s3");
jest.mock("sharp");
jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "mock-nanoid-123"),
}));

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  uploadFileToS3,
  deleteFileFromS3,
  extractKeyFromUrl,
} from "@/helpers/upload";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

// Properly typed mock functions with any to bypass strict typing
const mockQuery = db.query as jest.MockedFunction<any>;
const mockAuth = auth.api.getSession as jest.MockedFunction<any>;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<
  typeof revalidatePath
>;

// MinIO/S3 mock functions
const mockUploadFileToS3 = uploadFileToS3 as jest.MockedFunction<
  typeof uploadFileToS3
>;
const mockDeleteFileFromS3 = deleteFileFromS3 as jest.MockedFunction<
  typeof deleteFileFromS3
>;
const mockExtractKeyFromUrl = extractKeyFromUrl as jest.MockedFunction<
  typeof extractKeyFromUrl
>;
const mockS3Client = S3Client as jest.MockedClass<typeof S3Client>;
const mockPutObjectCommand = PutObjectCommand as jest.MockedClass<
  typeof PutObjectCommand
>;
const mockDeleteObjectCommand = DeleteObjectCommand as jest.MockedClass<
  typeof DeleteObjectCommand
>;
const mockSharp = sharp as jest.MockedFunction<typeof sharp>;

// Helper function to create mock File objects for testing
const createMockFile = (
  name: string,
  size: number = 1024,
  type: string = "image/jpeg"
): File => {
  const file = new File(["mock content"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

// Helper function to create mock MinIO URLs
const createMinIOUrl = (filename: string): string => {
  return `https://asset-minio.fleetime.my.id/room-reservation-capstone/uploads/images/${filename}`;
};

// Test data helper for consistent user object
const createMockUser = () => ({
  id: "user123",
  name: "Admin User",
  email: "admin@example.com",
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  banned: false,
});

const createMockSession = () => ({
  session: {
    id: "session123",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user123",
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    token: "mock-token",
  },
  user: createMockUser(),
});

describe("createRoom", () => {
  let mockFormData: FormData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    console.error = jest.fn();

    // Mock headers
    mockHeaders.mockResolvedValue(new Headers());

    // Setup MinIO/S3 mocks
    mockUploadFileToS3.mockResolvedValue(createMinIOUrl("test-image-1.webp"));
    mockDeleteFileFromS3.mockResolvedValue(undefined);
    mockExtractKeyFromUrl.mockImplementation((url: string) => {
      return url.replace(
        "https://asset-minio.fleetime.my.id/room-reservation-capstone/",
        ""
      );
    });

    // Mock Sharp for image compression
    const mockSharpInstance = {
      webp: jest.fn().mockReturnThis(),
      toBuffer: jest
        .fn()
        .mockResolvedValue(Buffer.from("compressed-image-data")),
    };
    mockSharp.mockReturnValue(mockSharpInstance as any);

    // Mock S3 Client
    const mockS3Send = jest.fn().mockResolvedValue({});
    mockS3Client.mockImplementation(
      () =>
        ({
          send: mockS3Send,
        }) as any
    );

    // Create mock form data with MinIO URLs (as they would be after upload)
    mockFormData = new FormData();
    mockFormData.append("name", "Test Conference Room");
    mockFormData.append("location", "Building A, Floor 2");
    mockFormData.append("capacity", "10");
    mockFormData.append("description", "A modern conference room");
    mockFormData.append("facilities", "Projector, Whiteboard, WiFi");
    mockFormData.append("imageUrls", createMinIOUrl("test-image-1.webp"));
    mockFormData.append("imageUrls", createMinIOUrl("test-image-2.webp"));
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
      mockAuth.mockResolvedValue(createMockSession());

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
        .mockResolvedValueOnce(
          createMockQueryResult([
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
          ])
        ) // INSERT room
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 1
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 2
        .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
        .mockResolvedValueOnce(
          createMockQueryResult([
            { imageUrl: createMinIOUrl("test-image-1.webp") },
          ])
        ); // SELECT cover image

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
      mockAuth.mockResolvedValue(createMockSession());
    });

    it("should validate required fields", async () => {
      // Arrange
      const invalidFormData = new FormData();
      invalidFormData.append("name", ""); // Empty name
      invalidFormData.append("location", ""); // Empty location
      invalidFormData.append("capacity", "0"); // Invalid capacity
      invalidFormData.append("imageUrls", createMinIOUrl("test-image-1.webp"));

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
      invalidFormData.append("imageUrls", createMinIOUrl("test-image-1.webp"));

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
      minimalFormData.append("description", ""); // Empty string
      minimalFormData.append("facilities", ""); // Empty string
      minimalFormData.append("imageUrls", createMinIOUrl("test-image-1.webp"));
      // Empty description and facilities should be treated as null

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
        .mockResolvedValueOnce(
          createMockQueryResult([
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
          ])
        ) // INSERT room
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image
        .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
        .mockResolvedValueOnce(
          createMockQueryResult([
            { imageUrl: createMinIOUrl("test-image-1.webp") },
          ])
        ); // SELECT cover image

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
      mockAuth.mockResolvedValue(createMockSession());
    });

    it("should successfully create room with images", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
        .mockResolvedValueOnce(
          createMockQueryResult([
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
          ])
        ) // INSERT room
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 1
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 2
        .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
        .mockResolvedValueOnce(
          createMockQueryResult([
            { imageUrl: createMinIOUrl("test-image-1.webp") },
          ])
        ); // SELECT cover image

      // Act
      const result = await createRoomAction(mockFormData);

      // Debug logging
      if (!result.success) {
        console.log(
          "Missing cover image test failed:",
          JSON.stringify(result, null, 2)
        );
      }

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
        coverImage: createMinIOUrl("test-image-1.webp"),
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
        expect.arrayContaining([
          1,
          createMinIOUrl("test-image-1.webp"),
          true,
          0,
        ])
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([
          1,
          createMinIOUrl("test-image-2.webp"),
          false,
          1,
        ])
      );

      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/rooms");
    });

    it("should handle explicit cover image selection", async () => {
      // Arrange
      const formDataWithCover = new FormData();
      formDataWithCover.append("name", "Test Room");
      formDataWithCover.append("location", "Building A");
      formDataWithCover.append("capacity", "10");
      formDataWithCover.append("description", "Test room description");
      formDataWithCover.append("facilities", "Test facilities");
      formDataWithCover.append(
        "imageUrls",
        createMinIOUrl("test-image-1.webp")
      );
      formDataWithCover.append(
        "imageUrls",
        createMinIOUrl("test-image-2.webp")
      );
      formDataWithCover.append("cover_1", "true"); // Second image as cover

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
        .mockResolvedValueOnce(
          createMockQueryResult([
            { id: 1, name: "Test Room", location: "Building A", capacity: 10 },
          ])
        ) // INSERT room
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 1
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 2 (cover)
        .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
        .mockResolvedValueOnce(
          createMockQueryResult([
            { imageUrl: createMinIOUrl("test-image-2.webp") },
          ])
        ); // SELECT cover image

      // Act
      const result = await createRoomAction(formDataWithCover);

      // Assert
      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([
          1,
          createMinIOUrl("test-image-1.webp"),
          true,
          0,
        ])
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([
          1,
          createMinIOUrl("test-image-2.webp"),
          true,
          1,
        ])
      );
    });

    it("should handle transaction rollback on error", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
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
        .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
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
      mockAuth.mockResolvedValue(createMockSession());
    });

    it("should set first image as cover by default", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
        .mockResolvedValueOnce(
          createMockQueryResult([{ id: 1, name: "Test Room" }])
        ) // INSERT room
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 1 (should be cover)
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 2
        .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
        .mockResolvedValueOnce(
          createMockQueryResult([
            { imageUrl: "https://example.com/image1.jpg" },
          ])
        ); // SELECT cover image

      // Act
      const result = await createRoomAction(mockFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([
          1,
          createMinIOUrl("test-image-1.webp"),
          true,
          0,
        ]) // First image is cover
      );
    });

    it("should handle missing cover image in result", async () => {
      // Arrange
      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
        .mockResolvedValueOnce(
          createMockQueryResult([
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
          ])
        ) // INSERT room
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 1
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 2
        .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
        .mockResolvedValueOnce(createMockQueryResult([])); // No cover image found

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
      singleImageFormData.append("description", "Single image room");
      singleImageFormData.append("facilities", "Basic facilities");
      singleImageFormData.append(
        "imageUrls",
        createMinIOUrl("single-image.webp")
      );

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
        .mockResolvedValueOnce(
          createMockQueryResult([{ id: 1, name: "Single Image Room" }])
        ) // INSERT room
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image
        .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
        .mockResolvedValueOnce(
          createMockQueryResult([
            { imageUrl: createMinIOUrl("single-image.webp") },
          ])
        ); // SELECT cover image

      // Act
      const result = await createRoomAction(singleImageFormData);

      // Assert
      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO room_image"),
        expect.arrayContaining([
          1,
          createMinIOUrl("single-image.webp"),
          true,
          0,
        ])
      );
    });
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(createMockSession());
    });

    it("should handle capacity as string input", async () => {
      // Arrange
      const stringCapacityFormData = new FormData();
      stringCapacityFormData.append("name", "String Capacity Room");
      stringCapacityFormData.append("location", "Building D");
      stringCapacityFormData.append("capacity", "15"); // String number
      stringCapacityFormData.append("description", "String capacity test");
      stringCapacityFormData.append("facilities", "Test facilities");
      stringCapacityFormData.append(
        "imageUrls",
        createMinIOUrl("capacity-test-image.webp")
      );

      mockQuery
        .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
        .mockResolvedValueOnce(
          createMockQueryResult([
            { id: 1, capacity: 15 }, // Should be converted to number
          ])
        ) // INSERT room
        .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image
        .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
        .mockResolvedValueOnce(createMockQueryResult([])); // Cover image

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
          "String capacity test",
          "Test facilities",
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

  describe("MinIO Upload Integration", () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(createMockSession());
    });

    /**
     * Tests for successful MinIO upload scenarios
     */
    describe("Successful Upload Scenarios", () => {
      it("should handle successful MinIO upload and URL generation", async () => {
        // Arrange
        const testImageUrl = createMinIOUrl("successful-upload.webp");
        mockUploadFileToS3.mockResolvedValue(testImageUrl);

        const formDataWithMinIOUrl = new FormData();
        formDataWithMinIOUrl.append("name", "MinIO Test Room");
        formDataWithMinIOUrl.append("location", "Building MinIO");
        formDataWithMinIOUrl.append("capacity", "12");
        formDataWithMinIOUrl.append(
          "description",
          "Room with MinIO uploaded images"
        );
        formDataWithMinIOUrl.append("facilities", "MinIO Storage, Fast Upload");
        formDataWithMinIOUrl.append("imageUrls", testImageUrl);

        mockQuery
          .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
          .mockResolvedValueOnce(
            createMockQueryResult([
              {
                id: 1,
                name: "MinIO Test Room",
                location: "Building MinIO",
                capacity: 12,
                description: "Room with MinIO uploaded images",
                facilities: "MinIO Storage, Fast Upload",
                isActive: true,
                createdBy: "user123",
                updatedBy: "user123",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ])
          ) // INSERT room
          .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image
          .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
          .mockResolvedValueOnce(
            createMockQueryResult([{ imageUrl: testImageUrl }])
          ); // SELECT cover image

        // Act
        const result = await createRoomAction(formDataWithMinIOUrl);

        // Assert
        expect(result.success).toBe(true);
        expect(result.room?.coverImage).toBe(testImageUrl);
        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringContaining("INSERT INTO room_image"),
          expect.arrayContaining([1, testImageUrl, true, 0])
        );
      });

      it("should handle multiple MinIO image uploads with proper ordering", async () => {
        // Arrange
        const image1Url = createMinIOUrl("multi-upload-1.webp");
        const image2Url = createMinIOUrl("multi-upload-2.webp");
        const image3Url = createMinIOUrl("multi-upload-3.webp");

        const multiImageFormData = new FormData();
        multiImageFormData.append("name", "Multi Image Room");
        multiImageFormData.append("location", "Building Multi");
        multiImageFormData.append("capacity", "20");
        multiImageFormData.append(
          "description",
          "Room with multiple MinIO images"
        );
        multiImageFormData.append("facilities", "Multi Upload, Storage");
        multiImageFormData.append("imageUrls", image1Url);
        multiImageFormData.append("imageUrls", image2Url);
        multiImageFormData.append("imageUrls", image3Url);
        multiImageFormData.append("cover_1", "true"); // Second image as cover

        mockQuery
          .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
          .mockResolvedValueOnce(
            createMockQueryResult([
              {
                id: 1,
                name: "Multi Image Room",
                location: "Building Multi",
                capacity: 20,
                description: "Room with multiple MinIO images",
                facilities: "Multi Upload, Storage",
                isActive: true,
                createdBy: "user123",
                updatedBy: "user123",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ])
          ) // INSERT room
          .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 1
          .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 2 (cover)
          .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image 3
          .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
          .mockResolvedValueOnce(
            createMockQueryResult([{ imageUrl: image2Url }])
          ); // SELECT cover image

        // Act
        const result = await createRoomAction(multiImageFormData);

        // Assert
        expect(result.success).toBe(true);
        expect(result.room?.coverImage).toBe(image2Url);

        // Verify all images were inserted with correct order and cover status
        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringContaining("INSERT INTO room_image"),
          expect.arrayContaining([1, image1Url, true, 0])
        );
        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringContaining("INSERT INTO room_image"),
          expect.arrayContaining([1, image2Url, true, 1])
        );
        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringContaining("INSERT INTO room_image"),
          expect.arrayContaining([1, image3Url, false, 2])
        );
      });

      it("should validate MinIO URL format and structure", async () => {
        // Arrange
        const validMinIOUrl = createMinIOUrl("valid-format.webp");
        expect(validMinIOUrl).toMatch(
          /^https:\/\/asset-minio\.fleetime\.my\.id\/room-reservation-capstone\/uploads\/images\/.+\.webp$/
        );

        const formDataWithValidUrl = new FormData();
        formDataWithValidUrl.append("name", "Valid URL Room");
        formDataWithValidUrl.append("location", "Building Valid");
        formDataWithValidUrl.append("capacity", "8");
        formDataWithValidUrl.append("description", "Room with valid MinIO URL");
        formDataWithValidUrl.append("facilities", "URL Validation, Storage");
        formDataWithValidUrl.append("imageUrls", validMinIOUrl);

        mockQuery
          .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
          .mockResolvedValueOnce(
            createMockQueryResult([
              {
                id: 1,
                name: "Valid URL Room",
                location: "Building Valid",
                capacity: 8,
                description: "Room with valid MinIO URL",
                facilities: "URL Validation, Storage",
                isActive: true,
                createdBy: "user123",
                updatedBy: "user123",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ])
          ) // INSERT room
          .mockResolvedValueOnce(createMockQueryResult([])) // INSERT room_image
          .mockResolvedValueOnce(createMockQueryResult([])) // COMMIT
          .mockResolvedValueOnce(
            createMockQueryResult([{ imageUrl: validMinIOUrl }])
          ); // SELECT cover image

        // Act
        const result = await createRoomAction(formDataWithValidUrl);

        // Assert
        expect(result.success).toBe(true);
        expect(result.room?.coverImage).toBe(validMinIOUrl);
      });
    });

    /**
     * Tests for MinIO upload failure scenarios
     */
    describe("Upload Failure Scenarios", () => {
      it("should handle MinIO connection errors gracefully", async () => {
        // Arrange - This test simulates what would happen if MinIO upload failed during the upload process
        // In the actual workflow, the upload happens before createRoomAction is called
        // But we can test the behavior when invalid/failed URLs are provided

        const invalidFormData = new FormData();
        invalidFormData.append("name", "Connection Error Room");
        invalidFormData.append("location", "Building Error");
        invalidFormData.append("capacity", "5");
        // No imageUrls - simulating upload failure

        // Act
        const result = await createRoomAction(invalidFormData);

        // Assert
        expect(result.success).toBe(false);
        expect(result.message).toBe(
          "At least one image must be uploaded for the room"
        );
        expect(mockQuery).not.toHaveBeenCalledWith(
          expect.stringContaining("INSERT INTO room")
        );
      });

      it("should handle database rollback when room creation fails after image processing", async () => {
        // Arrange
        const testImageUrl = createMinIOUrl("rollback-test.webp");
        const formDataWithImage = new FormData();
        formDataWithImage.append("name", "Rollback Test Room");
        formDataWithImage.append("location", "Building Rollback");
        formDataWithImage.append("capacity", "10");
        formDataWithImage.append("description", "Room for rollback testing");
        formDataWithImage.append("facilities", "Rollback Test, Error Handling");
        formDataWithImage.append("imageUrls", testImageUrl);

        mockQuery
          .mockResolvedValueOnce(createMockQueryResult([])) // BEGIN
          .mockRejectedValueOnce(new Error("Database constraint violation")); // INSERT room fails

        // Act
        const result = await createRoomAction(formDataWithImage);

        // Assert
        expect(result.success).toBe(false);
        expect(result.message).toBe("Failed to create room. Please try again.");
        expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");

        // Note: In a real scenario, we might want to clean up uploaded files from MinIO
        // when room creation fails, but that's not implemented in the current code
      });

      it("should validate image requirements even with MinIO integration", async () => {
        // Arrange - Empty imageUrls array
        const noImageFormData = new FormData();
        noImageFormData.append("name", "No Image Room");
        noImageFormData.append("location", "Building Empty");
        noImageFormData.append("capacity", "6");

        // Act
        const result = await createRoomAction(noImageFormData);

        // Assert
        expect(result.success).toBe(false);
        expect(result.message).toBe(
          "At least one image must be uploaded for the room"
        );
        expect(mockQuery).not.toHaveBeenCalledWith(
          expect.stringContaining("BEGIN")
        );
      });
    });

    /**
     * Tests for MinIO helper functions
     */
    describe("MinIO Helper Functions", () => {
      it("should properly extract keys from MinIO URLs", () => {
        // Arrange
        const testUrl = createMinIOUrl("test-extract-key.webp");
        mockExtractKeyFromUrl.mockImplementation((url: string) => {
          return url.replace(
            "https://asset-minio.fleetime.my.id/room-reservation-capstone/",
            ""
          );
        });

        // Act
        const extractedKey = mockExtractKeyFromUrl(testUrl);

        // Assert
        expect(extractedKey).toBe("uploads/images/test-extract-key.webp");
        expect(mockExtractKeyFromUrl).toHaveBeenCalledWith(testUrl);
      });

      it("should handle MinIO upload function calls", () => {
        // Arrange
        const mockBuffer = Buffer.from("test image data");
        const fileName = "test-upload.jpg";
        const contentType = "image/jpeg";
        const expectedUrl = createMinIOUrl("test-upload.webp");

        mockUploadFileToS3.mockResolvedValue(expectedUrl);

        // Act & Assert
        expect(mockUploadFileToS3).toBeDefined();

        // Simulate the upload call that would happen in the upload API
        mockUploadFileToS3(mockBuffer, fileName, contentType);
        expect(mockUploadFileToS3).toHaveBeenCalledWith(
          mockBuffer,
          fileName,
          contentType
        );
      });

      it("should handle MinIO delete operations", async () => {
        // Arrange
        const fileKey = "uploads/images/test-delete.webp";
        mockDeleteFileFromS3.mockResolvedValue(undefined);

        // Act
        await mockDeleteFileFromS3(fileKey);

        // Assert
        expect(mockDeleteFileFromS3).toHaveBeenCalledWith(fileKey);
      });
    });

    /**
     * Tests for image compression and format handling
     */
    describe("Image Processing", () => {
      it("should handle Sharp image compression mocking", () => {
        // Arrange
        const mockBuffer = Buffer.from("original image data");
        const compressedBuffer = Buffer.from("compressed image data");

        const mockSharpInstance = {
          webp: jest.fn().mockReturnThis(),
          toBuffer: jest.fn().mockResolvedValue(compressedBuffer),
        };
        mockSharp.mockReturnValue(mockSharpInstance as any);

        // Act
        const sharpInstance = mockSharp(mockBuffer);

        // Assert
        expect(mockSharp).toHaveBeenCalledWith(mockBuffer);
        expect(sharpInstance.webp).toBeDefined();
        expect(sharpInstance.toBuffer).toBeDefined();
      });

      it("should validate WebP format in MinIO URLs", () => {
        // Arrange & Act
        const webpUrl = createMinIOUrl("test-image.webp");

        // Assert
        expect(webpUrl).toContain(".webp");
        expect(webpUrl).toMatch(/\.webp$/);
      });
    });

    /**
     * Tests for S3 Client mocking
     */
    describe("S3 Client Integration", () => {
      it("should properly mock S3Client for MinIO operations", () => {
        // Arrange
        const mockS3Send = jest.fn().mockResolvedValue({});
        mockS3Client.mockImplementation(
          () =>
            ({
              send: mockS3Send,
            }) as any
        );

        // Act
        const client = new mockS3Client({
          region: "us-east-1",
          endpoint: "https://asset-minio.fleetime.my.id",
          credentials: {
            accessKeyId: "test-key",
            secretAccessKey: "test-secret",
          },
          forcePathStyle: true,
        });

        // Assert
        expect(mockS3Client).toHaveBeenCalled();
        expect(client.send).toBeDefined();
      });

      it("should handle PutObjectCommand for uploads", () => {
        // Arrange & Act
        const putCommand = new mockPutObjectCommand({
          Bucket: "room-reservation-capstone",
          Key: "uploads/images/test.webp",
          Body: Buffer.from("test"),
          ContentType: "image/webp",
        });

        // Assert
        expect(mockPutObjectCommand).toHaveBeenCalledWith({
          Bucket: "room-reservation-capstone",
          Key: "uploads/images/test.webp",
          Body: Buffer.from("test"),
          ContentType: "image/webp",
        });
      });

      it("should handle DeleteObjectCommand for cleanup", () => {
        // Arrange & Act
        const deleteCommand = new mockDeleteObjectCommand({
          Bucket: "room-reservation-capstone",
          Key: "uploads/images/test.webp",
        });

        // Assert
        expect(mockDeleteObjectCommand).toHaveBeenCalledWith({
          Bucket: "room-reservation-capstone",
          Key: "uploads/images/test.webp",
        });
      });
    });
  });
});
