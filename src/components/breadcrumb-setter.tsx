"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  useBreadcrumb,
  BreadcrumbItem,
} from "@/components/providers/breadcrumb-provider";

interface BreadcrumbSetterProps {
  items: BreadcrumbItem[];
}

/**
 * Client component that sets breadcrumbs when rendered
 * Use this in any page to update the breadcrumb navigation
 */
export function BreadcrumbSetter({ items }: BreadcrumbSetterProps) {
  const { setBreadcrumbs } = useBreadcrumb();
  const pathname = usePathname();

  console.log("Pathname in BreadcrumbSetter:", pathname);

  useEffect(() => {
    if (pathname === "/") {
      setBreadcrumbs([]);
    } else {
      setBreadcrumbs(items);
    }

    // Keep the original cleanup function or adjust if needed
    return () => {
      // Resetting to dashboard might be okay, or maybe reset based on previous state?
      // For now, keeping the original reset logic.
      setBreadcrumbs([{ label: "Dashboard", href: "/dashboard" }]);
    };
  }, [items, setBreadcrumbs, pathname]);

  return null;
}
