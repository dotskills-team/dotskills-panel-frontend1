import { Role, type User } from "@/types/user.types";

export const formatUserName = (user: User): string => {
  return user.fullName || `${user.firstName} ${user.lastName}`;
};

export const getInitials = (user: User): string => {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "INACTIVE":
      return "secondary";
    case "SUSPENDED":
      return "destructive";
    default:
      return "outline";
  }
};

export const sortUsers = (users: User[], sortBy?: string, sortOrder: "asc" | "desc" = "asc"): User[] => {
  if (!sortBy) return users;

  return [...users].sort((a, b) => {
    let aValue = (a as any)[sortBy];
    let bValue = (b as any)[sortBy];

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
};

export const filterUsers = (
  users: User[],
  searchTerm: string,
  filters?: {
    role?: string;
    status?: string;
    department?: string;
    designation?: string;
    isVerified?: boolean;
  },
): User[] => {
  return users.filter((user) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone?.toLowerCase().includes(searchLower) ?? false) ||
        (user.designation?.toLowerCase().includes(searchLower) ?? false) ||
        (user.department?.toLowerCase().includes(searchLower) ?? false);

      if (!matchesSearch) return false;
    }

    // Role filter
    if (filters?.role && user.role !== filters.role) return false;

    // Status filter
    if (filters?.status && user.status !== filters.status) return false;

    // Department filter
    if (filters?.department && user.department !== filters.department) return false;

    // Designation filter
    if (filters?.designation && user.designation !== filters.designation) return false;

    // Verification filter
    if (filters?.isVerified !== undefined && user.isVerified !== filters.isVerified) return false;

    return true;
  });
};

export const canManageUser = (currentUserRole: string, targetUserRole: string): boolean => {
  const roleHierarchy: Record<string, number> = {
    SUPER_ADMIN: 9,
    ADMIN: 8,
    MANAGER: 7,
    DEVELOPER: 6,
    DESIGNER: 5,
    VIDEO_EDITOR: 4,
    MARKETING_SALES_LEAD: 3,
    SALES_MARKETING: 2,
    STAFF: 1,
  };

  return (roleHierarchy[currentUserRole] || 0) > (roleHierarchy[targetUserRole] || 0);
};

export const getUserFullName = (user?: { firstName: string; lastName: string }) =>
  user ? `${user.firstName} ${user.lastName}`.trim() : "";
/** True only for the Marketing & Sales Lead role. */
export const isMarketingSalesLead = (role?: string | null): boolean =>
  role === Role.MARKETING_SALES_LEAD;

/** True for the whole marketing/sales team: regular members and the lead. */
export const isMarketingSalesTeam = (role?: string | null): boolean =>
  role === Role.SALES_MARKETING || role === Role.MARKETING_SALES_LEAD;

/** Only admin-level roles may see project value (budget, payments, dues). */
export const canViewProjectValue = (role?: string | null): boolean =>
  role === Role.SUPER_ADMIN || role === Role.ADMIN;

/** Roles that may change who a client is credited to. */
export const canEditCreditedTo = (role?: string | null): boolean =>
  role === Role.SUPER_ADMIN || role === Role.ADMIN || role === Role.MARKETING_SALES_LEAD;

