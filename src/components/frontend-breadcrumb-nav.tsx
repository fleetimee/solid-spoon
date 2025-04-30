"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/components/providers/breadcrumb-provider";

export function FrontendBreadcrumbNav() {
  const { breadcrumbs } = useBreadcrumb();
  const pathname = usePathname();

  // Don't render on the root page or if there are no breadcrumbs
  if (pathname === "/" || !breadcrumbs.length) {
    return null;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-4">
      {" "}
      {/* Added py-4 for spacing */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const isLastItem = index === breadcrumbs.length - 1;

            return (
              <React.Fragment key={`${crumb.label}-${index}`}>
                <BreadcrumbItem
                  className={index === 0 ? "hidden md:block" : ""}
                >
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
    </div>
  );
}
