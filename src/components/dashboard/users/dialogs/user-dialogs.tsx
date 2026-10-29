// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import type { User } from "@/types/user.types";
// import { UserForm } from "../forms/user-form";
// import type { CreateUserInput, UpdateUserInput } from "@/features/users/schemas/user.schema";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// interface CreateUserDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmit: (data: CreateUserInput) => Promise<void>;
//   isLoading?: boolean;
// }

// export function CreateUserDialog({
//   open,
//   onOpenChange,
//   onSubmit,
//   isLoading,
// }: CreateUserDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="bg-gray-100 dark:bg-slate-950 max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Create New User</DialogTitle>
//           <DialogDescription>
//             Fill in the form below to create a new user account.
//           </DialogDescription>
//         </DialogHeader>
//         <ScrollArea className="max-h-[85vh] pr-2">
//           <UserForm
//           onSubmit={async (data) => {
//             await onSubmit(data as CreateUserInput);
//             onOpenChange(false);
//           }}
//           isLoading={isLoading}
//         />
//         <ScrollBar orientation="vertical" />
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }

// interface UpdateUserDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   user?: User;
//   onSubmit: (data: UpdateUserInput) => Promise<void>;
//   isLoading?: boolean;
// }

// export function UpdateUserDialog({
//   open,
//   onOpenChange,
//   user,
//   onSubmit,
//   isLoading,
// }: UpdateUserDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="bg-gray-100 dark:bg-slate-950 max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Edit User</DialogTitle>
//           <DialogDescription>
//             Update the user information below.
//           </DialogDescription>
//         </DialogHeader>
//         {user && (
//           <ScrollArea className="max-h-[85vh] pr-2">
//             <UserForm
//             user={user}
//             onSubmit={async (data) => {
//               await onSubmit(data as UpdateUserInput);
//               onOpenChange(false);
//             }}
//             isLoading={isLoading}
//           />
//           <ScrollBar orientation="vertical" />
//           </ScrollArea>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

// interface DeleteUserDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   user?: User;
//   onConfirm: () => Promise<void>;
//   isLoading?: boolean;
// }

// export function DeleteUserDialog({
//   open,
//   onOpenChange,
//   user,
//   onConfirm,
//   isLoading,
// }: DeleteUserDialogProps) {
//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Delete User</AlertDialogTitle>
//           <AlertDialogDescription>
//             Are you sure you want to delete <span className="font-semibold">{user?.fullName}</span>? This action cannot be undone.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <div className="flex gap-3 justify-end">
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={async (e) => {
//               e.preventDefault();
//               await onConfirm();
//               onOpenChange(false);
//             }}
//             disabled={isLoading}
//             className="gap-2"
//           >
//             {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
//             Delete
//           </AlertDialogAction>
//         </div>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

// interface StatusChangeDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   user?: User;
//   currentStatus?: string;
//   onStatusChange: (status: "ACTIVE" | "INACTIVE" | "SUSPENDED") => Promise<void>;
//   isLoading?: boolean;
// }

// export function StatusChangeDialog({
//   open,
//   onOpenChange,
//   user,
//   currentStatus,
//   onStatusChange,
//   isLoading,
// }: StatusChangeDialogProps) {
//   const statuses = [
//     { value: "ACTIVE", label: "Active", description: "User can access the system" },
//     { value: "INACTIVE", label: "Inactive", description: "User account is inactive" },
//     { value: "SUSPENDED", label: "Suspended", description: "User access is suspended" },
//   ];

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Change User Status</DialogTitle>
//           <DialogDescription>
//             Select a new status for {user?.fullName}.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-3">
//           {statuses.map((status) => (
//             <Button
//               key={status.value}
//               variant={
//                 currentStatus === status.value ? "default" : "outline"
//               }
//               className="w-full justify-start gap-3"
//               disabled={isLoading}
//               onClick={async () => {
//                 await onStatusChange(
//                   status.value as "ACTIVE" | "INACTIVE" | "SUSPENDED",
//                 );
//                 onOpenChange(false);
//               }}
//             >
//               <div className="flex flex-col items-start gap-1">
//                 <span className="font-medium">{status.label}</span>
//                 <span className="text-xs text-muted-foreground">
//                   {status.description}
//                 </span>
//               </div>
//             </Button>
//           ))}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }




"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { User } from "@/types/user.types";
import { UserForm } from "../forms/user-form";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/features/users/schemas/user.schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserInput) => Promise<void>;
  isLoading?: boolean;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-100 dark:bg-slate-950 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a new user account.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[85vh] pr-2">
          <UserForm
            onSubmit={async (data) => {
              await onSubmit(data as CreateUserInput);
              onOpenChange(false);
            }}
            isLoading={isLoading}
          />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface UpdateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSubmit: (data: UpdateUserInput) => Promise<void>;
  isLoading?: boolean;
  /** True only when the logged-in user is ADMIN or SUPER_ADMIN. */
  canChangePassword?: boolean;
  onChangePassword?: (userId: string, newPassword: string) => Promise<void>;
}

export function UpdateUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading,
  canChangePassword,
  onChangePassword,
}: UpdateUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-100 dark:bg-slate-950 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user information below.
          </DialogDescription>
        </DialogHeader>
        {user && (
          <ScrollArea className="max-h-[85vh] pr-2">
            <UserForm
              user={user}
              onSubmit={async (data) => {
                await onSubmit(data as UpdateUserInput);
                onOpenChange(false);
              }}
              isLoading={isLoading}
              canChangePassword={canChangePassword}
              onChangePassword={onChangePassword}
            />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isLoading,
}: DeleteUserDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{user?.fullName}</span>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault();
              await onConfirm();
              onOpenChange(false);
            }}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface StatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  currentStatus?: string;
  onStatusChange: (
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED",
  ) => Promise<void>;
  isLoading?: boolean;
}

export function StatusChangeDialog({
  open,
  onOpenChange,
  user,
  currentStatus,
  onStatusChange,
  isLoading,
}: StatusChangeDialogProps) {
  const statuses = [
    { value: "ACTIVE", label: "Active", description: "User can access the system" },
    { value: "INACTIVE", label: "Inactive", description: "User account is inactive" },
    { value: "SUSPENDED", label: "Suspended", description: "User access is suspended" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Status</DialogTitle>
          <DialogDescription>
            Select a new status for {user?.fullName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {statuses.map((status) => (
            <Button
              key={status.value}
              variant={currentStatus === status.value ? "default" : "outline"}
              className="w-full justify-start gap-3"
              disabled={isLoading}
              onClick={async () => {
                await onStatusChange(
                  status.value as "ACTIVE" | "INACTIVE" | "SUSPENDED",
                );
                onOpenChange(false);
              }}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">{status.label}</span>
                <span className="text-xs text-muted-foreground">
                  {status.description}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}