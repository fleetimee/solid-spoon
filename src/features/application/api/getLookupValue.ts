import db from "../../../lib/db"; // Corrected path relative to src/lib/db.ts
import { Lookup } from "../types/lookup"; // Assuming Lookup type exists

/**
 * Fetches a single lookup value from the database based on its code.
 * Returns the value string or null if not found or inactive.
 */
export async function getLookupValue(code: string): Promise<string | null> {
  if (!code) {
    return null;
  }

  try {
    const result = await db.query<Pick<Lookup, "value">>(
      `SELECT value FROM lookup WHERE code = $1 AND is_active = TRUE LIMIT 1`,
      [code]
    );

    if (result.rows.length > 0) {
      return result.rows[0].value;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching lookup value for code "${code}":`, error);
    // Depending on requirements, you might want to throw the error
    // or just return null to allow the UI to handle the missing value gracefully.
    return null;
  }
}

/**
 * Fetches all active lookup values for a given category.
 * @param category The category to fetch lookup values for.
 * @returns Array of lookup objects containing id and value.
 */
export async function getLookupsByCategory(
  category: string
): Promise<{ id: number; value: string }[]> {
  try {
    const result = await db.query<{ id: number; value: string }>(
      `SELECT id, value 
       FROM lookup 
       WHERE category = $1 AND is_active = TRUE 
       ORDER BY sort_order, value`, // Added ordering
      [category]
    );
    return result.rows;
  } catch (error) {
    console.error(
      `Error fetching lookup values for category "${category}":`,
      error
    );
    return []; // Return empty array on error
  }
}

/**
 * Fetches all active reservation statuses.
 * @returns Array of reservation status objects containing id and value.
 */
export async function getReservationStatuses(): Promise<
  { id: number; value: string }[]
> {
  return getLookupsByCategory("reservation_status");
}
