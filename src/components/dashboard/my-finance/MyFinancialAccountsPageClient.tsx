"use client";

import { ArrowDownRight, Landmark, Wallet, WalletCards } from "lucide-react";

import { useFinancialAccounts } from "@/features/financial-account/hooks/use-financial-account";
import { AccountBalanceGrid } from "@/components/dashboard/financial-account/financial-account-page-client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "./finance-format";
import { FinanceStatCard } from "./FinanceStatCard";

/**
 * Financial accounts assigned to the logged-in user, shown with the same card
 * design as the admin Financial Accounts page. The API limits every user,
 * admins included, to the accounts they own.
 */
export function MyFinancialAccountsPageClient() {
  const { data, isLoading, isError } = useFinancialAccounts({ limit: 100 });

  const accounts = data?.data ?? [];
  const totalBalance = accounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const totalOpening = accounts.reduce((sum, account) => sum + account.openingBalance, 0);
  const totalSpent = totalOpening - totalBalance;
  const activeCount = accounts.filter((account) => account.status === "ACTIVE").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financial Accounts</h1>
        <p className="text-sm text-muted-foreground">
          The accounts assigned to you. Expenses you add are paid from these accounts.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FinanceStatCard
          title="Total Balance"
          value={formatMoney(totalBalance)}
          caption="Across all your accounts"
          icon={Wallet}
          tone="text-emerald-100"
          gradient="from-emerald-500 via-teal-600 to-cyan-700"
        />
        <FinanceStatCard
          title="Opening Balance"
          value={formatMoney(totalOpening)}
          caption="Total at the start"
          icon={Landmark}
          tone="text-blue-100"
          gradient="from-blue-600 via-indigo-600 to-violet-600"
        />
        <FinanceStatCard
          title="Total Spent"
          value={formatMoney(totalSpent)}
          caption="Opening minus current balance"
          icon={ArrowDownRight}
          tone="text-rose-100"
          gradient="from-rose-500 via-pink-600 to-fuchsia-600"
        />
        <FinanceStatCard
          title="Accounts"
          value={String(accounts.length)}
          caption={`${activeCount} active`}
          icon={WalletCards}
          tone="text-violet-100"
          gradient="from-violet-600 via-purple-600 to-fuchsia-700"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600 dark:text-red-400">Could not load your accounts.</p>
      ) : accounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
            <Wallet className="h-10 w-10 opacity-50" />
            <p className="font-medium text-foreground">No financial account is assigned to you yet.</p>
            <p>Ask an administrator to assign one.</p>
          </CardContent>
        </Card>
      ) : (
        <AccountBalanceGrid accounts={accounts} />
      )}
    </div>
  );
}

export default MyFinancialAccountsPageClient;
