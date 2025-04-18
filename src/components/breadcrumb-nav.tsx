"use client";

import React from "react";
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

  // Don't render anything if there are no breadcrumbs
  if (!breadcrumbs.length) return null;

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
                  <BreadcrumbLink href={crumb.href || "#"}>
                    {crumb.label}
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
