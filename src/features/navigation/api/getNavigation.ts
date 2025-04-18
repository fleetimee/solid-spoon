import db from "@/lib/db";
import { NavigationMain } from "../types/navigation";

/**
 * Fetches the main navigation items and their sub-items from the database
 * @returns Array of navigation main items with their sub-items
 */
export async function getNavigation(): Promise<NavigationMain[]> {
  const mainNavResult = await db.query(`
    SELECT id, title, url, icon, is_active as "isActive"
    FROM navigation_main
    ORDER BY id
  `);

  const mainNavItems = mainNavResult.rows;

  for (const item of mainNavItems) {
    const subItemsResult = await db.query(
      `
      SELECT title, url
      FROM navigation_item
      WHERE navigation_main_id = $1
      ORDER BY id
    `,
      [item.id]
    );

    item.items = subItemsResult.rows;

    delete item.id;
  }

  return mainNavItems;
}
