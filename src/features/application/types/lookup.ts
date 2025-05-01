// src/features/application/types/lookup.ts
export interface Lookup {
  id: number;
  category: string;
  code: string;
  value: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string; // Or Date
}
