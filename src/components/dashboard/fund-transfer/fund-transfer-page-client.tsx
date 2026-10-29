"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, ArrowRightLeft, Plus, Trash } from "lucide-react";

import {
    useDeleteFundTransfer,
    useFundTransfers,
} from "@/features/fund-transfer/hooks/use-fund-transfer";
import type { IFundTransfer } from "@/types/fund-transfer.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FundTransferFormDialog } from "./fund-transfer-form-dialog";
import { useFinancialPayments } from "@/features/financial-account/hooks/use-financial-account";

const money = (value?: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(value ?? 0);

const accountName = (value: IFundTransfer["fromAccountId"]) =>
    typeof value === "string" ? value : value?.accountName ?? "—";
const userName = (value: IFundTransfer["createdBy"]) => {
    if (!value) return "—";
    if (typeof value === "string") return value;
    return `${value.firstName ?? ""} ${value.lastName ?? ""}`.trim() || "—";
};
export function FundTransferPageClient() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<IFundTransfer | null>(null);

    const list = useFundTransfers({ page, limit, sort: "-transferDate" });
    const deleteMutation = useDeleteFundTransfer();

    const { data, isLoading } = useFinancialPayments({
    });

    console.log("Financial Payments Data:", data);

    const rows = list.data?.data ?? [];
    const meta = list.data?.meta;

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteMutation.mutateAsync({ id: deleteTarget._id });
            toast.success("Transfer reversed and deleted successfully.");
            setDeleteTarget(null);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to delete transfer.");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <FundTransferFormDialog open={formOpen} onOpenChange={setFormOpen} />
            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Reverse this transfer?"
                description={`${money(deleteTarget?.amount)} will be returned to "${deleteTarget ? accountName(deleteTarget.fromAccountId) : ""
                    }" and deducted from "${deleteTarget ? accountName(deleteTarget.toAccountId) : ""}".`}
                confirmText="Reverse & Delete"
                variant="destructive"
                isLoading={deleteMutation.isPending}
                onConfirm={confirmDelete}
            />

            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Fund Transfer</h1>
                    <p className="text-sm text-muted-foreground">
                        Move money between your cash, bank and mobile banking accounts.
                    </p>
                </div>
                <Button
                    className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
                    onClick={() => setFormOpen(true)}
                >
                    <Plus />
                    New Transfer
                </Button>
            </div>

            <Card className="bg-slate-100 dark:bg-slate-950 p-0">
                <CardContent className="flex flex-col gap-4 p-0">
                    {list.isError ? (
                        <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                            {list.error instanceof Error ? list.error.message : "Unable to load transfers."}
                        </div>
                    ) : list.isLoading ? (
                        <div className="flex flex-col gap-3 p-4">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Skeleton key={index} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="m-4 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
                            <ArrowRightLeft className="text-muted-foreground" />
                            <p className="font-medium">No transfers yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-190 text-sm">
                                <thead>
                                    <tr className="*:text-white bg-indigo-600 border-b text-left text-xs">
                                        <th className="p-3 font-medium">Date</th>
                                        <th className="p-3 font-medium">From</th>
                                        <th className="p-3 font-medium">To</th>
                                        <th className="p-3 font-medium">Amount</th>
                                        <th className="p-3 font-medium">Transferred By</th>

                                        <th className="p-3 font-medium">Reference</th>
                                        <th className="p-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((transfer) => (
                                        <tr key={transfer._id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="p-3 text-muted-foreground">
                                                {new Date(transfer.transferDate).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 font-medium">{accountName(transfer.fromAccountId)}</td>
                                            <td className="p-3 font-medium">{accountName(transfer.toAccountId)}</td>
                                            <td className="p-3 font-semibold">{money(transfer.amount)}</td>
                                            <td className="p-3">
                                                <p className="font-medium">{userName(transfer.createdBy)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(transfer.createdAt).toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="p-3 text-muted-foreground">
                                                {transfer.reference || transfer.note || "—"}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => setDeleteTarget(transfer)}
                                                        aria-label="Reverse transfer"
                                                        className="hover:cursor-pointer transition hover:scale-[1.02]"
                                                    >
                                                        <Trash />
                                                    </Button>
                                                </div>
                                            </td>
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
                                {page} / {meta?.totalPage ?? 1}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={page >= (meta?.totalPage ?? 1)}
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

export default FundTransferPageClient;