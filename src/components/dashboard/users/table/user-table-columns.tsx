import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2, UserCog } from "lucide-react";
import type { User } from "@/types/user.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/dashboard/users/user-avatar";
import { RoleBadge } from "@/components/dashboard/users/role-badge";
import { StatusBadge } from "@/components/dashboard/users/status-badge";

interface UserTableColumnsProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewDetails: (user: User) => void;
  onStatusChange: (user: User) => void;
}

export const getUserTableColumns = ({
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
}: UserTableColumnsProps): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-2 h-8 px-2 text-[var(--muted-fg)] hover:text-[var(--foreground)]"
      >
        Name
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <button
          type="button"
          onClick={() => onViewDetails(user)}
          className="group flex items-center gap-3 text-left"
        >
          <UserAvatar
            firstName={user.firstName}
            lastName={user.lastName}
            fullName={user.fullName}
            avatar={user.avatar}
            role={user.role}
            size="sm"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--brand-cobalt)] group-hover:underline underline-offset-2">
              {user.fullName}
            </span>
            <span className="text-xs text-[var(--muted-fg)]">{user.email}</span>
          </span>
        </button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <RoleBadge role={row.getValue("role")} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <span className="text-sm text-[var(--muted-fg)]">
        {row.getValue("department") || "—"}
      </span>
    ),
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => (
      <span className="text-sm text-[var(--muted-fg)]">
        {row.getValue("designation") || "—"}
      </span>
    ),
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified") as boolean;
      return (
        <span
          className={
            isVerified
              ? "inline-flex items-center gap-1.5 text-xs font-medium text-[#0C9A67] dark:text-[#3DDA9F]"
              : "inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-fg)]"
          }
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: isVerified ? "#17C787" : "#8A8F98" }}
          />
          {isVerified ? "Verified" : "Unverified"}
        </span>
      );
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => {
      const lastLogin = row.getValue("lastLogin") as string;
      if (!lastLogin)
        return <span className="text-xs text-[var(--muted-fg)]">Never</span>;
      return (
        <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--muted-fg)]">
          {new Date(lastLogin).toLocaleDateString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-[var(--muted-fg)] hover:text-[var(--foreground)]"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetails(user)} className="gap-2">
              <Eye className="h-3.5 w-3.5" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)} className="gap-2">
              <Pencil className="h-3.5 w-3.5" />
              Edit user
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange(user)} className="gap-2">
              <UserCog className="h-3.5 w-3.5" />
              Change status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="gap-2 text-[var(--signal-rose)] focus:text-[var(--signal-rose)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
