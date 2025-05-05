import db from "@/lib/db";
import { NavigationMain } from "../types/navigation";

/**
 * Fetches the main navigation items and their sub-items from the database
 * @returns Array of navigation main items with their sub-items
 */
export async function getNavigation(): Promise<NavigationMain[]> {
  const mainNavResult = await db.query(`
    SELECT id, title, url, icon, is_active as "isActive", sort_order
    FROM navigation_main
    ORDER BY sort_order
  `);

  const mainNavItems = mainNavResult.rows;

  // Sort main navigation items by sort_order ascendingly
  mainNavItems.sort((a, b) => a.sort_order - b.sort_order);

  for (const item of mainNavItems) {
    const subItemsResult = await db.query(
      `
      SELECT title, url
      FROM navigation_item
      WHERE navigation_main_id = $1
    `,
      [item.id]
    );

    item.items = subItemsResult.rows;

    delete item.id;
    delete item.sort_order; // Remove sort_order before returning
  }

  return mainNavItems;
}
