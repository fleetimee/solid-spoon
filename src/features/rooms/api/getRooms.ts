import db from "@/lib/db";
import { Room } from "../types/room";

/**
 * Fetches all rooms from the database with their cover images
 * @returns Array of rooms with cover image URLs
 */
export async function getRooms(): Promise<Room[]> {
  const roomsResult = await db.query(`
    SELECT 
      r.id, 
      r.name, 
      r.location, 
      r.capacity, 
      r.description, 
      r.facilities, 
      r.is_active as "isActive",
      r.created_by as "createdBy",
      r.updated_by as "updatedBy",
      r.created_at as "createdAt", 
      r.updated_at as "updatedAt"
    FROM room r
    WHERE r.is_active = true
    ORDER BY r.id
  `);

  const rooms = roomsResult.rows;

  // Fetch cover images for each room
  for (const room of rooms) {
    const coverImageResult = await db.query(
      `
      SELECT image_url as "imageUrl"
      FROM room_image
      WHERE room_id = $1 AND is_active = true
      ORDER BY is_cover DESC, sort_order ASC
      LIMIT 1
    `,
      [room.id]
    );

    room.coverImage = coverImageResult.rows[0]?.imageUrl || null;
  }

  return rooms;
}

/**
 * Fetches a single room by ID with its cover image
 * @param id Room ID
 * @returns Room object with cover image URL
 */
export async function getRoomById(id: number): Promise<Room | null> {
  const roomResult = await db.query(
    `
    SELECT 
      r.id, 
      r.name, 
      r.location, 
      r.capacity, 
      r.description, 
      r.facilities, 
      r.is_active as "isActive",
      r.created_by as "createdBy",
      r.updated_by as "updatedBy",
      r.created_at as "createdAt", 
      r.updated_at as "updatedAt"
    FROM room r
    WHERE r.id = $1 AND r.is_active = true
  `,
    [id]
  );

  if (roomResult.rows.length === 0) {
    return null;
  }

  const room = roomResult.rows[0];

  // Fetch cover image for the room
  const coverImageResult = await db.query(
    `
    SELECT image_url as "imageUrl"
    FROM room_image
    WHERE room_id = $1 AND is_active = true
    ORDER BY is_cover DESC, sort_order ASC
    LIMIT 1
  `,
    [room.id]
  );

  room.coverImage = coverImageResult.rows[0]?.imageUrl || null;

  return room;
}

/**
 * Fetches all images for a specific room
 * @param roomId Room ID
 * @returns Array of room image URLs
 */
export async function getRoomImages(roomId: number): Promise<string[]> {
  const imagesResult = await db.query(
    `
    SELECT image_url as "imageUrl"
    FROM room_image
    WHERE room_id = $1 AND is_active = true
    ORDER BY is_cover DESC, sort_order ASC
  `,
    [roomId]
  );

  return imagesResult.rows.map((row) => row.imageUrl);
}
