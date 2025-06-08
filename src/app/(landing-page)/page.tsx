import { Hero } from "@/features/frontpage/components/hero-section";
import { Features } from "@/features/frontpage/components/feature-section";
import { FAQ } from "@/features/frontpage/components/faq-section";
import { Testimonial } from "@/features/frontpage/components/testimonial-section";
import { AvailableRoomsSection } from "@/features/frontpage/components/available-rooms-section"; // Import the new section
import { getRooms } from "@/features/rooms/api/getRooms"; // Import getRooms
import { getLookupValue } from "@/features/application/api/getLookupValue";
import { ScrollHandler } from "./components/scroll-handler"; // Import the new component
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistem Reservasi Ruangan - Capstone Room Reservation",
  description:
    "Platform reservasi ruangan modern untuk mengelola dan memesan ruangan dengan mudah. Temukan ruangan yang sesuai kebutuhan Anda.",
  keywords: [
    "reservasi ruangan",
    "booking ruangan",
    "sistem reservasi",
    "manajemen ruangan",
    "sewa ruangan",
    "ruangan meeting",
    "ruangan kantor",
    "capstone",
    "Indonesia",
  ],
  authors: [{ name: "Capstone Room Reservation Team" }],
  openGraph: {
    title: "Sistem Reservasi Ruangan - Capstone Room Reservation",
    description:
      "Platform reservasi ruangan modern untuk mengelola dan memesan ruangan dengan mudah. Temukan ruangan yang sesuai kebutuhan Anda.",
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Capstone Room Reservation",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Capstone Room Reservation - Sistem Reservasi Ruangan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistem Reservasi Ruangan - Capstone Room Reservation",
    description:
      "Platform reservasi ruangan modern untuk mengelola dan memesan ruangan dengan mudah. Temukan ruangan yang sesuai kebutuhan Anda.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default async function LandingPage() {
  // Make the component async
  // Fetch rooms data on the server
  const availableRoomsData = await getRooms({ pageSize: 6 });
  const rooms = availableRoomsData.rooms; // Extract rooms array
  const heroYoutubeLink = await getLookupValue("HERO_YOUTUBE_LINK");

  return (
    <>
      <ScrollHandler /> {/* Render the scroll handler component */}
      <Hero heroYoutubeLink={heroYoutubeLink} />
      <Features />
      {/* Pass fetched rooms data as a prop */}
      <AvailableRoomsSection rooms={rooms} />
      <FAQ />
      <Testimonial />
    </>
  );
}
