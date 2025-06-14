import {
  parseDateParam,
  parseArrayParam,
  parseStatusArrayParam,
  formatTimeRange,
  formatTimeRangeIndonesian,
  getRelativeDayIndonesian,
} from "@/lib/utils";

describe("Utility Functions", () => {
  describe("parseDateParam", () => {
    const defaultDate = new Date("2024-01-01T00:00:00Z");

    it("should parse valid date string", () => {
      const result = parseDateParam("2024-12-25T10:00:00Z", defaultDate);
      expect(result).toEqual(new Date("2024-12-25T10:00:00Z"));
    });

    it("should return default date for invalid string", () => {
      const result = parseDateParam("invalid-date", defaultDate);
      expect(result).toEqual(defaultDate);
    });

    it("should return default date for undefined param", () => {
      const result = parseDateParam(undefined, defaultDate);
      expect(result).toEqual(defaultDate);
    });

    it("should return default date for array param", () => {
      const result = parseDateParam(["2024-12-25"], defaultDate);
      expect(result).toEqual(defaultDate);
    });

    it("should handle edge case ISO dates", () => {
      const edgeCases = [
        "2024-02-29T23:59:59.999Z", // Leap year edge
        "2024-01-01T00:00:00.000Z", // Start of year
        "2024-12-31T23:59:59.999Z", // End of year
      ];

      edgeCases.forEach((dateStr) => {
        const result = parseDateParam(dateStr, defaultDate);
        expect(result).toEqual(new Date(dateStr));
      });
    });
  });

  describe("parseArrayParam", () => {
    it("should parse array parameter", () => {
      const result = parseArrayParam(["item1", "item2", "item3"]);
      expect(result).toEqual(["item1", "item2", "item3"]);
    });

    it("should filter out empty strings from array", () => {
      const result = parseArrayParam(["item1", "", "item2", "   "]);
      expect(result).toEqual(["item1", "item2"]);
    });

    it("should parse comma-separated string", () => {
      const result = parseArrayParam("item1,item2,item3");
      expect(result).toEqual(["item1", "item2", "item3"]);
    });

    it("should handle string with spaces", () => {
      const result = parseArrayParam("item1, item2 , item3");
      expect(result).toEqual(["item1", "item2", "item3"]);
    });

    it("should return empty array for undefined", () => {
      const result = parseArrayParam(undefined);
      expect(result).toEqual([]);
    });

    it("should return empty array for empty string", () => {
      const result = parseArrayParam("");
      expect(result).toEqual([]);
    });

    it("should handle mixed empty and valid items", () => {
      const result = parseArrayParam("item1,,item2,");
      expect(result).toEqual(["item1", "item2"]);
    });
  });

  describe("parseStatusArrayParam", () => {
    it("should delegate to parseArrayParam", () => {
      const result = parseStatusArrayParam("4,5,6");
      expect(result).toEqual(["4", "5", "6"]);
    });

    it("should handle numeric-like status strings", () => {
      const result = parseStatusArrayParam("1");
      expect(result).toEqual(["1"]);
    });

    it("should handle text status values", () => {
      const result = parseStatusArrayParam(["PENDING", "APPROVED"]);
      expect(result).toEqual(["PENDING", "APPROVED"]);
    });
  });

  describe("formatTimeRange", () => {
    it("should format time range correctly", () => {
      const startTime = new Date("2024-12-20T09:00:00Z");
      const endTime = new Date("2024-12-20T17:30:00Z");

      const result = formatTimeRange(startTime, endTime);

      // Should contain AM/PM format
      expect(result).toMatch(
        /\d{1,2}:\d{2}\s*(AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)/
      );
    });

    it("should handle same day different times", () => {
      const startTime = new Date("2024-12-20T14:00:00Z");
      const endTime = new Date("2024-12-20T15:00:00Z");

      const result = formatTimeRange(startTime, endTime);

      expect(result).toContain("-");
      expect(result).toMatch(/PM.*PM|AM.*AM|AM.*PM|PM.*AM/);
    });

    it("should handle midnight times", () => {
      const startTime = new Date("2024-12-20T00:00:00Z");
      const endTime = new Date("2024-12-20T01:00:00Z");

      const result = formatTimeRange(startTime, endTime);

      expect(result).toBeDefined();
      expect(result).toContain("-");
    });
  });

  describe("formatTimeRangeIndonesian", () => {
    it("should format time range in 24-hour format", () => {
      const startTime = new Date("2024-12-20T09:00:00Z");
      const endTime = new Date("2024-12-20T17:30:00Z");

      const result = formatTimeRangeIndonesian(startTime, endTime);

      expect(result).toMatch(/\d{2}\.\d{2}\s*-\s*\d{2}\.\d{2}\s*WIB/);
      expect(result).toContain("WIB");
    });

    it("should not contain AM/PM indicators", () => {
      const startTime = new Date("2024-12-20T14:00:00Z");
      const endTime = new Date("2024-12-20T15:00:00Z");

      const result = formatTimeRangeIndonesian(startTime, endTime);

      expect(result).not.toContain("AM");
      expect(result).not.toContain("PM");
    });

    it("should always end with WIB", () => {
      const startTime = new Date("2024-12-20T00:00:00Z");
      const endTime = new Date("2024-12-20T23:59:00Z");

      const result = formatTimeRangeIndonesian(startTime, endTime);

      expect(result.endsWith("WIB")).toBe(true);
    });
  });

  describe("getRelativeDayIndonesian", () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    it("should return 'Hari ini' for today", () => {
      const result = getRelativeDayIndonesian(today);
      expect(result).toBe("Hari ini");
    });

    it("should return 'Besok' for tomorrow", () => {
      const result = getRelativeDayIndonesian(tomorrow);
      expect(result).toBe("Besok");
    });

    it("should return 'Kemarin' for yesterday", () => {
      const result = getRelativeDayIndonesian(yesterday);
      expect(result).toBe("Kemarin");
    });

    it("should return Indonesian day names for other dates", () => {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 7); // One week from now

      const result = getRelativeDayIndonesian(futureDate);

      const expectedDays = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];

      expect(expectedDays).toContain(result);
    });

    it("should handle edge cases around midnight", () => {
      const todayMidnight = new Date(today);
      todayMidnight.setHours(0, 0, 0, 0);

      const result = getRelativeDayIndonesian(todayMidnight);
      expect(result).toBe("Hari ini");
    });

    it("should return correct day names for each weekday", () => {
      const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];

      // Test each day of the week
      for (let i = 0; i < 7; i++) {
        const testDate = new Date("2024-01-07"); // A Sunday
        testDate.setDate(testDate.getDate() + i);

        // Skip if it's today, tomorrow, or yesterday relative to current date
        const daysDiff = Math.floor(
          (testDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (Math.abs(daysDiff) <= 1) continue;

        const result = getRelativeDayIndonesian(testDate);
        expect(result).toBe(dayNames[testDate.getDay()]);
      }
    });
  });
});
