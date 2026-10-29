"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_PAGE_SIZES } from "@/features/leads/constants/lead.constant";

interface LeadsPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function LeadsPagination({
  page,
  limit,
  total,
  totalPage,
  onPageChange,
  onLimitChange,
}: LeadsPaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start} to {end} of {total} results
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="min-w-8 rounded-md bg-primary px-2.5 py-1 text-center text-sm font-medium text-primary-foreground">
            {page}
          </span>

          <span className="text-sm text-muted-foreground">of {totalPage || 1}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page >= totalPage}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
