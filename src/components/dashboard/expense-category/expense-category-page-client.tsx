"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  FolderKanban,
  Pencil,
  Plus,
  Search,
  Tags,
  Trash,
} from "lucide-react";

import {
  useDeleteExpenseCategory,
  useExpenseCategories,
} from "@/features/expense-category/hooks/use-expense-category";
import {
  CATEGORY_STATUS_OPTIONS,
  EXPENSE_CATEGORY_SORT_OPTIONS,
} from "@/features/expense-category/constants/expense-category.constant";
import type { IExpenseCategory } from "@/types/expense-category.types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ExpenseCategoryFormDialog } from "./expense-category-form-dialog";

// function StatCard({
//   title,
//   value,
//   caption,
//   icon: Icon,
//   tone,
// }: {
//   title: string;
//   value: string;
//   caption: string;
//   icon: typeof Tags;
//   tone: string;
// }) {
//   return (
//     <Card className="rounded-xl border-0 bg-gray-100 dark:bg-slate-900 ease-in-out duration-500 transform hover:bg-slate-950 hover:scale-105 shadow-sm overflow-hidden transition-shadow hover:-translate-y-0.5 hover:shadow-md">
//       <CardContent className="flex items-center gap-3 p-4">
//         <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", tone)}>
//           <Icon />
//         </div>
//         <div className="min-w-0">
//           <p className="text-xs text-muted-foreground">{title}</p>
//           <p className="mt-1 text-lg font-semibold tracking-tight">{value}</p>
//           <p className="truncate text-xs text-muted-foreground">{caption}</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
function StatCard({
  title,
  value,
  caption,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  caption: string;
  icon: typeof Tags;
  tone: string;
}) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border-0 shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        tone,
      )}
    >
      <CardContent className="relative flex items-center gap-4 p-5">
        {/* Decorative background */}
        <div className="absolute -right-8 -top-8 size-24 rounded-full bg-white/20 blur-2xl transition-transform duration-500 group-hover:scale-150" />

        {/* Icon */}
        <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-sm backdrop-blur-sm">
          <Icon className="size-6" strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="relative min-w-0 text-white">
          <p className="text-xs font-medium text-white/80">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight">
            {value}
          </p>

          <p className="mt-0.5 truncate text-xs text-white/75">
            {caption}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
export function ExpenseCategoryPageClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IExpenseCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IExpenseCategory | null>(null);

  const query = useMemo(
    () => ({
      page,
      limit,
      searchTerm: search || undefined,
      status: status === "ALL" ? undefined : (status as never),
      sort,
    }),
    [page, limit, search, status, sort],
  );

  const list = useExpenseCategories(query);
  const deleteMutation = useDeleteExpenseCategory();

  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;
  const activeCount = rows.filter((row) => row.status === "ACTIVE").length;

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (category: IExpenseCategory) => {
    setEditing(category);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync({ id: deleteTarget._id });
      toast.success("Expense category deleted successfully.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete expense category.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ExpenseCategoryFormDialog open={formOpen} onOpenChange={setFormOpen} existing={editing} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete expense category?"
        description={`This will permanently remove "${deleteTarget?.name}". Expenses already using this category will keep the reference.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expense Categories</h1>
          <p className="text-sm text-muted-foreground">
            Organize expenses by category for better reporting.
          </p>
        </div>
        <Button
          className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
          onClick={openCreate}
        >
          <Plus />
          Add Category
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
        <StatCard
          title="Total Categories"
          value={String(meta?.total ?? rows.length)}
          caption="All expense categories"
          icon={FolderKanban}
          tone="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500"
        />

        <StatCard
          title="Active Categories"
          value={String(activeCount)}
          caption="Currently active"
          icon={Tags}
          tone="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500"
        />
      </div>

      <Card className="bg-slate-100 dark:bg-slate-950 p-0">
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="pt-5 pb-2 px-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 w-5 h-5 top-1.5 text-muted-foreground" />
              <Input
                className="pl-9 py-2"
                placeholder="Search by category name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                {CATEGORY_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORY_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {list.isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {list.error instanceof Error ? list.error.message : "Unable to load categories."}
            </div>
          ) : list.isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
              <FolderKanban className="text-muted-foreground" />
              <div>
                <p className="font-medium">No expense categories found</p>
                <p className="text-sm text-muted-foreground">
                  Try changing filters or search terms.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setStatus("ALL");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150 text-sm">
                <thead>
                  <tr className="hover:bg-cyan-800 *:text-white bg-indigo-600 rounded-xl border-b text-left text-xs">
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Description</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((category) => (
                    <tr key={category._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium">{category.name}</td>
                      <td className="p-3 text-muted-foreground max-w-80 truncate">
                        {category.description || "—"}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={
                            category.status === "ACTIVE"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }
                        >
                          {category.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(category)}
                            aria-label="Edit category"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setDeleteTarget(category)}
                            aria-label="Delete category"
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

export default ExpenseCategoryPageClient;