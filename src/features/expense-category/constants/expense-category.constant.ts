import { CategoryStatus } from "@/types/expense-category.types";

export const CATEGORY_STATUS_OPTIONS = [
  { value: CategoryStatus.ACTIVE, label: "Active" },
  { value: CategoryStatus.INACTIVE, label: "Inactive" },
];

export const EXPENSE_CATEGORY_SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "name", label: "Name (A-Z)" },
];