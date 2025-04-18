import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  plugins: [admin()],
  emailAndPassword: {
    enabled: true,
  },
});
