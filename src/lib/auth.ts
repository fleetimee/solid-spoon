import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  plugins: [
    admin({
      adminRoles: ["admin", "superadmin"],
      adminUserIds: ["ZkZ8QJRiOak401tDuWs0UUb1z9RETI8i"], // Add your admin user IDs here
    }),
    nextCookies(),
  ],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    autoSignIn: false,
  },
});
