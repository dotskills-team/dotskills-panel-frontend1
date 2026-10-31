/**
 * Dashboard utility functions for breadcrumbs, page titles, and route detection
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeTitleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/team": "Team Management",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
  "/dashboard/api-keys": "API Keys",
  "/dashboard/my-assigned-projects": "My Assigned Projects",
  "/dashboard/manager-project-management": "Manager Project Management",
  "/dashboard/my-salaries": "My Salaries",
  "/dashboard/integrations": "Integrations",
  "/dashboard/documentation": "Documentation",
  "/dashboard/automation": "Automation",
  "/dashboard/billing": "Billing",
  "/dashboard/security": "Security",
  "/staff/dashboard": "Dashboard",
  "/staff/dashboard/admin/product-management": "Product Management",
  "/staff/dashboard/purchase-products": "Purchase Products",
  "/staff/dashboard/returns": "Returns",
  "/staff/dashboard/product-verifications": "Product Verifications",
  "/staff/dashboard/coupons": "Coupons",
  "/staff/dashboard/blog": "Blog",
  "/staff/dashboard/admin/user-management": "Staff Management",
  "/staff/dashboard/reviews": "Reviews",
  "/staff/dashboard/admin/customer-management": "Customer Management",
  "/staff/dashboard/my-customers": "My Customers",
  "/staff/dashboard/orders-management": "Orders Management",
  "/staff/dashboard/leads": "Leads",
  "/staff/dashboard/my-orders": "My Orders",
  "/staff/dashboard/pos": "Point of Sale",
  "/staff/dashboard/admin/courier-settings": "Courier Settings",
};

/**
 * Get page title from pathname
 */
export function getPageTitle(pathname: string): string {
  return routeTitleMap[pathname] || "Dashboard";
}

/**
 * Generate breadcrumbs from pathname
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  let path = "";
  for (let i = 0; i < segments.length; i++) {
    path += `/${segments[i]}`;
    const label = segments[i]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    if (i < segments.length - 1) {
      breadcrumbs.push({ label, href: path });
    } else {
      breadcrumbs.push({ label });
    }
  }

  return breadcrumbs;
}

/**
 * Check if a route is active
 */
export function isRouteActive(
  pathname: string,
  routePrefix: string,
): boolean {
  return pathname.startsWith(routePrefix);
}

/**
 * Get the current section from pathname
 */
export function getCurrentSection(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] || "dashboard";
}

/**
 * Format role for display
 */
export function formatRole(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Check if viewport is mobile
 */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

/**
 * Get sidebar state from localStorage
 */
export function getSidebarState(): "open" | "closed" {
  if (typeof window === "undefined") return "open";
  const state = localStorage.getItem("sidebar-state");
  return (state as "open" | "closed") || "open";
}

/**
 * Set sidebar state in localStorage
 */
export function setSidebarState(state: "open" | "closed"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("sidebar-state", state);
}
