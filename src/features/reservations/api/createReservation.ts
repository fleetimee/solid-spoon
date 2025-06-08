"use server";

import { z } from "zod";
import { auth } from "../../../lib/auth";
import db from "../../../lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers"; // Import headers
import { PoolClient } from "pg"; // Import PoolClient for type safety if needed
import {
  sendAdminNotification,
  formatDateIndonesian,
  formatTimeRange,
} from "./sendAdminNotification";

// Define the Zod schema for validation
const newReservationSchema = z
  .object({
    roomId: z.coerce
      .number()
      .int()
      .positive("ID ruangan harus berupa bilangan bulat positif"),
    title: z.string().min(1, "Judul diperlukan"),
    description: z.string().min(1, "Deskripsi diperlukan"),
    start_time: z
      .string()
      .datetime({ message: "Format tanggal/waktu mulai tidak valid" }),
    end_time: z
      .string()
      .datetime({ message: "Format tanggal/waktu selesai tidak valid" }),
  })
  .refine(
    (data) => {
      try {
        return new Date(data.end_time) > new Date(data.start_time);
      } catch (e) {
        // Handle potential invalid date strings during parsing for comparison
        return false;
      }
    },
    {
      message: "Waktu selesai harus setelah waktu mulai",
      path: ["end_time"], // Attach the error specifically to the end_time field
    }
  );

// Define the return type for the server action
export type CreateReservationFormState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  reservationId?: number; // Optional: return the ID of the new reservation
};

// The server action function
export async function createReservationAction(
  prevState: CreateReservationFormState, // Recommended for useFormState
  formData: FormData
): Promise<CreateReservationFormState> {
  const readonlyHeaders = await headers(); // Await the headers
  const mutableHeaders = new Headers();
  readonlyHeaders.forEach((value: string, key: string) => {
    // Add types for clarity
    mutableHeaders.append(key, value);
  });
  const session = await auth.api.getSession({ headers: mutableHeaders }); // Pass mutable headers object

  if (!session?.user?.id) {
    return { success: false, message: "Autentikasi diperlukan" };
  }

  const userId = session.user.id;

  // Extract data from FormData
  const rawData = {
    roomId: formData.get("roomId"),
    title: formData.get("title"),
    description: formData.get("description"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
  };

  // Validate the data
  const result = newReservationSchema.safeParse(rawData);

  if (!result.success) {
    console.error("Validation Errors:", result.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Data tidak valid. Silakan periksa kolom-kolom yang diisi.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const validatedData = result.data;

  // Add duration validation (Backend)
  const startTime = new Date(validatedData.start_time);
  const endTime = new Date(validatedData.end_time);
  const durationMs = endTime.getTime() - startTime.getTime();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

  if (durationMs > twentyFourHoursInMs) {
    return {
      success: false,
      message: "Durasi reservasi tidak boleh melebihi 24 jam.",
      fieldErrors: {
        end_time: ["Durasi reservasi tidak boleh melebihi 24 jam."],
      },
    };
  }

  let client: PoolClient | null = null;
  try {
    client = await db.connect(); // Get a client from the pool
    if (!client) {
      throw new Error("Failed to acquire database client.");
    }

    await client.query("BEGIN"); // Start transaction

    // Use validatedData for insertion
    // Postgres handles ISO 8601 strings directly for timestamp/timestamptz columns
    const insertQuery = `
      INSERT INTO room_reservation (room_id, user_id, title, description, start_time, end_time, status_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const insertParams = [
      validatedData.roomId,
      userId,
      validatedData.title,
      validatedData.description, // Description is now required, no need for null fallback
      validatedData.start_time, // Use the validated ISO string
      validatedData.end_time, // Use the validated ISO string
      2, // Assume status ID 1 means 'Pending'
    ];

    const insertResult = await client.query<{ id: number }>(
      insertQuery,
      insertParams
    );

    if (insertResult.rows.length === 0 || !insertResult.rows[0].id) {
      throw new Error("Failed to create reservation or retrieve ID.");
    }

    const newReservationId = insertResult.rows[0].id;

    // Fetch the room slug and name *before* notification insert
    let roomSlug: string | null = null;
    let roomName: string | null = null;
    try {
      const roomQuery = `SELECT slug, name FROM room WHERE id = $1`; // Select name as well
      const roomResult = await client.query<{ slug: string; name: string }>( // Update type
        roomQuery,
        [validatedData.roomId]
      );
      if (roomResult.rows.length > 0) {
        roomSlug = roomResult.rows[0].slug;
        roomName = roomResult.rows[0].name; // Store the name
      } else {
        console.warn(
          `Could not find room with ID ${validatedData.roomId} for notification/revalidation.`
        );
      }
    } catch (roomInfoError) {
      console.error(
        `Error fetching room info for ID ${validatedData.roomId}:`,
        roomInfoError
      );
      // Continue without slug/name if fetch fails
    }

    // Insert notification for admins within the transaction
    const notificationTitle = "Reservasi Baru Menunggu Persetujuan";
    // Use roomName in the message, fallback to ID
    const notificationMessage = `User ${
      session.user?.name || userId
    } mengajukan reservasi untuk ruangan "${
      roomName || `ID: ${validatedData.roomId}` // Use name, fallback to ID
    }".`;
    const notificationType = "admin";
    // Link still uses slug if available, otherwise generic fallback
    const notificationLink = roomSlug
      ? `/admin/rooms/${roomSlug}`
      : "/admin/reservations";

    const notificationQuery = `
      INSERT INTO notification (recipient_id, title, message, type, link)
      VALUES ('admin', $1, $2, $3, $4)
    `; // recipient_id NULL targets admins implicitly based on type='admin'
    const notificationParams = [
      notificationTitle,
      notificationMessage,
      notificationType,
      notificationLink,
    ];

    await client.query(notificationQuery, notificationParams);

    // Commit the transaction
    await client.query("COMMIT");

    // Send admin notification email (after successful commit)
    // Don't await this to avoid blocking the response - run in background
    (async () => {
      try {
        const adminNotificationData = {
          userName:
            session.user?.name || session.user?.email || `User ${userId}`,
          userEmail: session.user?.email || "",
          roomName: roomName || `Ruangan ID: ${validatedData.roomId}`,
          reservationDate: formatDateIndonesian(validatedData.start_time),
          reservationTime: formatTimeRange(
            validatedData.start_time,
            validatedData.end_time
          ),
          purpose: validatedData.title,
          roomSlug: roomSlug || undefined,
        };

        const emailSent = await sendAdminNotification(adminNotificationData);

        if (emailSent) {
          console.log(
            `Admin notification email sent successfully for reservation ${newReservationId}`
          );
        } else {
          console.warn(
            `Failed to send admin notification email for reservation ${newReservationId}`
          );
        }
      } catch (emailError) {
        console.error("Error sending admin notification email:", emailError);
        // Don't fail the reservation creation due to email errors
      }
    })();

    // Revalidate relevant paths (after successful commit)
    if (roomSlug) {
      revalidatePath(`/v/${roomSlug}`); // Revalidate the specific room page
      revalidatePath("/me"); // Revalidate user's own reservation page
      // Optionally keep revalidating the homepage if it lists availability
      // revalidatePath("/");
    } else {
      // Fallback to generic revalidation if slug wasn't found
      revalidatePath("/");
      revalidatePath("/me");
    }

    return {
      success: true,
      message: "Reservasi berhasil dibuat!",
      reservationId: newReservationId,
    };
  } catch (error: any) {
    if (client) {
      try {
        await client.query("ROLLBACK"); // Rollback transaction on error
        console.log("Transaction rolled back due to error.");
      } catch (rollbackError) {
        console.error("Failed to rollback transaction:", rollbackError);
        // Log rollback error but proceed with original error handling
      }
    }
    console.error("Database/Action Error:", error);
    // Check for specific known constraint errors if necessary
    // Example: if (error.code === '23505' && error.constraint === 'unique_room_time') { ... }
    return {
      success: false,
      message: "Gagal membuat reservasi. Silakan coba lagi nanti.",
      // Optionally include more specific error details in development
      // fieldErrors: process.env.NODE_ENV === 'development' ? { _form: [error.message] } : undefined,
    };
  } finally {
    client?.release(); // Release the client back to the pool
  }
}
