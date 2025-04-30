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

  // Content customization based on pathname
  const getPageContent = () => {
    switch (pathname) {
      case "sign-in":
        return {
          title: "Welcome back",
          description:
            "Sign in to your account to manage room reservations and access all features.",
        };
      case "sign-up":
        return {
          title: "Create your account",
          description:
            "Join our platform to discover and book the perfect spaces for your needs.",
        };
      case "forgot-password":
        return {
          title: "Reset your password",
          description:
            "We'll help you recover your account and get back to booking rooms.",
        };
      default:
        return {
          title: "Account access",
          description:
            "Securely manage your account and room reservations with our authentication system.",
        };
    }
  };

  const content = getPageContent();

  return (
    <main className="flex min-h-screen h-full bg-background">
      {/* Left panel with illustration - hidden on mobile, visible on md+ screens */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/5 to-primary/10 flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="relative z-10 max-w-md">
          <div className="mb-12">
            <h1 className="text-3xl font-semibold tracking-tight mb-3">
              {content.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {content.description}
            </p>
          </div>

          {/* Custom Building/Room SVG Illustration */}
          <div className="w-full aspect-square relative mb-12">
            <svg
              viewBox="0 0 800 800"
              fill="none"
              className="w-full h-full text-primary/80"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Building outline */}
              <rect
                x="150"
                y="200"
                width="500"
                height="450"
                rx="8"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
              />

              {/* Roof */}
              <path
                d="M100 200L400 50L700 200"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
              />

              {/* Windows - Top Row */}
              <rect
                x="200"
                y="250"
                width="80"
                height="100"
                rx="4"
                stroke="currentColor"
                strokeWidth="4"
                fill="currentColor"
                fillOpacity="0.1"
              />
              <rect
                x="360"
                y="250"
                width="80"
                height="100"
                rx="4"
                stroke="currentColor"
                strokeWidth="4"
                fill="currentColor"
                fillOpacity="0.1"
              />
              <rect
                x="520"
                y="250"
                width="80"
                height="100"
                rx="4"
                stroke="currentColor"
                strokeWidth="4"
                fill="currentColor"
                fillOpacity="0.1"
              />

              {/* Windows - Middle Row */}
              <rect
                x="200"
                y="380"
                width="80"
                height="100"
                rx="4"
                stroke="currentColor"
                strokeWidth="4"
                fill="currentColor"
                fillOpacity="0.1"
              />
              <rect
                x="520"
                y="380"
                width="80"
                height="100"
                rx="4"
                stroke="currentColor"
                strokeWidth="4"
                fill="currentColor"
                fillOpacity="0.1"
              />

              {/* Door */}
              <rect
                x="360"
                y="480"
                width="80"
                height="170"
                rx="4"
                stroke="currentColor"
                strokeWidth="6"
                fill="currentColor"
                fillOpacity="0.1"
              />
              <circle cx="425" cy="565" r="8" fill="currentColor" />

              {/* Windows - Above Door */}
              <rect
                x="360"
                y="380"
                width="80"
                height="70"
                rx="4"
                stroke="currentColor"
                strokeWidth="4"
                fill="currentColor"
                fillOpacity="0.1"
              />

              {/* Steps */}
              <path
                d="M330 650H470V630H350V650Z"
                fill="currentColor"
                fillOpacity="0.3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M340 670H460V650H330V670Z"
                fill="currentColor"
                fillOpacity="0.3"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Features list */}
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-1.5">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-base">Secure room booking system</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-1.5">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-base">Easy scheduling and management</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-1.5">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <span className="text-base">
                Find perfect spaces for your needs
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right panel with auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <AuthCard
            pathname={pathname}
            classNames={{
              base: "border border-input/30 shadow-sm w-full transition-all duration-300",
              header: "px-6 pt-6 pb-2",
              title: "text-2xl font-semibold tracking-tight",
              description: "text-muted-foreground text-sm",
              content: "p-6",
              footer: "px-6 pb-6 pt-2",
              footerLink:
                "text-primary hover:text-primary/80 transition-colors",
            }}
          />
        </div>
      </div>
    </main>
  );
}
