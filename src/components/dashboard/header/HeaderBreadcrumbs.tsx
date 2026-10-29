"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { generateBreadcrumbs, getPageTitle } from "@/lib/dashboard-utils";

export function HeaderBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex items-center gap-1 text-sm">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1"
        title="Dashboard home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.length > 1 && (
        <>
          {breadcrumbs.slice(1, -1).map((crumb, idx) => (
            <div
              key={`breadcrumb-${idx}`}
              className="flex items-center gap-1"
            >
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-muted-foreground px-1.5 py-1">
                  {crumb.label}
                </span>
              )}
            </div>
          ))}

          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground font-medium px-1.5 py-1">
                {pageTitle}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
