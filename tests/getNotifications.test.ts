import {
  getNotifications,
  getRecentNotifications,
} from "@/features/notifications/api/getNotifications";
import {
  testData,
  createMockQueryResult,
  createMockDBError,
} from "./setup.test";

// Mock the db module
jest.mock("@/lib/db");
// Mock the auth module
jest.mock("@/lib/auth");
// Mock Next.js headers
jest.mock("next/headers");

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Cast to get access to the mock functions
const mockQuery = (db as any).query;
const mockAuth = auth as any;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;

describe("Notifications API", () => {
  beforeEach(() => {
    mockQuery.mockClear();
    mockAuth.api = {
      getSession: jest.fn(),
    };
    mockHeaders.mockResolvedValue(new Headers());
    console.error = jest.fn();
  });

  const mockNotificationRow = {
    id: 1,
    recipient_id: "admin",
    title: "New Reservation",
    message: "A new reservation needs approval",
    is_read: false,
    type: "admin",
    link: "/admin/reservations",
    created_at: "2024-12-19T10:00:00Z",
    priority: "normal",
  };

  describe("getRecentNotifications", () => {
    it("should fetch recent notifications for logged-in user", async () => {
      mockAuth.api.getSession.mockResolvedValueOnce({
        user: { id: "user-123", name: "John Doe" },
      });
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockNotificationRow])
      );

      const result = await getRecentNotifications();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        recipient_id: "admin",
        title: "New Reservation",
        message: "A new reservation needs approval",
        isRead: false,
        type: "admin",
        link: "/admin/reservations",
        timestamp: new Date("2024-12-19T10:00:00Z"),
        priority: "normal",
        created_at: new Date("2024-12-19T10:00:00Z"),
      });
    });

    it("should return empty array when user not logged in", async () => {
      mockAuth.api.getSession.mockResolvedValueOnce(null);

      const result = await getRecentNotifications();

      expect(result).toEqual([]);
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("should return empty array when session has no user ID", async () => {
      mockAuth.api.getSession.mockResolvedValueOnce({ user: {} });

      const result = await getRecentNotifications();

      expect(result).toEqual([]);
    });

    it("should limit results to 10 notifications", async () => {
      mockAuth.api.getSession.mockResolvedValueOnce({
        user: { id: "user-123" },
      });
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getRecentNotifications();

      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("LIMIT 10");
    });

    it("should order by created_at DESC", async () => {
      mockAuth.api.getSession.mockResolvedValueOnce({
        user: { id: "user-123" },
      });
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getRecentNotifications();

      const query = mockQuery.mock.calls[0][0];
      expect(query).toContain("ORDER BY created_at DESC");
    });

    it("should filter by recipient_id", async () => {
      mockAuth.api.getSession.mockResolvedValueOnce({
        user: { id: "user-123" },
      });
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getRecentNotifications();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE recipient_id = $1"),
        ["user-123"]
      );
    });

    it("should handle database errors gracefully", async () => {
      mockAuth.api.getSession.mockResolvedValueOnce({
        user: { id: "user-123" },
      });
      mockQuery.mockRejectedValueOnce(createMockDBError("Connection failed"));

      const result = await getRecentNotifications();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching recent notifications:",
        expect.any(Error)
      );
    });

    it("should handle auth errors gracefully", async () => {
      mockAuth.api.getSession.mockRejectedValueOnce(new Error("Auth failed"));

      const result = await getRecentNotifications();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching recent notifications:",
        expect.any(Error)
      );
    });

    it("should provide default values for missing fields", async () => {
      const incompleteNotification = {
        id: 1,
        recipient_id: "admin",
        title: "Test",
        message: "Test message",
        is_read: false,
        created_at: "2024-12-19T10:00:00Z",
        // Missing type, link, priority
      };

      mockAuth.api.getSession.mockResolvedValueOnce({
        user: { id: "user-123" },
      });
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([incompleteNotification])
      );

      const result = await getRecentNotifications();

      expect(result[0].type).toBe("system");
      expect(result[0].priority).toBe("normal");
      expect(result[0].link).toBeUndefined();
    });
  });

  describe("getNotifications", () => {
    it("should fetch paginated notifications", async () => {
      // Mock count query
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "5" }]));
      // Mock notifications query
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockNotificationRow])
      );

      const result = await getNotifications("admin");

      expect(result.notifications).toHaveLength(1);
      expect(result.pagination.totalItems).toBe(5);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("should apply read filter", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "2" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getNotifications("admin", { filter: "read" });

      const countQuery = mockQuery.mock.calls[0][0];
      const mainQuery = mockQuery.mock.calls[1][0];

      expect(countQuery).toContain("AND is_read = true");
      expect(mainQuery).toContain("AND is_read = true");
    });

    it("should apply unread filter", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "3" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getNotifications("admin", { filter: "unread" });

      const countQuery = mockQuery.mock.calls[0][0];
      const mainQuery = mockQuery.mock.calls[1][0];

      expect(countQuery).toContain("AND is_read = false");
      expect(mainQuery).toContain("AND is_read = false");
    });

    it("should handle custom pagination", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "25" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getNotifications("admin", {
        page: 3,
        pageSize: 5,
      });

      expect(result.pagination.currentPage).toBe(3);
      expect(result.pagination.pageSize).toBe(5);
      expect(result.pagination.totalPages).toBe(5);

      // Check OFFSET and LIMIT parameters
      const params = mockQuery.mock.calls[1][1];
      expect(params[1]).toBe(10); // OFFSET (page-1)*pageSize = 2*5
      expect(params[2]).toBe(5); // LIMIT
    });

    it("should default to all filter when no filter provided", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getNotifications("admin");

      const countQuery = mockQuery.mock.calls[0][0];
      const mainQuery = mockQuery.mock.calls[1][0];

      expect(countQuery).not.toContain("AND is_read =");
      expect(mainQuery).not.toContain("AND is_read =");
    });

    it("should filter by recipient_id as admin", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getNotifications("test-user");

      // Note: The function seems to hardcode "admin" as recipient_id
      expect(mockQuery.mock.calls[0][1]).toContain("admin");
      expect(mockQuery.mock.calls[1][1]).toContain("admin");
    });

    it("should convert database fields to proper format", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([mockNotificationRow])
      );

      const result = await getNotifications("admin");
      const notification = result.notifications[0];

      expect(notification.isRead).toBe(false); // is_read -> isRead
      expect(notification.timestamp).toBeInstanceOf(Date);
      expect(notification.created_at).toBeInstanceOf(Date);
      expect(notification.type).toBe("admin");
      expect(notification.priority).toBe("normal");
    });

    it("should provide default values for missing fields", async () => {
      const incompleteNotification = {
        id: 1,
        recipient_id: "admin",
        title: "Test",
        message: "Test message",
        is_read: false,
        created_at: "2024-12-19T10:00:00Z",
        // Missing type, link, priority
      };

      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([incompleteNotification])
      );

      const result = await getNotifications("admin");
      const notification = result.notifications[0];

      expect(notification.type).toBe("system");
      expect(notification.priority).toBe("normal");
    });

    it("should handle empty results", async () => {
      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "0" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getNotifications("admin");

      expect(result.notifications).toEqual([]);
      expect(result.pagination.totalItems).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it("should log debug information", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      mockQuery.mockResolvedValueOnce(createMockQueryResult([{ total: "1" }]));
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      await getNotifications("test-user");

      expect(consoleSpy).toHaveBeenCalledWith("Params:", ["admin", 0, 10]);

      consoleSpy.mockRestore();
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors in getNotifications", async () => {
      mockQuery.mockRejectedValueOnce(createMockDBError("Connection failed"));

      await expect(getNotifications("admin")).rejects.toThrow();
    });

    it("should handle invalid total count", async () => {
      mockQuery.mockResolvedValueOnce(
        createMockQueryResult([{ total: "invalid" }])
      );
      mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

      const result = await getNotifications("admin");

      expect(result.pagination.totalItems).toBeNaN();
      expect(result.pagination.totalPages).toBeNaN();
    });
  });
});
