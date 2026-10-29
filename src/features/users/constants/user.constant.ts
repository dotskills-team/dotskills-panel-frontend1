import { Role, UserStatus } from "@/types/user.types";

export const USER_SEARCHABLE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "designation",
  "department",
  "address",
] as const;

export const USER_GENDER_OPTIONS = [
  {
    value: "MALE",
    label: "Male",
  },
  {
    value: "FEMALE",
    label: "Female",
  },
  {
    value: "OTHER",
    label: "Other",
  },
  {
    value: "PREFER_NOT_TO_SAY",
    label: "Prefer not to say",
  },
] as const;

export const USER_PAYMENT_METHOD_OPTIONS = [
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "BKASH",
    label: "bKash",
  },
  {
    value: "NAGAD",
    label: "Nagad",
  },
  {
    value: "BANK",
    label: "Bank Transfer",
  },
] as const;

export const USER_FILTERABLE_FIELDS = [
  "role",
  "status",
  "department",
  "designation",
  "isVerified",
] as const;

export const USER_ROLES = Object.entries(Role).map(([key, value]) => ({
  label: key.replace(/_/g, " "),
  value,
  color: getRoleColor(value),
}));

export const USER_STATUSES = Object.entries(UserStatus).map(([key, value]) => ({
  label: key,
  value,
  color: getStatusColor(value),
}));

export const USER_DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "HR",
  "Finance",
];

export const USER_DESIGNATIONS = [
  "Junior Developer",
  "Senior Developer",
  "Tech Lead",
  "Manager",
  "Director",
  "VP",
  "CEO",
  "Designer",
  "Product Manager",
  "Sales Executive"
];

export const ROLES_WITH_PERMISSIONS = [
  { value: Role.SUPER_ADMIN, label: "Super Admin", canManageAll: true },
  { value: Role.ADMIN, label: "Admin", canManageUsers: true },
  { value: Role.MANAGER, label: "Manager", canManageTeam: true },
  { value: Role.DEVELOPER, label: "Developer" },
  { value: Role.DESIGNER, label: "Designer" },
  { value: Role.MARKETER, label: "Marketer" },
  { value: Role.STAFF, label: "Staff" },
];

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    [Role.SUPER_ADMIN]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    [Role.ADMIN]: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    [Role.MANAGER]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    [Role.DEVELOPER]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    [Role.DESIGNER]: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    [Role.MARKETER]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    [Role.STAFF]: "bg-muted text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };
  return colors[role] || "bg-muted text-gray-800";
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    [UserStatus.ACTIVE]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    [UserStatus.INACTIVE]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    [UserStatus.SUSPENDED]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[status] || "bg-muted text-gray-800";
}
