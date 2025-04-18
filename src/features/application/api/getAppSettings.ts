import db from "@/lib/db";

export interface AppSetting {
  code: string;
  value: string;
  description: string | null;
}

/**
 * Fetches application settings from the lookup table
 * @returns Object with application settings
 */
export async function getAppSettings(): Promise<{
  appName: string;
  appDescription: string;
}> {
  const result = await db.query(`
    SELECT code, value, description
    FROM lookup
    WHERE category = 'application'
    AND is_active = true
    ORDER BY sort_order
  `);

  const settings = result.rows.reduce<Record<string, AppSetting>>(
    (acc, row) => {
      acc[row.code] = row;
      return acc;
    },
    {}
  );

  return {
    appName: settings.APP_NAME?.value || "Acme Inc",
    appDescription: settings.APP_NAME?.description || "Enterprise",
  };
}
