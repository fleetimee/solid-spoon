import type { QueryResult, QueryResultRow } from "pg";

// Export the mock function so it can be controlled from tests - use any for flexibility
export const mockQuery = jest.fn() as jest.MockedFunction<
  <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ) => Promise<QueryResult<T>>
>;

// Mock client connection
export const mockConnect = jest.fn();

// Mock transaction helper - make sure it's a proper jest mock
export const mockWithTransaction = jest.fn();

// Mock database pool
const db = {
  query: mockQuery,
  connect: mockConnect,
  withTransaction: mockWithTransaction,
};

// Also make sure withTransaction is available on the db object
Object.defineProperty(db, "withTransaction", {
  value: mockWithTransaction,
  writable: true,
  enumerable: true,
  configurable: true,
});

export default db;
