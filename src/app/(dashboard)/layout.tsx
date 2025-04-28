import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getAppSettings } from "@/features/application/api/getAppSettings";
import { AppSidebar } from "@/features/navigation/components/app-sidebar";
import { getNavigation } from "@/features/navigation/api/getNavigation";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

interface UserData {
  name: string;
  email: string;
  image: string | null | undefined;
  role: string;
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navMainItems, session, appSettings] = await Promise.all([
    getNavigation(),
    auth.api.getSession({
      headers: await headers(),
    }),
    getAppSettings(),
  ]);

  let unreadNotificationsCount = 0;
  const userId = session?.user?.id;

  if (userId) {
    try {
      const result = await db.query<{ total: string }>(
        `SELECT COUNT(*) as total FROM notification WHERE recipient_id = $1 AND is_read = false`,
        [userId]
      );
      unreadNotificationsCount = parseInt(result.rows[0]?.total || "0", 10);
    } catch (error) {
      console.error("Failed to fetch unread notification count:", error);
    }
  }

  const userData: UserData | null = session?.user
    ? {
        name: session.user.name || "Unknown User",
        email: session.user.email || "",
        image: session.user.image,
        role: session.user.role || "user",
      }
    : null;

  if (!session) {
    return redirect("/auth/sign-in");
  }

  if (session.user.role !== "admin") {
    return redirect("/");
  }

  return (
    <SidebarProvider>
      <BreadcrumbProvider
        initialItems={[{ label: "Dashboard", href: "/dashboard" }]}
      >
        <AppSidebar
          navMain={navMainItems}
          userData={userData}
          appName={appSettings.appName}
          appDescription={appSettings.appDescription}
          unreadNotificationsCount={unreadNotificationsCount}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadcrumbNav />
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}
