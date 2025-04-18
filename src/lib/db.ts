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
