import {
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
} from "date-fns";

function parseDate(date: Date | string): Date {
  return typeof date === "string"
    ? parseISO(date)
    : date;
}

export function formatDate(
  date: Date | string,
  pattern = "dd MMM yyyy",
): string {
  const parsed = parseDate(date);

  if (!isValid(parsed)) return "-";

  return format(parsed, pattern);
}

export function formatDateTime(
  date: Date | string,
): string {
  return formatDate(date, "dd MMM yyyy, hh:mm a");
}

export function formatTime(
  date: Date | string,
): string {
  return formatDate(date, "hh:mm a");
}

export function fromNow(
  date: Date | string,
): string {
  const parsed = parseDate(date);

  if (!isValid(parsed)) return "-";

  return formatDistanceToNow(parsed, {
    addSuffix: true,
  });
}

export function formatNumber(
  value: number,
): string {
  return new Intl.NumberFormat("en-GB").format(
    value,
  );
}

export function formatDecimal(
  value: number,
  digits = 2,
): string {
  return value.toFixed(digits);
}

export function formatPercent(
  value: number,
  digits = 2,
): string {
  return `${value.toFixed(digits)}%`;
}

export function formatCurrency(
  value: number,
  currency = "BDT",
): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatFileSize(
  bytes: number,
): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;

  const sizes = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const i = Math.floor(
    Math.log(bytes) / Math.log(k),
  );

  return `${parseFloat(
    (bytes / Math.pow(k, i)).toFixed(2),
  )} ${sizes[i]}`;
}

export function formatPhone(
  phone: string,
): string {
  return phone.replace(
    /(\+880|880|0)?(\d{3})(\d{3})(\d{4})/,
    "+880 $2-$3-$4",
  );
}

export function getInitials(
  firstName?: string,
  lastName?: string,
): string {
  return `${firstName?.charAt(0) ?? ""}${
    lastName?.charAt(0) ?? ""
  }`.toUpperCase();
}

export function fullName(
  firstName?: string,
  lastName?: string,
): string {
  return [firstName, lastName]
    .filter(Boolean)
    .join(" ");
}

export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  return count === 1
    ? singular
    : plural ?? `${singular}s`;
}