import { Hero } from "@/features/frontpage/components/hero-section";
import { Features } from "@/features/frontpage/components/feature-section";
import { FAQ } from "@/features/frontpage/components/faq-section";
import { Testimonial } from "@/features/frontpage/components/testimonial-section";
import { AvailableRoomsSection } from "@/features/frontpage/components/available-rooms-section"; // Import the new section
import { getRooms } from "@/features/rooms/api/getRooms"; // Import getRooms
import { getLookupValue } from "@/features/application/api/getLookupValue";
import { ScrollHandler } from "./components/scroll-handler"; // Import the new component

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
