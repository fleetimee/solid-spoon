"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";
import { Room } from "../types/room";

const updateRoomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1")
    .max(1000, "Capacity cannot exceed 1000"),
  description: z.string().optional(),
  facilities: z.string().optional(),
});

export type UpdateRoomFormState = {
  success: boolean;
  message: string;
  room?: Room;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Server action to update an existing room with pre-uploaded images
 */
export async function updateRoomAction(
  roomId: number,
  formData: FormData
): Promise<UpdateRoomFormState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "You must be logged in to update a room",
      };
    }

    // Check if the room exists
    const existingRoom = await db.query(
      `SELECT id, name FROM room WHERE id = $1 AND is_active = true`,
      [roomId]
    );

    if (existingRoom.rows.length === 0) {
      return {
        success: false,
        message: "Room not found or has been deleted",
      };
    }

    // Extract form data
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const capacity = formData.get("capacity") as string;
    const description = formData.get("description") as string;
    const facilities = formData.get("facilities") as string;

    // Process image URLs
    const imageUrls = formData.getAll("imageUrls") as string[];
    const existingImageUrls = formData.getAll("existingImageUrls") as string[];
    const removedImageUrls = formData.getAll("removedImageUrls") as string[];

    // Require at least one image (either existing or new)
    if (
      (!imageUrls || imageUrls.length === 0) &&
      (!existingImageUrls || existingImageUrls.length === 0)
    ) {
      return {
        success: false,
        message: "At least one image must be provided for the room",
      };
    }

    // Validate input data
    const validationResult = updateRoomSchema.safeParse({
      name,
      location,
      capacity,
      description,
      facilities,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid room data",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const roomData = validationResult.data;

    // Begin transaction
    await db.query("BEGIN");

    // Check if the name is being changed and if it would cause a conflict
    if (name !== existingRoom.rows[0].name) {
      const nameConflict = await db.query(
        `SELECT id FROM room WHERE name = $1 AND id != $2 AND is_active = true`,
        [name, roomId]
      );

      if (nameConflict.rows.length > 0) {
        await db.query("ROLLBACK");
        return {
          success: false,
          message: "A room with this name already exists",
        };
      }
    }

    // Update the room data
    const roomResult = await db.query(
      `
      UPDATE room 
      SET 
        name = $1, 
        location = $2, 
        capacity = $3, 
        description = $4, 
        facilities = $5,
        updated_by = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING 
        id, name, location, capacity, description, facilities, slug,
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
        roomId,
      ]
    );

    const updatedRoom = roomResult.rows[0] as Room;

    // Process removed images
    if (removedImageUrls.length > 0) {
      await db.query(
        `
        UPDATE room_image
        SET is_active = false, updated_at = NOW()
        WHERE room_id = $1 AND image_url = ANY($2)
        `,
        [roomId, removedImageUrls]
      );
    }

    // Get the highest sort order
    const highestSortOrder = await db.query(
      `
      SELECT COALESCE(MAX(sort_order), -1) as max_sort_order
      FROM room_image
      WHERE room_id = $1 AND is_active = true
      `,
      [roomId]
    );

    let nextSortOrder = highestSortOrder.rows[0].max_sort_order + 1;

    // Add new images
    if (imageUrls.length > 0) {
      for (let index = 0; index < imageUrls.length; index++) {
        const imageUrl = imageUrls[index];
        const isCover = formData.get(`cover_${index}`) === "true";

        await db.query(
          `
          INSERT INTO room_image 
            (room_id, image_url, is_cover, sort_order) 
          VALUES 
            ($1, $2, $3, $4)
          `,
          [roomId, imageUrl, isCover, nextSortOrder + index]
        );
      }
    }

    // Update cover image for existing images
    const existingCoverIndices = formData.getAll("existingCover") as string[];
    if (existingCoverIndices.length > 0) {
      // First, set all existing images as non-cover
      await db.query(
        `
        UPDATE room_image
        SET is_cover = false
        WHERE room_id = $1 AND is_active = true
        `,
        [roomId]
      );

      // Then set the specified image as cover
      for (const coverIndex of existingCoverIndices) {
        const coverUrl = existingImageUrls[parseInt(coverIndex)];
        if (coverUrl) {
          await db.query(
            `
            UPDATE room_image
            SET is_cover = true
            WHERE room_id = $1 AND image_url = $2 AND is_active = true
            `,
            [roomId, coverUrl]
          );
        }
      }
    }

    await db.query("COMMIT");

    // Get the updated cover image
    const coverImageResult = await db.query(
      `
      SELECT image_url as "imageUrl"
      FROM room_image
      WHERE room_id = $1 AND is_active = true AND is_cover = true
      LIMIT 1
      `,
      [roomId]
    );

    if (coverImageResult.rows.length > 0) {
      updatedRoom.coverImage = coverImageResult.rows[0].imageUrl;
    } else {
      // If no cover image is explicitly set, use the first active image
      const firstImageResult = await db.query(
        `
        SELECT image_url as "imageUrl"
        FROM room_image
        WHERE room_id = $1 AND is_active = true
        ORDER BY sort_order ASC
        LIMIT 1
        `,
        [roomId]
      );

      if (firstImageResult.rows.length > 0) {
        updatedRoom.coverImage = firstImageResult.rows[0].imageUrl;
      }
    }

    // Revalidate paths
    revalidatePath("/admin/rooms");
    revalidatePath(`/admin/rooms/${updatedRoom.slug}`);
    revalidatePath(`/admin/rooms/${updatedRoom.slug}/update`);

    return {
      success: true,
      message: "Room updated successfully",
      room: updatedRoom,
    };
  } catch (error) {
    await db.query("ROLLBACK");

    console.error("Failed to update room:", error);

    if (error instanceof Error) {
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
      message: "Failed to update room. Please try again.",
    };
  }
}
