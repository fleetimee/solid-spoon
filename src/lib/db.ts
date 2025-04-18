import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface NavigationItem {
  title: string;
  url: string;
}

export interface NavigationMain {
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  items: NavigationItem[];
}

export async function getNavigation(): Promise<NavigationMain[]> {
  const client = await db.connect();

  try {
    // First, get all main navigation items
    const mainNavResult = await client.query(`
      SELECT id, title, url, icon, is_active as "isActive"
      FROM navigation_main
      ORDER BY id
    `);

    const mainNavItems = mainNavResult.rows;

    // For each main item, get its sub-items
    for (const item of mainNavItems) {
      const subItemsResult = await client.query(
        `
        SELECT title, url
        FROM navigation_item
        WHERE navigation_main_id = $1
        ORDER BY id
      `,
        [item.id]
      );

      // Add sub-items to the main item
      item.items = subItemsResult.rows;

      // Remove the id as it's not needed in the response
      delete item.id;
    }

    return mainNavItems;
  } finally {
    client.release();
  }
}

export default db;
