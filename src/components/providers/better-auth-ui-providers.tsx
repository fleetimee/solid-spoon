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
      Link={Link}
      localization={{
        signIn: "Welcome Back",
        signInDescription: "Sign in to your account to continue.",
        signUp: "Create an Account",
        signUpDescription: "Fill out the form below to create your account.",
        forgotPassword: "Reset Password",
        forgotPasswordDescription: "Enter your email to receive a reset link.",
        emailPlaceholder: "Enter your email",
        passwordPlaceholder: "Enter your password",
        magicLinkEmail: "Check your inbox! We've sent you a login link.",
        forgotPasswordEmail: "Password reset link sent to your inbox.",
      }}
    >
      {children}
    </AuthUIProvider>
  );
}
