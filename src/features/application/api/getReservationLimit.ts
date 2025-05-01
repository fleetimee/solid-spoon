import db from "@/lib/db";

interface LookupResult {
  value: string | null;
}

/**
 * Fetches the pending reservation limit from the lookup table.
 * Defaults to 3 if the setting is not found or invalid.
 *
 * @returns {Promise<number>} The reservation limit.
 */
export async function getReservationLimit(): Promise<number> {
  const defaultLimit = 3;

  try {
    // Type assertion needed as node-postgres query method returns 'any' by default
    // or configure it globally if possible. Assuming a simple setup here.
    const { rows } = await db.query(
      `SELECT value FROM lookup WHERE category = 'application' AND code = 'RESERVATION_LIMIT' AND is_active = true LIMIT 1;`
    );

    const result = rows as LookupResult[]; // Assert the type of rows

    if (result && result.length > 0 && result[0].value !== null) {
      const parsedValue = parseInt(result[0].value, 10);
      if (!isNaN(parsedValue)) {
        return parsedValue;
      }
    }
  } catch (error) {
    console.error("Failed to fetch reservation limit:", error);
    // Fall through to return default limit on error
  }

  return defaultLimit;
}
