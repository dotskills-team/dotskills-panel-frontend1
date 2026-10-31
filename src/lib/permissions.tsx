import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FileText,
  Lock,
  Zap,
  BookOpen,
  Shield,
  DollarSign,
} from "lucide-react";

export type Permission = string;

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "DEVELOPER"
  | "DESIGNER"
  | "MARKETER"
  | "STAFF";

export type PageAccess =
  | "dashboard"
  | "team-management"
  | "analytics"
  | "settings"
  | "documentation"
  | "api-keys"
  | "my-assigned-projects"
  | "my-salaries"
  | "integrations"
  | "automation"
  | "billing"
  | "security"
  | "team-salary"
  | "clients-management"
  | "product-management"
  | "project-management"
  | "manager-project-management"
  | "purchase-products"
  | "returns"
  | "category-management"
  | "product-verifications"
  | "reviews-management"
  | "brand-management"
  | "coupons"
  | "blogs"
  | "staff-management"
  | "customer-management"
  | "my-customers"
  | "orders-management"
  | "leads"
  | "my-orders"
  | "pos"
  | "courier-settings"
  | "financial"
  | "expense"
  | "expenseCategory"
  | "fundTransfer"
  | "payments";

export interface Page {
  id: PageAccess;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

export const availablePages: Page[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    description: "Main dashboard overview",
  },
  {
    id: "team-management",
    label: "Team Management",
    icon: <Users className="h-4 w-4" />,
    description: "Manage team members",
  },
  {
    id: "team-salary",
    label: "Team Salary",
    icon: <Users className="h-4 w-4" />,
    description: "Manage team salary of members",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "View analytics",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    description: "Configure settings",
  },
  {
    id: "documentation",
    label: "Documentation",
    icon: <FileText className="h-4 w-4" />,
    description: "API documentation",
  },
  {
    id: "api-keys",
    label: "API Keys",
    icon: <Lock className="h-4 w-4" />,
    description: "Manage API keys",
  },
   {
    id: "my-assigned-projects",
    label: "My Assigned Projects",
    icon: <FileText className="h-4 w-4" />,
    description: "View your assigned projects",
  },
     {
    id: "manager-project-management",
    label: "Manager Project Management",
    icon: <FileText className="h-4 w-4" />,
    description: "Manage projects as a manager",
  },
  {
    id: "my-salaries",
    label: "My Salaries",
    icon: <DollarSign className="h-4 w-4" />,
    description: "View your salary information",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: <Zap className="h-4 w-4" />,
    description: "Third-party integrations",
  },
  {
    id: "automation",
    label: "Automation",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Workflow automation",
  },
  {
    id: "billing",
    label: "Billing",
    icon: <FileText className="h-4 w-4" />,
    description: "Billing & subscriptions",
  },
  {
    id: "security",
    label: "Security",
    icon: <Shield className="h-4 w-4" />,
    description: "Security settings",
  },
  // Legacy pages for backward compatibility
  {
    id: "product-management",
    label: "Product Management",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "purchase-products",
    label: "Purchase Products",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "returns",
    label: "Returns",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "category-management",
    label: "Category Management",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "product-verifications",
    label: "Product Verifications",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: "reviews-management",
    label: "Reviews Management",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "brand-management",
    label: "Brand Management",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "coupons",
    label: "Coupons",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "blogs",
    label: "Blogs",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: "staff-management",
    label: "Staff Management",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "customer-management",
    label: "Customer Management",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "my-customers",
    label: "My Customers",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "orders-management",
    label: "Orders Management",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "leads",
    label: "Leads",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "my-orders",
    label: "My Orders",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "pos",
    label: "POS",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "courier-settings",
    label: "Courier Settings",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: "financial",
    label: "Financial",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "expense",
    label: "Expense",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "expenseCategory",
    label: "Expense Category",
    icon: <Settings className="h-4 w-4" />,
  },
];

export const defaultRolePermissions: Record<UserRole, PageAccess[]> = {
  SUPER_ADMIN: availablePages.map((p) => p.id),
  ADMIN: availablePages.map((p) => p.id),
  MANAGER: [
    "dashboard",
    "team-management",
    "analytics",
    "settings",
    "orders-management",
    "customer-management",
    "my-salaries",
    "manager-project-management",
  ],
  DEVELOPER: [
    "dashboard",
    "api-keys",
    "my-assigned-projects",
    "my-salaries",
    "documentation",
    "integrations",
    "automation",
  ],
  DESIGNER: ["dashboard", "documentation", "product-management"],
  MARKETER: [
    "dashboard",
    "analytics",
    "blogs",
    "customer-management",
    "my-salaries"
  ],
  STAFF: ["dashboard", "orders-management", "my-orders", "my-customers"],
};

export function hasPermission(
  permissions: Permission[] | undefined,
  permission: Permission,
): boolean {
  if (!permissions?.length) return false;

  return permissions.includes(permission);
}

export function hasAnyPermission(
  permissions: Permission[] | undefined,
  requiredPermissions: Permission[],
): boolean {
  if (!permissions?.length) return false;

  return requiredPermissions.some((permission) =>
    permissions.includes(permission),
  );
}

export function hasAllPermissions(
  permissions: Permission[] | undefined,
  requiredPermissions: Permission[],
): boolean {
  if (!permissions?.length) return false;

  return requiredPermissions.every((permission) =>
    permissions.includes(permission),
  );
}

export function isSuperAdmin(role?: string): boolean {
  return role === "SUPER_ADMIN";
}

export function isAdmin(role?: string): boolean {
  return role === "ADMIN";
}

export function isManager(role?: string): boolean {
  return role === "MANAGER";
}

export function canAccess({
  role,
  permissions,
  allowedRoles,
  requiredPermissions,
}: {
  role?: string;
  permissions?: Permission[];
  allowedRoles?: string[];
  requiredPermissions?: Permission[];
}): boolean {
  if (role === "SUPER_ADMIN") {
    return true;
  }

  if (
    allowedRoles?.length &&
    role &&
    allowedRoles.includes(role)
  ) {
    return true;
  }

  if (
    requiredPermissions?.length &&
    permissions?.length
  ) {
    return hasAllPermissions(
      permissions,
      requiredPermissions,
    );
  }

  return false;
}

export function isOwner(
  ownerId?: string,
  currentUserId?: string,
): boolean {
  return (
    !!ownerId &&
    !!currentUserId &&
    ownerId === currentUserId
  );
}
