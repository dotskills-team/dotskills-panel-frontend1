"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Wallet } from "lucide-react";

import {
    useFinancialAccounts,
    useFinancialPayments,
} from "@/features/financial-account/hooks/use-financial-account";
import type { FinancialPaymentStatus } from "@/features/financial-account/api/financial-account.api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/utils/dateFormat";

const ALL = "ALL";

const money = (value?: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(value ?? 0);

const STATUS_OPTIONS: { value: FinancialPaymentStatus; label: string }[] = [
    { value: "COMPLETE", label: "Complete" },
    { value: "PARTIAL", label: "Partial" },
    { value: "ADVANCED", label: "Advanced" },
    { value: "DUE", label: "Due" },
    { value: "ALL", label: "All status" },
];

const statusClass: Record<string, string> = {
    COMPLETE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    PARTIAL: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    ADVANCED: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
    DUE: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
};

export function PaymentsPageClient() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [accountId, setAccountId] = useState<string>(ALL);
    const [status, setStatus] = useState<FinancialPaymentStatus>("COMPLETE");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const accountsQuery = useFinancialAccounts({ limit: 100 } as never);
    const accounts = accountsQuery.data?.data ?? [];

    const { data, isLoading, isError, error } = useFinancialPayments({
        financialAccountId: accountId === ALL ? undefined : accountId,
        status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        excludeDeletedProjects: true || undefined,
        page,
        limit,
    });

    const rows = data?.data.payments ?? [];
    const summary = data?.data.summary;
    const byAccount = data?.data.byAccount ?? [];
    const meta = data?.meta;

    const resetPage = () => setPage(1);
    const hasFilter =
        accountId !== ALL || status !== "COMPLETE" || startDate || endDate ;

    const clearFilters = () => {
        setAccountId(ALL);
        setStatus("COMPLETE");
        setStartDate("");
        setEndDate("");
        setPage(1);
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
                <p className="text-sm text-muted-foreground">
                    All project payments. Filter by account, status or date to see where the money came in.
                </p>
            </div>

            {/* Filters */}
            <Card className="bg-slate-100 dark:bg-slate-950 p-0">
                <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:flex-wrap lg:items-end">
                    <div className="flex flex-col gap-1 lg:w-56">
                        <label className="text-xs text-muted-foreground">Account</label>
                        <Select
                            value={accountId}
                            onValueChange={(v) => {
                                setAccountId(v);
                                resetPage();
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All accounts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL}>All accounts</SelectItem>
                                {accounts.map((acc) => (
                                    <SelectItem key={acc._id} value={acc._id}>
                                        {acc.accountName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1 lg:w-44">
                        <label className="text-xs text-muted-foreground">Status</label>
                        <Select
                            value={status}
                            onValueChange={(v) => {
                                setStatus(v as FinancialPaymentStatus);
                                resetPage();
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">From</label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                resetPage();
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">To</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                resetPage();
                            }}
                        />
                    </div>

                    {hasFilter && (
                        <Button variant="outline" onClick={clearFilters} className="cursor-pointer">
                            Clear
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-100 dark:bg-slate-950">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                        <p className="text-xl font-bold">{money(summary?.totalAmount)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-100 dark:bg-slate-950">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">Total Payments</p>
                        <p className="text-xl font-bold">{summary?.totalPayments ?? 0}</p>
                    </CardContent>
                </Card>

                {byAccount.map((acc) => (
                    <Card
                        key={acc._id}
                        onClick={() => {
                            setAccountId(acc._id);
                            resetPage();
                        }}
                        className="cursor-pointer bg-slate-100 transition hover:scale-[1.02] dark:bg-slate-950"
                    >
                        <CardContent className="p-4">
                            <p className="truncate text-xs text-muted-foreground">
                                {acc.accountName} · {acc.paymentCount} payments
                            </p>
                            <p className="text-xl font-bold">{money(acc.totalReceived)}</p>
                            <p className="text-xs text-muted-foreground">
                                Balance: {money(acc.currentBalance)}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table */}
            <Card className="bg-slate-100 dark:bg-slate-950 p-0">
                <CardContent className="flex flex-col gap-4 p-0">
                    {isError ? (
                        <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                            {error instanceof Error ? error.message : "Unable to load payments."}
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col gap-3 p-4">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Skeleton key={index} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="m-4 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
                            <Wallet className="text-muted-foreground" />
                            <p className="font-medium">No payments found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-190 text-sm">
                                <thead>
                                    <tr className="*:text-white bg-indigo-600 border-b text-left text-xs">
                                        <th className="p-3 font-medium">Date</th>
                                        <th className="p-3 font-medium">Project</th>
                                        <th className="p-3 font-medium">Client</th>
                                        <th className="p-3 font-medium">Account</th>
                                        <th className="p-3 font-medium">Amount</th>
                                        <th className="p-3 font-medium">Status</th>
                                        <th className="p-3 font-medium">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((p) => (
                                        <tr key={p.paymentId} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="p-3 text-muted-foreground">
                                                {/* {new Date(p.date).toLocaleDateString()} */}
                                                  {formatDate(p.date)}
                                            </td>
                                            <td className="p-3 font-medium">
                                                {p.project?.name ?? "—"}
                                                {p.project?.isDeleted && (
                                                    <span className="ml-2 text-xs text-destructive">(deleted)</span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                {p.client?.name || "—"}
                                            </td>
                                            <td className="p-3">
                                                <p className="font-medium">{p.account?.accountName ?? "—"}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {p.account?.accountType}
                                                </p>
                                            </td>
                                            <td className="p-3 font-semibold">{money(p.amount)}</td>
                                            <td className="p-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[p.status] ?? ""}`}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-muted-foreground">{p.note || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="pt-3 pb-2 px-4 flex flex-col justify-between gap-3 border-t text-sm text-muted-foreground sm:flex-row sm:items-center">
                        <span>
                            Showing {rows.length ? (page - 1) * limit + 1 : 0} to{" "}
                            {Math.min(page * limit, meta?.total ?? rows.length)} of {meta?.total ?? rows.length} results
                        </span>
                        <div className="flex items-center gap-2">
                            <Select
                                value={String(limit)}
                                onValueChange={(value) => {
                                    setLimit(Number(value));
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-24">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 30, 50].map((value) => (
                                        <SelectItem key={value} value={String(value)}>
                                            {value} / page
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                                <ArrowLeft />
                            </Button>
                            <span>
                                {page} / {meta?.totalPage || 1}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={page >= (meta?.totalPage || 1)}
                                onClick={() => setPage(page + 1)}
                            >
                                <ArrowRight />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default PaymentsPageClient;