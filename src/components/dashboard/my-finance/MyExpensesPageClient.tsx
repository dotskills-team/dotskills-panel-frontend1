"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Eye,
  Landmark,
  Pencil,
  Plus,
  Receipt,
  Tag,
  TrendingUp,
} from "lucide-react";

import { useExpenseSummary, useExpenses } from "@/features/expense/hooks/use-expense";
import { useFinancialAccounts } from "@/features/financial-account/hooks/use-financial-account";
import type { IExpense } from "@/types/expense.types";
import { formatDate } from "@/utils/dateFormat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseFormDialog } from "@/components/dashboard/expense/expense-form-dialog";
import { ExpenseDetailsDialog } from "@/components/dashboard/expense/expense-details-dialog";
import { accountNameOf, categoryNameOf, formatMoney } from "./finance-format";
import { FinanceStatCard } from "./FinanceStatCard";
import type { DashboardRangeParams } from "@/types/dashboard.types";
import {
  DateRangeFilter,
  presetRange,
  type RangePreset,
} from "@/components/dashboard/overview/DateRangeFilter";

const PAGE_SIZE = 10;

/**
 * Expenses the logged-in user has recorded, with totals for their own expenses.
 * `mine: "true"` keeps the list and stats to the caller's rows, including for admins.
 */
export function MyExpensesPageClient() {
  const [page, setPage] = useState(1);
  const [datePreset, setDatePreset] = useState<RangePreset>("all");
  const [customDates, setCustomDates] = useState<DashboardRangeParams>({});
  const dateRange = useMemo<DashboardRangeParams>(
    () => (datePreset === "custom" ? customDates : presetRange(datePreset)),
    [datePreset, customDates],
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IExpense | null>(null);
  const [viewing, setViewing] = useState<IExpense | null>(null);

  const dates = { startDate: dateRange.startDate || undefined, endDate: dateRange.endDate || undefined };
  const list = useExpenses({ page, limit: PAGE_SIZE, sort: "-expenseDate", mine: "true", ...dates });
  const summary = useExpenseSummary({ mine: "true", ...dates });
  const accounts = useFinancialAccounts({ limit: 100, status: "ACTIVE" as never });

  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;
  const stats = summary.data?.data;
  const hasAccount = (accounts.data?.data.length ?? 0) > 0;
  const topCategories = stats?.topCategories ?? [];
  const topTotal = topCategories.reduce((sum, c) => sum + c.amount, 0);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (expense: IExpense) => {
    setEditing(expense);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Expenses you record are paid from your own financial account.
          </p>
        </div>
        <Button
          onClick={openCreate}
          disabled={!hasAccount}
          className="cursor-pointer bg-indigo-600 text-white transition hover:scale-[1.02] hover:bg-indigo-500"
        >
          <Plus />
          Add Expense
        </Button>
      </div>

      {accounts.isSuccess && !hasAccount && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          You don&apos;t have a financial account yet, so you can&apos;t add expenses. Ask an administrator to assign one to you.
        </div>
      )}

      <DateRangeFilter
        preset={datePreset}
        showAll
        onPresetChange={(next) => {
          setDatePreset(next);
          setPage(1);
        }}
        custom={customDates}
        onCustomChange={(next) => {
          setCustomDates(next);
          setPage(1);
        }}
      />

      {/* Stats: same design as the admin Expenses page */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <FinanceStatCard
          title="Total Spent"
          value={formatMoney(stats?.totalAmount)}
          caption={`${stats?.totalCount ?? 0} expenses recorded`}
          icon={CircleDollarSign}
          tone="text-rose-100"
          gradient="from-rose-500 via-pink-600 to-fuchsia-600"
        />
        <FinanceStatCard
          title="This Month"
          value={formatMoney(stats?.thisMonthAmount)}
          caption={`${stats?.thisMonthCount ?? 0} expenses this month`}
          icon={CalendarDays}
          tone="text-amber-100"
          gradient="from-amber-500 via-orange-500 to-red-500"
        />
        <FinanceStatCard
          title="Average Expense"
          value={formatMoney(stats?.averageAmount)}
          caption="Per expense recorded"
          icon={BarChart3}
          tone="text-blue-100"
          gradient="from-blue-600 via-indigo-600 to-violet-600"
        />
        <FinanceStatCard
          title="Largest Expense"
          value={formatMoney(stats?.largestAmount)}
          caption={stats?.latestExpenseDate ? `Latest on ${formatDate(stats.latestExpenseDate)}` : "No expenses yet"}
          icon={TrendingUp}
          tone="text-violet-100"
          gradient="from-violet-600 via-purple-600 to-fuchsia-700"
        />
        <FinanceStatCard
          title="Accounts Used"
          value={String(stats?.accountsUsed ?? 0)}
          caption="Financial accounts you paid from"
          icon={Landmark}
          tone="text-emerald-100"
          gradient="from-emerald-500 via-teal-600 to-cyan-700"
        />
        <FinanceStatCard
          title="Top Category"
          value={topCategories[0]?.name ?? "—"}
          caption={topCategories[0] ? `${formatMoney(topCategories[0].amount)} spent` : "No category data yet"}
          icon={Tag}
          tone="text-sky-100"
          gradient="from-sky-500 via-blue-600 to-indigo-700"
        />
      </div>

      {topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Where your money goes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCategories.map((category) => {
              const share = topTotal ? Math.round((category.amount / topTotal) * 100) : 0;
              return (
                <div key={category._id} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">
                      {formatMoney(category.amount)} · {category.count} · {share}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-rose-500 to-fuchsia-600"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-100 p-0 dark:bg-slate-950">
        <CardContent className="p-0">
          {list.isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading expenses…</div>
          ) : list.isError ? (
            <div className="p-6 text-sm text-red-600 dark:text-red-400">Could not load your expenses.</div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-10 text-center text-sm text-muted-foreground">
              <Receipt className="h-8 w-8 opacity-50" />
              <p>No expenses recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150 text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-left text-xs text-white">
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
                    <tr
                      key={expense._id}
                      onClick={() => setViewing(expense)}
                      className="cursor-pointer border-b bg-white last:border-0 hover:bg-muted/30 dark:bg-transparent"
                    >
                      <td className="p-3 text-muted-foreground">{formatDate(expense.expenseDate)}</td>
                      <td className="p-3">
                        <p className="font-medium">{expense.description || "—"}</p>
                        {expense.reference && (
                          <p className="text-xs text-muted-foreground">Ref: {expense.reference}</p>
                        )}
                      </td>
                      <td className="p-3">{categoryNameOf(expense)}</td>
                      <td className="p-3">{accountNameOf(expense)}</td>
                      <td className="p-3 font-semibold text-rose-600 dark:text-rose-400">
                        {formatMoney(expense.amount)}
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => setViewing(expense)} aria-label="View expense">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(expense)} aria-label="Edit expense">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground">
              <span>
                Page {meta.page} of {meta.totalPage} · {meta.total} expenses
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ExpenseFormDialog open={formOpen} onOpenChange={setFormOpen} existing={editing} />
      <ExpenseDetailsDialog
        expense={viewing}
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewing(null)}
      />
    </div>
  );
}

export default MyExpensesPageClient;
