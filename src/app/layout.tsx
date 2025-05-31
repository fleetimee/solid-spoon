import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/better-auth-ui-providers";
import { Toaster } from "sonner";
import BProgressProviders from "@/components/providers/bprogress-providers";
import TanstackProviders from "@/components/providers/tanstack-query-providers";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { RouteScrollHandler } from "@/components/route-scroll-handler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Capstone Room Reservation",
    default: "Capstone Room Reservation",
  },
  description: "Room reservation system for managing spaces and bookings",
  metadataBase: new URL("https://room-reservation.example.com"),
  openGraph: {
    siteName: "Capstone Room Reservation",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BProgressProviders>
          <Providers>
            <TanstackProviders>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <RouteScrollHandler />
                {children}
              </ThemeProvider>
            </TanstackProviders>
          </Providers>
        </BProgressProviders>

        <Toaster />
      </body>
    </html>
  );
}
