import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/features/frontpage/components/footer-section";
import React from "react";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";
import { FrontendBreadcrumbNav } from "@/components/frontend-breadcrumb-nav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUnreadNotificationCount } from "@/features/notifications/api/getUnreadNotificationCount";
import { RouteScrollHandler } from "./components/route-scroll-handler";

export default async function LandingPageLayout({
  // Changed to async function
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const unreadCount = await getUnreadNotificationCount();

  return (
    <div className="flex min-h-screen flex-col">
      <RouteScrollHandler />
      <Navbar session={session} initialNotificationCount={unreadCount} />
      <BreadcrumbProvider>
        <main className="container mx-auto max-w-7xl flex-grow px-4 py-8">
          {" "}
          {/* Added container, max-width, padding, margin */}
          <FrontendBreadcrumbNav /> {/* Use the new frontend breadcrumb */}
          {children}
        </main>
      </BreadcrumbProvider>
      <Footer />
    </div>
  );
}
