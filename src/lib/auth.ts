import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import { Resend } from "resend";
import { EmailTemplate } from "@daveyplate/better-auth-ui/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  plugins: [admin(), nextCookies()],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      const name = user.name || user.email.split("@")[0];

      console.log("Sending password reset email to:", user.email);

      await resend.emails.send({
        from: "CapstoneD <capstone-kelompok-d@capstone-mail.fleetime.my.id>",
        to: user.email,
        subject: "Reset Your Password",
        react: EmailTemplate({
          action: "Reset Password",
          heading: "Reset Your Password",
          content: `Hello ${name}, please reset your password by clicking the link below.`,
          siteName: "NEW-TECH",
          baseUrl: "https://newtech.dev",
          url,
        }),

        text: `Hello ${name},\n\nPlease reset your password by clicking the link below:\n\n${url}\n\nBest regards,\nYour Team`,
      });
    },
  },
});
