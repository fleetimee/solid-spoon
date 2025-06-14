import {
  getRooms,
  getRoomById,
  getRoomBySlug,
  getActiveRoomsList,
  RoomSearchParams,
} from "@/features/rooms/api/getRooms";
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

describe("Rooms API", () => {
  beforeEach(() => {
    mockQuery.mockClear();
    console.error = jest.fn();
  });

  const mockRoom = {
    id: 1,
    name: "Conference Room A",
    location: "Floor 1",
    capacity: 10,
    description: "A modern conference room",
    facilities: "projector,whiteboard",
    slug: "conference-room-a",
    isActive: true,
    createdBy: "admin",
    updatedBy: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  describe("getRooms", () => {
    it("should fetch rooms with pagination", async () => {
      // Mock count query
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "5" }]));
      // Mock rooms query
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
      // Mock cover image query
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([{ imageUrl: "room1.jpg" }])
      );

      const result = await getRooms();

      expect(result.rooms).toHaveLength(1);
      expect(result.pagination.totalItems).toBe(5);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.pageSize).toBe(9);
      expect(result.rooms[0].coverImage).toBe("room1.jpg");
    });

    it("should apply search filter", async () => {
      const searchParams: RoomSearchParams = { search: "conference" };

      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getRooms(searchParams);

      const countQuery = mockQuery.mock.calls[0][0];
      const mainQuery = mockQuery.mock.calls[1][0];

      expect(countQuery).toContain("r.name ILIKE $1 OR r.description ILIKE $1");
      expect(mainQuery).toContain("r.name ILIKE $1 OR r.description ILIKE $1");
      expect(mockQuery.mock.calls[0][1]).toContain("%conference%");
    });

    it("should apply location filter", async () => {
      const searchParams: RoomSearchParams = { location: "Floor 1" };

      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getRooms(searchParams);

      const countQuery = mockQuery.mock.calls[0][0];
      expect(countQuery).toContain("r.location ILIKE");
      expect(mockQuery.mock.calls[0][1]).toContain("%Floor 1%");
    });

    it("should apply capacity filters", async () => {
      const searchParams: RoomSearchParams = {
        minCapacity: 5,
        maxCapacity: 20,
      };

      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getRooms(searchParams);

      const countQuery = mockQuery.mock.calls[0][0];
      expect(countQuery).toContain("r.capacity >= $1");
      expect(countQuery).toContain("r.capacity <= $2");
      expect(mockQuery.mock.calls[0][1]).toEqual(
        expect.arrayContaining([5, 20])
      );
    });

    it("should apply facilities filter", async () => {
      const searchParams: RoomSearchParams = {
        facilities: ["projector", "whiteboard"],
      };

      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getRooms(searchParams);

      const countQuery = mockQuery.mock.calls[0][0];
      expect(countQuery).toContain(
        "r.facilities ILIKE $1 OR r.facilities ILIKE $2"
      );
      expect(mockQuery.mock.calls[0][1]).toEqual(
        expect.arrayContaining(["%projector%", "%whiteboard%"])
      );
    });

    it("should handle custom pagination", async () => {
      const searchParams: RoomSearchParams = { page: 2, pageSize: 5 };

      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "15" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getRooms(searchParams);

      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.pageSize).toBe(5);
      expect(result.pagination.totalPages).toBe(3);

      // Check OFFSET and LIMIT parameters
      const params = mockQuery.mock.calls[1][1];
      expect(params[params.length - 2]).toBe(5); // OFFSET (page-1)*pageSize = 1*5
      expect(params[params.length - 1]).toBe(5); // LIMIT
    });

    it("should only fetch active rooms", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getRooms();

      const countQuery = mockQuery.mock.calls[0][0];
      const mainQuery = mockQuery.mock.calls[1][0];

      expect(countQuery).toContain("r.is_active = true");
      expect(mainQuery).toContain("r.is_active = true");
    });

    it("should handle rooms without cover images", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([])); // No cover image

      const result = await getRooms();

      expect(result.rooms[0].coverImage).toBeNull();
    });
  });

  describe("getRoomById", () => {
    it("should fetch room by ID", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([{ imageUrl: "room1.jpg" }])
      );

      const result = await getRoomById(1);

      expect(result).toEqual({ ...mockRoom, coverImage: "room1.jpg" });
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE r.id = $1 AND r.is_active = true"),
        [1]
      );
    });

    it("should return null when room not found", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getRoomById(999);

      expect(result).toBeNull();
    });

    it("should handle room without cover image", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([mockRoom]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getRoomById(1);

      expect(result?.coverImage).toBeNull();
    });
  });

  describe("getRoomBySlug", () => {
    const mockRoomWithUsers = {
      ...mockRoom,
      createdByName: "Admin User",
      updatedByName: "Admin User",
    };

    it("should fetch room by slug with user names", async () => {
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockRoomWithUsers])
      );
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([
          { imageUrl: "room1.jpg", isCover: true, sortOrder: 1 },
          { imageUrl: "room2.jpg", isCover: false, sortOrder: 2 },
        ])
      );

      const result = await getRoomBySlug("conference-room-a");

      expect(result).toMatchObject({
        ...mockRoomWithUsers,
        coverImage: "room1.jpg",
        images: ["room1.jpg", "room2.jpg"],
      });
    });

    it("should return null when room not found", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getRoomBySlug("nonexistent-room");

      expect(result).toBeNull();
    });

    it("should handle rooms without cover image", async () => {
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockRoomWithUsers])
      );
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([
          { imageUrl: "room1.jpg", isCover: false, sortOrder: 1 },
        ])
      );

      const result = await getRoomBySlug("conference-room-a");

      expect(result?.coverImage).toBe("room1.jpg"); // First image becomes cover
      expect(result?.images).toEqual(["room1.jpg"]);
    });

    it("should handle rooms with no images", async () => {
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockRoomWithUsers])
      );
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getRoomBySlug("conference-room-a");

      expect(result?.coverImage).toBeNull();
      expect(result?.images).toEqual([]);
    });

    it("should join with user tables for creator/updater names", async () => {
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockRoomWithUsers])
      );
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getRoomBySlug("conference-room-a");

      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain(
        'LEFT JOIN "user" creator ON r.created_by = creator.id'
      );
      expect(query).toContain(
        'LEFT JOIN "user" updater ON r.updated_by = updater.id'
      );
      expect(query).toContain('creator.name as "createdByName"');
      expect(query).toContain('updater.name as "updatedByName"');
    });
  });

  describe("getActiveRoomsList", () => {
    it("should fetch list of active rooms with ID and name only", async () => {
      const mockRoomsList = [
        { id: 1, name: "Conference Room A" },
        { id: 2, name: "Conference Room B" },
      ];

      mockQuery.mockResolvedValueOnce(createMockQueryResult(mockRoomsList));

      const result = await getActiveRoomsList();

      expect(result).toEqual(mockRoomsList);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /SELECT\s+id,\s*name\s+FROM\s+room\s+WHERE\s+is_active\s*=\s*true\s+ORDER\s+BY\s+name/
        )
      );
    });

    it("should return empty array when no active rooms", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getActiveRoomsList();

      expect(result).toEqual([]);
    });

    it("should order rooms by name", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getActiveRoomsList();

      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("ORDER BY name");
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors in getRooms", async () => {
      mockQuery.mockRejectedValueOnce(createMockDBError("Connection failed"));

      await expect(getRooms()).rejects.toThrow();
    });

    it("should handle database errors in getRoomById", async () => {
      mockQuery.mockRejectedValueOnce(createMockDBError("Connection failed"));

      await expect(getRoomById(1)).rejects.toThrow();
    });

    it("should handle database errors in getRoomBySlug", async () => {
      mockQuery.mockRejectedValueOnce(createMockDBError("Connection failed"));

      await expect(getRoomBySlug("test-room")).rejects.toThrow();
    });

    it("should handle database errors in getActiveRoomsList", async () => {
      mockQuery.mockRejectedValueOnce(createMockDBError("Connection failed"));

      await expect(getActiveRoomsList()).rejects.toThrow();
    });
  });
});
