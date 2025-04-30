"use client";

import React from "react";
import Link from "next/link";
// Removed usePathname import
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/components/providers/breadcrumb-provider";

export function BreadcrumbNav() {
  // Renaming this later conceptually to AdminBreadcrumbNav
  const { breadcrumbs } = useBreadcrumb();

  // Don't render anything if there are no breadcrumbs
  if (!breadcrumbs.length) return null;

  // Directly return the breadcrumb structure without path checking or container
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          // Last item is the current page
          const isLastItem = index === breadcrumbs.length - 1;

          return (
            <React.Fragment key={`${crumb.label}-${index}`}>
              <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                {isLastItem ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href || "#"}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastItem && (
                <BreadcrumbSeparator
                  className={index === 0 ? "hidden md:block" : ""}
                />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
