"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => {
        // Clear router cache (protected routes)
        router.refresh();
      }}
      captcha={{
        provider: "google-recaptcha-v2-checkbox",
        siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
        hideBadge: false,
      }}
      Link={Link}
      viewPaths={{
        signIn: "sign-in",
        signOut: "sign-out",
        signUp: "", // Disable sign-up path
        forgotPassword: "forgot-password",
        resetPassword: "reset-password",
        magicLink: "magic-link",
        settings: "settings",
      }}
      localization={{
        signIn: "Welcome Back",
        signInDescription: "Sign in to your account to continue.",
        signUp: "", // Hide sign-up text
        signUpDescription: "", // Hide sign-up description
        forgotPassword: "Reset Password",
        dontHaveAnAccount: "",
        forgotPasswordDescription: "Enter your email to receive a reset link.",
        emailPlaceholder: "Enter your email",
        passwordPlaceholder: "Enter your password",
        magicLinkEmail: "Check your inbox! We've sent you a login link.",
        forgotPasswordEmail: "Password reset link sent to your inbox.",
        alreadyHaveAnAccount: "Already have an account?", // Keep this for any edge cases
      }}
    >
      {children}
    </AuthUIProvider>
  );
}
