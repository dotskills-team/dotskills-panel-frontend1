"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Eye, MoreHorizontal, Pencil, Phone, RefreshCw, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/shared/TablePagination";
import { formatDate } from "@/lib/format";
import { ExpiryBadge, StatusBadge } from "./status-badges";
import {
  STATUS_OPTIONS,
} from "@/features/domain-hosting/constants/domain-hosting.constant";
import { useDomainHostingList } from "@/features/domain-hosting/hooks/use-domain-hosting";
import type {
  DomainHostingFilters,
  DomainRecord,
  HostingRecord,
  TargetRecord,
  TargetType,
} from "@/types/domain-hosting.types";

interface DomainHostingTableProps {
  type: TargetType;
  canWrite: boolean;
  onView: (record: TargetRecord) => void;
  onEdit: (record: TargetRecord) => void;
  onRenew: (record: TargetRecord) => void;
  onLogContact: (record: TargetRecord) => void;
  onDelete: (record: TargetRecord) => void;
}

const SORT_OPTIONS = [
  { value: "expiryDate", label: "Nearest expiry" },
  { value: "-expiryDate", label: "Farthest expiry" },
  { value: "clientName", label: "Client A–Z" },
  { value: "-createdAt", label: "Newest added" },
];

const PAGE_SIZE = 10;

const INITIAL_FILTERS: DomainHostingFilters = {
  page: 1,
  limit: PAGE_SIZE,
  status: "",
  provider: "",
  expiryFrom: "",
  expiryTo: "",
  sort: "expiryDate",
  searchTerm: "",
};

/** Primary label: the domain name, or the provider for hosting. */
const primaryLabel = (type: TargetType, record: TargetRecord) =>
  type === "domain" ? (record as DomainRecord).domainName : (record as HostingRecord).provider || "Hosting";

const secondaryLabel = (type: TargetType, record: TargetRecord) =>
  type === "domain" ? "" : (record as HostingRecord).planName || "";

const providerLabel = (type: TargetType, record: TargetRecord) =>
  type === "domain" ? (record as DomainRecord).registrar : (record as HostingRecord).provider;

export function DomainHostingTable({
  type,
  canWrite,
  onView,
  onEdit,
  onRenew,
  onLogContact,
  onDelete,
}: DomainHostingTableProps) {
  const [filters, setFilters] = useState<DomainHostingFilters>(INITIAL_FILTERS);
  const [searchInput, setSearchInput] = useState("");

  // Debounce the search box so typing does not fire a request per key
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters((prev) =>
        prev.searchTerm === searchInput.trim() ? prev : { ...prev, searchTerm: searchInput.trim(), page: 1 },
      );
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, isError, refetch } = useDomainHostingList(type, filters);

  const records = data?.data ?? [];
  const meta = data?.meta;
  const hasActiveFilters = Boolean(
    filters.searchTerm || filters.status || filters.provider || filters.expiryFrom || filters.expiryTo,
  );

  const updateFilter = (patch: Partial<DomainHostingFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));

  const resetFilters = () => {
    setSearchInput("");
    setFilters(INITIAL_FILTERS);
  };

  const providerPlaceholder = type === "domain" ? "Registrar" : "Provider";
  const columnCount = canWrite ? 7 : 6;

  return (
    <div className="space-y-4">
      {/* ------------------------------- Toolbar -------------------------------- */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <div className="relative xl:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search"
            placeholder={type === "domain" ? "Search domain, client, registrar" : "Search provider, plan, client, IP"}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filters.status || "all"} onValueChange={(value) => updateFilter({ status: value === "all" ? "" : (value as DomainHostingFilters["status"]) })}>
          <SelectTrigger aria-label="Filter by status" className="w-full">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          aria-label={`Filter by ${providerPlaceholder.toLowerCase()}`}
          placeholder={providerPlaceholder}
          value={filters.provider ?? ""}
          onChange={(event) => updateFilter({ provider: event.target.value })}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            aria-label="Expiry from"
            type="date"
            value={filters.expiryFrom ?? ""}
            onChange={(event) => updateFilter({ expiryFrom: event.target.value })}
          />
          <Input
            aria-label="Expiry to"
            type="date"
            value={filters.expiryTo ?? ""}
            onChange={(event) => updateFilter({ expiryTo: event.target.value })}
          />
        </div>

        <Select value={filters.sort ?? "expiryDate"} onValueChange={(value) => updateFilter({ sort: value })}>
          <SelectTrigger aria-label="Sort" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{meta ? `${meta.total} result${meta.total === 1 ? "" : "s"}` : ""}</span>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      )}

      {/* -------------------------------- Table --------------------------------- */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{type === "domain" ? "Domain" : "Hosting"}</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>{type === "domain" ? "Registrar" : "Provider"}</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Renewal</TableHead>
              {canWrite && <TableHead className="w-12 text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody className={isFetching && !isLoading ? "opacity-60" : undefined}>
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={columnCount}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && isError && (
              <TableRow>
                <TableCell colSpan={columnCount} className="py-10 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <p className="text-sm text-destructive">Failed to load records.</p>
                    <Button size="sm" onClick={() => refetch()}>
                      Try again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && records.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnCount} className="py-10 text-center text-sm text-muted-foreground">
                  {hasActiveFilters
                    ? "No records match these filters."
                    : type === "domain"
                      ? "No domains yet. Add the first one to start tracking renewals."
                      : "No hosting records yet. Add the first one to start tracking renewals."}
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              records.map((record) => {
                const secondary = secondaryLabel(type, record);
                return (
                  <TableRow key={record._id} className="cursor-pointer" onClick={() => onView(record)}>
                    <TableCell className="max-w-56">
                      <p className="truncate font-medium">{primaryLabel(type, record)}</p>
                      {secondary && <p className="truncate text-xs text-muted-foreground">{secondary}</p>}
                    </TableCell>
                    <TableCell className="max-w-44 truncate">{record.clientName || "—"}</TableCell>
                    <TableCell className="max-w-40 truncate">{providerLabel(type, record) || "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm">{formatDate(record.expiryDate)}</span>
                        <ExpiryBadge daysLeft={record.daysLeft} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right text-sm">
                      {record.renewalPrice !== undefined ? `${record.currency} ${record.renewalPrice.toLocaleString()}` : "—"}
                      {record.paidBy === "client" && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          Client pays
                        </Badge>
                      )}
                    </TableCell>

                    {canWrite && (
                      <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Row actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(record)}>
                              <Eye className="h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(record)}>
                              <Pencil className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRenew(record)}>
                              <RefreshCw className="h-4 w-4" />
                              Renew
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onLogContact(record)}>
                              <Phone className="h-4 w-4" />
                              Log client contact
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => onDelete(record)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {/* ------------------------------ Pagination ------------------------------ */}
      {meta && meta.totalPage > 1 && (
        <TablePagination
          currentPage={meta.page}
          totalPages={meta.totalPage}
          isPending={isFetching}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
}
