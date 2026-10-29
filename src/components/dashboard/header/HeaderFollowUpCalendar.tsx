// "use client";

// import { useMemo, useState } from "react";
// import { CalendarDays, Clock, Phone, StickyNote } from "lucide-react";

// import { useFollowUpCalendar } from "@/features/leads/hooks/use-lead-calendar";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { cn } from "@/lib/utils";
// import type { FollowUpCalendarEntry } from "@/types/lead";

// const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

// const statusConfig: Record<
//   string,
//   { label: string; dot: string; badge: string }
// > = {
//   CONFIRMED_MEETING: {
//     label: "Confirmed Meeting",
//     dot: "bg-emerald-500",
//     badge:
//       "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400",
//   },

//   NEXT_CONTACT: {
//     label: "Next Contact",
//     dot: "bg-amber-500",
//     badge:
//       "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400",
//   },
// };

// function getStatusConfig(status: string) {
//   return statusConfig[status] ?? {
//     label: status,
//     dot: "bg-slate-400",
//     badge: "border-slate-200 bg-slate-50 text-slate-600",
//   };
// }

// export function HeaderFollowUpCalendar() {
//   const { data, isLoading } = useFollowUpCalendar();
//   const [monthOffset, setMonthOffset] = useState(0);

//   const entriesByDate = useMemo(() => {
//     const map = new Map<string, FollowUpCalendarEntry>();
//     data?.data.forEach((entry) => map.set(entry.date, entry));
//     return map;
//   }, [data]);

//   const today = new Date();
//   const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
//   const year = viewDate.getFullYear();
//   const month = viewDate.getMonth();

//   const firstDayOfWeek = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const cells: (number | null)[] = [
//     ...Array(firstDayOfWeek).fill(null),
//     ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
//   ];

//   const totalUpcoming = data?.data.reduce((sum, entry) => sum + entry.leads.length, 0) ?? 0;

//   const dateKey = (day: number) =>
//     `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

//   const formatTime = (iso: string) =>
//     new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="relative h-9 w-9 rounded-lg hover:bg-accent/50"
//           title="Follow-up calendar"
//         >
//           <CalendarDays className="h-5 w-5" />
//           {totalUpcoming > 0 && (
//             <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px] bg-indigo-600 text-white border-0">
//               {totalUpcoming > 9 ? "9+" : totalUpcoming}
//             </Badge>
//           )}
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="end" className="w-96 overflow-hidden p-0">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3 text-white">
//           <button
//             className="flex h-6 w-6 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white"
//             onClick={(e) => {
//               e.preventDefault();
//               setMonthOffset((v) => v - 1);
//             }}
//           >
//             ‹
//           </button>
//           <div className="text-center">
//             <p className="text-sm font-semibold">
//               {viewDate.toLocaleString("default", { month: "long", year: "numeric" })}
//             </p>
//             <p className="text-[11px] text-white/80">
//               {totalUpcoming} upcoming follow-up{totalUpcoming === 1 ? "" : "s"}
//             </p>
//           </div>
//           <button
//             className="flex h-6 w-6 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white"
//             onClick={(e) => {
//               e.preventDefault();
//               setMonthOffset((v) => v + 1);
//             }}
//           >
//             ›
//           </button>
//         </div>

//         {/* Legend */}
//         <div className="flex items-center gap-4 border-b bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
//           <span className="flex items-center gap-1.5">
//             <span className="h-2 w-2 rounded-full bg-emerald-500" />
//             Confirmed Meeting
//           </span>
//           <span className="flex items-center gap-1.5">
//             <span className="h-2 w-2 rounded-full bg-amber-500" />
//             Next Contact
//           </span>
//         </div>
//         {/* <div className="flex items-center gap-4 border-b bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
//           <span className="flex items-center gap-1.5">
//             <span className="h-2 w-2 rounded-full bg-emerald-500" />
//             Confirmed Meeting
//           </span>
//           <span className="flex items-center gap-1.5">
//             <span className="h-2 w-2 rounded-full bg-amber-500" />
//             Next Contact
//           </span>
//         </div> */}

//         {/* Calendar grid */}
//         <div className="p-3">
//           <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-muted-foreground">
//             {dayNames.map((d, i) => (
//               <span key={`${d}-${i}`}>{d}</span>
//             ))}
//           </div>

//           <div className="grid grid-cols-7 gap-1">
//             {cells.map((day, index) => {
//               if (!day) return <div key={index} className="h-9" />;

//               const key = dateKey(day);
//               const entry = entriesByDate.get(key);
//               const isToday =
//                 today.getFullYear() === year &&
//                 today.getMonth() === month &&
//                 today.getDate() === day;

//               const primaryStatus = entry?.leads[0]?.status;
//               const config = primaryStatus ? getStatusConfig(primaryStatus) : null;

//               const cellButton = (
//                 <button
//                   type="button"
//                   className={cn(
//                     "relative flex h-9 w-9 flex-col items-center justify-center rounded-lg text-xs font-medium transition-colors",
//                     entry
//                       ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
//                       : "text-foreground hover:bg-accent/60",
//                     isToday && "ring-2 ring-indigo-500 ring-offset-1",
//                   )}
//                 >
//                   {day}
//                   {entry && (
//                     <span className="absolute bottom-1 flex gap-0.5">
//                       {entry.leads.slice(0, 3).map((lead, i) => (
//                         <span
//                           key={i}
//                           className={cn("h-1 w-1 rounded-full", getStatusConfig(lead.status).dot)}
//                         />
//                       ))}
//                     </span>
//                   )}
//                 </button>
//               );

//               if (!entry) {
//                 return <div key={index}>{cellButton}</div>;
//               }

//               return (
//                 <Tooltip key={index} delayDuration={150}>
//                   <TooltipTrigger asChild>{cellButton}</TooltipTrigger>
//                   <TooltipContent
//                     side="top"
//                     className="w-72 rounded-xl border bg-popover p-0 shadow-lg"
//                   >
                   

//                     <div className="max-h-72 overflow-y-auto p-2">
//                          <div className="border-b bg-muted/40 px-3 py-2">
//                       <p className="text-xs font-semibold text-foreground">
//                         {new Date(key).toLocaleDateString("en-US", {
//                           weekday: "long",
//                           month: "long",
//                           day: "numeric",
//                         })}
//                       </p>
//                       <p className="text-[11px] text-muted-foreground">
//                         {entry.leads.length} lead{entry.leads.length === 1 ? "" : "s"} scheduled
//                       </p>
//                     </div>
//                       {entry.leads.map((lead, leadIndex) => {
//                         const leadConfig = getStatusConfig(lead.status);
//                         return (
//                           <div
//                             key={lead._id}
//                             className={cn(
//                               "flex flex-col gap-1.5 rounded-lg border p-2.5 text-xs",
//                               leadIndex > 0 && "mt-2",
//                               "bg-card",
//                             )}
//                           >
//                             <div className="flex items-center justify-between gap-2">
//                               <p className="font-semibold text-foreground">{lead.fullName}</p>
//                               <Badge
//                                 variant="outline"
//                                 className={cn("h-5 shrink-0 px-1.5 text-[10px] font-medium", leadConfig.badge)}
//                               >
//                                 {leadConfig.label}
//                               </Badge>
//                             </div>

//                             <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
//                               <span className="flex items-center gap-1">
//                                 <Phone className="h-3 w-3" />
//                                 {lead.phone}
//                               </span>
//                               {/* <span className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 {formatTime(lead.nextContactAt)}
//                               </span> */}
//                             </div>

//                             {lead.notes.length > 0 && (
//                               <div className="mt-1 flex flex-col gap-1 border-t pt-1.5">
//                                 {lead.notes.map((note, i) => (
//                                   <div
//                                     key={i}
//                                     className="flex items-start gap-1.5 text-[11px] text-foreground/80"
//                                   >
//                                     <StickyNote className="mt-0.5 h-3 w-3 shrink-0 text-indigo-500" />
//                                     <span className="leading-snug">{note.message}</span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </TooltipContent>
//                 </Tooltip>
//               );
//             })}
//           </div>
//         </div>

//         {isLoading && (
//           <div className="border-t px-4 py-3 text-center text-xs text-muted-foreground">
//             Loading follow-ups...
//           </div>
//         )}

//         {!isLoading && totalUpcoming === 0 && (
//           <div className="border-t px-4 py-6 text-center">
//             <CalendarDays className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
//             <p className="text-sm font-medium text-muted-foreground">No upcoming follow-ups</p>
//           </div>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// export default HeaderFollowUpCalendar;


"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Phone, StickyNote, X } from "lucide-react";

import { useFollowUpCalendar } from "@/features/leads/hooks/use-lead-calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { FollowUpCalendarEntry } from "@/types/lead";

const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

const statusConfig: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  CONFIRMED_MEETING: {
    label: "Confirmed Meeting",
    dot: "bg-emerald-500",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400",
  },

  NEXT_CONTACT: {
    label: "Next Contact",
    dot: "bg-amber-500",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400",
  },
};

function getStatusConfig(status: string) {
  return (
    statusConfig[status] ?? {
      label: status,
      dot: "bg-slate-400",
      badge: "border-slate-200 bg-slate-50 text-slate-600",
    }
  );
}

export function HeaderFollowUpCalendar() {
  const { data, isLoading } = useFollowUpCalendar();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, FollowUpCalendarEntry>();
    data?.data.forEach((entry) => map.set(entry.date, entry));
    return map;
  }, [data]);

  const today = new Date();
  const viewDate = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1,
  );
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const totalUpcoming =
    data?.data.reduce((sum, entry) => sum + entry.leads.length, 0) ?? 0;

  const dateKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Selected day-er entry (tap korle panel-e dekhabe)
  const selectedEntry = selectedKey ? entriesByDate.get(selectedKey) : undefined;

  const formatSelectedDate = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) setSelectedKey(null);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg hover:bg-accent/50"
          title="Follow-up calendar"
        >
          <CalendarDays className="h-5 w-5" />
          {totalUpcoming > 0 && (
            <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-0 bg-indigo-600 p-0 text-[10px] text-white">
              {totalUpcoming > 9 ? "9+" : totalUpcoming}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-1.5rem)] max-w-96 overflow-hidden p-0 sm:w-96"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3 text-white">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              setMonthOffset((v) => v - 1);
              setSelectedKey(null);
            }}
          >
            ‹
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold">
              {viewDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-[11px] text-white/80">
              {totalUpcoming} upcoming follow-up
              {totalUpcoming === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              setMonthOffset((v) => v + 1);
              setSelectedKey(null);
            }}
          >
            ›
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 border-b bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Confirmed Meeting
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Next Contact
          </span>
        </div>

        {/* Calendar grid */}
        <div className="p-3">
          <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-muted-foreground">
            {dayNames.map((d, i) => (
              <span key={`${d}-${i}`}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 justify-items-center gap-1">
            {cells.map((day, index) => {
              if (!day) return <div key={index} className="h-9" />;

              const key = dateKey(day);
              const entry = entriesByDate.get(key);
              const isSelected = selectedKey === key;
              const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!entry) {
                      setSelectedKey(null);
                      return;
                    }
                    // Ekই date-e abar tap korle bondho hobe
                    setSelectedKey((prev) => (prev === key ? null : key));
                  }}
                  className={cn(
                    "relative flex h-9 w-9 flex-col items-center justify-center rounded-lg text-xs font-medium transition-colors",
                    isSelected
                      ? "bg-indigo-600 text-white hover:bg-indigo-600"
                      : entry
                        ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                        : "text-foreground hover:bg-accent/60",
                    isToday && "ring-2 ring-indigo-500 ring-offset-1",
                  )}
                >
                  {day}
                  {entry && (
                    <span className="absolute bottom-1 flex gap-0.5">
                      {entry.leads.slice(0, 3).map((lead, i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-1 w-1 rounded-full",
                            isSelected
                              ? "bg-white"
                              : getStatusConfig(lead.status).dot,
                          )}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day details (tap/click korle ekhane dekhabe) */}
        {selectedKey && selectedEntry && (
          <div className="border-t bg-muted/20">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {formatSelectedDate(selectedKey)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {selectedEntry.leads.length} lead
                  {selectedEntry.leads.length === 1 ? "" : "s"} scheduled
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedKey(null);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto overscroll-contain p-3">
              {selectedEntry.leads.map((lead) => {
                const leadConfig = getStatusConfig(lead.status);
                return (
                  <div
                    key={lead._id}
                    className="flex flex-col gap-1.5 rounded-lg border bg-card p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground">
                        {lead.fullName}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-5 shrink-0 px-1.5 text-[10px] font-medium",
                          leadConfig.badge,
                        )}
                      >
                        {leadConfig.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                    </div>

                    {lead.notes.length > 0 && (
                      <div className="mt-1 flex flex-col gap-1 border-t pt-1.5">
                        {lead.notes.map((note, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-1.5 text-[11px] text-foreground/80"
                          >
                            <StickyNote className="mt-0.5 h-3 w-3 shrink-0 text-indigo-500" />
                            <span className="leading-snug">{note.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="border-t px-4 py-3 text-center text-xs text-muted-foreground">
            Loading follow-ups...
          </div>
        )}

        {!isLoading && totalUpcoming === 0 && (
          <div className="border-t px-4 py-6 text-center">
            <CalendarDays className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              No upcoming follow-ups
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HeaderFollowUpCalendar;