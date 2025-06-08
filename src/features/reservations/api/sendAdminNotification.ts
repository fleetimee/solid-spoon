import * as React from "react";
import { Resend } from "resend";
import { AdminNotificationTemplate } from "@/components/email/admin-notification-template";
import { getLookupValue } from "@/features/application/api/getLookupValue";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL =
  process.env.EMAIL_FROM ||
  "CapstoneD <capstone-kelompok-d@capstone-mail.fleetime.my.id>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface AdminNotificationData {
  userName: string;
  userEmail: string;
  roomName: string;
  reservationDate: string;
  reservationTime: string;
  purpose: string;
  roomSlug?: string;
}

/**
 * Sends an email notification to admin when a new reservation is created
 * @param data - The reservation data to include in the notification
 * @returns Promise<boolean> - true if successful, false if failed
 */
export async function sendAdminNotification(
  data: AdminNotificationData
): Promise<boolean> {
  try {
    // Get admin email from lookup table
    const adminEmail = await getLookupValue("ADMIN_EMAIL");

    if (!adminEmail) {
      console.warn(
        "Admin email not found in lookup table with code 'ADMIN_EMAIL'"
      );
      return false;
    }

    // Format the admin panel URL
    const adminPanelUrl = data.roomSlug
      ? `${BASE_URL}/admin/rooms/${data.roomSlug}`
      : `${BASE_URL}/admin/rooms/reservations`;

    // Create the React element for the email template
    const emailElement = React.createElement(AdminNotificationTemplate, {
      userName: data.userName,
      userEmail: data.userEmail,
      roomName: data.roomName,
      reservationDate: data.reservationDate,
      reservationTime: data.reservationTime,
      purpose: data.purpose,
      adminPanelUrl,
    });

    // Send the email
    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [adminEmail],
      subject: "Reservasi Baru Memerlukan Persetujuan",
      react: emailElement,
    });

    if (error) {
      console.error("Error sending admin notification email:", error);
      return false;
    }

    console.log("Admin notification email sent successfully:", emailData?.id);
    return true;
  } catch (error) {
    console.error("Error in sendAdminNotification:", error);
    return false;
  }
}

/**
 * Helper function to format date in Indonesian locale
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatDateIndonesian(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Helper function to format time range in Indonesian format
 * @param startTime - Start time Date object or ISO string
 * @param endTime - End time Date object or ISO string
 * @returns Formatted time range string
 */
export function formatTimeRange(
  startTime: Date | string,
  endTime: Date | string
): string {
  const startObj =
    typeof startTime === "string" ? new Date(startTime) : startTime;
  const endObj = typeof endTime === "string" ? new Date(endTime) : endTime;

  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  };

  const startTimeStr = startObj.toLocaleTimeString("id-ID", timeFormat);
  const endTimeStr = endObj.toLocaleTimeString("id-ID", timeFormat);

  return `${startTimeStr} - ${endTimeStr} WIB`;
}
