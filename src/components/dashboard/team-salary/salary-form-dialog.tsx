// "use client";

// import { useMemo, useState } from "react";
// import { Search, UserRound, WalletCards } from "lucide-react";
// import { toast } from "sonner";
// import { useUsers } from "@/features/users/hooks/useUsers";
// import { useCreateTeamSalary } from "@/features/team-salary/hooks/use-team-salary";
// import { createTeamSalarySchema } from "@/features/team-salary/schemas/team-salary.schema";
// import { TEAM_SALARY_MONTH_OPTIONS } from "@/features/team-salary/constants/team-salary.constant";
// import { formatSalaryAmount } from "@/features/team-salary/utils/team-salary.utils";
// import type { ITeamSalary } from "@/types/team-salary.types";
// import type { User } from "@/types/user.types";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";

// interface SalaryFormDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   month: number;
//   year: number;
//   existing?: ITeamSalary | null;
// }

// const userName = (user: User) =>
//   user.fullName || `${user.firstName} ${user.lastName}`;
// const salaryUserId = (salary: ITeamSalary) =>
//   typeof salary.user === "string" ? salary.user : salary.user._id.toString();

// export function SalaryFormDialog({
//   open,
//   onOpenChange,
//   month: initialMonth,
//   year: initialYear,
//   existing,
// }: SalaryFormDialogProps) {
//   const isEdit = Boolean(existing);
//   const [searchTerm, setSearch] = useState("");
//   const [userId, setUserId] = useState("");
//   const [month, setMonth] = useState(initialMonth);
//   const [year, setYear] = useState(initialYear);
//   const [note, setNote] = useState("");
//   const createMutation = useCreateTeamSalary();
//   const usersQuery = useUsers(
//     { page: 1, limit: 20, searchTerm, status: "ACTIVE" },
//     { enabled: open && !isEdit },
//   );
//   const selectedUser = useMemo(
//     () => usersQuery.data?.data?.find((user) => user._id === userId),
//     [userId, usersQuery.data],
//   );

//   const reset = () => {
//     setSearch("");
//     setUserId(existing ? salaryUserId(existing) : "");
//     setMonth(existing?.month ?? initialMonth);
//     setYear(existing?.year ?? initialYear);
//     setNote(existing?.note ?? "");
//   };
//   const submit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (isEdit) {
//       toast.info(
//         "Salary edits are not supported by the current backend contract.",
//       );
//       return;
//     }
//     const parsed = createTeamSalarySchema.safeParse({
//       user: userId,
//       month,
//       year,
//       note: note || undefined,
//     });
//     if (!parsed.success) {
//       toast.error(
//         parsed.error.issues[0]?.message ??
//           "Please complete the salary details.",
//       );
//       return;
//     }
//     try {
//       await createMutation.mutateAsync(parsed.data);
//       toast.success("Salary record created successfully.");
//       onOpenChange(false);
//       reset();
//     } catch (error) {
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Unable to create salary record.",
//       );
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(value) => {
//         onOpenChange(value);
//         if (!value) reset();
//       }}
//     >
//       <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
//         <DialogHeader>
//           <DialogTitle>{isEdit ? "Edit Salary" : "Create Salary"}</DialogTitle>
//           <DialogDescription>
//             {isEdit
//               ? "Review this salary record. The current backend does not expose an update endpoint."
//               : "Create a salary record for an active staff member."}
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={submit} className="flex flex-col gap-5">
//           {!isEdit && (
//             <div className="flex flex-col gap-2">
//               <label
//                 className="text-sm font-medium"
//                 htmlFor="salary-staff-search"
//               >
//                 Staff member
//               </label>
//               <div className="relative">
//                 <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   id="salary-staff-search"
//                   className="pl-9"
//                   value={searchTerm}
//                   onChange={(event) => setSearch(event.target.value)}
//                   placeholder="Search active staff by name or email"
//                 />
//               </div>
//               <div className="max-h-44 overflow-y-auto rounded-lg border">
//                 {usersQuery.isLoading ? (
//                   <p className="p-4 text-sm text-muted-foreground">
//                     Loading staff...
//                   </p>
//                 ) : usersQuery.data?.data?.length ? (
//                   usersQuery.data.data.map((user) => (
//                     <button
//                       type="button"
//                       key={user._id}
//                       onClick={() => setUserId(user._id)}
//                       className={`flex w-full cursor-pointer items-center gap-3 border-b p-3 text-left transition hover:scale-[1.01] hover:bg-primary/5 ${userId === user._id ? "bg-primary/10" : ""}`}
//                     >
//                       <Avatar className="size-9">
//                         <AvatarImage src={user.avatar} alt={userName(user)} />
//                         <AvatarFallback>
//                           {user.firstName?.[0]}
//                           {user.lastName?.[0]}
//                         </AvatarFallback>
//                       </Avatar>
//                       <span className="min-w-0 flex-1">
//                         <span className="block truncate text-sm font-medium">
//                           {userName(user)}
//                         </span>
//                         <span className="block truncate text-xs text-muted-foreground">
//                           {user.designation || user.email}
//                         </span>
//                       </span>
//                       <span className="text-xs text-muted-foreground">
//                         {user.department || "Staff"}
//                       </span>
//                     </button>
//                   ))
//                 ) : (
//                   <p className="p-4 text-sm text-muted-foreground">
//                     No active staff found.
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}
//           {(selectedUser || existing) && (
//             <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
//               <Avatar className="size-12">
//                 <AvatarImage
//                   src={selectedUser?.avatar}
//                   alt={
//                     selectedUser ? userName(selectedUser) : "Selected employee"
//                   }
//                 />
//                 <AvatarFallback>
//                   <UserRound />
//                 </AvatarFallback>
//               </Avatar>
//               <div className="min-w-0 flex-1">
//                 <p className="font-semibold">
//                   {selectedUser ? userName(selectedUser) : "Selected employee"}
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   {selectedUser?.designation || "Salary record"} ·{" "}
//                   {selectedUser?.department || "Team"}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs text-muted-foreground">Monthly salary</p>
//                 <p className="font-semibold text-primary">
//                   {formatSalaryAmount(
//                     selectedUser?.salary ?? existing?.salaryAmount,
//                   )}
//                 </p>
//               </div>
//             </div>
//           )}
//           <div className="grid gap-4 sm:grid-cols-2">
//             <label className="grid gap-2 text-sm font-medium">
//               Month
//               <Select
//                 value={String(month)}
//                 onValueChange={(value) => setMonth(Number(value))}
//                 disabled={isEdit}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {TEAM_SALARY_MONTH_OPTIONS.map((item) => (
//                     <SelectItem key={item.value} value={String(item.value)}>
//                       {item.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </label>
//             <label className="grid gap-2 text-sm font-medium">
//               Year
//               <Input
//                 type="number"
//                 min="2000"
//                 max="3000"
//                 value={year}
//                 onChange={(event) => setYear(Number(event.target.value))}
//                 disabled={isEdit}
//               />
//             </label>
//           </div>
//           <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
//             <WalletCards className="mr-2 inline size-4 text-primary" />
//             Salary amount is derived from the selected user record by the
//             backend. Update the user profile salary before generating future
//             payroll.
//           </div>
//           <label className="grid gap-2 text-sm font-medium">
//             Note
//             <Textarea
//               value={note}
//               onChange={(event) => setNote(event.target.value)}
//               placeholder="Optional accounting note"
//               maxLength={500}
//               disabled={isEdit}
//             />
//           </label>
//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               className="cursor-pointer transition hover:scale-[1.02]"
//               onClick={() => onOpenChange(false)}
//             >
//               Cancel
//             </Button>
//             {!isEdit && (
//               <Button
//                 type="submit"
//                 className="cursor-pointer bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
//                 disabled={createMutation.isPending || !userId}
//               >
//                 {createMutation.isPending ? "Creating..." : "Create Salary"}
//               </Button>
//             )}
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default SalaryFormDialog;




"use client";

import { useMemo, useState } from "react";
import { Search, UserRound, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useCreateTeamSalary } from "@/features/team-salary/hooks/use-team-salary";
import { createTeamSalarySchema } from "@/features/team-salary/schemas/team-salary.schema";
import { TEAM_SALARY_MONTH_OPTIONS } from "@/features/team-salary/constants/team-salary.constant";
import { formatSalaryAmount } from "@/features/team-salary/utils/team-salary.utils";
import { getSalaryTotal } from "@/types/team-salary.types";
import type { ITeamSalary } from "@/types/team-salary.types";
import type { User } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SalaryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: number;
  year: number;
  existing?: ITeamSalary | null;
}

const userName = (user: User) =>
  user.fullName || `${user.firstName} ${user.lastName}`;
const salaryUserId = (salary: ITeamSalary) =>
  typeof salary.user === "string" ? salary.user : salary.user._id.toString();

export function SalaryFormDialog({
  open,
  onOpenChange,
  month: initialMonth,
  year: initialYear,
  existing,
}: SalaryFormDialogProps) {
  const isEdit = Boolean(existing);
  const [searchTerm, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [extraName, setExtraName] = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const [note, setNote] = useState("");
  const createMutation = useCreateTeamSalary();
  const usersQuery = useUsers(
    { page: 1, limit: 20, searchTerm, status: "ACTIVE" },
    { enabled: open && !isEdit },
  );
  const selectedUser = useMemo(
    () => usersQuery.data?.data?.find((user) => user._id === userId),
    [userId, usersQuery.data],
  );

  const baseSalary = Number(
    selectedUser?.salary ?? existing?.salaryAmount ?? 0,
  );
  const extraValue = isEdit
    ? Number(existing?.extraAmount ?? 0)
    : Number(extraAmount) || 0;
  const totalValue = isEdit && existing ? getSalaryTotal(existing) : baseSalary + extraValue;

  const reset = () => {
    setSearch("");
    setUserId(existing ? salaryUserId(existing) : "");
    setMonth(existing?.month ?? initialMonth);
    setYear(existing?.year ?? initialYear);
    setExtraName(existing?.extraName ?? "");
    setExtraAmount(existing?.extraAmount ? String(existing.extraAmount) : "");
    setNote(existing?.note ?? "");
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isEdit) {
      toast.info(
        "Salary edits are not supported by the current backend contract.",
      );
      return;
    }
    const parsedExtra = extraAmount ? Number(extraAmount) : undefined;
    const parsed = createTeamSalarySchema.safeParse({
      user: userId,
      month,
      year,
      extraName: parsedExtra && parsedExtra > 0 ? extraName.trim() : undefined,
      extraAmount: parsedExtra,
      note: note || undefined,
    });
    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ??
          "Please complete the salary details.",
      );
      return;
    }
    try {
      await createMutation.mutateAsync(parsed.data);
      toast.success("Salary record created successfully.");
      onOpenChange(false);
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create salary record.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) reset();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Salary" : "Create Salary"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Review this salary record."
              : "Create a salary record for an active staff member."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-5">
          {!isEdit && (
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium"
                htmlFor="salary-staff-search"
              >
                Staff member
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="salary-staff-search"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search active staff by name or email"
                />
              </div>
              <div className="max-h-44 overflow-y-auto rounded-lg border">
                {usersQuery.isLoading ? (
                  <p className="p-4 text-sm text-muted-foreground">
                    Loading staff...
                  </p>
                ) : usersQuery.data?.data?.length ? (
                  usersQuery.data.data.map((user) => (
                    <button
                      type="button"
                      key={user._id}
                      onClick={() => setUserId(user._id)}
                      className={`flex w-full cursor-pointer items-center gap-3 border-b p-3 text-left transition hover:scale-[1.01] hover:bg-primary/5 ${userId === user._id ? "bg-primary/10" : ""}`}
                    >
                      <Avatar className="size-9">
                        <AvatarImage src={user.avatar} alt={userName(user)} />
                        <AvatarFallback>
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {userName(user)}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {user.designation || user.email}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.department || "Staff"}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">
                    No active staff found.
                  </p>
                )}
              </div>
            </div>
          )}
          {(selectedUser || existing) && (
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <Avatar className="size-12">
                <AvatarImage
                  src={selectedUser?.avatar}
                  alt={
                    selectedUser ? userName(selectedUser) : "Selected employee"
                  }
                />
                <AvatarFallback>
                  <UserRound />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {selectedUser ? userName(selectedUser) : "Selected employee"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedUser?.designation || "Salary record"} ·{" "}
                  {selectedUser?.department || "Team"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Monthly salary</p>
                <p className="font-semibold text-primary">
                  {formatSalaryAmount(
                    selectedUser?.salary ?? existing?.salaryAmount,
                  )}
                </p>
              </div>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Month
              <Select
                value={String(month)}
                onValueChange={(value) => setMonth(Number(value))}
                disabled={isEdit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_SALARY_MONTH_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={String(item.value)}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Year
              <Input
                type="number"
                min="2000"
                max="3000"
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                disabled={isEdit}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Extra name
              <Input
                value={isEdit ? (existing?.extraName ?? "") : extraName}
                onChange={(event) => setExtraName(event.target.value)}
                placeholder="e.g. Eid Bonus"
                maxLength={100}
                disabled={isEdit}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Extra amount
              <Input
                type="number"
                min="0"
                value={
                  isEdit ? String(existing?.extraAmount ?? "") : extraAmount
                }
                onChange={(event) => setExtraAmount(event.target.value)}
                placeholder="0"
                disabled={isEdit}
              />
            </label>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between gap-2">
              <span>
                <WalletCards className="mr-2 inline size-4 text-primary" />
                Base {formatSalaryAmount(baseSalary)}
                {extraValue > 0 && <> + Extra {formatSalaryAmount(extraValue)}</>}
              </span>
              <span className="font-semibold text-primary">
                Total {formatSalaryAmount(totalValue)}
              </span>
            </div>
            <p className="mt-2 text-xs">
              Base salary user profile theke backend nijei nibe. Extra thakle
              total-e add hobe.
            </p>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Note
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Optional accounting note"
              maxLength={500}
              disabled={isEdit}
            />
          </label>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer transition hover:scale-[1.02]"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {!isEdit && (
              <Button
                type="submit"
                className="cursor-pointer bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
                disabled={createMutation.isPending || !userId}
              >
                {createMutation.isPending ? "Creating..." : "Create Salary"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SalaryFormDialog;