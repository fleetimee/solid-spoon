import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import ThemeToggle from "../theme-toggle";
import { NavigationSheet } from "./navigation-sheet";
import { authClient } from "@/lib/auth-client"; // Keep for signOut
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Terminal, User as UserIcon } from "lucide-react"; // Rename User icon import, add Terminal
import type { Session, User } from "better-auth"; // Import Session and User types
import { LogoutConfirmation } from "@/components/auth/logout-confirmation"; // Import LogoutConfirmation

// Define the combined type returned by getSession
interface AuthSession {
  session: Session;
  user: User & { role?: string | null }; // Allow role to be string, null, or undefined
}

interface NavbarProps {
  session: AuthSession | null; // Update prop type
}

export async function Navbar({ session }: NavbarProps) {
  // Destructure session (which is AuthSession | null)
  // Removed: client-side session fetching hook

  return (
    <nav className="sticky top-0 z-50 h-16 bg-background border-b border-accent">
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {session && <NotificationBell />}

          {session ? ( // Check if the combined session object exists
            <DropdownMenu>
              {" "}
              {/* Apply responsive classes here */}
              <div className="hidden md:flex">
                {" "}
                {/* Wrap Trigger and Content logic */}
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image ?? undefined} // Access user object directly
                        alt={session.user.name ?? ""} // Access user object directly
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() ?? "?"}{" "}
                        {/* Access user object directly */}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name} {/* Access user object directly */}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email} {/* Access user object directly */}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {session?.user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                        <Terminal className="mr-2 h-4 w-4" />
                        <span>Console</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/me">
                      <UserIcon className="mr-2 h-4 w-4" />{" "}
                      {/* Use renamed icon */}
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* Settings Link Placeholder */}
                  {/* <DropdownMenuItem asChild>
                   <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                   </Link>
                </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <LogoutConfirmation asChild>
                      <button className="flex items-center w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </button>
                    </LogoutConfirmation>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </div>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                className="hidden sm:inline-flex"
                asChild
              >
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button className="hidden xs:inline-flex" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            {/* Note: Mobile menu might need adjustment for auth state too */}
            <NavigationSheet session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
}
