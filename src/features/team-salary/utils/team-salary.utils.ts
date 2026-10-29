import type { ITeamSalary } from "@/types/team-salary.types";
import {
  TEAM_SALARY_MONTH_OPTIONS,
  TEAM_SALARY_STATUS_CONFIG,
} from "../constants/team-salary.constant";

export function formatSalary(
  value?: number | null,
) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}


export function formatSalaryAmount(
  value?: number | null,
) {
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value ?? 0)}`;
}


export function getMonthLabel(
  month?: number,
) {
  if (!month) return "—";

  return (
    TEAM_SALARY_MONTH_OPTIONS.find(
      (option) => option.value === month,
    )?.label ?? "—"
  );
}


export function getPayrollPeriodLabel(
  month?: number,
  year?: number,
) {
  if (!month || !year) return "—";

  return `${getMonthLabel(month)} ${year}`;
}


export function getSalaryEmployeeName(
  salary?: ITeamSalary,
) {
  if (!salary?.user) return "Unknown employee";

  if (typeof salary.user === "string") {
    return "Unknown employee";
  }

  return `${salary.user.firstName ?? ""} ${
    salary.user.lastName ?? ""
  }`.trim() || "Unknown employee";
}


export function getSalaryEmployeeInitials(
  salary?: ITeamSalary,
) {
  if (
    !salary?.user ||
    typeof salary.user === "string"
  ) {
    return "U";
  }

  const first =
    salary.user.firstName?.charAt(0) ?? "";

  const last =
    salary.user.lastName?.charAt(0) ?? "";

  return `${first}${last}`.toUpperCase() || "U";
}


export function getSalaryStatusConfig(
  status: ITeamSalary["status"],
) {
  return TEAM_SALARY_STATUS_CONFIG[status];
}


export function getSalaryPaymentPercentage(
  salary: ITeamSalary,
) {
  if (salary.salaryAmount <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (salary.paidAmount /
        salary.salaryAmount) *
        100,
    ),
  );
}


export function isSalaryFullyPaid(
  salary: ITeamSalary,
) {
  return (
    salary.status === "PAID" ||
    salary.dueAmount <= 0
  );
}


export function canRecordSalaryPayment(
  salary: ITeamSalary,
) {
  return (
    salary.status !== "PAID" &&
    salary.status !== "CANCELLED" &&
    salary.dueAmount > 0
  );
}


export function canCancelSalary(
  salary: ITeamSalary,
) {
  return (
    salary.status !== "PAID" &&
    salary.status !== "CANCELLED" &&
    salary.paidAmount <= 0
  );
}


export function getSalaryPaymentMethodLabel(
  method?: string,
) {
  switch (method) {
    case "BKASH":
      return "bKash";

    case "NAGAD":
      return "Nagad";

    case "BANK":
      return "Bank";

    case "CASH":
      return "Cash";

    default:
      return method || "—";
  }
}