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
