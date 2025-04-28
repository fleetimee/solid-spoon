import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, Home, Clock, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto flex min-h-screen flex-col">
        <header className="border-b bg-white">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-semibold text-purple-600">
                CompanySpaces
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="#spaces"
                className="text-sm font-medium text-gray-600 hover:text-purple-600"
              >
                Spaces
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-purple-600"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-purple-600"
              >
                How It Works
              </Link>
            </nav>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-purple-600"
              >
                Log in
              </Link>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Sign in with SSO
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                    Book Company Spaces in Seconds
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Seamlessly reserve meeting rooms, event spaces, and
                    workspaces with your company account.
                  </p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6">
                      Reserve Now
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-6"
                    >
                      View My Bookings
                    </Button>
                  </div>
                </div>
                <div className="mx-auto lg:ml-auto">
                  <Image
                    src="/placeholder.svg?height=550&width=550"
                    alt="Company Room Reservation"
                    width={550}
                    height={550}
                    className="rounded-lg object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="w-full py-12 md:py-24 bg-purple-50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                    Why Use CompanySpaces
                  </h2>
                  <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our minimalist approach makes booking company spaces simple
                    and efficient
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-4 rounded-lg border border-purple-100 bg-white p-6 shadow-sm">
                  <div className="rounded-full bg-purple-100 p-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800">
                    Instant Booking
                  </h3>
                  <p className="text-center text-gray-500">
                    Reserve spaces in seconds with your company credentials
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 rounded-lg border border-purple-100 bg-white p-6 shadow-sm">
                  <div className="rounded-full bg-purple-100 p-3">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800">
                    Real-time Availability
                  </h3>
                  <p className="text-center text-gray-500">
                    See up-to-date space availability and avoid scheduling
                    conflicts
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 rounded-lg border border-purple-100 bg-white p-6 shadow-sm">
                  <div className="rounded-full bg-purple-100 p-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800">
                    Team Integration
                  </h3>
                  <p className="text-center text-gray-500">
                    Sync with your calendar and invite team members
                    automatically
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="spaces" className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                    Available Company Spaces
                  </h2>
                  <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Find and book the perfect space for your meetings and events
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Room Card 1 */}
                <div className="group overflow-hidden rounded-lg border border-purple-100 bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Conference Room A"
                      width={400}
                      height={300}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-purple-600 px-2 py-1 text-xs font-medium text-white">
                      Popular
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Conference Room A
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="mr-2">Capacity: 12 people</span>
                      <span>•</span>
                      <span className="ml-2">4th Floor</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Spacious conference room with projector, whiteboard, and
                      video conferencing.
                    </p>
                    <div className="mt-4 flex items-center justify-end">
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Reserve
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Room Card 2 */}
                <div className="group overflow-hidden rounded-lg border border-purple-100 bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Meeting Room B"
                      width={400}
                      height={300}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Meeting Room B
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="mr-2">Capacity: 6 people</span>
                      <span>•</span>
                      <span className="ml-2">3rd Floor</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Intimate meeting room perfect for small team discussions
                      and brainstorming.
                    </p>
                    <div className="mt-4 flex items-center justify-end">
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Reserve
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Room Card 3 */}
                <div className="group overflow-hidden rounded-lg border border-purple-100 bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Event Space"
                      width={400}
                      height={300}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-green-600 px-2 py-1 text-xs font-medium text-white">
                      New
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Event Space
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="mr-2">Capacity: 50 people</span>
                      <span>•</span>
                      <span className="ml-2">1st Floor</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Large open space ideal for company events, workshops, and
                      presentations.
                    </p>
                    <div className="mt-4 flex items-center justify-end">
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Reserve
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Room Card 4 */}
                <div className="group overflow-hidden rounded-lg border border-purple-100 bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Focus Room"
                      width={400}
                      height={300}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Focus Room
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="mr-2">Capacity: 2 people</span>
                      <span>•</span>
                      <span className="ml-2">2nd Floor</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Quiet space for focused work or one-on-one meetings with
                      soundproofing.
                    </p>
                    <div className="mt-4 flex items-center justify-end">
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Reserve
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  View All Spaces
                </Button>
              </div>
            </div>
          </section>

          <section
            id="how-it-works"
            className="w-full py-12 md:py-24 bg-purple-50"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                    How It Works
                  </h2>
                  <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Three simple steps to book your company space
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-purple-800">
                    Browse Spaces
                  </h3>
                  <p className="text-center text-gray-500">
                    Find the perfect space for your needs from our available
                    company rooms
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-purple-800">
                    Select Time
                  </h3>
                  <p className="text-center text-gray-500">
                    Choose your preferred date and time slot
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-purple-800">
                    Confirm Booking
                  </h3>
                  <p className="text-center text-gray-500">
                    Receive confirmation and calendar invite automatically
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 bg-purple-600 text-white">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to book your next meeting?
                  </h2>
                  <p className="max-w-[700px] text-purple-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Join your colleagues who are already using CompanySpaces to
                    book rooms effortlessly
                  </p>
                </div>
                <div className="mx-auto flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6">
                    Sign In & Reserve
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-400 text-white hover:bg-purple-700 px-8 py-6"
                  >
                    View Tutorial
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="border-t bg-white">
          <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:py-12 px-4 md:px-6">
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-semibold text-purple-600">
                  CompanySpaces
                </span>
              </Link>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Your Company. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                Help
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                IT Support
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                Feedback
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
