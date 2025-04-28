import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react"; // Example icon

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Building2 className="h-6 w-6" /> {/* Example Icon */}
            <span className="font-bold inline-block">Room Reservation</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
            {/* Add Nav Links if needed */}
            {/* <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link> */}
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
            {/* Or link directly to dashboard if auth handles redirection */}
            {/* <Button asChild>
               <Link href="/admin/dashboard">Go to Dashboard</Link>
             </Button> */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        {/* Modified section */}
        <section className="container py-28 md:py-32 lg:py-40">
          {/* NEW Wrapper Div */}
          <div className="flex flex-col items-center text-center">
            {/* Modified h1 (no max-w) */}
            <h1 className="max-w-[750px] text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-br from-foreground to-muted-foreground/70 bg-clip-text text-transparent">
              Welcome to Room Reservation
            </h1>
            {/* Modified p (no max-w removed, 750px added) */}
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl mt-4">
              Easily book and manage rooms for your needs. Streamlined,
              efficient, and simple.
            </p>
            {/* Button container */}
            <div className="flex justify-center gap-4 mt-8">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
              {/* <Button variant="outline" size="lg">Learn More</Button> */}
            </div>
          </div>{" "}
          {/* End NEW Wrapper Div */}
        </section>

        {/* Other sections can be added here */}
        {/* <section className="container py-10">
          <h2 className="text-2xl font-bold">Features</h2>
          {/* Feature content */}
        {/* </section> */}
      </main>

      {/* Footer */}
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Your Team/Name. © {new Date().getFullYear()} All rights
            reserved.
          </p>
          {/* Add social links or other footer content if needed */}
        </div>
      </footer>
    </div>
  );
}
