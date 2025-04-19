import db from "@/lib/db";
import { Room } from "../types/room";

export interface RoomSearchParams {
  search?: string;
  location?: string;
  minCapacity?: number;
  maxCapacity?: number;
  facilities?: string[];
}

/**
 * Fetches all rooms from the database with their cover images
 * @param searchParams Filter parameters for rooms
 * @returns Array of rooms with cover image URLs
 */
export async function getRooms(
  searchParams?: RoomSearchParams
): Promise<Room[]> {
  const params: Array<string | number> = [];
  const queryConditions = ["r.is_active = true"];

  if (searchParams?.search) {
    params.push(`%${searchParams.search}%`);
    queryConditions.push(
      `(r.name ILIKE $${params.length} OR r.description ILIKE $${params.length})`
    );
  }

  if (searchParams?.location) {
    params.push(`%${searchParams.location}%`);
    queryConditions.push(`r.location ILIKE $${params.length}`);
  }

  if (searchParams?.minCapacity) {
    params.push(searchParams.minCapacity);
    queryConditions.push(`r.capacity >= $${params.length}`);
  }

  if (searchParams?.maxCapacity) {
    params.push(searchParams.maxCapacity);
    queryConditions.push(`r.capacity <= $${params.length}`);
  }

  if (searchParams?.facilities && searchParams.facilities.length > 0) {
    const facilityConditions = searchParams.facilities.map((facility) => {
      params.push(`%${facility}%`);
      return `r.facilities ILIKE $${params.length}`;
    });
    queryConditions.push(`(${facilityConditions.join(" OR ")})`);
  }

  const query = `
    SELECT 
      r.id, 
      r.name, 
      r.location, 
      r.capacity, 
      r.description, 
      r.facilities, 
      r.slug,
      r.is_active as "isActive",
      r.created_by as "createdBy",
      r.updated_by as "updatedBy",
      r.created_at as "createdAt", 
      r.updated_at as "updatedAt"
    FROM room r
    WHERE ${queryConditions.join(" AND ")}
    ORDER BY r.id
  `;

  const roomsResult = await db.query(query, params);
  const rooms = roomsResult.rows;

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
      r.slug,
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
 * Fetches a room by its slug with its cover image
 * @param slug Room slug
 * @returns Room object with cover image URL, all images, and creator/updater names
 */
export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const roomResult = await db.query(
    `
    SELECT 
      r.id, 
      r.name, 
      r.location, 
      r.capacity, 
      r.description, 
      r.facilities, 
      r.slug,
      r.is_active as "isActive",
      r.created_by as "createdBy",
      r.updated_by as "updatedBy",
      creator.name as "createdByName",
      updater.name as "updatedByName",
      r.created_at as "createdAt", 
      r.updated_at as "updatedAt"
    FROM room r
    LEFT JOIN "user" creator ON r.created_by = creator.id
    LEFT JOIN "user" updater ON r.updated_by = updater.id
    WHERE r.slug = $1 AND r.is_active = true
  `,
    [slug]
  );

  if (roomResult.rows.length === 0) {
    return null;
  }

  const room = roomResult.rows[0];

  // Fetch all images for this room
  const imagesResult = await db.query(
    `
    SELECT 
      image_url as "imageUrl",
      is_cover as "isCover",
      sort_order as "sortOrder"
    FROM room_image
    WHERE room_id = $1 AND is_active = true
    ORDER BY is_cover DESC, sort_order ASC
  `,
    [room.id]
  );

  // Set the cover image and all images array
  room.coverImage =
    imagesResult.rows.find((img) => img.isCover)?.imageUrl ||
    imagesResult.rows[0]?.imageUrl ||
    null;
  room.images = imagesResult.rows.map((row) => row.imageUrl);

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
