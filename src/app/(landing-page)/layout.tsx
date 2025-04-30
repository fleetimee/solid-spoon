import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/features/frontpage/components/footer-section";
import React from "react";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { auth } from "@/lib/auth"; // Added import
import { headers } from "next/headers"; // Added import

export default async function LandingPageLayout({
  // Changed to async function
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() }); // Fetch session - Added await

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar session={session} /> {/* Pass session as prop */}
      <BreadcrumbProvider>
        <main className="flex-grow">{children}</main>
      </BreadcrumbProvider>
      <Footer />
    </div>
  );
}
