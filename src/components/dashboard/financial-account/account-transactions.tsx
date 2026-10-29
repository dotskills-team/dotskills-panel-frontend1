"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { useTransactions } from "@/features/financial-account/hooks/use-ledger";
import type { TransactionType } from "@/types/financial-account.types";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const money = (v?: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(v ?? 0);

const TYPE_LABEL: Record<TransactionType, string> = {
  DEPOSIT: "Deposit",
  LOAN_RECEIVED: "Loan received",
  LOAN_REPAYMENT: "Loan repayment",
  TRANSFER_IN: "Transfer in",
  TRANSFER_OUT: "Transfer out",
  SALARY: "Salary",
  EXPENSE: "Expense",
  PROJECT_PAYMENT: "Project payment",
};

export function AccountTransactions({ accountId }: { accountId: string }) {
  const [page, setPage] = useState(1);
  const query = useTransactions(
    { accountId, page, limit: 10, sort: "-date,-createdAt" },
    { enabled: Boolean(accountId) },
  );

  const rows = query.data?.data ?? [];
  const meta = query.data?.meta;

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/40 px-4 py-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Transaction History
        </h3>
      </div>

      {query.isLoading ? (
        <p className="px-4 py-3 text-sm text-muted-foreground">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="px-4 py-3 text-sm text-muted-foreground">
          No transactions recorded yet.
        </p>
      ) : (
        <ul className="divide-y">
          {rows.map((t) => {
            const isIn = t.direction === "IN";
            return (
              <li key={t._id} className="flex items-start gap-3 px-4 py-3 text-sm">
                <div
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                    isIn
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950"
                      : "bg-red-50 text-red-600 dark:bg-red-950",
                  )}
                >
                  {isIn ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{TYPE_LABEL[t.type] ?? t.type}</p>
                    {t.isReversal && (
                      <Badge variant="outline" className="text-[10px]">
                        Reversal
                      </Badge>
                    )}
                  </div>
                  {t.note && (
                    <p className="truncate text-xs text-muted-foreground">{t.note}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className={cn("font-semibold", isIn ? "text-emerald-600" : "text-red-600")}>
                    {isIn ? "+" : "-"}
                    {money(t.amount)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Balance {money(t.balanceAfter)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          <span className="text-xs text-muted-foreground">
            {page} / {meta.totalPage}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= meta.totalPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}

export default AccountTransactions;