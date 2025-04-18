"use client";

import * as React from "react";
import { Command } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-project";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { NavigationMain } from "@/features/navigation/types/navigation";
import { getIconByName, iconMap } from "@/lib/icons";
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: iconMap.LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: iconMap.Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: iconMap.Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: iconMap.PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: iconMap.Map,
    },
  ],
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
}

export function AppSidebar({ navMain, ...props }: AppSidebarProps) {
  const processedNavMain = processNavItems(navMain);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={processedNavMain} />
        <NavProjects projects={staticData.projects} />
        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={staticData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
