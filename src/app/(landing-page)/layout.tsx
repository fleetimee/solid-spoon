import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/features/frontpage/components/footer-section";
import React from "react";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";
import { FrontendBreadcrumbNav } from "@/components/frontend-breadcrumb-nav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUnreadNotificationCount } from "@/features/notifications/api/getUnreadNotificationCount";

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
      <Navbar session={session} initialNotificationCount={unreadCount} />
      <BreadcrumbProvider>
        <main className="flex-grow">
          {/* Removed conflicting container constraints */}
          <FrontendBreadcrumbNav /> {/* Use the new frontend breadcrumb */}
          {children}
        </main>
      </BreadcrumbProvider>
      <Footer />
    </div>
  );
}
