"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    setBreadcrumbs(items);

    return () => {
      setBreadcrumbs([{ label: "Dashboard", href: "/dashboard" }]);
    };
  }, [items, setBreadcrumbs]);

  return null;
}
