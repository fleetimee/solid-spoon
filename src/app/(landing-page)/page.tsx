import { Hero } from "@/features/frontpage/components/hero-section";
import { Features } from "@/features/frontpage/components/feature-section";
import { FAQ } from "@/features/frontpage/components/faq-section";
import { Navbar } from "@/components/navbar/navbar";
import { Testimonial } from "@/features/frontpage/components/testimonial-section";
import { Footer } from "@/features/frontpage/components/footer-section";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <Testimonial />
      <Footer />
    </>
  );
}
