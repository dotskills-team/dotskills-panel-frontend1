// "use client";

// import { Briefcase, CircleCheck, CirclePause, Clock, ListTodo, PackageCheck, Wallet } from "lucide-react";

// const formatMoney = (n?: number) => `৳${(n ?? 0).toLocaleString("en-US")}`;

// export function ProjectsStats({ projectStat, isLoading }: { projectStat?: any; isLoading: boolean }) {
//   const { total, Planning, InProgress, Completed, OnHold, DoneDue, Delivered, totalValue, totalPaid, totalDue } =
//     projectStat || {};

//   const moneyStats = [
//     { label: "Total Value", value: formatMoney(totalValue), icon: Wallet, gradient: "from-indigo-700 to-purple-500" },
//     { label: "Total Paid", value: formatMoney(totalPaid), icon: CircleCheck, gradient: "from-green-700 to-emerald-500" },
//     { label: "Total Due", value: formatMoney(totalDue), icon: CirclePause, gradient: "from-red-700 to-rose-500" },
//   ];

//   const stats = [
//     { label: "Total Projects", value: total, icon: Briefcase, gradient: "from-blue-700 to-blue-500" },
//     { label: "Planning", value: Planning, icon: ListTodo, gradient: "from-slate-900 to-slate-700" },
//     { label: "In Progress", value: InProgress, icon: Clock, gradient: "from-amber-600 to-orange-500" },
//     { label: "On Hold", value: OnHold, icon: CirclePause, gradient: "from-red-700 to-rose-500" },
//     { label: "Completed", value: Completed, icon: CircleCheck, gradient: "from-emerald-700 to-emerald-500" },
//     { label: "Done & Due", value: DoneDue, icon: Wallet, gradient: "from-violet-700 to-purple-500" },
//     { label: "Delivered", value: Delivered, icon: PackageCheck, gradient: "from-teal-700 to-cyan-500" },
//   ];

//   const renderCard = ({ label, value, icon: Icon, gradient }: (typeof stats)[number] | (typeof moneyStats)[number]) => (
//     <div
//       key={label}
//       className={`relative overflow-hidden rounded-xl bg-linear-to-br ${gradient} px-3 py-2.5 text-white shadow-md`}
//     >
//       <div className="flex items-start justify-between gap-2">
//         <p className="text-[10px] font-semibold uppercase tracking-wide text-white/80">{label}</p>
//         <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/20">
//           <Icon className="h-3.5 w-3.5" />
//         </div>
//       </div>
//       <p className="mt-1 text-xl font-bold leading-none">{isLoading ? "—" : (value ?? 0)}</p>
//     </div>
//   );

//   return (
//     <div className="flex flex-col gap-3">
//       {/* Row 1: money stats (3) */}
//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{moneyStats.map(renderCard)}</div>

//       {/* Row 2: project status stats (7) */}
//       <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">{stats.map(renderCard)}</div>
//     </div>
//   );
// }


"use client";

import { FinanceStatCard } from "@/components/dashboard/my-finance/FinanceStatCard";
import { Briefcase, CircleCheck, CirclePause, Clock, ListTodo, PackageCheck, Wallet } from "lucide-react";

const formatMoney = (n?: number) => `৳${(n ?? 0).toLocaleString("en-US")}`;

interface ProjectsStatsProps {
  projectStat?: any;
  isLoading: boolean;
  /** false for roles that must not see money totals (e.g. manager) */
  showMoney?: boolean;
}

export function ProjectsStats({ projectStat, isLoading, showMoney = true }: ProjectsStatsProps) {
  const { total, Planning, InProgress, Completed, OnHold, DoneDue, Delivered, totalValue, totalPaid, totalDue, totalOverpaid } =
    projectStat || {};

  const moneyStats = [
    { label: "Total Value", value: formatMoney(totalValue), icon: Wallet, tone: "text-blue-100", gradient: "from-blue-600 via-indigo-600 to-violet-600" },
    { label: "Total Received", value: formatMoney(totalPaid), icon: CircleCheck, tone: "text-emerald-100", gradient: "from-emerald-500 via-teal-600 to-cyan-700" },
    { label: "Total Outstanding", value: formatMoney(totalDue), icon: CirclePause, tone: "text-rose-100", gradient: "from-rose-500 via-pink-600 to-fuchsia-600" },
    // Only when the server sends it (admin / super admin)
    ...(totalOverpaid !== undefined
      ? [{ label: "Total Overpaid", value: formatMoney(totalOverpaid), icon: Wallet, tone: "text-cyan-100", gradient: "from-cyan-500 via-sky-600 to-blue-700" }]
      : []),
  ];

  const stats = [
    { label: "Total Projects", value: total, icon: Briefcase, tone: "text-blue-100", gradient: "from-blue-600 via-indigo-600 to-violet-600" },
    { label: "Planning", value: Planning, icon: ListTodo, tone: "text-slate-100", gradient: "from-slate-600 via-slate-700 to-slate-800" },
    { label: "In Progress", value: InProgress, icon: Clock, tone: "text-amber-100", gradient: "from-amber-500 via-orange-500 to-orange-600" },
    { label: "On Hold", value: OnHold, icon: CirclePause, tone: "text-rose-100", gradient: "from-rose-500 via-pink-600 to-fuchsia-600" },
    { label: "Completed", value: Completed, icon: CircleCheck, tone: "text-emerald-100", gradient: "from-emerald-500 via-teal-600 to-cyan-700" },
    { label: "Done & Due", value: DoneDue, icon: Wallet, tone: "text-violet-100", gradient: "from-violet-600 via-purple-600 to-fuchsia-700" },
    { label: "Delivered", value: Delivered, icon: PackageCheck, tone: "text-cyan-100", gradient: "from-cyan-500 via-sky-600 to-blue-700" },
  ];

  const renderCard = ({ label, value, icon, tone, gradient }: (typeof stats)[number] | (typeof moneyStats)[number]) => (
    <FinanceStatCard
      key={label}
      title={label}
      value={String(value ?? 0)}
      caption=""
      icon={icon}
      tone={tone}
      gradient={gradient}
      loading={isLoading}
    />
  );

  return (
    <div className="flex flex-col gap-3">
      {showMoney && (
        <div className={`grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 ${"grid-cols-3"}`}>
          {moneyStats.map(renderCard)}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-7">{stats.map(renderCard)}</div>
    </div>
  );
}