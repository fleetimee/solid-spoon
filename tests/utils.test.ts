import { getInitials } from '@/lib/utils';

describe('getInitials', () => {
  it('returns initials for a full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('handles single names', () => {
    expect(getInitials('Madonna')).toBe('M');
  });

  it('returns ?? for empty string', () => {
    expect(getInitials('')).toBe('??');
  });
});
