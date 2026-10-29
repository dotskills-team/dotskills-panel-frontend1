
export const buildProjectQuery = (
  filters: Record<string, unknown>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      result[key] = value;
    }
  });

  return result;
};

export const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
};