
"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CircleDollarSign,
  Pencil,
  Plus,
  Receipt,
  Search,
  Trash,
  X,
} from "lucide-react";

import { useDeleteExpense, useExpenses } from "@/features/expense/hooks/use-expense";
import { useExpenseCategories } from "@/features/expense-category/hooks/use-expense-category";
import { useFinancialAccounts } from "@/features/financial-account/hooks/use-financial-account";
import { EXPENSE_SORT_OPTIONS } from "@/features/expense/constants/expense.constant";
import type { IExpense } from "@/types/expense.types";
import { cn } from "@/lib/utils";

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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ExpenseFormDialog } from "./expense-form-dialog";
import { formatDate } from "@/utils/dateFormat";

const money = (value?: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(value ?? 0);

const nameOf = (value: unknown, key: string) => {
  if (!value) return "—";
  if (typeof value === "string") return value;
  return (value as Record<string, string>)[key] ?? "—";
};

function StatCard({
  title,
  value,
  caption,
  icon: Icon,
  tone,
  gradient,
}: {
  title: string;
  value: string;
  caption: string;
  icon: typeof Receipt;
  tone: string;
  gradient: string;
}) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border-0",
        "bg-linear-to-br text-white shadow-lg",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        gradient,
      )}
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />

      <div className="pointer-events-none absolute -bottom-12 -left-8 size-28 rounded-full bg-black/5" />

      <CardContent className="relative flex items-center gap-4 p-5">
        {/* Icon */}
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            "bg-white/15 backdrop-blur-sm",
            "ring-1 ring-white/10",
            tone,
          )}
        >
          <Icon className="size-6" strokeWidth={2.2} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-white/75">
            {title}
          </p>

          <p className="mt-1 truncate text-2xl font-bold tracking-tight">
            {value}
          </p>

          <p className="mt-1 truncate text-[11px] text-white/65">
            {caption}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ExpensePageClient() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("ALL");
  const [financialAccountId, setFinancialAccountId] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState("-expenseDate");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IExpense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IExpense | null>(null);

  const categoriesQuery = useExpenseCategories({ limit: 100 });
  const accountsQuery = useFinancialAccounts({ limit: 100 });

  const query = useMemo(
    () => ({
      page,
      limit,
      searchTerm: search || undefined,
      categoryId: categoryId === "ALL" ? undefined : categoryId,
      financialAccountId: financialAccountId === "ALL" ? undefined : financialAccountId,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sort,
    }),
    [page, limit, search, categoryId, financialAccountId, startDate, endDate, sort],
  );

  const list = useExpenses(query);
  const deleteMutation = useDeleteExpense();

  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;
  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);

  const hasDateFilter = Boolean(startDate || endDate);

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (expense: IExpense) => {
    setEditing(expense);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync({ id: deleteTarget._id });
      toast.success("Expense deleted successfully.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete expense.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ExpenseFormDialog open={formOpen} onOpenChange={setFormOpen} existing={editing} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete expense?"
        description={`This will permanently remove this ${money(deleteTarget?.amount)} expense record.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage all company expenses.
          </p>
        </div>
        <Button
          className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
          onClick={openCreate}
        >
          <Plus />
          Add Expense
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          title="Total Expenses"
          value={String(meta?.total ?? rows.length)}
          caption="All expense records"
          icon={Receipt}
          tone="text-blue-100"
          gradient="from-blue-600 via-indigo-600 to-violet-600"
        />

        <StatCard
          title="Total Amount"
          value={money(totalAmount)}
          caption="Sum on this page"
          icon={CircleDollarSign}
          tone="text-rose-100"
          gradient="from-rose-500 via-pink-600 to-fuchsia-600"
        />
      </div>

      <Card className="bg-slate-100 dark:bg-slate-950 p-0">
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="pt-5 pb-2 px-4 flex flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 w-5 h-5 top-1.5 text-muted-foreground" />
                <Input
                  className="pl-9 py-2"
                  placeholder="Search by description, reference..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Select
                value={categoryId}
                onValueChange={(value) => {
                  setCategoryId(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categoriesQuery.data?.data.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={financialAccountId}
                onValueChange={(value) => {
                  setFinancialAccountId(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Accounts</SelectItem>
                  {accountsQuery.data?.data.map((account) => (
                    <SelectItem key={account._id} value={account._id}>
                      {account.accountName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full lg:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Date filter */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <label htmlFor="expense-start-date" className="text-xs font-medium text-muted-foreground">
                    From
                  </label>
                  <Input
                    id="expense-start-date"
                    type="date"
                    className="w-full sm:w-40"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="expense-end-date" className="text-xs font-medium text-muted-foreground">
                    To
                  </label>
                  <Input
                    id="expense-end-date"
                    type="date"
                    className="w-full sm:w-40"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                {hasDateFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit cursor-pointer"
                    onClick={clearDates}
                  >
                    <X />
                    Clear dates
                  </Button>
                )}
              </div>
            </div>


          </div>

          {list.isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {list.error instanceof Error ? list.error.message : "Unable to load expenses."}
            </div>
          ) : list.isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
              <Receipt className="text-muted-foreground" />
              <div>
                <p className="font-medium">No expenses found</p>
                <p className="text-sm text-muted-foreground">
                  Try changing filters or search terms.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategoryId("ALL");
                  setFinancialAccountId("ALL");
                  setStartDate("");
                  setEndDate("");
                  setPage(1);
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-sm">
                <thead>
                  <tr className="hover:bg-cyan-800 *:text-white bg-indigo-600 rounded-xl border-b text-left text-xs">
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium">Description</th>
                    <th className="p-3 font-medium">Category</th>
                    <th className="p-3 font-medium">Account</th>
                    <th className="p-3 font-medium">Amount</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((expense) => (
                    <tr key={expense._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 text-muted-foreground">
                        {/* {new Date(expense.expenseDate).toLocaleDateString()} */}
                          {formatDate(expense.expenseDate)}
                      </td>
                      <td className="p-3">
                        <p className="font-medium">{expense.description || "—"}</p>
                        {expense.reference && (
                          <p className="text-xs text-muted-foreground">Ref: {expense.reference}</p>
                        )}
                      </td>
                      <td className="p-3">{nameOf(expense.categoryId, "name")}</td>
                      <td className="p-3">{nameOf(expense.financialAccountId, "accountName")}</td>
                      <td className="p-3 font-medium">{money(expense.amount)}</td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(expense)}
                            aria-label="Edit expense"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setDeleteTarget(expense)}
                            aria-label="Delete expense"
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
              {Math.min(page * limit, meta?.total ?? rows.length)} of{" "}
              {meta?.total ?? rows.length} results
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

export default ExpensePageClient;