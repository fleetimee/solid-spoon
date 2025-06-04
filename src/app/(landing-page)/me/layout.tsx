"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client"; // Import authClient
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

export default function MeLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession(); // Use the hook
  const segment = useSelectedLayoutSegment();
  const activeTab = segment ?? "activity";
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "My Profile" },
  ];

  // Handle loading state
  if (isPending) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 pb-16 pt-8 space-y-8">
        {/* Simplified loading skeleton */}
        <Skeleton className="h-48 w-full rounded-xl mb-20" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-64 w-full col-span-1" />
          <Skeleton className="h-96 w-full col-span-1 md:col-span-3" />
        </div>
      </div>
    );
  }

  // TODO: Add handling for when session is null (user not authenticated)
  // For now, we assume the user is authenticated if not pending.
  // You might want to redirect or show a different UI here.
  // console.log("Session data:", session); // Example: log session data

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <div className="max-w-screen-xl mx-auto px-6 pb-16 pt-8">
        <div className="relative mb-20">
          <div className="w-full h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl" />
          <div className="absolute -bottom-12 left-6 flex items-center space-x-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              {/* Use session data for avatar if available */}
              <AvatarImage
                src={session?.user?.image ?? "/placeholder.svg"}
                alt={session?.user?.name ?? "User Avatar"}
              />
              <AvatarFallback className="text-xl">
                {session?.user?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="pb-2 hidden sm:block">
              <div className="bg-black/50 px-3 py-1 rounded-md">
                <h1 className="text-2xl font-bold text-white drop-shadow-md">
                  {/* Use session data for name */}
                  {session?.user?.name ?? "User Name"}
                </h1>
                <p className="text-sm text-white drop-shadow-md">
                  {session?.user?.email ?? "No email provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:hidden mb-8 mt-14">
          {/* Use session data for name */}
          <h1 className="text-2xl font-bold">
            {session?.user?.name ?? "User Name"}
          </h1>
          {/* Use session data for email/username */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1">
            <Card>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Contact
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Icon name="Calendar" className="mr-2 h-4 w-4" />
                        {/* Placeholder - Could fetch join date */}
                        <span>Joined April 2024</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Status
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                    >
                      {/* Placeholder - Could fetch user status/role */}
                      Active Member
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 md:col-span-3">
            <Tabs value={activeTab} className="w-full">
              <div className="border-b">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                  <TabsTrigger
                    asChild
                    value="activity"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-4"
                  >
                    <Link href="/me/activity">
                      <Icon name="LayoutDashboard" className="h-4 w-4 mr-2" />
                      Activity
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger
                    asChild
                    value="bookings"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-4"
                  >
                    <Link href="/me/bookings">
                      <Icon name="Calendar" className="h-4 w-4 mr-2" />
                      Bookings
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger
                    asChild
                    value="settings"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-4"
                  >
                    <Link href="/me/settings">
                      <Icon name="Settings2" className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </TabsTrigger>
                </TabsList>
              </div>
              {/* Render children within the active tab */}
              <TabsContent value={activeTab} className="mt-4">
                {children}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
