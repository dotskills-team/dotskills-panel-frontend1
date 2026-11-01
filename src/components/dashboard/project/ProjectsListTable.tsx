"use client";

import { useState } from "react";
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Gitlab,
    Globe,
    Rocket,
    SlidersHorizontal,
} from "lucide-react";

import type { IProject } from "@/types/project.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
    STATUS_BADGE,
    STATUS_LABELS,
    formatLabel,
    formatTableDate,
    fullName,
} from "@/features/project/constants/project-table.constants";
import { formatCurrency } from "@/features/project/utils/project.utils";
import type { ProjectPermissions } from "@/features/project/utils/project.permission";
import { ProjectRowActions } from "./ProjectRowAction";

/**
 * Projects table in the "My Assigned Projects" style, shared by the admin and
 * manager project pages.
 *
 * Responsive:
 * - below `lg` → card list (no horizontal scrolling on phones/tablets)
 * - `lg`+ → table; lower-priority columns appear only at wider breakpoints
 *   (see `responsive` in COLUMNS), so the table fits its container.
 *
 * Permissions: canViewFinancials → Project Value + Due Amount;
 * canEdit / canDelete → row actions. Row selection only when `selection` is passed.
 */

/* -------------------------------------------------------------------------- */
/* Columns                                                                    */
/* -------------------------------------------------------------------------- */

type SortField = "priority" | "name" | "status" | "startDate" | "budget";

// `responsive`: Tailwind classes that hide the column until there is room for it
const COLUMNS = [
    { key: "type", label: "Type", responsive: "hidden xl:table-cell" },
    { key: "status", label: "Status", responsive: "" },
    { key: "client", label: "Client", responsive: "" },
    { key: "manager", label: "Project Manager", responsive: "hidden xl:table-cell" },
    { key: "developers", label: "Developers", responsive: "hidden 2xl:table-cell" },
    { key: "technologies", label: "Technologies", responsive: "hidden 2xl:table-cell" },
    { key: "budget", label: "Project Value", responsive: "", financial: true },
    { key: "dueAmount", label: "Due Amount", responsive: "", financial: true },
    { key: "startDate", label: "Start Date", responsive: "hidden xl:table-cell" },
    { key: "endDate", label: "Delivery Date", responsive: "" },
] as const;

export type ProjectsListColumnKey = (typeof COLUMNS)[number]["key"];
type ColumnKey = ProjectsListColumnKey;

const DEFAULT_VISIBLE: Record<ColumnKey, boolean> = {
    type: true,
    status: true,
    client: true,
    manager: true,
    developers: true,
    technologies: true,
    budget: true,
    dueAmount: true,
    startDate: true,
    endDate: true,
};

const RESPONSIVE = Object.fromEntries(
    COLUMNS.map((c) => [c.key, c.responsive]),
) as Record<ColumnKey, string>;

const PAGE_SIZES = [10, 20, 50];

// Budget minus completed payments (same rule as the previous admin table)
const getDueAmount = (project: IProject) => {
    if (project.budget === undefined || project.budget === null) return undefined;

    const totalPaid = (project.payments ?? [])
        .filter((p) => p.status === "COMPLETE")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    return Math.max(project.budget - totalPaid, 0);
};

const dueClass = (due?: number) =>
    due === undefined
        ? "text-muted-foreground"
        : due === 0
          ? "text-green-500"
          : "text-red-600 dark:text-red-400";

const getLinks = (p: IProject) =>
    [
        { label: "Live", href: p.liveUrl, icon: Rocket },
        { label: "Dev", href: p.developmentLiveUrl, icon: Globe },
        { label: "Repo", href: p.repositoryUrl, icon: Gitlab },
    ].filter((l) => !!l.href);

/* -------------------------------------------------------------------------- */
/* Small presentational pieces                                                */
/* -------------------------------------------------------------------------- */

interface SortableHeadProps {
    field: SortField;
    label: string;
    sort: string;
    onSortChange: (sort: string) => void;
}

// Clicking toggles asc ("field") <-> desc ("-field")
function SortableHead({ field, label, sort, onSortChange }: SortableHeadProps) {
    const Icon =
        sort === field ? ArrowUp : sort === `-${field}` ? ArrowDown : ArrowUpDown;

    return (
        <button
            type="button"
            onClick={() => onSortChange(sort === field ? `-${field}` : field)}
            className="flex items-center gap-1 whitespace-nowrap uppercase"
        >
            {label}
            <Icon className={cn("h-3 w-3", Icon === ArrowUpDown && "opacity-60")} />
        </button>
    );
}

function PriorityBadge({ priority }: { priority?: number }) {
    return priority !== undefined && priority !== null ? (
        <Badge variant="outline">P{priority}</Badge>
    ) : (
        <span className="text-muted-foreground">—</span>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <Badge
            variant="outline"
            className={cn("text-[11px] font-medium", STATUS_BADGE[status])}
        >
            {STATUS_LABELS[status] ?? formatLabel(status)}
        </Badge>
    );
}

function ProjectLinks({ project }: { project: IProject }) {
    const links = getLinks(project);
    if (links.length === 0) return null;

    return (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
            {links.map(({ label, href, icon: Icon }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-indigo-400 hover:text-indigo-400"
                >
                    <Icon className="h-3 w-3" />
                    {label}
                </a>
            ))}
        </div>
    );
}

const HEAD = "text-xs font-semibold uppercase text-white";
const MUTED_CELL = "text-sm text-muted-foreground";

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface ProjectsListTableProps {
    projects: IProject[];
    /** First load (no data yet): shows skeletons */
    isLoading: boolean;
    /** Background refetch (filters/page changed): dims the rows */
    isFetching?: boolean;
    isError: boolean;
    errorMessage?: string;
    onRetry: () => void;

    hasActiveFilters: boolean;
    onClearFilters: () => void;

    /** "field" = asc, "-field" = desc */
    sort: string;
    onSortChange: (sort: string) => void;

    page: number;
    limit: number;
    total: number;
    totalPage: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;

    onOpenDetails: (project: IProject) => void;
    onEdit: (project: IProject) => void;
    onDelete?: (project: IProject) => void;
    permissions: ProjectPermissions;

    /** Columns this page never shows (not even in the Columns menu) */
    hiddenColumns?: ColumnKey[];

    /** Selected project ids ({ [_id]: true }). Omit to hide the checkboxes. */
    selection?: Record<string, boolean>;
    onSelectionChange?: (selection: Record<string, boolean>) => void;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ProjectsListTable({
    projects,
    isLoading,
    isFetching = false,
    isError,
    errorMessage,
    onRetry,
    hasActiveFilters,
    onClearFilters,
    sort,
    onSortChange,
    page,
    limit,
    total,
    totalPage,
    onPageChange,
    onLimitChange,
    onOpenDetails,
    onEdit,
    onDelete,
    permissions,
    hiddenColumns = [],
    selection,
    onSelectionChange,
}: ProjectsListTableProps) {
    const [visibility, setVisibility] = useState(DEFAULT_VISIBLE);

    // Columns this role/page may show at all
    const availableColumns = COLUMNS.filter(
        (c) =>
            !hiddenColumns.includes(c.key) &&
            (!("financial" in c && c.financial) || permissions.canViewFinancials),
    );
    const show = (key: ColumnKey) =>
        visibility[key] && availableColumns.some((c) => c.key === key);

    /* ------------------------------ Selection ------------------------------ */

    const selectable = !!selection && !!onSelectionChange;
    const isSelected = (id: string) => selectable && !!selection[id];
    const selectedOnPage = projects.filter((p) => isSelected(p._id)).length;
    const allOnPageSelected = projects.length > 0 && selectedOnPage === projects.length;

    const toggleRow = (id: string, checked: boolean) => {
        if (!selectable) return;
        const next = { ...selection };
        if (checked) next[id] = true;
        else delete next[id];
        onSelectionChange(next);
    };

    const togglePage = (checked: boolean) => {
        if (!selectable) return;
        const next = { ...selection };
        projects.forEach((p) => {
            if (checked) next[p._id] = true;
            else delete next[p._id];
        });
        onSelectionChange(next);
    };

    const pageCheckboxState = allOnPageSelected
        ? true
        : selectedOnPage > 0
          ? "indeterminate"
          : false;

    /* ------------------------------ Derived -------------------------------- */

    const totalPages = Math.max(1, totalPage);
    const startIdx = (page - 1) * limit;
    // colSpan only needs to cover every possible column; extra span is harmless
    const colSpan = (selectable ? 1 : 0) + 3 + availableColumns.length;
    const showStatusBlock = !isLoading && (isError || projects.length === 0);

    const renderActions = (p: IProject) => (
        <ProjectRowActions
            project={p}
            onOpenDetails={onOpenDetails}
            onEdit={onEdit}
            onDelete={onDelete ?? (() => {})}
            canEdit={permissions.canEdit}
            canDelete={permissions.canDelete && !!onDelete}
        />
    );

    // Shared error / empty content (used by both the cards and the table)
    const statusBlock = isError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">
                {errorMessage ?? "Failed to load projects."}
            </p>
            <Button size="sm" onClick={onRetry}>
                Try again
            </Button>
        </div>
    ) : (
        <div className="flex flex-col items-center gap-3 py-12 text-center text-sm text-muted-foreground">
            No projects found.
            {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={onClearFilters}>
                    Clear filters
                </Button>
            )}
        </div>
    );

    return (
        <div className="min-w-0 rounded-xl border bg-background">
            {/* Toolbar: select-all (cards) + column toggle (table) */}
            <div className="flex items-center justify-between gap-2 p-3">
                {selectable && projects.length > 0 ? (
                    <label className="flex items-center gap-2 text-sm text-muted-foreground lg:invisible">
                        <Checkbox
                            aria-label="Select all projects on this page"
                            checked={pageCheckboxState}
                            onCheckedChange={(v) => togglePage(v === true)}
                        />
                        Select all
                    </label>
                ) : (
                    <span />
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden h-8 lg:inline-flex">
                            <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableColumns.map((c) => (
                            <DropdownMenuCheckboxItem
                                key={c.key}
                                checked={visibility[c.key]}
                                onCheckedChange={(checked) =>
                                    setVisibility((v) => ({ ...v, [c.key]: !!checked }))
                                }
                            >
                                {c.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                        <DropdownMenuSeparator />
                        <p className="px-2 py-1.5 text-[11px] text-muted-foreground">
                            Some columns appear only on wider screens.
                        </p>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* ============================ Cards (< lg) ============================ */}
            <div
                className={cn(
                    "divide-y border-t lg:hidden",
                    isFetching && !isLoading && "opacity-60",
                )}
            >
                {isLoading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2 p-4">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-3 w-1/3" />
                        </div>
                    ))}

                {showStatusBlock && statusBlock}

                {!isLoading &&
                    !isError &&
                    projects.map((p) => {
                        const due = getDueAmount(p);

                        return (
                            <div
                                key={p._id}
                                role="button"
                                tabIndex={0}
                                onClick={() => onOpenDetails(p)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") onOpenDetails(p);
                                }}
                                className={cn(
                                    "cursor-pointer space-y-3 p-4 transition-colors hover:bg-muted/50",
                                    isSelected(p._id) && "bg-muted",
                                )}
                            >
                                {/* Title row */}
                                <div className="flex items-start gap-3">
                                    {selectable && (
                                        <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                aria-label={`Select ${p.name}`}
                                                checked={isSelected(p._id)}
                                                onCheckedChange={(v) => toggleRow(p._id, v === true)}
                                            />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <PriorityBadge priority={p.priority} />
                                            <p className="min-w-0 truncate text-sm font-medium">{p.name}</p>
                                        </div>
                                        {p.description && (
                                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                                {p.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="-mr-2 -mt-1" onClick={(e) => e.stopPropagation()}>
                                        {renderActions(p)}
                                    </div>
                                </div>

                                {/* Status + type */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {show("status") && <StatusBadge status={p.status} />}
                                    {show("type") && (
                                        <Badge variant="secondary" className="text-[11px] font-normal">
                                            {formatLabel(p.type)}
                                        </Badge>
                                    )}
                                </div>

                                {/* Details grid */}
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                    {show("client") && (
                                        <div className="min-w-0">
                                            <dt className="text-muted-foreground">Client</dt>
                                            <dd className="truncate font-medium">{fullName(p.client)}</dd>
                                        </div>
                                    )}
                                    {show("manager") && (
                                        <div className="min-w-0">
                                            <dt className="text-muted-foreground">Project Manager</dt>
                                            <dd className="truncate font-medium">{fullName(p.projectManager)}</dd>
                                        </div>
                                    )}
                                    {show("budget") && (
                                        <div>
                                            <dt className="text-muted-foreground">Project Value</dt>
                                            <dd className="font-medium">{formatCurrency(p.budget)}</dd>
                                        </div>
                                    )}
                                    {show("dueAmount") && (
                                        <div>
                                            <dt className="text-muted-foreground">Due Amount</dt>
                                            <dd className={cn("font-medium", dueClass(due))}>
                                                {formatCurrency(due)}
                                            </dd>
                                        </div>
                                    )}
                                    {show("developers") && p.developers?.length > 0 && (
                                        <div className="col-span-2 min-w-0">
                                            <dt className="text-muted-foreground">Developers</dt>
                                            <dd className="font-medium">
                                                {p.developers.map((d) => fullName(d)).join(", ")}
                                            </dd>
                                        </div>
                                    )}
                                </dl>

                                {/* Dates */}
                                {(show("startDate") || show("endDate")) && (
                                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        {show("startDate") && <span>{formatTableDate(p.startDate)}</span>}
                                        {show("startDate") && show("endDate") && <span>→</span>}
                                        {show("endDate") && <span>{formatTableDate(p.endDate)}</span>}
                                    </div>
                                )}

                                {show("technologies") && p.technologies?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {p.technologies.map((t) => (
                                            <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <ProjectLinks project={p} />
                            </div>
                        );
                    })}
            </div>

            {/* ============================ Table (lg+) ============================ */}
            <div className="hidden lg:block">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-indigo-500 hover:bg-indigo-500">
                            {selectable && (
                                <TableHead className="w-10">
                                    <Checkbox
                                        aria-label="Select all projects on this page"
                                        className="border-white data-[state=checked]:border-white"
                                        checked={pageCheckboxState}
                                        onCheckedChange={(v) => togglePage(v === true)}
                                    />
                                </TableHead>
                            )}
                            <TableHead className="w-15 text-xs font-semibold text-white">
                                <SortableHead field="priority" label="Pri" sort={sort} onSortChange={onSortChange} />
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-white">
                                <SortableHead field="name" label="Project" sort={sort} onSortChange={onSortChange} />
                            </TableHead>
                            {show("type") && <TableHead className={cn(HEAD, RESPONSIVE.type)}>Type</TableHead>}
                            {show("status") && (
                                <TableHead className="text-xs font-semibold text-white">
                                    <SortableHead field="status" label="Status" sort={sort} onSortChange={onSortChange} />
                                </TableHead>
                            )}
                            {show("client") && <TableHead className={HEAD}>Client</TableHead>}
                            {show("manager") && (
                                <TableHead className={cn(HEAD, RESPONSIVE.manager)}>Project Manager</TableHead>
                            )}
                            {show("developers") && (
                                <TableHead className={cn(HEAD, RESPONSIVE.developers)}>Developers</TableHead>
                            )}
                            {show("technologies") && (
                                <TableHead className={cn(HEAD, RESPONSIVE.technologies)}>Technologies</TableHead>
                            )}
                            {show("budget") && (
                                <TableHead className="text-xs font-semibold text-white">
                                    <SortableHead field="budget" label="Value" sort={sort} onSortChange={onSortChange} />
                                </TableHead>
                            )}
                            {show("dueAmount") && <TableHead className={cn(HEAD, "whitespace-nowrap")}>Due</TableHead>}
                            {show("startDate") && (
                                <TableHead className={cn("text-xs font-semibold text-white", RESPONSIVE.startDate)}>
                                    <SortableHead field="startDate" label="Start" sort={sort} onSortChange={onSortChange} />
                                </TableHead>
                            )}
                            {show("endDate") && <TableHead className={cn(HEAD, "whitespace-nowrap")}>Delivery</TableHead>}
                            <TableHead className="w-12 text-right">
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className={cn(isFetching && !isLoading && "opacity-60")}>
                        {isLoading &&
                            Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={colSpan}>
                                        <Skeleton className="h-5 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))}

                        {showStatusBlock && (
                            <TableRow>
                                <TableCell colSpan={colSpan}>{statusBlock}</TableCell>
                            </TableRow>
                        )}

                        {!isLoading &&
                            !isError &&
                            projects.map((p) => {
                                const due = getDueAmount(p);

                                return (
                                    <TableRow
                                        key={p._id}
                                        className="cursor-pointer"
                                        data-state={isSelected(p._id) ? "selected" : undefined}
                                        onClick={() => onOpenDetails(p)}
                                    >
                                        {selectable && (
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    aria-label={`Select ${p.name}`}
                                                    checked={isSelected(p._id)}
                                                    onCheckedChange={(v) => toggleRow(p._id, v === true)}
                                                />
                                            </TableCell>
                                        )}

                                        <TableCell>
                                            <PriorityBadge priority={p.priority} />
                                        </TableCell>

                                        {/* Project name + URLs; wraps instead of forcing width */}
                                        <TableCell className="min-w-44 max-w-64 whitespace-normal">
                                            <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
                                            {p.description && (
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {p.description}
                                                </p>
                                            )}
                                            <ProjectLinks project={p} />
                                        </TableCell>

                                        {show("type") && (
                                            <TableCell className={cn(MUTED_CELL, RESPONSIVE.type)}>
                                                {formatLabel(p.type)}
                                            </TableCell>
                                        )}

                                        {show("status") && (
                                            <TableCell>
                                                <StatusBadge status={p.status} />
                                            </TableCell>
                                        )}

                                        {/* Client; below xl the Project Manager column is hidden,
                                            so show the PM under the client instead */}
                                        {show("client") && (
                                            <TableCell className="max-w-40 whitespace-normal">
                                                <p className="text-sm text-muted-foreground">{fullName(p.client)}</p>
                                                {show("manager") && (
                                                    <p className="text-xs text-muted-foreground/80 xl:hidden">
                                                        PM: {fullName(p.projectManager)}
                                                    </p>
                                                )}
                                            </TableCell>
                                        )}

                                        {show("manager") && (
                                            <TableCell className={cn("max-w-40 whitespace-normal", MUTED_CELL, RESPONSIVE.manager)}>
                                                {fullName(p.projectManager)}
                                            </TableCell>
                                        )}

                                        {show("developers") && (
                                            <TableCell className={cn("max-w-48 whitespace-normal", MUTED_CELL, RESPONSIVE.developers)}>
                                                {p.developers?.length
                                                    ? p.developers.map((d) => fullName(d)).join(", ")
                                                    : "—"}
                                            </TableCell>
                                        )}

                                        {show("technologies") && (
                                            <TableCell className={cn("max-w-48 whitespace-normal", RESPONSIVE.technologies)}>
                                                <div className="flex flex-wrap gap-1">
                                                    {(p.technologies ?? []).map((t) => (
                                                        <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                                                            {t}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        )}

                                        {show("budget") && (
                                            <TableCell className={cn("whitespace-nowrap", MUTED_CELL)}>
                                                {formatCurrency(p.budget)}
                                            </TableCell>
                                        )}

                                        {show("dueAmount") && (
                                            <TableCell className={cn("whitespace-nowrap text-sm font-medium", dueClass(due))}>
                                                {formatCurrency(due)}
                                            </TableCell>
                                        )}

                                        {show("startDate") && (
                                            <TableCell className={cn("whitespace-nowrap", MUTED_CELL, RESPONSIVE.startDate)}>
                                                {formatTableDate(p.startDate)}
                                            </TableCell>
                                        )}

                                        {show("endDate") && (
                                            <TableCell className={cn("whitespace-nowrap", MUTED_CELL)}>
                                                {formatTableDate(p.endDate)}
                                            </TableCell>
                                        )}

                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            {renderActions(p)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </div>

            {/* Footer / pagination */}
            <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                    Showing {total === 0 ? 0 : startIdx + 1} to{" "}
                    {Math.min(startIdx + limit, total)} of {total} results
                </span>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Previous page"
                            disabled={page <= 1 || isFetching}
                            onClick={() => onPageChange(page - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="rounded-md bg-muted px-2.5 py-1 text-foreground">{page}</span>
                        <span>of {totalPages}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Next page"
                            disabled={page >= totalPages || isFetching}
                            onClick={() => onPageChange(page + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">Rows per page</span>
                        <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
                            <SelectTrigger className="h-8 w-18">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZES.map((n) => (
                                    <SelectItem key={n} value={String(n)}>
                                        {n}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
