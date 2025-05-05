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
 * Parses status array param, ensuring values are valid ReservationStatus types.
 */
export function parseStatusArrayParam(
  param: string | string[] | undefined
): ReservationStatus[] {
  const rawArray = parseArrayParam(param);
  // Filter the array to only include valid status values
  return rawArray.filter((s): s is ReservationStatus =>
    validStatuses.has(s as ReservationStatus)
  );
}
