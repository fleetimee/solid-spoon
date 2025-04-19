"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";
import { uploadFileToS3 } from "@/helpers/upload";
import { Room } from "../types/room";

// Define validation schema for new room
const newRoomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1")
    .max(1000, "Capacity cannot exceed 1000"),
  description: z.string().optional(),
  facilities: z.string().optional(),
});

export type CreateRoomFormState = {
  success: boolean;
  message: string;
  room?: Room;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Server action to create a new room and upload room images
 */
export async function createRoomAction(
  formData: FormData
): Promise<CreateRoomFormState> {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "You must be logged in to create a room",
      };
    }

    // Process and validate form data
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const capacity = formData.get("capacity") as string;
    const description = formData.get("description") as string;
    const facilities = formData.get("facilities") as string;

    // Validate room data
    const validationResult = newRoomSchema.safeParse({
      name,
      location,
      capacity,
      description,
      facilities,
    });

    if (!validationResult.success) {
      // Return validation errors
      return {
        success: false,
        message: "Invalid room data",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    // Prepare data for db insertion
    const roomData = validationResult.data;

    // Begin transaction
    await db.query("BEGIN");

    // Insert room data
    const roomResult = await db.query(
      `
      INSERT INTO room 
        (name, location, capacity, description, facilities, created_by, updated_by) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id, name, location, capacity, description, facilities, 
        is_active as "isActive", 
        created_by as "createdBy", 
        updated_by as "updatedBy", 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      `,
      [
        roomData.name,
        roomData.location,
        roomData.capacity,
        roomData.description || null,
        roomData.facilities || null,
        session.user.id,
        session.user.id,
      ]
    );

    const newRoom = roomResult.rows[0] as Room;

    // Process images
    const images = formData.getAll("images") as File[];
    let coverImageSet = false;

    if (images && images.length > 0) {
      for (const [index, image] of images.entries()) {
        if (image.size > 0) {
          // Only process non-empty files
          const buffer = Buffer.from(await image.arrayBuffer());
          const contentType = image.type;

          // Upload image to S3/MinIO
          const imageUrl = await uploadFileToS3(
            buffer,
            image.name,
            contentType
          );

          // Set first image as cover by default
          const isCover =
            index === 0 || formData.get(`cover_${index}`) === "true";

          // Insert image record
          await db.query(
            `
            INSERT INTO room_image 
              (room_id, image_url, is_cover, sort_order) 
            VALUES 
              ($1, $2, $3, $4)
            `,
            [newRoom.id, imageUrl, isCover, index]
          );

          if (isCover) {
            coverImageSet = true;
          }
        }
      }
    }

    // Commit transaction
    await db.query("COMMIT");

    // Fetch cover image for the new room
    if (coverImageSet) {
      const coverImageResult = await db.query(
        `
        SELECT image_url as "imageUrl"
        FROM room_image
        WHERE room_id = $1 AND is_active = true AND is_cover = true
        LIMIT 1
        `,
        [newRoom.id]
      );

      if (coverImageResult.rows.length > 0) {
        newRoom.coverImage = coverImageResult.rows[0].imageUrl;
      }
    }

    // Revalidate relevant paths
    revalidatePath("/admin/rooms");

    return {
      success: true,
      message: "Room created successfully",
      room: newRoom,
    };
  } catch (error) {
    // Roll back transaction on error
    await db.query("ROLLBACK");

    console.error("Failed to create room:", error);

    if (error instanceof Error) {
      // Check for unique constraint violation
      if (
        error.message.includes(
          'duplicate key value violates unique constraint "room_name_key"'
        )
      ) {
        return {
          success: false,
          message: "A room with this name already exists",
        };
      }
    }

    return {
      success: false,
      message: "Failed to create room. Please try again.",
    };
  }
}
