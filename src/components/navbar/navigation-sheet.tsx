"use client";

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
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { SheetLogo } from "./sheet-logo";
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
  session: AuthSession | null;
  initialUnreadCount?: number;
}

export const NavigationSheet = ({
  session,
  initialUnreadCount = 0,
}: NavigationSheetProps) => {
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
          <SheetHeader className="p-0 mb-6 h-auto max-h-24 flex-shrink-0">
            <SheetLogo />
          </SheetHeader>

          {session ? ( // Check if the AuthSession object exists
            // Authenticated User Content
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session.user.image ?? undefined}
                      alt={session.user.name ?? ""}
                    />
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <NotificationBell initialCount={initialUnreadCount} />
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
