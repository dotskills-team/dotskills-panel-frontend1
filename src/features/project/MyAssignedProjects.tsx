"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    FolderKanban,
    Gitlab,
    Globe,
    ListChecks,
    PackageCheck,
    PauseCircle,
    RefreshCw,
    Rocket,
    Search,
    SlidersHorizontal,
    Wallet,
} from "lucide-react";

import type {
    IDeveloperProject,
    IDeveloperProjectMeta,
    IDeveloperProjectStats,
} from "@/types/project.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import projectApi from "./api/project.api";
import { ProjectDetailsDialog } from "@/components/dashboard/project/ProjectDetailsDialog";
import {
    STATUS_BADGE,
    STATUS_LABELS,
    formatLabel,
    formatTableDate as formatDate,
    fullName,
} from "./constants/project-table.constants";

/* -------------------------------------------------------------------------- */
/* Constants & helpers                                                        */
/* -------------------------------------------------------------------------- */

const ALL = "ALL";

const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

const TYPE_OPTIONS = [
    "WORDPRESS",
    "MERN",
    "PERN",
    "NEXT_JS",
    "SHOPIFY",
    "LARAVEL",
    "PHP",
    "MOBILE_APP",
    "UI_UX",
    "VIDEO_EDITING",
    "SEO",
    "IMAGE_DESIGN",
    "DIGITAL_MARKETING",
    "OTHER",
];

type SortField = "priority" | "name" | "status" | "startDate";

const COLUMNS = [
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "client", label: "Client" },
    { key: "manager", label: "Project Manager" },
    { key: "technologies", label: "Technologies" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "Delivery Date" },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

type StatKey = Exclude<keyof IDeveloperProjectStats, "clients">;

const STAT_CARDS: {
    key: StatKey;
    label: string;
    icon: typeof FolderKanban;
    linear: string;
}[] = [
    { key: "total", label: "Total Projects", icon: FolderKanban, linear: "from-blue-600 to-blue-500" },
    { key: "Planning", label: "Planning", icon: ListChecks, linear: "from-slate-800 to-slate-700" },
    { key: "InProgress", label: "In Progress", icon: Clock, linear: "from-orange-600 to-orange-500" },
    { key: "OnHold", label: "On Hold", icon: PauseCircle, linear: "from-red-700 to-rose-500" },
    { key: "Completed", label: "Completed", icon: CheckCircle2, linear: "from-green-700 to-emerald-500" },
    { key: "DoneDue", label: "Done & Due", icon: Wallet, linear: "from-purple-700 to-fuchsia-500" },
    { key: "Delivered", label: "Delivered", icon: PackageCheck, linear: "from-teal-700 to-cyan-500" },
];

// Small debounce hook for the search input
const useDebounce = <T,>(value: T, delay = 400) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return debounced;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const MyAssignedProjects = () => {
    const [projects, setProjects] = useState<IDeveloperProject[]>([]);
    const [meta, setMeta] = useState<IDeveloperProjectMeta | null>(null);
    const [stats, setStats] = useState<IDeveloperProjectStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Details dialog
    const [selectedProject, setSelectedProject] =
        useState<IDeveloperProject | null>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [clientFilter, setClientFilter] = useState(ALL);
    const [statusFilter, setStatusFilter] = useState(ALL);
    const [typeFilter, setTypeFilter] = useState(ALL);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Sorting: "priority" = asc, "-priority" = desc (same convention as getProjects)
    const [sort, setSort] = useState("priority");

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Column visibility
    const [visible, setVisible] = useState<Record<ColumnKey, boolean>>({
        type: true,
        status: true,
        client: true,
        manager: true,
        technologies: true,
        startDate: true,
        endDate: true,
    });

    const debouncedSearch = useDebounce(search);

    // Ignore responses of outdated requests
    const requestId = useRef(0);

    const fetchProjects = useCallback(async () => {
        const currentId = ++requestId.current;
        setIsLoading(true);
        setError(null);

        try {
            const res = await projectApi.getMyProjects({
                page,
                limit,
                sort,
                searchTerm: debouncedSearch || undefined,
                client: clientFilter !== ALL ? clientFilter : undefined,
                status: statusFilter !== ALL ? statusFilter : undefined,
                type: typeFilter !== ALL ? typeFilter : undefined,
                startDate: dateFrom || undefined,
                endDate: dateTo || undefined,
            });

            if (currentId !== requestId.current) return;

            setProjects(res.data ?? []);
            setMeta(res.meta ?? null);
            setStats(res.stats ?? null);
        } catch (err: any) {
            if (currentId !== requestId.current) return;
            setError(
                err?.response?.data?.message ?? "Failed to load your projects.",
            );
        } finally {
            if (currentId === requestId.current) setIsLoading(false);
        }
    }, [
        page,
        limit,
        sort,
        debouncedSearch,
        clientFilter,
        statusFilter,
        typeFilter,
        dateFrom,
        dateTo,
    ]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Go back to the first page when the search term changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    // Wraps a filter setter so it also resets pagination
    const withReset =
        <T,>(setter: (v: T) => void) =>
        (value: T) => {
            setter(value);
            setPage(1);
        };

    const toggleSort = (field: SortField) => {
        setSort((prev) => (prev === field ? `-${field}` : field));
        setPage(1);
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sort === field) return <ArrowUp className="h-3 w-3" />;
        if (sort === `-${field}`) return <ArrowDown className="h-3 w-3" />;
        return <ArrowUpDown className="h-3 w-3 opacity-60" />;
    };

    const SortableHead = ({ field, label }: { field: SortField; label: string }) => (
        <button
            type="button"
            onClick={() => toggleSort(field)}
            className="flex items-center gap-1 uppercase"
        >
            {label}
            <SortIcon field={field} />
        </button>
    );

    const total = meta?.total ?? 0;
    const totalPages = Math.max(1, meta?.totalPage ?? 1);
    const currentPage = meta?.page ?? page;
    const startIdx = (currentPage - 1) * limit;
    // priority + project + visible columns
    const colSpan = 2 + COLUMNS.filter((c) => visible[c.key]).length;
    const isInitialLoad = isLoading && !stats;

    /* --------------------------------- Render -------------------------------- */

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
                    <p className="text-sm text-muted-foreground">
                        Projects assigned to you, sorted by priority.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchProjects}
                    disabled={isLoading}
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </Button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
                {STAT_CARDS.map(({ key, label, icon: Icon, linear }) => (
                    <div
                        key={key}
                        className={`rounded-xl bg-linear-to-r ${linear} p-3 text-white shadow-sm`}
                    >
                        <div className="flex items-start justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-wide">
                                {label}
                            </span>
                            <span className="rounded-md bg-white/20 p-1.5">
                                <Icon className="h-3.5 w-3.5" />
                            </span>
                        </div>
                        {isInitialLoad ? (
                            <Skeleton className="mt-2 h-7 w-10 bg-white/30" />
                        ) : (
                            <p className="mt-1 text-2xl font-bold">
                                {stats?.[key] ?? 0}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => withReset(setDateFrom)(e.target.value)}
                        className="h-9 w-37.5"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => withReset(setDateTo)(e.target.value)}
                        className="h-9 w-37.5"
                    />
                    {(dateFrom || dateTo) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setDateFrom("");
                                setDateTo("");
                                setPage(1);
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-70">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects by name or client..."
                            className="h-9 pl-9"
                        />
                    </div>

                    <Select
                        value={clientFilter}
                        onValueChange={withReset(setClientFilter)}
                    >
                        <SelectTrigger className="h-9 w-37.5">
                            <SelectValue placeholder="All Clients" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All Clients</SelectItem>
                            {(stats?.clients ?? []).map((c) => (
                                <SelectItem key={c._id} value={c._id}>
                                    {fullName(c)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={statusFilter}
                        onValueChange={withReset(setStatusFilter)}
                    >
                        <SelectTrigger className="h-9 w-37.5">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All Statuses</SelectItem>
                            {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {STATUS_LABELS[s]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={typeFilter}
                        onValueChange={withReset(setTypeFilter)}
                    >
                        <SelectTrigger className="h-9 w-37.5">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All Types</SelectItem>
                            {TYPE_OPTIONS.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {formatLabel(t)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table card */}
            <div className="rounded-xl border">
                <div className="flex justify-end p-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                                <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {COLUMNS.map((c) => (
                                <DropdownMenuCheckboxItem
                                    key={c.key}
                                    checked={visible[c.key]}
                                    onCheckedChange={(checked) =>
                                        setVisible((v) => ({ ...v, [c.key]: !!checked }))
                                    }
                                >
                                    {c.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-indigo-500 hover:bg-indigo-500">
                                <TableHead className="w-15 text-xs font-semibold text-white">
                                    <SortableHead field="priority" label="Pri" />
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-white">
                                    <SortableHead field="name" label="Project" />
                                </TableHead>
                                {visible.type && (
                                    <TableHead className="text-xs font-semibold uppercase text-white">
                                        Type
                                    </TableHead>
                                )}
                                {visible.status && (
                                    <TableHead className="text-xs font-semibold text-white">
                                        <SortableHead field="status" label="Status" />
                                    </TableHead>
                                )}
                                {visible.client && (
                                    <TableHead className="text-xs font-semibold uppercase text-white">
                                        Client
                                    </TableHead>
                                )}
                                {visible.manager && (
                                    <TableHead className="text-xs font-semibold uppercase text-white">
                                        Project Manager
                                    </TableHead>
                                )}
                                {visible.technologies && (
                                    <TableHead className="text-xs font-semibold uppercase text-white">
                                        Technologies
                                    </TableHead>
                                )}
                                {visible.startDate && (
                                    <TableHead className="text-xs font-semibold text-white">
                                        <SortableHead field="startDate" label="Start Date" />
                                    </TableHead>
                                )}
                                {visible.endDate && (
                                    <TableHead className="text-xs font-semibold uppercase text-white">
                                        Delivery Date
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>

                        <TableBody
                            className={isLoading && !isInitialLoad ? "opacity-60" : ""}
                        >
                            {/* Initial loading */}
                            {isInitialLoad &&
                                Array.from({ length: 6 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={colSpan}>
                                            <Skeleton className="h-5 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))}

                            {/* Error */}
                            {!isLoading && error && (
                                <TableRow>
                                    <TableCell colSpan={colSpan} className="py-12">
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            <AlertCircle className="h-8 w-8 text-destructive" />
                                            <p className="text-sm text-destructive">{error}</p>
                                            <Button size="sm" onClick={fetchProjects}>
                                                Try again
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Empty */}
                            {!isLoading && !error && projects.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={colSpan}
                                        className="py-12 text-center text-sm text-muted-foreground"
                                    >
                                        No projects found.
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Rows */}
                            {!error &&
                                !isInitialLoad &&
                                projects.map((p) => {
                                    const links = [
                                        { label: "Live", href: p.liveUrl, icon: Rocket },
                                        { label: "Dev", href: p.developmentLiveUrl, icon: Globe },
                                        { label: "Repo", href: p.repositoryUrl, icon: Gitlab },
                                    ].filter((l) => !!l.href);

                                    return (
                                        <TableRow
                                            key={p._id}
                                            className="cursor-pointer"
                                            onClick={() => setSelectedProject(p)}
                                        >
                                            <TableCell>
                                                {p.priority !== undefined && p.priority !== null ? (
                                                    <Badge variant="outline">P{p.priority}</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </TableCell>

                                            {/* Project name + URLs */}
                                            <TableCell className="max-w-72">
                                                <p className="truncate text-sm font-medium">
                                                    {p.name}
                                                </p>
                                                {p.description && (
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {p.description}
                                                    </p>
                                                )}
                                                {links.length > 0 && (
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
                                                )}
                                            </TableCell>

                                            {visible.type && (
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatLabel(p.type)}
                                                </TableCell>
                                            )}

                                            {visible.status && (
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[11px] font-medium ${STATUS_BADGE[p.status] ?? ""}`}
                                                    >
                                                        {STATUS_LABELS[p.status] ?? formatLabel(p.status)}
                                                    </Badge>
                                                </TableCell>
                                            )}

                                            {visible.client && (
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {fullName(p.client)}
                                                </TableCell>
                                            )}

                                            {visible.manager && (
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {fullName(p.projectManager)}
                                                </TableCell>
                                            )}

                                            {visible.technologies && (
                                                <TableCell className="max-w-55">
                                                    <div className="flex flex-wrap gap-1">
                                                        {p.technologies.map((t) => (
                                                            <Badge
                                                                key={t}
                                                                variant="secondary"
                                                                className="text-[10px] font-normal"
                                                            >
                                                                {t}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visible.startDate && (
                                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                                    {formatDate(p.startDate)}
                                                </TableCell>
                                            )}

                                            {visible.endDate && (
                                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                                    {formatDate(p.endDate)}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer / pagination */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground">
                    <span>
                        Showing {total === 0 ? 0 : startIdx + 1} to{" "}
                        {Math.min(startIdx + limit, total)} of {total} results
                    </span>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={currentPage <= 1 || isLoading}
                                onClick={() => setPage(currentPage - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="rounded-md bg-muted px-2.5 py-1 text-foreground">
                                {currentPage}
                            </span>
                            <span>of {totalPages}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={currentPage >= totalPages || isLoading}
                                onClick={() => setPage(currentPage + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <Select
                                value={String(limit)}
                                onValueChange={(v) => {
                                    setLimit(Number(v));
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="h-8 w-18">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 50].map((n) => (
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

            {/* Single details dialog */}
            <ProjectDetailsDialog
                project={selectedProject}
                open={!!selectedProject}
                onOpenChange={(isOpen) => {
                    if (!isOpen) setSelectedProject(null);
                }}
                role="DEVELOPER"
            />
        </div>
    );
};

export default MyAssignedProjects;