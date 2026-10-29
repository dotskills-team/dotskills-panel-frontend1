
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Plus, Search, Trash2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { PaymentStatus } from "@/types/project.types";
// import type { ProjectFilters } from "@/types/project.types";
// import type { IClient } from "@/types/clients";
// import {
//   PROJECT_STATUS_OPTIONS,
//   PROJECT_TYPE_OPTIONS,
// } from "@/features/project/constants/project.constants";

// interface ProjectsToolbarProps {
//   filters: ProjectFilters;
//   clients?: IClient[];
//   onSearchChange: (value: string) => void;
//   onUpdateFilters: (patch: Partial<ProjectFilters>) => void;
//   onAddProject: () => void;
// }

// const ALL = "__all__";

// const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
//   { value: PaymentStatus.DUE, label: "Due" },
//   { value: PaymentStatus.PARTIAL, label: "Partial" },
//   { value: PaymentStatus.ADVANCED, label: "Advanced" },
//   { value: PaymentStatus.COMPLETE, label: "Complete" },
// ];

// // Adjust to match the fields available on IClient
// const getClientLabel = (client: IClient): string => {
//   const c = client as IClient & {
//     fullName?: string;
//     name?: string;
//     firstName?: string;
//     lastName?: string;
//     email?: string;
//   };

//   return (
//     c.fullName ||
//     c.name ||
//     [c.firstName, c.lastName].filter(Boolean).join(" ") ||
//     c.email ||
//     "Unnamed client"
//   );
// };

// export function ProjectsToolbar({
//   filters,
//   clients = [],
//   onSearchChange,
//   onUpdateFilters,
//   onAddProject,
// }: ProjectsToolbarProps) {
//   const [search, setSearch] = useState(filters.searchTerm ?? "");

//   return (
//     <div className="flex flex-col gap-3">
//       {/* Row 1: date filter + trash/add project actions */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-2">
//           <Input
//             type="date"
//             className="w-full sm:w-36"
//             value={filters.startDate ?? ""}
//             onChange={(e) =>
//               onUpdateFilters({ startDate: e.target.value || undefined })
//             }
//           />
//           <span className="text-sm text-muted-foreground">to</span>
//           <Input
//             type="date"
//             className="w-full sm:w-36"
//             value={filters.endDate ?? ""}
//             onChange={(e) =>
//               onUpdateFilters({ endDate: e.target.value || undefined })
//             }
//           />
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//           <Button
//             variant="default"
//             size="sm"
//             className="gap-2 text-white bg-red-600 transition-transform duration-500 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-rose-800"
//             asChild
//           >
//             <Link href="/dashboard/project/trash">
//               <Trash2 className="h-4 w-4" />
//               Trash
//             </Link>
//           </Button>
//           <Button
//             onClick={onAddProject}
//             variant="default"
//             className="gap-2 text-white bg-indigo-600 transition-transform duration-500 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-cyan-800"
//           >
//             <Plus className="h-4 w-4" />
//             Add Project
//           </Button>
//         </div>
//       </div>

//       {/* Row 2: search + client/status/type/payment filters */}
//       <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
//         <div className="relative w-full sm:max-w-sm">
//           <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             value={search}
//             placeholder="Search projects by name or client..."
//             className="pl-9"
//             onChange={(event) => {
//               setSearch(event.target.value);
//               onSearchChange(event.target.value);
//             }}
//           />
//         </div>

//         <Select
//           value={filters.client ?? ALL}
//           onValueChange={(value) =>
//             onUpdateFilters({
//               client: value === ALL ? undefined : value,
//             })
//           }
//         >
//           <SelectTrigger className="w-full sm:w-48">
//             <SelectValue placeholder="Client" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value={ALL}>All Clients</SelectItem>
//             {clients.map((client) => (
//               <SelectItem key={client._id} value={client._id}>
//                 {getClientLabel(client)}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Select
//           value={filters.status ?? ALL}
//           onValueChange={(value) =>
//             onUpdateFilters({
//               status:
//                 value === ALL
//                   ? undefined
//                   : (value as ProjectFilters["status"]),
//             })
//           }
//         >
//           <SelectTrigger className="w-full sm:w-40">
//             <SelectValue placeholder="Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value={ALL}>All Statuses</SelectItem>
//             {PROJECT_STATUS_OPTIONS.map((option) => (
//               <SelectItem key={option.value} value={option.value}>
//                 {option.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Select
//           value={filters.type ?? ALL}
//           onValueChange={(value) =>
//             onUpdateFilters({
//               type:
//                 value === ALL
//                   ? undefined
//                   : (value as ProjectFilters["type"]),
//             })
//           }
//         >
//           <SelectTrigger className="w-full sm:w-40">
//             <SelectValue placeholder="Type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value={ALL}>All Types</SelectItem>
//             {PROJECT_TYPE_OPTIONS.map((option) => (
//               <SelectItem key={option.value} value={option.value}>
//                 {option.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Select
//           value={filters.paymentStatus ?? ALL}
//           onValueChange={(value) =>
//             onUpdateFilters({
//               paymentStatus:
//                 value === ALL ? undefined : (value as PaymentStatus),
//             })
//           }
//         >
//           <SelectTrigger className="w-full sm:w-44">
//             <SelectValue placeholder="Payment" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value={ALL}>All Payments</SelectItem>
//             {PAYMENT_STATUS_OPTIONS.map((option) => (
//               <SelectItem key={option.value} value={option.value}>
//                 {option.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PaymentStatus } from "@/types/project.types";
import type { ProjectFilters } from "@/types/project.types";
import type { IClient } from "@/types/clients";
import {
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from "@/features/project/constants/project.constants";

interface ProjectsToolbarProps {
  filters: ProjectFilters;
  clients?: IClient[];
  canCreate?: boolean;
  canViewFinancials?: boolean;
  onSearchChange: (value: string) => void;
  onUpdateFilters: (patch: Partial<ProjectFilters>) => void;
  onAddProject: () => void;
}

const ALL = "__all__";

const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: PaymentStatus.DUE, label: "Due" },
  { value: PaymentStatus.PARTIAL, label: "Partial" },
  { value: PaymentStatus.ADVANCED, label: "Advanced" },
  { value: PaymentStatus.COMPLETE, label: "Complete" },
];

// Adjust to match the fields available on IClient
const getClientLabel = (client: IClient): string => {
  const c = client as IClient & {
    fullName?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  return (
    c.fullName ||
    c.name ||
    [c.firstName, c.lastName].filter(Boolean).join(" ") ||
    c.email ||
    "Unnamed client"
  );
};

export function ProjectsToolbar({
  filters,
  clients = [],
  canCreate = true,
  canViewFinancials = true,
  onSearchChange,
  onUpdateFilters,
  onAddProject,
}: ProjectsToolbarProps) {
  const [search, setSearch] = useState(filters.searchTerm ?? "");

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: date filter + trash/add project actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="w-full sm:w-36"
            value={filters.startDate ?? ""}
            onChange={(e) =>
              onUpdateFilters({ startDate: e.target.value || undefined })
            }
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="date"
            className="w-full sm:w-36"
            value={filters.endDate ?? ""}
            onChange={(e) =>
              onUpdateFilters({ endDate: e.target.value || undefined })
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="default"
            size="sm"
            className="gap-2 text-white bg-red-600 transition-transform duration-500 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-rose-800"
            asChild
          >
            <Link href="/dashboard/project/trash">
              <Trash2 className="h-4 w-4" />
              Trash
            </Link>
          </Button>

          {canCreate && (
            <Button
              onClick={onAddProject}
              variant="default"
              className="gap-2 text-white bg-indigo-600 transition-transform duration-500 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-cyan-800"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          )}
        </div>
      </div>

      {/* Row 2: search + client/status/type/payment filters */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            placeholder="Search projects by name or client..."
            className="pl-9"
            onChange={(event) => {
              setSearch(event.target.value);
              onSearchChange(event.target.value);
            }}
          />
        </div>

        <Select
          value={filters.client ?? ALL}
          onValueChange={(value) =>
            onUpdateFilters({
              client: value === ALL ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Clients</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client._id} value={client._id}>
                {getClientLabel(client)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? ALL}
          onValueChange={(value) =>
            onUpdateFilters({
              status:
                value === ALL
                  ? undefined
                  : (value as ProjectFilters["status"]),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Statuses</SelectItem>
            {PROJECT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.type ?? ALL}
          onValueChange={(value) =>
            onUpdateFilters({
              type:
                value === ALL
                  ? undefined
                  : (value as ProjectFilters["type"]),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Types</SelectItem>
            {PROJECT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canViewFinancials && (
          <Select
            value={filters.paymentStatus ?? ALL}
            onValueChange={(value) =>
              onUpdateFilters({
                paymentStatus:
                  value === ALL ? undefined : (value as PaymentStatus),
              })
            }
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Payments</SelectItem>
              {PAYMENT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}