import type { QueryResult } from "pg";

// Define the interface for lookup results
interface LookupResult {
  value: string | null;
}

// Export the mock function so it can be controlled from tests
export const mockQuery = jest.fn<
  Promise<QueryResult<LookupResult>>,
  [string]
>();

// Mock database pool
const db = {
  query: mockQuery,
};

export default db;
