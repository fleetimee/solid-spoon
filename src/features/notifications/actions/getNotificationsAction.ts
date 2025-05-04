"use server";

import { getRecentNotifications } from "../api/getNotifications";
import { Notification } from "../types/notification";

type NotificationsActionResult =
  | { notifications: Notification[]; error?: never }
  | { error: string; notifications?: never };

export async function getNotificationsAction(): Promise<NotificationsActionResult> {
  try {
    const notifications = await getRecentNotifications();
    return { notifications };
  } catch (error) {
    return { error: "Failed to fetch notifications" };
  }
}
