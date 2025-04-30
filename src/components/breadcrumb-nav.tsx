"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
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
  const { breadcrumbs } = useBreadcrumb();
  const pathname = usePathname(); // Get the current path

  // Determine if we are in the admin section
  const isAdminPath = pathname.startsWith("/admin");

  // Don't render anything if there are no breadcrumbs
  if (!breadcrumbs.length) return null;

  const breadcrumbContent = (
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

  // Conditionally wrap with the container div
  return isAdminPath ? (
    breadcrumbContent
  ) : (
    <div className="w-full max-w-screen-xl mx-auto px-6">
      {breadcrumbContent}
    </div>
  );
}
