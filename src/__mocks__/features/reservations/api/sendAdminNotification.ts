/**
 * Mock for sendAdminNotification module
 */

export const sendAdminNotification = jest.fn().mockResolvedValue(true);

export const formatDateIndonesian = jest
  .fn()
  .mockReturnValue("15 Desember 2024");

export const formatTimeRange = jest.fn().mockReturnValue("10:00 - 12:00 WIB");

// Default export for compatibility
export default {
  sendAdminNotification,
  formatDateIndonesian,
  formatTimeRange,
};
