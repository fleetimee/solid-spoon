import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getNavigation } from "@/features/navigation/api/getNavigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navMainItems = await getNavigation();

  return (
    <SidebarProvider>
      <BreadcrumbProvider
        initialItems={[{ label: "Dashboard", href: "/dashboard" }]}
      >
        <AppSidebar navMain={navMainItems} />
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
