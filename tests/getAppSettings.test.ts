import { getAppSettings } from "@/features/application/api/getAppSettings";
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

describe("getAppSettings", () => {
  beforeEach(() => {
    mockQuery.mockClear();
    console.error = jest.fn();
  });

  it("should fetch application settings and return formatted object", async () => {
    const mockSettingsRows = [
      {
        code: "APP_NAME",
        value: "My Room Booking App",
        description: "Main application name",
      },
      {
        code: "APP_DESCRIPTION",
        value: "Enterprise Room Management",
        description: "Application description",
      },
      {
        code: "RESERVATION_LIMIT",
        value: "5",
        description: "Maximum pending reservations per user",
      },
    ];

    mockQuery.mockResolvedValueOnce(createMockQueryResult(mockSettingsRows));

    const result = await getAppSettings();

    expect(result).toEqual({
      appName: "My Room Booking App",
      appDescription: "Main application name", // Note: uses description, not value for appDescription
    });
  });

  it("should use correct SQL query", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    await getAppSettings();

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringMatching(
        /SELECT\s+code,\s*value,\s*description\s+FROM\s+lookup/
      )
    );

    const query = mockQuery.mock.calls[0][0];
    expect(query).toMatch(/WHERE\s+category\s*=\s*'application'/);
    expect(query).toMatch(/AND\s+is_active\s*=\s*true/);
    expect(query).toMatch(/ORDER\s+BY\s+sort_order/);
  });

  it("should handle empty results with default values", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    const result = await getAppSettings();

    expect(result).toEqual({
      appName: "Acme Inc",
      appDescription: "Enterprise",
    });
  });

  it("should handle partial settings data", async () => {
    const partialSettings = [
      {
        code: "APP_NAME",
        value: "Custom App Name",
        description: "Custom description",
      },
      // Missing APP_DESCRIPTION
    ];

    mockQuery.mockResolvedValueOnce(createMockQueryResult(partialSettings));

    const result = await getAppSettings();

    expect(result).toEqual({
      appName: "Custom App Name",
      appDescription: "Custom description", // Uses APP_NAME description, not default
    });
  });

  it("should correctly reduce settings into object by code", async () => {
    const mockSettings = [
      {
        code: "SETTING_1",
        value: "value1",
        description: "desc1",
      },
      {
        code: "SETTING_2",
        value: "value2",
        description: "desc2",
      },
      {
        code: "APP_NAME",
        value: "Test App",
        description: "Test Description",
      },
    ];

    mockQuery.mockResolvedValueOnce(createMockQueryResult(mockSettings));

    const result = await getAppSettings();

    expect(result.appName).toBe("Test App");
    expect(result.appDescription).toBe("Test Description");
  });

  it("should handle null values gracefully", async () => {
    const settingsWithNulls = [
      {
        code: "APP_NAME",
        value: null,
        description: null,
      },
    ];

    mockQuery.mockResolvedValueOnce(createMockQueryResult(settingsWithNulls));

    const result = await getAppSettings();

    expect(result).toEqual({
      appName: "Acme Inc", // Falls back to default
      appDescription: "Enterprise", // Falls back to default
    });
  });

  it("should handle missing APP_NAME setting", async () => {
    const settingsWithoutAppName = [
      {
        code: "OTHER_SETTING",
        value: "other_value",
        description: "other_desc",
      },
    ];

    mockQuery.mockResolvedValueOnce(
      createMockQueryResult(settingsWithoutAppName)
    );

    const result = await getAppSettings();

    expect(result).toEqual({
      appName: "Acme Inc",
      appDescription: "Enterprise",
    });
  });

  it("should handle database errors by throwing", async () => {
    mockQuery.mockRejectedValueOnce(createMockDBError("Connection failed"));

    await expect(getAppSettings()).rejects.toThrow();
  });

  it("should fetch only active settings", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    await getAppSettings();

    const query = mockQuery.mock.calls[0][0];
    expect(query).toMatch(/is_active\s*=\s*true/);
  });

  it("should order settings by sort_order", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    await getAppSettings();

    const query = mockQuery.mock.calls[0][0];
    expect(query).toMatch(/ORDER\s+BY\s+sort_order/);
  });

  it("should filter by application category", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    await getAppSettings();

    const query = mockQuery.mock.calls[0][0];
    expect(query).toMatch(/category\s*=\s*'application'/);
  });

  it("should handle edge case with empty string values", async () => {
    const settingsWithEmptyStrings = [
      {
        code: "APP_NAME",
        value: "",
        description: "",
      },
    ];

    mockQuery.mockResolvedValueOnce(
      createMockQueryResult(settingsWithEmptyStrings)
    );

    const result = await getAppSettings();

    expect(result).toEqual({
      appName: "Acme Inc", // Falls back to default for empty string
      appDescription: "Enterprise", // Falls back to default for empty string
    });
  });

  it("should properly type the return value", async () => {
    mockQuery.mockResolvedValueOnce(createMockQueryResult([]));

    const result = await getAppSettings();

    expect(typeof result.appName).toBe("string");
    expect(typeof result.appDescription).toBe("string");
    expect(result).toHaveProperty("appName");
    expect(result).toHaveProperty("appDescription");
  });
});
