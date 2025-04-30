"use client";

import { AuthCard } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthView({ pathname }: { pathname: string }) {
  const router = useRouter();

  useEffect(() => {
    // Clear router cache (protected routes)
    router.refresh();
  }, [router]);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background/50">
      <div className="w-full max-w-md p-4 sm:p-6">
        <AuthCard pathname={pathname} />
      </div>
    </main>
  );
}
