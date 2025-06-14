import * as React from "react";

interface AdminNotificationTemplateProps {
  userName: string;
  userEmail: string;
  roomName: string;
  reservationDate: string;
  reservationTime: string;
  purpose: string;
  adminPanelUrl?: string;
}

export const AdminNotificationTemplate: React.FC<
  Readonly<AdminNotificationTemplateProps>
> = () => {
  // Mock implementation for testing
  return React.createElement(
    "div",
    { "data-testid": "admin-notification-template" },
    "Mock Admin Notification Template"
  );
};
