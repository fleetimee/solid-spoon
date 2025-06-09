"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

const ThemeToggleSidebar = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <SidebarMenuButton size="sm" className="w-full">
        <div className="h-4 w-4" />
        <span>Toggle Theme</span>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton size="sm" className="w-full" onClick={handleClick}>
      {resolvedTheme === "dark" ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
      <span>Toggle Theme</span>
    </SidebarMenuButton>
  );
};

export default ThemeToggleSidebar;
