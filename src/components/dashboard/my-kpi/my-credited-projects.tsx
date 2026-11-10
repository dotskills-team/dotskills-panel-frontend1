"use client";

import { FolderKanban } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMonthLabel } from "@/features/kpi/utils/kpi.utils";
import { formatDate } from "@/lib/format";
import type { KpiMyProject } from "@/types/kpi.types";

interface MyCreditedProjectsProps {
  month: string;
  projects: KpiMyProject[];
}

/** The projects credited to the member this month. There is intentionally no value column. */
export function MyCreditedProjects({ month, projects }: MyCreditedProjectsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Credited projects</CardTitle>
        <Badge variant="secondary">{projects.length}</Badge>
      </CardHeader>

      <CardContent className="p-0">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <FolderKanban className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No projects credited in {formatMonthLabel(month)}</p>
            <p className="text-xs text-muted-foreground">
              Projects appear here when a client credited to you gets a new project.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project._id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.clientName || "—"}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(project.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
