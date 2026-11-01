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

export const STATUS_BADGE: Record<string, string> = {
    PLANNING: "border-slate-500/40 bg-slate-500/10 text-slate-300",
    PENDING: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
    IN_PROGRESS: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    ON_HOLD: "border-red-500/40 bg-red-500/10 text-red-300",
    COMPLETED: "border-green-500/40 bg-green-500/10 text-green-300",
    DONE_DUE: "border-orange-500/40 bg-orange-500/10 text-orange-300",
    DELIVERED: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    CANCELLED: "border-red-500/40 bg-red-500/10 text-red-300",
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
