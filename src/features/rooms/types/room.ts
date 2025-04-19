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
  createdAt: string;
  updatedAt: string;
  coverImage?: string | null;
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
