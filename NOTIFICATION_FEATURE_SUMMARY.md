# Notification Feature Summary (Session: 2025-04-28)

This document summarizes the features and improvements implemented for the notification system.

## Core Functionality

- **Notification List:** Display notifications fetched from the backend (`getNotifications`) with pagination and filtering (`/admin/notifications/page.tsx`, `NotificationsList`, `NotificationPagination`, `NotificationFilters`).
- **Notification Card:** Component (`NotificationCard`) to display individual notification details (title, message, timestamp, read status indicator).

## Actions on Individual Notifications (`NotificationCard`)

- **Mark as Read:**
  - Added a "Mark as Read" button (conditionally shown for unread notifications).
  - Created `markNotificationAsRead` Server Action to update `is_read` to `true`.
  - Integrated button with action using `useTransition` and `toast` feedback.
- **Mark as Unread:**
  - Added a "Mark as Unread" button (conditionally shown for read notifications).
  - Created `markNotificationAsUnread` Server Action to update `is_read` to `false`.
  - Integrated button with action using `useTransition` and `toast` feedback.
- **Delete:**
  - Added a "Delete" button (conditionally shown for read notifications).
  - Created `deleteNotification` Server Action to remove the notification record.
  - Integrated button with action using `useTransition` and `toast` feedback.

## Bulk Actions (`/admin/notifications/page.tsx`)

- **Mark All as Read:**
  - Added a "Mark All Read" button.
  - Created `markAllNotificationsAsRead` Server Action to update all unread notifications for the user.
  - Created `MarkAllAsReadButton` client component to handle the action call, `useTransition`, `toast`, and disabling based on unread count.
  - Integrated button into the page, fetching and passing `userId` and `hasUnreadNotifications`.
- **Clear Read:**
  - Added a "Clear Read" button.
  - Created `clearReadNotifications` Server Action to delete all read notifications for the user.
  - Created `ClearNotificationsButton` client component with confirmation dialog (`AlertDialog`) to handle the action call, `useTransition`, `toast`, and disabling based on read count.
  - Integrated button into the page, fetching and passing `userId` and `hasReadNotifications`.

## UI Enhancements

- **Button Styling:** Adjusted button styles (`variant`, `cursor`, internal structure) for consistency and correct hover effects.
- **Unread Count Badge:**
  - Fetched unread notification count in the main dashboard layout (`layout.tsx`).
  - Passed the count down through `AppSidebar` to `NavMain` and `NavUser`.
  - Displayed a red (`destructive`) badge with the count next to the "Notifications" link in both the main sidebar (`NavMain`) and the user profile dropdown (`NavUser`), only when the count > 0.

## Development Features

- **JSON View Toggle:**
  - Added a "Show JSON" toggle (`NotificationJsonToggle`) and view (`NotificationJsonView`) for debugging purposes.
  - Made these components conditional based on the `NEXT_PUBLIC_DEV_MODE` environment variable being set to `'true'`.
  - Added `NEXT_PUBLIC_DEV_MODE=true` to the `.env` file.
