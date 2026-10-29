"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Ban,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    HandCoins,
    PieChart,
    ReceiptText,
    RefreshCw,
    Search,
    SlidersHorizontal,
    Wallet,
} from "lucide-react";

import type {
    IMySalary,
    IMySalaryMeta,
    IMySalaryStats,
} from "@/types/team-salary.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { salaryApi } from "@/features/team-salary";

/* -------------------------------------------------------------------------- */
/* Constants & helpers                                                        */
/* -------------------------------------------------------------------------- */

const ALL = "ALL";

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pending",
    PARTIAL: "Partial",
    PAID: "Paid",
    CANCELLED: "Cancelled",
};

const STATUS_BADGE: Record<string, string> = {
    PENDING: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
    PARTIAL: "border-orange-500/40 bg-orange-500/10 text-orange-300",
    PAID: "border-green-500/40 bg-green-500/10 text-green-300",
    CANCELLED: "border-red-500/40 bg-red-500/10 text-red-300",
};

// "BANK_TRANSFER" -> "Bank Transfer"
const formatLabel = (value: string) =>
    value
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

const formatCurrency = (amount?: number) =>
    `BDT ${Number(amount ?? 0).toLocaleString("en-US")}`;

const formatDate = (date?: string) =>
    date
        ? new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
          })
        : "—";

const periodLabel = (s: { month: number; year: number }) =>
    `${MONTHS[s.month - 1] ?? s.month} ${s.year}`;

type SortField = "period" | "totalAmount" | "paidAmount" | "dueAmount" | "status";
type SortDir = "asc" | "desc";

// Converts the UI sort state to the API sort string
const buildSort = (field: SortField, dir: SortDir) => {
    if (field === "period") {
        return dir === "desc" ? "-year,-month" : "year,month";
    }
    return dir === "desc" ? `-${field}` : field;
};

const COLUMNS = [
    { key: "base", label: "Base Salary" },
    { key: "extra", label: "Extra" },
    { key: "total", label: "Total" },
    { key: "paid", label: "Paid" },
    { key: "due", label: "Due" },
    { key: "status", label: "Status" },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

type StatKey = "total" | "totalSalary" | "totalPaid" | "totalDue" | "Pending" | "Partial" | "Paid";

const STAT_CARDS: {
    key: StatKey;
    label: string;
    icon: typeof Wallet;
    linear: string;
    isMoney?: boolean;
}[] = [
    { key: "totalSalary", label: "Total Salary", icon: Wallet, linear: "from-purple-600 to-purple-500", isMoney: true },
    { key: "totalPaid", label: "Total Paid", icon: HandCoins, linear: "from-green-600 to-emerald-500", isMoney: true },
    { key: "totalDue", label: "Total Due", icon: ReceiptText, linear: "from-red-600 to-rose-500", isMoney: true },
    { key: "total", label: "Total Records", icon: FileText, linear: "from-blue-600 to-blue-500" },
    { key: "Pending", label: "Pending", icon: Clock, linear: "from-yellow-600 to-amber-500" },
    { key: "Partial", label: "Partial", icon: PieChart, linear: "from-orange-600 to-orange-500" },
    { key: "Paid", label: "Paid", icon: CheckCircle2, linear: "from-teal-700 to-cyan-500" },
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
/* Details dialog                                                             */
/* -------------------------------------------------------------------------- */

const Field = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-sm font-medium ${className ?? ""}`}>{value}</span>
    </div>
);

const SalaryDetailsDialog = ({
    salary,
    onClose,
}: {
    salary: IMySalary | null;
    onClose: () => void;
}) => {
    if (!salary) return null;

    return (
        <Dialog open={!!salary} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xl overflow-hidden p-0">
                <div className="bg-linear-to-br from-indigo-600 to-cyan-700 px-6 py-5 text-white">
                    <DialogHeader>
                        <div className="flex items-start justify-between gap-4">
                            <DialogTitle className="text-xl font-semibold text-white">
                                {periodLabel(salary)}
                            </DialogTitle>
                            <Badge
                                variant="outline"
                                className="border-white/30 bg-white/10 text-white"
                            >
                                {STATUS_LABELS[salary.status] ?? formatLabel(salary.status)}
                            </Badge>
                        </div>
                    </DialogHeader>
                </div>

                <ScrollArea className="max-h-[65vh]">
                    <div className="flex flex-col gap-5 px-6 py-5">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <Field label="Base Salary" value={formatCurrency(salary.salaryAmount)} />
                            <Field
                                label={salary.extraName ? `Extra (${salary.extraName})` : "Extra"}
                                value={formatCurrency(salary.extraAmount)}
                            />
                            <Field label="Total" value={formatCurrency(salary.totalAmount)} />
                            <Field label="Paid" value={formatCurrency(salary.paidAmount)} className="text-green-500" />
                            <Field label="Due" value={formatCurrency(salary.dueAmount)} className="text-red-500" />
                        </div>

                        {salary.note && (
                            <>
                                <Separator />
                                <Field label="Note" value={salary.note} />
                            </>
                        )}

                        {salary.status === "CANCELLED" && (
                            <>
                                <Separator />
                                <Field
                                    label={`Cancelled on ${formatDate(salary.cancelledAt)}`}
                                    value={salary.cancellationReason ?? "—"}
                                />
                            </>
                        )}

                        <Separator />

                        <div className="flex flex-col gap-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Payment History
                            </h3>

                            {salary.payments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No payments received yet.
                                </p>
                            ) : (
                                salary.payments.map((p) => (
                                    <div
                                        key={p._id}
                                        className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {formatCurrency(p.amount)}
                                                <span className="ml-2 text-xs font-normal text-muted-foreground">
                                                    {p.paymentFor === "EXTRA" ? "Extra" : "Salary"}
                                                </span>
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(p.paymentDate)} · {formatLabel(p.paymentMethod)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end text-xs text-muted-foreground">
                                            {p.paymentReference && <span>Ref: {p.paymentReference}</span>}
                                            {p.note && <span>{p.note}</span>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </ScrollArea>

                <div className="flex justify-end border-t px-6 py-3">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const MySalaries = () => {
    const [salaries, setSalaries] = useState<IMySalary[]>([]);
    const [meta, setMeta] = useState<IMySalaryMeta | null>(null);
    const [stats, setStats] = useState<IMySalaryStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Details dialog
    const [selected, setSelected] = useState<IMySalary | null>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [yearFilter, setYearFilter] = useState(ALL);
    const [monthFilter, setMonthFilter] = useState(ALL);
    const [statusFilter, setStatusFilter] = useState(ALL);
    const [methodFilter, setMethodFilter] = useState(ALL);

    // Sorting (default: newest month first)
    const [sortField, setSortField] = useState<SortField>("period");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Column visibility
    const [visible, setVisible] = useState<Record<ColumnKey, boolean>>({
        base: true,
        extra: true,
        total: true,
        paid: true,
        due: true,
        status: true,
    });

    const debouncedSearch = useDebounce(search);

    // Ignore responses of outdated requests
    const requestId = useRef(0);

    const fetchSalaries = useCallback(async () => {
        const currentId = ++requestId.current;
        setIsLoading(true);
        setError(null);

        try {
            const res = await salaryApi.getMySalaries({
                page,
                limit,
                sort: buildSort(sortField, sortDir),
                searchTerm: debouncedSearch || undefined,
                year: yearFilter !== ALL ? yearFilter : undefined,
                month: monthFilter !== ALL ? monthFilter : undefined,
                status: statusFilter !== ALL ? statusFilter : undefined,
                paymentMethod: methodFilter !== ALL ? methodFilter : undefined,
            });

            if (currentId !== requestId.current) return;

            setSalaries(res.data ?? []);
            setMeta(res.meta ?? null);
            setStats(res.stats ?? null);
        } catch (err: any) {
            if (currentId !== requestId.current) return;
            setError(
                err?.response?.data?.message ?? "Failed to load your salaries.",
            );
        } finally {
            if (currentId === requestId.current) setIsLoading(false);
        }
    }, [
        page,
        limit,
        sortField,
        sortDir,
        debouncedSearch,
        yearFilter,
        monthFilter,
        statusFilter,
        methodFilter,
    ]);

    useEffect(() => {
        fetchSalaries();
    }, [fetchSalaries]);

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
        if (sortField === field) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir("asc");
        }
        setPage(1);
    };

    const SortableHead = ({ field, label }: { field: SortField; label: string }) => (
        <button
            type="button"
            onClick={() => toggleSort(field)}
            className="flex items-center gap-1 uppercase"
        >
            {label}
            {sortField !== field ? (
                <ArrowUpDown className="h-3 w-3 opacity-60" />
            ) : sortDir === "asc" ? (
                <ArrowUp className="h-3 w-3" />
            ) : (
                <ArrowDown className="h-3 w-3" />
            )}
        </button>
    );

    const total = meta?.total ?? 0;
    const totalPages = Math.max(1, meta?.totalPage ?? 1);
    const currentPage = meta?.page ?? page;
    const startIdx = (currentPage - 1) * limit;
    // period + visible columns
    const colSpan = 1 + COLUMNS.filter((c) => visible[c.key]).length;
    const isInitialLoad = isLoading && !stats;

    /* --------------------------------- Render -------------------------------- */

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Salary</h1>
                    <p className="text-sm text-muted-foreground">
                        Your monthly salary records and payment history.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchSalaries}
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
                {STAT_CARDS.map(({ key, label, icon: Icon, linear, isMoney }) => (
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
                            <Skeleton className="mt-2 h-7 w-16 bg-white/30" />
                        ) : (
                            <p className="mt-1 text-xl font-bold">
                                {isMoney
                                    ? formatCurrency(stats?.[key])
                                    : (stats?.[key] ?? 0)}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-70">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by note, extra or reference..."
                        className="h-9 pl-9"
                    />
                </div>

                <Select value={yearFilter} onValueChange={withReset(setYearFilter)}>
                    <SelectTrigger className="h-9 w-32">
                        <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All Years</SelectItem>
                        {(stats?.years ?? []).map((y) => (
                            <SelectItem key={y} value={String(y)}>
                                {y}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={monthFilter} onValueChange={withReset(setMonthFilter)}>
                    <SelectTrigger className="h-9 w-37.5">
                        <SelectValue placeholder="All Months" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All Months</SelectItem>
                        {MONTHS.map((m, i) => (
                            <SelectItem key={m} value={String(i + 1)}>
                                {m}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={withReset(setStatusFilter)}>
                    <SelectTrigger className="h-9 w-37.5">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All Statuses</SelectItem>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={methodFilter} onValueChange={withReset(setMethodFilter)}>
                    <SelectTrigger className="h-9 w-40">
                        <SelectValue placeholder="All Methods" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All Methods</SelectItem>
                        {(stats?.paymentMethods ?? []).map((m) => (
                            <SelectItem key={m} value={m}>
                                {formatLabel(m)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
                                <TableHead className="text-xs font-semibold text-white">
                                    <SortableHead field="period" label="Month" />
                                </TableHead>
                                {visible.base && (
                                    <TableHead className="text-xs font-semibold uppercase text-white">
                                        Base Salary
                                    </TableHead>
                                )}
                                {visible.extra && (
                                    <TableHead className="text-xs font-semibold uppercase text-white">
                                        Extra
                                    </TableHead>
                                )}
                                {visible.total && (
                                    <TableHead className="text-xs font-semibold text-white">
                                        <SortableHead field="totalAmount" label="Total" />
                                    </TableHead>
                                )}
                                {visible.paid && (
                                    <TableHead className="text-xs font-semibold text-white">
                                        <SortableHead field="paidAmount" label="Paid" />
                                    </TableHead>
                                )}
                                {visible.due && (
                                    <TableHead className="text-xs font-semibold text-white">
                                        <SortableHead field="dueAmount" label="Due" />
                                    </TableHead>
                                )}
                                {visible.status && (
                                    <TableHead className="text-xs font-semibold text-white">
                                        <SortableHead field="status" label="Status" />
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
                                            <Button size="sm" onClick={fetchSalaries}>
                                                Try again
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Empty */}
                            {!isLoading && !error && salaries.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={colSpan}
                                        className="py-12 text-center text-sm text-muted-foreground"
                                    >
                                        No salary records found.
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Rows */}
                            {!error &&
                                !isInitialLoad &&
                                salaries.map((s) => (
                                    <TableRow
                                        key={s._id}
                                        className="cursor-pointer"
                                        onClick={() => setSelected(s)}
                                    >
                                        <TableCell className="whitespace-nowrap text-sm font-medium">
                                            {periodLabel(s)}
                                            {s.note && (
                                                <p className="max-w-60 truncate text-xs font-normal text-muted-foreground">
                                                    {s.note}
                                                </p>
                                            )}
                                        </TableCell>

                                        {visible.base && (
                                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                                {formatCurrency(s.salaryAmount)}
                                            </TableCell>
                                        )}

                                        {visible.extra && (
                                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                                {s.extraAmount > 0 ? (
                                                    <>
                                                        {formatCurrency(s.extraAmount)}
                                                        {s.extraName && (
                                                            <p className="text-xs">{s.extraName}</p>
                                                        )}
                                                    </>
                                                ) : (
                                                    "—"
                                                )}
                                            </TableCell>
                                        )}

                                        {visible.total && (
                                            <TableCell className="whitespace-nowrap text-sm font-medium">
                                                {formatCurrency(s.totalAmount)}
                                            </TableCell>
                                        )}

                                        {visible.paid && (
                                            <TableCell className="whitespace-nowrap text-sm text-green-500">
                                                {formatCurrency(s.paidAmount)}
                                            </TableCell>
                                        )}

                                        {visible.due && (
                                            <TableCell
                                                className={`whitespace-nowrap text-sm ${
                                                    s.dueAmount > 0 && s.status !== "CANCELLED"
                                                        ? "text-red-500"
                                                        : "text-green-500"
                                                }`}
                                            >
                                                {formatCurrency(s.dueAmount)}
                                            </TableCell>
                                        )}

                                        {visible.status && (
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`gap-1 text-[11px] font-medium ${STATUS_BADGE[s.status] ?? ""}`}
                                                >
                                                    {s.status === "CANCELLED" && (
                                                        <Ban className="h-3 w-3" />
                                                    )}
                                                    {STATUS_LABELS[s.status] ?? formatLabel(s.status)}
                                                </Badge>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
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

            <SalaryDetailsDialog
                salary={selected}
                onClose={() => setSelected(null)}
            />
        </div>
    );
};

export default MySalaries;