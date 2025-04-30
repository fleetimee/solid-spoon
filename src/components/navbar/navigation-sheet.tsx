import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Menu,
  LogOut,
  Terminal,
  User as UserIcon,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Logo } from "./logo";
import type { Session, User } from "better-auth"; // Import Session and User types
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { LogoutConfirmation } from "@/components/auth/logout-confirmation"; // Import LogoutConfirmation

// Define the combined type expected from Navbar
interface AuthSession {
  session: Session;
  user: User & { role?: string | null };
}

interface NavigationSheetProps {
  session: AuthSession | null; // Update prop type to AuthSession
}

export const NavigationSheet = ({ session }: NavigationSheetProps) => {
  // Destructure session (AuthSession | null)
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>Navigation Drawer</SheetTitle>
      </VisuallyHidden>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full p-0">
        <div className="flex flex-col flex-1 px-4 py-6">
          <SheetHeader className="p-0 mb-6">
            <Logo />
          </SheetHeader>

          {session ? ( // Check if the AuthSession object exists
            // Authenticated User Content
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session.user.image ?? undefined} // Access user via session.user
                    alt={session.user.name ?? ""} // Access user via session.user
                  />
                  <AvatarFallback>
                    {session.user.name?.charAt(0).toUpperCase() ?? "?"}{" "}
                    {/* Access user via session.user */}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user.name} {/* Access user via session.user */}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email} {/* Access user via session.user */}
                  </p>
                </div>
              </div>
              <Separator />
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/me">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              {session?.user?.role === "admin" && ( // Check role via session.user.role
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/admin/dashboard">
                    <Terminal className="mr-2 h-4 w-4" />
                    Console
                  </Link>
                </Button>
              )}
              <LogoutConfirmation asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  // Remove onClick handler
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </LogoutConfirmation>
            </div>
          ) : (
            // Unauthenticated User Content
            <div className="flex flex-col space-y-4">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/auth/sign-in">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/auth/sign-up">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
