import type { User } from "@/types/user.types";

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
    SUPER_ADMIN: 7,
    ADMIN: 6,
    MANAGER: 5,
    DEVELOPER: 4,
    DESIGNER: 3,
    MARKETER: 2,
    STAFF: 1,
  };

  return (roleHierarchy[currentUserRole] || 0) > (roleHierarchy[targetUserRole] || 0);
};

export const getUserFullName = (user?: { firstName: string; lastName: string }) =>
  user ? `${user.firstName} ${user.lastName}`.trim() : "";