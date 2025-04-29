import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/features/frontpage/components/footer-section";
import React from "react";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <BreadcrumbProvider>
        <main className="flex-grow">{children}</main>
      </BreadcrumbProvider>
      <Footer />
    </div>
  );
}
