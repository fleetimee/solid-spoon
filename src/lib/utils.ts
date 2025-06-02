import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper functions for parsing search parameters

/**
 * Parses a date string from search params.
 * Returns defaultDate if parsing fails or param is missing.
 */
export function parseDateParam(
  param: string | string[] | undefined,
  defaultDate: Date
): Date {
  if (typeof param === "string") {
    const date = new Date(param);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return defaultDate;
}

/**
 * Parses a potentially comma-separated string or array from search params into an array of strings.
 * Returns an empty array if param is missing or invalid.
 */
export function parseArrayParam(
  param: string | string[] | undefined
): string[] {
  if (Array.isArray(param)) {
    // Filter out empty strings just in case
    return param.filter((s) => typeof s === "string" && s.trim() !== "");
  }
  if (typeof param === "string" && param.trim() !== "") {
    return param
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
  }
  return [];
}

// TODO: Define or import ReservationStatus type correctly and ensure values are validated
type ReservationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
const validStatuses: Set<ReservationStatus> = new Set([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

/**
 * Parses a potentially comma-separated status string or array from search params into an array of strings.
 * Handles single values (e.g., "4"), comma-separated values (e.g., "4,5"), and null/undefined/empty inputs.
 */
export function parseStatusArrayParam(
  param: string | string[] | undefined
): string[] {
  // Directly return the result of parseArrayParam, which handles splitting and cleaning.
  // This allows any non-empty string values, including numeric-like ones, as per requirements.
  return parseArrayParam(param);
}

/**
 * Generates initials from a full name
 * @param name - The full name to generate initials from
 * @returns Initials (max 2 characters)
 */
export function getInitials(name: string): string {
  if (!name || name.trim() === "") return "??";

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Formats a time range for display
 * @param startTime - Start time
 * @param endTime - End time
 * @returns Formatted time range string
 */
export function formatTimeRange(startTime: Date, endTime: Date): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const start = startTime.toLocaleTimeString("en-US", formatOptions);
  const end = endTime.toLocaleTimeString("en-US", formatOptions);

  return `${start} - ${end}`;
}
