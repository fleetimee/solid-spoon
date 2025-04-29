import { Hero } from "@/features/frontpage/components/hero-section";
import { Features } from "@/features/frontpage/components/feature-section";
import { FAQ } from "@/features/frontpage/components/faq-section";
import { Testimonial } from "@/features/frontpage/components/testimonial-section";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <FAQ />
      <Testimonial />
    </>
  );
}
