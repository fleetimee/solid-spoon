export interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description: string | null;
  facilities: string | null;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdByName?: string | null; // Added name of the creator
  updatedByName?: string | null; // Added name of the updater
  createdAt: string;
  updatedAt: string;
  coverImage?: string | null;
  slug?: string;
  images?: string[]; // Array of all image URLs for the room
}

export interface RoomImage {
  id: number;
  roomId: number;
  imageUrl: string;
  isCover: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
