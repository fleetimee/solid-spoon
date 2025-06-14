import { describe, it, expect, jest } from "@jest/globals";
import {
  canCancelReservation,
  getTimeUntilReservation,
} from "@/features/reservations/utils/reservation-utils";
import { UserReservation } from "@/features/reservations/api/getUserReservations";

// Mock current time for consistent testing
const mockCurrentTime = new Date("2025-06-14T10:00:00Z");
jest.useFakeTimers();
jest.setSystemTime(mockCurrentTime);

describe("Booking Cancellation Logic", () => {
  const createMockReservation = (
    status: string,
    startTime: string
  ): UserReservation => ({
    id: "1",
    title: "Test Meeting",
    description: "Test Description",
    startTime: new Date(startTime),
    endTime: new Date(startTime),
    createdAt: new Date(),
    roomName: "Test Room",
    status: status,
  });

  describe("canCancelReservation", () => {
    it("should allow cancellation for pending reservations", () => {
      const reservation = createMockReservation(
        "pending",
        "2025-06-15T10:00:00Z"
      );
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(true);
      expect(result.reason).toBe("pending");
      expect(result.message).toContain("dapat dibatalkan kapan saja");
    });

    it("should allow cancellation for approved reservations >24 hours away", () => {
      const reservation = createMockReservation(
        "approved",
        "2025-06-16T12:00:00Z"
      ); // 26 hours away
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(true);
      expect(result.reason).toBe("approved_eligible");
      expect(result.message).toContain("Dapat dibatalkan");
    });

    it("should NOT allow cancellation for approved reservations <24 hours away", () => {
      const reservation = createMockReservation(
        "approved",
        "2025-06-14T20:00:00Z"
      ); // 10 hours away
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(false);
      expect(result.reason).toBe("approved_too_late");
      expect(result.message).toContain("kurang dari 24 jam");
    });

    it("should NOT allow cancellation for completed reservations", () => {
      const reservation = createMockReservation(
        "completed",
        "2025-06-15T10:00:00Z"
      );
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(false);
      expect(result.reason).toBe("other_status");
    });

    it("should NOT allow cancellation for rejected reservations", () => {
      const reservation = createMockReservation(
        "rejected",
        "2025-06-15T10:00:00Z"
      );
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(false);
      expect(result.reason).toBe("other_status");
    });

    it("should NOT allow cancellation for cancelled reservations", () => {
      const reservation = createMockReservation(
        "cancelled",
        "2025-06-15T10:00:00Z"
      );
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(false);
      expect(result.reason).toBe("other_status");
    });
  });

  describe("getTimeUntilReservation", () => {
    it("should calculate hours and days correctly for future reservations", () => {
      const reservation = createMockReservation(
        "approved",
        "2025-06-16T10:00:00Z"
      ); // 24 hours away
      const result = getTimeUntilReservation(reservation);

      expect(result.hours).toBe(24);
      expect(result.days).toBe(1);
      expect(result.isInPast).toBe(false);
    });

    it("should handle reservations in the past", () => {
      const reservation = createMockReservation(
        "completed",
        "2025-06-13T10:00:00Z"
      ); // 24 hours ago
      const result = getTimeUntilReservation(reservation);

      expect(result.hours).toBe(0);
      expect(result.days).toBe(0);
      expect(result.isInPast).toBe(true);
    });

    it("should calculate partial days correctly", () => {
      const reservation = createMockReservation(
        "approved",
        "2025-06-15T16:00:00Z"
      ); // 30 hours away
      const result = getTimeUntilReservation(reservation);

      expect(result.hours).toBe(30);
      expect(result.days).toBe(1); // Floor of 30/24 = 1
      expect(result.isInPast).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle case-insensitive status matching", () => {
      const reservation = createMockReservation(
        "PENDING",
        "2025-06-15T10:00:00Z"
      );
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(true);
      expect(result.reason).toBe("pending");
    });

    it("should handle mixed-case status matching", () => {
      const reservation = createMockReservation(
        "Approved",
        "2025-06-16T12:00:00Z"
      );
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(true);
      expect(result.reason).toBe("approved_eligible");
    });

    it("should handle undefined status gracefully", () => {
      const reservation = createMockReservation("", "2025-06-15T10:00:00Z");
      reservation.status = undefined as any;
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(false);
      expect(result.reason).toBe("other_status");
    });

    it("should handle null status gracefully", () => {
      const reservation = createMockReservation("", "2025-06-15T10:00:00Z");
      reservation.status = null as any;
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(false);
      expect(result.reason).toBe("other_status");
    });
  });

  describe("Business Rule Validation", () => {
    it("should enforce 24-hour rule for approved reservations", () => {
      // Test exactly at 24-hour boundary
      const reservation = createMockReservation(
        "approved",
        "2025-06-15T10:00:00Z"
      ); // Exactly 24 hours away
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(false); // Should be false as it's not > 24 hours
      expect(result.reason).toBe("approved_too_late");
    });

    it("should allow cancellation just over 24 hours", () => {
      const reservation = createMockReservation(
        "approved",
        "2025-06-15T09:59:59Z"
      ); // Just over 24 hours
      const result = canCancelReservation(reservation);

      expect(result.canCancel).toBe(true);
      expect(result.reason).toBe("approved_eligible");
    });
  });
});

describe("Integration Test Scenarios", () => {
  it("should handle typical user booking scenarios", () => {
    const scenarios = [
      {
        name: "New pending booking",
        reservation: createMockReservation("pending", "2025-06-20T14:00:00Z"),
        expectedCanCancel: true,
        expectedReason: "pending",
      },
      {
        name: "Approved booking next week",
        reservation: createMockReservation("approved", "2025-06-21T09:00:00Z"),
        expectedCanCancel: true,
        expectedReason: "approved_eligible",
      },
      {
        name: "Approved booking tomorrow morning",
        reservation: createMockReservation("approved", "2025-06-15T08:00:00Z"),
        expectedCanCancel: false,
        expectedReason: "approved_too_late",
      },
      {
        name: "Yesterday completed meeting",
        reservation: createMockReservation("completed", "2025-06-13T14:00:00Z"),
        expectedCanCancel: false,
        expectedReason: "other_status",
      },
    ];

    scenarios.forEach((scenario) => {
      const result = canCancelReservation(scenario.reservation);
      expect(result.canCancel).toBe(scenario.expectedCanCancel);
      expect(result.reason).toBe(scenario.expectedReason);
    });
  });
});

function createMockReservation(
  status: string,
  startTime: string
): UserReservation {
  return {
    id: Math.random().toString(),
    title: "Test Meeting",
    description: "Test Description",
    startTime: new Date(startTime),
    endTime: new Date(new Date(startTime).getTime() + 60 * 60 * 1000), // 1 hour later
    createdAt: new Date(),
    roomName: "Test Room",
    status: status,
  };
}
