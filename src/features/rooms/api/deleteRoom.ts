"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";
import { Room } from "../types/room";

const deleteRoomSchema = z
  .object({
    roomName: z.string().min(1, "Room name is required"),
    confirmName: z.string().min(1, "Confirmation is required"),
  })
  .refine((data) => data.roomName === data.confirmName, {
    message: "Room name confirmation doesn't match",
    path: ["confirmName"],
  });

export type DeleteRoomFormState = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * Server action to delete a room
 */
export async function deleteRoomAction(
  roomId: number,
  formData: FormData
): Promise<DeleteRoomFormState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "You must be logged in to delete a room",
      };
    }

    const roomName = formData.get("roomName") as string;
    const confirmName = formData.get("confirmName") as string;

    const validationResult = deleteRoomSchema.safeParse({
      roomName,
      confirmName,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation error",
        error: validationResult.error.errors[0]?.message || "Invalid input",
      };
    }

    const roomResult = await db.query(
      `
      SELECT id, name
      FROM room
      WHERE id = $1 AND is_active = true
      `,
      [roomId]
    );

    if (roomResult.rows.length === 0) {
      return {
        success: false,
        message: "Room not found or already deleted",
      };
    }

    const room = roomResult.rows[0] as Room;

    if (room.name !== roomName) {
      return {
        success: false,
        message: "Room name confirmation doesn't match",
        error: "Room name confirmation doesn't match",
      };
    }

    await db.query("BEGIN");

    await db.query(
      `
      UPDATE room
      SET 
        is_active = false,
        updated_by = $1,
        updated_at = NOW()
      WHERE id = $2
      `,
      [session.user.id, roomId]
    );

    await db.query(
      `
      UPDATE room_image
      SET 
        is_active = false,
        updated_at = NOW()
      WHERE room_id = $1
      `,
      [roomId]
    );

    await db.query("COMMIT");

    revalidatePath("/admin/rooms");
    revalidatePath(`/admin/rooms/${room.slug}`);

    return {
      success: true,
      message: "Room deleted successfully",
    };
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Failed to delete room:", error);

    return {
      success: false,
      message: "Failed to delete room. Please try again.",
    };
  }
}
