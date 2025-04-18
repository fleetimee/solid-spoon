import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/navigation/components/app-sidebar";
import { getNavigation } from "@/features/navigation/api/getNavigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
  const [navMainItems, session] = await Promise.all([
    getNavigation(),
    auth.api.getSession({
      headers: await headers(),
    }),
  ]);

  const userData: UserData | null = session?.user
    ? {
        name: session.user.name || "Unknown User",
        email: session.user.email || "",
        image: session.user.image,
        role: session.user.role || "user",
      }
    : null;

  return (
    <SidebarProvider>
      <BreadcrumbProvider
        initialItems={[{ label: "Dashboard", href: "/dashboard" }]}
      >
        <AppSidebar navMain={navMainItems} userData={userData} />
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
