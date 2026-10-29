import {
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  XCircle,
} from "lucide-react";

import {
  SalaryPaymentStatus,
  type ITeamSalary,
} from "@/types/team-salary.types";

export const TEAM_SALARY_STATUS_OPTIONS = [
  {
    value: SalaryPaymentStatus.PENDING,
    label: "Pending",
    description: "No payment has been recorded yet.",
    icon: Clock3,
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
  },
  {
    value: SalaryPaymentStatus.PARTIAL,
    label: "Partial",
    description: "Salary has been partially paid.",
    icon: CircleDollarSign,
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400",
  },
  {
    value: SalaryPaymentStatus.PAID,
    label: "Paid",
    description: "Salary has been fully paid.",
    icon: CheckCircle2,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  {
    value: SalaryPaymentStatus.CANCELLED,
    label: "Cancelled",
    description: "Salary record has been cancelled.",
    icon: XCircle,
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400",
  },
] as const;

export const TEAM_SALARY_STATUS_CONFIG = Object.fromEntries(
  TEAM_SALARY_STATUS_OPTIONS.map((option) => [
    option.value,
    option,
  ]),
) as Record<
  SalaryPaymentStatus,
  (typeof TEAM_SALARY_STATUS_OPTIONS)[number]
>;

export const TEAM_SALARY_PAYMENT_METHOD_OPTIONS = [
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
    label: "Bank",
  },
] as const;

export const TEAM_SALARY_MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
] as const;

export const TEAM_SALARY_SORT_OPTIONS = [
  {
    value: "-createdAt",
    label: "Newest first",
  },
  {
    value: "createdAt",
    label: "Oldest first",
  },
  {
    value: "-salaryAmount",
    label: "Highest salary",
  },
  {
    value: "salaryAmount",
    label: "Lowest salary",
  },
  {
    value: "-dueAmount",
    label: "Highest due",
  },
  {
    value: "dueAmount",
    label: "Lowest due",
  },
] as const;

export const TEAM_SALARY_PAGE_SIZE_OPTIONS = [
  10,
  20,
  30,
  50,
] as const;

export const TEAM_SALARY_DEFAULT_PAGE_SIZE = 20;

export const getSalaryEmployee = (
  salary: ITeamSalary,
) => {
  return typeof salary.user === "string"
    ? null
    : salary.user;
};