import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { admin, captcha } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import { Resend } from "resend";
import { EmailTemplate } from "@daveyplate/better-auth-ui/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  plugins: [
    admin(),
    nextCookies(),
    captcha({
      provider: "google-recaptcha",
      secretKey: process.env.RECAPTCHA_SECRET_KEY as string,
    }),
  ],
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
        subject: "Atur Ulang Kata Sandi Anda",
        react: EmailTemplate({
          action: "Atur Ulang Kata Sandi",
          heading: "Atur Ulang Kata Sandi Anda",
          content: `Halo ${name}, silakan atur ulang kata sandi Anda dengan mengklik tautan di bawah ini.`,
          siteName: "CapstoneD Manajemen Ruangan Meeting",
          baseUrl: "https://newtech.dev",
          url,
        }),

        text: `Halo ${name},\n\nSilakan atur ulang kata sandi Anda dengan mengklik tautan di bawah ini:\n\n${url}\n\nSalam hormat,\nTim Kami`,
      });
    },
  },
});
