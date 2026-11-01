// Shared display helpers for the "My Assigned Projects" style project tables
// (developer: MyAssignedProjects, admin + manager: ProjectsListTable).

export const STATUS_LABELS: Record<string, string> = {
    PLANNING: "Planning",
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
    DONE_DUE: "Done & Due",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

// Light mode: saturated tint background + dark text for contrast on white.
// Dark mode: translucent colored background + bright text.
export const STATUS_BADGE: Record<string, string> = {
    PLANNING:
        "border-slate-400 bg-slate-200 text-slate-800 dark:border-slate-500/50 dark:bg-slate-500/20 dark:text-slate-200",
    PENDING:
        "border-yellow-500 bg-yellow-200 text-yellow-900 dark:border-yellow-500/50 dark:bg-yellow-500/20 dark:text-yellow-300",
    IN_PROGRESS:
        "border-blue-500 bg-blue-200 text-blue-900 dark:border-blue-500/50 dark:bg-blue-500/20 dark:text-blue-300",
    ON_HOLD:
        "border-red-500 bg-red-200 text-red-900 dark:border-red-500/50 dark:bg-red-500/20 dark:text-red-300",
    COMPLETED:
        "border-green-500 bg-green-200 text-green-900 dark:border-green-500/50 dark:bg-green-500/20 dark:text-green-300",
    DONE_DUE:
        "border-orange-500 bg-orange-200 text-orange-900 dark:border-orange-500/50 dark:bg-orange-500/20 dark:text-orange-300",
    DELIVERED:
        "border-emerald-500 bg-emerald-200 text-emerald-900 dark:border-emerald-500/50 dark:bg-emerald-500/20 dark:text-emerald-300",
    CANCELLED:
        "border-rose-500 bg-rose-200 text-rose-900 dark:border-rose-500/50 dark:bg-rose-500/20 dark:text-rose-300",
};

// "NEXT_JS" -> "Next Js"
export const formatLabel = (value: string) =>
    value
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

export const formatTableDate = (date?: string) =>
    date
        ? new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
          })
        : "—";

export const fullName = (u?: { firstName: string; lastName?: string }) =>
    u ? `${u.firstName} ${u.lastName ?? ""}`.trim() : "—";
