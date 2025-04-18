"use client";

import * as React from "react";
import Link from "next/link";
import { Command } from "lucide-react";

import { NavMain } from "@/features/navigation/components/nav-main";
// import { NavProjects } from "@/features/navigation/components/nav-project";
import { NavSecondary } from "@/features/navigation/components/nav-secondary";
import { NavUser } from "@/features/navigation/components/nav-user";
import { NavigationMain } from "@/features/navigation/types/navigation";
import { getIconByName } from "@/lib/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const staticData = {
  //   navSecondary: [
  //     {
  //       title: "Support",
  //       url: "#",
  //       icon: iconMap.LifeBuoy,
  //     },
  //     {
  //       title: "Feedback",
  //       url: "#",
  //       icon: iconMap.Send,
  //     },
  //   ],

  //   projects: [
  //     {
  //       name: "Design Engineering",
  //       url: "#",
  //       icon: iconMap.Frame,
  //     },
  //     {
  //       name: "Sales & Marketing",
  //       url: "#",
  //       icon: iconMap.PieChart,
  //     },
  //     {
  //       name: "Travel",
  //       url: "#",
  //       icon: iconMap.Map,
  //     },
  //   ],
  navSecondary: [],
  projects: [],
  defaultUser: {
    name: "Guest User",
    email: "guest@example.com",
    image: null,
    role: "guest",
  },
};

function processNavItems(items: NavigationMain[]) {
  return items.map((item) => ({
    title: item.title,
    url: item.url,
    icon: getIconByName(item.icon),
    isActive: item.isActive,
    items: item.items,
  }));
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navMain: NavigationMain[];
  userData?: {
    name: string;
    email: string;
    image: string | null | undefined;
    role: string;
  } | null;
  appName: string;
  appDescription: string;
}

export function AppSidebar({
  navMain,
  userData,
  appName,
  appDescription,
  ...props
}: AppSidebarProps) {
  const processedNavMain = processNavItems(navMain);
  const userForNav = userData || staticData.defaultUser;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{appName}</span>
                  <span className="truncate text-xs">{appDescription}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={processedNavMain} />
        {/* <NavProjects projects={staticData.projects} /> */}
        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userForNav} />
      </SidebarFooter>
    </Sidebar>
  );
}
