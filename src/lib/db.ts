import { Pool, PoolClient } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX || "20"),
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || "30000"),
  connectionTimeoutMillis: parseInt(
    process.env.DB_POOL_CONNECTION_TIMEOUT || "5000"
  ),
});

db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

db.on("connect", () => {
  console.debug("New client connected to database");
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

/**
 * Helper function for handling database transactions
 * @param callback Function that performs database operations within a transaction
 * @returns Result of the callback function
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export default db;
