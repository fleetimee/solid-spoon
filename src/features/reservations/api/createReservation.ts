"use server";

import { z } from "zod";
import { auth } from "../../../lib/auth";
import db from "../../../lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers"; // Import headers
import { PoolClient } from "pg"; // Import PoolClient for type safety if needed

// Define the Zod schema for validation
const newReservationSchema = z
  .object({
    roomId: z.coerce
      .number()
      .int()
      .positive("Room ID must be a positive integer"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    start_time: z
      .string()
      .datetime({ message: "Invalid start date/time format" }),
    end_time: z.string().datetime({ message: "Invalid end date/time format" }),
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
      message: "End time must be after start time",
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
    return { success: false, message: "Authentication required" };
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
      message: "Invalid data provided. Please check the fields.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const validatedData = result.data;

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
      validatedData.description || null, // Use null if description is empty/undefined
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
    const notificationTitle = "New Reservation Pending";
    // Use roomName in the message, fallback to ID
    const notificationMessage = `User ${
      session.user?.name || userId
    } requested reservation for room "${
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
      message: "Reservation created successfully!",
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
      message: "Failed to create reservation. Please try again later.",
      // Optionally include more specific error details in development
      // fieldErrors: process.env.NODE_ENV === 'development' ? { _form: [error.message] } : undefined,
    };
  } finally {
    client?.release(); // Release the client back to the pool
  }
}
