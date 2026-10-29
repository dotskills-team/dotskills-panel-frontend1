"use client";

import type { ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building2,
  CalendarClock,
  FileText,
  Landmark,
  Mail,
  Pencil,
  Smartphone,
  User,
  Wallet,
} from "lucide-react";

import {
  ACCOUNT_TYPE_OPTIONS,
  PROVIDER_OPTIONS,
} from "@/features/financial-account/constants/financial-account.constant";
import type { IFinancialAccount } from "@/types/financial-account.types";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AccountTransactions } from "./account-transactions";
interface FinancialAccountDetailsSheetProps {
  account: IFinancialAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (account: IFinancialAccount) => void;
}

/* -------------------------------- Helpers --------------------------------- */

const formatMoney = (value?: number, currency = "BDT") =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency }).format(value ?? 0);

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const getOwner = (owner: IFinancialAccount["ownerId"]) => {
  if (!owner) return null;
  if (typeof owner === "string") return { name: owner };
  return {
    name: `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim() || "—",
    email: owner.email,
    designation: (owner as { designation?: string }).designation,
  };
};

const getTheme = (accountType: string) => {
  const type = accountType.toUpperCase();

  if (type.includes("BANK")) {
    return { Icon: Building2, tone: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300" };
  }
  if (type.includes("MOBILE")) {
    return { Icon: Smartphone, tone: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300" };
  }
  if (type.includes("CASH")) {
    return { Icon: Banknote, tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" };
  }
  return { Icon: Wallet, tone: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" };
};

/* ------------------------------ UI Building Blocks ------------------------- */

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Landmark;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
        <Icon className="size-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      </div>
      <dl className="divide-y">{children}</dl>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 px-4 py-3 text-sm">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium">{children}</dd>
    </div>
  );
}

function BalanceTile({
  label,
  value,
  className,
  icon: Icon,
}: {
  label: string;
  value: string;
  className?: string;
  icon?: typeof Wallet;
}) {
  return (
    <div className={cn("rounded-xl border p-3.5", className)}>
      <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
        {Icon && <Icon className="size-3" />}
        {label}
      </p>
      <p className="mt-1 truncate text-base font-semibold tracking-tight">{value}</p>
    </div>
  );
}

/* --------------------------------- Component ------------------------------- */

export function FinancialAccountDetailsSheet({
  account,
  open,
  onOpenChange,
  onEdit,
}: FinancialAccountDetailsSheetProps) {
  const theme = account ? getTheme(String(account.accountType)) : null;
  const owner = account ? getOwner(account.ownerId) : null;

  const typeLabel = account
    ? (ACCOUNT_TYPE_OPTIONS.find((o) => o.value === account.accountType)?.label ??
      account.accountType)
    : "";

  const providerLabel = account?.providerName
    ? (PROVIDER_OPTIONS.find((o) => o.value === account.providerName)?.label ??
      account.providerName)
    : null;

  const netChange = account ? account.currentBalance - account.openingBalance : 0;
  const isPositive = netChange >= 0;
  const isActive = account?.status === "ACTIVE";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-dvh w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Account Details</SheetTitle>
          <SheetDescription>Financial account information</SheetDescription>
        </SheetHeader>

        {account && theme && (
          <>
            {/* ------------------------ Fixed Header ------------------------ */}
            <div className="shrink-0 border-b bg-background px-5 pb-4 pt-5">
              <div className="flex items-start gap-3 pr-8">
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl",
                    theme.tone,
                  )}
                >
                  <theme.Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-semibold leading-tight">
                    {account.accountName}
                  </h2>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {typeLabel}
                    {providerLabel ? ` · ${providerLabel}` : ""}
                    {account.accountNumber ? ` · ${account.accountNumber}` : ""}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0",
                    isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                      : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
                  )}
                >
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* ------------------------ Scrollable Body ---------------------- */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="flex flex-col gap-4 p-5">
                {/* Balance summary */}
                <div className="grid grid-cols-2 gap-3">
                  <BalanceTile
                    label="Current Balance"
                    value={formatMoney(account.currentBalance, account.currency)}
                    className="col-span-2 border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/40 [&_p:last-child]:text-2xl"
                  />
                  <BalanceTile
                    label="Opening Balance"
                    value={formatMoney(account.openingBalance, account.currency)}
                    className="bg-card"
                  />
                  <BalanceTile
                    label="Net Change"
                    value={`${isPositive ? "+" : ""}${formatMoney(netChange, account.currency)}`}
                    icon={isPositive ? ArrowUpRight : ArrowDownRight}
                    className={
                      isPositive
                        ? "border-emerald-200 bg-emerald-50/60 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-red-200 bg-red-50/60 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    }
                  />
                </div>

                <Section title="Account Information" icon={Landmark}>
                  <Row label="Account Name">{account.accountName}</Row>
                  <Row label="Account Type">{typeLabel}</Row>
                  {providerLabel && <Row label="Provider">{providerLabel}</Row>}
                  <Row label="Account Number">{account.accountNumber || "—"}</Row>
                  <Row label="Account Holder">{account.accountHolderName || "—"}</Row>
                  <Row label="Currency">{account.currency}</Row>
                </Section>

                {(account.bankName || account.branchName) && (
                  <Section title="Bank Information" icon={Building2}>
                    <Row label="Bank Name">{account.bankName || "—"}</Row>
                    <Row label="Branch">{account.branchName || "—"}</Row>
                  </Section>
                )}

                <Section title="Responsible Person" icon={User}>
                  {owner ? (
                    <>
                      <Row label="Name">{owner.name}</Row>
                      {owner.designation && <Row label="Designation">{owner.designation}</Row>}
                      {owner.email && (
                        <Row label="Email">
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="size-3.5 text-muted-foreground" />
                            {owner.email}
                          </span>
                        </Row>
                      )}
                    </>
                  ) : (
                    <p className="px-4 py-3 text-sm text-muted-foreground">
                      No owner assigned.
                    </p>
                  )}
                </Section>

                {account.description && (
                  <Section title="Description" icon={FileText}>
                    <p className="whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                      {account.description}
                    </p>
                  </Section>
                )}

                <Section title="Activity" icon={CalendarClock}>
                  <Row label="Created">{formatDateTime(account.createdAt)}</Row>
                  <Row label="Last Updated">{formatDateTime(account.updatedAt)}</Row>
                </Section>
                                <AccountTransactions accountId={account._id} />
              </div>
            </div>

            {/* ------------------------ Fixed Footer ------------------------- */}
            <div className="flex shrink-0 gap-2 border-t bg-background p-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                className="flex-1 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(account);
                }}
              >
                <Pencil className="size-4" />
                Edit Account
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default FinancialAccountDetailsSheet;