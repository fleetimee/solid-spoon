import type { User as BetterAuthUser } from "better-auth";

export interface ExtendedUser extends BetterAuthUser {
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  role: string | null;
}
