import { getReservationLimit } from '@/features/application/api/getReservationLimit';
import db from '@/lib/db';

jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

const mockedDb = db as unknown as { query: jest.Mock };

describe('getReservationLimit', () => {
  beforeEach(() => {
    mockedDb.query.mockReset();
  });

  it('returns the limit from the database when available', async () => {
    mockedDb.query.mockResolvedValueOnce({ rows: [{ value: '5' }] });
    await expect(getReservationLimit()).resolves.toBe(5);
  });

  it('falls back to the default limit when query fails', async () => {
    mockedDb.query.mockRejectedValueOnce(new Error('db error'));
    await expect(getReservationLimit()).resolves.toBe(3);
  });
});
