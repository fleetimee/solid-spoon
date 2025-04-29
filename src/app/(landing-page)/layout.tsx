import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/features/frontpage/components/footer-section";
import React from "react";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
