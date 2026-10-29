
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Folder,
  FolderKanban,
  KeyRound,
  Landmark,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SquarePen,
  Tags,
  Target,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/lib/dashboard-config";

// Notun icon lagle ekhane import kore map-e joga koro
const ICONS: Record<string, LucideIcon> = {
  ArrowLeftRight,
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
  CreditCard,
  Folder,
  FolderKanban,
  KeyRound,
  Landmark,
  LayoutDashboard,
  Package,
  PenSquare: SquarePen,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SquarePen,
  Tags,
  Target,
  Users,
  Wallet,
};

interface NavIconProps {
  name?: string;
  colorClass?: string;
  active?: boolean;
  fallback?: LucideIcon;
}

function NavIcon({ name, colorClass, active, fallback }: NavIconProps) {
  const Icon = (name && ICONS[name]) || fallback;
  if (!Icon) return null;

  return (
    <Icon
      aria-hidden="true"
      className={cn(
        "h-4 w-4 shrink-0 transition-colors",
        active ? "text-white" : colorClass || "text-slate-500 dark:text-slate-400",
      )}
    />
  );
}

interface SidebarNavItemsProps {
  groups: NavGroup[];
}

const baseLinkClass =
  "gap-2.5 rounded-lg font-normal text-slate-600 transition-colors " +
  "hover:bg-slate-100 hover:text-slate-900 " +
  "dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-slate-50";

const activeLinkClass =
  "bg-indigo-600 font-medium text-white shadow-sm " +
  "hover:bg-indigo-700 hover:text-white " +
  "dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white " +
  "data-[active=true]:bg-indigo-600 data-[active=true]:text-white " +
  "dark:data-[active=true]:bg-indigo-600 " +
  "[&_svg]:!text-white";

export function SidebarNavItems({ groups }: SidebarNavItemsProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  // "/dashboard" shudhu exact match, baki gulo prefix match
  const isItemActive = (href: string) =>
    href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  // Je folder-er bhitore current page ache
  const activeGroupLabel =
    groups.find(
      (g) => g.collapsible && g.items.some((i) => isItemActive(i.href)),
    )?.label ?? null;

  // Ekshathe ekta-i folder khola thakbe
  const [openGroup, setOpenGroup] = React.useState<string | null>(
    activeGroupLabel,
  );

  // Page bodlale shongshlisto folder auto-open
  React.useEffect(() => {
    if (activeGroupLabel) setOpenGroup(activeGroupLabel);
  }, [activeGroupLabel, pathname]);

  return (
    <div className="space-y-1">
      {groups.map((group, groupIdx) => {
        /* ---------- Shadharon group (folder na) ---------- */
        if (!group.collapsible) {
          return (
            <div key={`group-${groupIdx}`} className="pb-3">
              {group.label && !isCollapsed && (
                <p className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.label}
                </p>
              )}
              <SidebarMenu>
                {group.items.map((item, itemIdx) => {
                  const isActive = isItemActive(item.href);
                  return (
                    <SidebarMenuItem key={`${groupIdx}-${itemIdx}`}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className={cn(baseLinkClass, isActive && activeLinkClass)}
                      >
                        <Link
                          href={item.href}
                          onClick={handleNavClick}
                          title={item.description}
                        >
                          <NavIcon
                            name={item.icon}
                            colorClass={item.iconColor}
                            active={isActive}
                          />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          );
        }

        /* ---------- Folder group ---------- */
        const isOpen = openGroup === group.label;
        const hasActiveChild = group.items.some((i) => isItemActive(i.href));

        return (
          <SidebarMenu key={`group-${groupIdx}`}>
            <Collapsible
              open={isOpen}
              onOpenChange={(next) => setOpenGroup(next ? group.label : null)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={group.label}
                    className={cn(
                      "gap-2.5 rounded-lg font-medium text-slate-800 transition-colors",
                      "hover:bg-slate-100 hover:text-slate-900",
                      "dark:text-slate-100 dark:hover:bg-slate-800/70 dark:hover:text-slate-50",
                      hasActiveChild &&
                        !isOpen &&
                        "bg-indigo-50 dark:bg-indigo-500/10",
                    )}
                  >
                    <NavIcon
                      name={group.icon}
                      colorClass={group.iconColor}
                      fallback={Folder}
                    />
                    <span className="flex-1 truncate">{group.label}</span>
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 dark:text-slate-500" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub className="border-slate-200 dark:border-slate-800">
                    {group.items.map((item, itemIdx) => {
                      const isActive = isItemActive(item.href);
                      return (
                        <SidebarMenuSubItem key={`${groupIdx}-${itemIdx}`}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive}
                            className={cn(
                              baseLinkClass,
                              isActive && activeLinkClass,
                            )}
                          >
                            <Link
                              href={item.href}
                              onClick={handleNavClick}
                              title={item.description}
                            >
                              <NavIcon
                                name={item.icon}
                                colorClass={item.iconColor}
                                active={isActive}
                              />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        );
      })}
    </div>
  );
}




// // "use client";

// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { ChevronDown } from "lucide-react";

// // import {
// //   Collapsible,
// //   CollapsibleContent,
// //   CollapsibleTrigger,
// // } from "@/components/ui/collapsible";
// // import {
// //   SidebarMenu,
// //   SidebarMenuButton,
// //   SidebarMenuItem,
// //   SidebarMenuSub,
// //   SidebarMenuSubButton,
// //   SidebarMenuSubItem,
// //   useSidebar,
// // } from "@/components/ui/sidebar";
// // import { cn } from "@/lib/utils";
// // import type { NavGroup } from "@/lib/dashboard-config";

// // interface SidebarNavItemsProps {
// //   groups: NavGroup[];
// // }

// // export function SidebarNavItems({ groups }: SidebarNavItemsProps) {
// //   const pathname = usePathname();
// //   const { isMobile, setOpenMobile, state } = useSidebar();
// //   const isCollapsed = state === "collapsed";

// //   const handleNavClick = () => {
// //     if (isMobile) setOpenMobile(false);
// //   };

// //   const isItemActive = (href: string) =>
// //     pathname === href || pathname.startsWith(href + "/");

// //   return (
// //     <div className="space-y-5">
// //       {groups.map((group, groupIdx) => (
// //         <div key={`group-${groupIdx}`}>
// //           {group.label && !isCollapsed && (
// //             <p className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
// //               {group.label}
// //             </p>
// //           )}

// //           <SidebarMenu>
// //             {group.items.map((item, itemIdx) => {
// //               const isActive = isItemActive(item.href);

// //               if (!group.collapsible) {
// //                 return (
// //                   <SidebarMenuItem key={`${groupIdx}-${itemIdx}`}>
// //                     <SidebarMenuButton
// //                       asChild
// //                       isActive={isActive}
// //                       tooltip={item.label}
// //                       className={cn(
// //                         "gap-2.5 rounded-lg font-normal text-sidebar-foreground/80 transition-colors",
// //                         "hover:bg-primary/8 hover:text-sidebar-foreground",
// //                         isActive &&
// //                           "bg-indigo-600 dark:bg-indigo-700 font-medium text-white shadow-sm hover:bg-indigo-800 hover:text-primary-foreground",
// //                       )}
// //                     >
// //                       <Link href={item.href} onClick={handleNavClick} title={item.description}>
// //                         {item.icon && (
// //                           <span
// //                             className={cn(
// //                               "shrink-0",
// //                               isActive ? "text-primary-foreground" : "text-muted-foreground",
// //                             )}
// //                           >
// //                             {item.icon}
// //                           </span>
// //                         )}
// //                         <span className="flex-1 truncate">{item.label}</span>
// //                         {item.badge && (
// //                           <span
// //                             className={cn(
// //                               "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
// //                               isActive
// //                                 ? "bg-white/20 text-white"
// //                                 : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
// //                             )}
// //                           >
// //                             {item.badge}
// //                           </span>
// //                         )}
// //                       </Link>
// //                     </SidebarMenuButton>
// //                   </SidebarMenuItem>
// //                 );
// //               }

// //               return (
// //                 <Collapsible
// //                   key={`${groupIdx}-${itemIdx}`}
// //                   defaultOpen={isActive}
// //                   className="group/collapsible"
// //                 >
// //                   <SidebarMenuItem>
// //                     <CollapsibleTrigger asChild>
// //                       <SidebarMenuButton
// //                         tooltip={item.label}
// //                         className={cn(
// //                           "gap-2.5 rounded-lg font-normal text-sidebar-foreground/80 transition-colors",
// //                           "hover:bg-primary/8 hover:text-sidebar-foreground",
// //                           isActive && "bg-primary/10 text-sidebar-foreground",
// //                         )}
// //                       >
// //                         {item.icon && (
// //                           <span className="shrink-0 text-muted-foreground">{item.icon}</span>
// //                         )}
// //                         <span className="flex-1 truncate">{item.label}</span>
// //                         <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/collapsible:rotate-180" />
// //                       </SidebarMenuButton>
// //                     </CollapsibleTrigger>

// //                     <CollapsibleContent>
// //                       <SidebarMenuSub className="border-sidebar-border/60">
// //                         {/* TODO: map item.children once NavItem gains a children field —
// //                             kept as a single link for now to match the current type. */}
// //                         <SidebarMenuSubItem>
// //                           <SidebarMenuSubButton asChild isActive={isActive}>
// //                             <Link href={item.href} onClick={handleNavClick}  className={cn(
// //                         "gap-2.5 rounded-lg font-normal text-sidebar-foreground/80 transition-colors",
// //                         "hover:bg-primary/8 hover:text-sidebar-foreground",
// //                         isActive &&
// //                           "bg-indigo-600 dark:bg-indigo-700 font-medium text-white shadow-sm hover:bg-indigo-800 hover:text-primary-foreground",
// //                       )}>
// //                               {item.label}
// //                             </Link>
// //                           </SidebarMenuSubButton>
// //                         </SidebarMenuSubItem>
// //                       </SidebarMenuSub>
// //                     </CollapsibleContent>
// //                   </SidebarMenuItem>
// //                 </Collapsible>
// //               );
// //             })}
// //           </SidebarMenu>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }
// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Briefcase,
//   ChevronDown,
//   Folder,
//   Settings,
//   Users,
//   Wallet,
//   type LucideIcon,
// } from "lucide-react";

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { cn } from "@/lib/utils";
// import type { NavGroup } from "@/lib/dashboard-config";

// // নতুন icon লাগলে এখানে import করে যোগ করুন
// const GROUP_ICONS: Record<string, LucideIcon> = {
//   Wallet,
//   Users,
//   Briefcase,
//   Settings,
// };

// interface SidebarNavItemsProps {
//   groups: NavGroup[];
// }

// const activeLinkClass =
//   "bg-indigo-600 dark:bg-indigo-700 font-medium text-white shadow-sm hover:bg-indigo-800 hover:text-white";

// export function SidebarNavItems({ groups }: SidebarNavItemsProps) {
//   const pathname = usePathname();
//   const { isMobile, setOpenMobile, state } = useSidebar();
//   const isCollapsed = state === "collapsed";

//   const handleNavClick = () => {
//     if (isMobile) setOpenMobile(false);
//   };

//   // "/dashboard" শুধু exact match, বাকিগুলো prefix match
//   const isItemActive = (href: string) =>
//     href === "/dashboard"
//       ? pathname === href
//       : pathname === href || pathname.startsWith(href + "/");

//   // যে ফোল্ডারের ভেতরে বর্তমান page আছে
//   const activeGroupLabel =
//     groups.find(
//       (g) => g.collapsible && g.items.some((i) => isItemActive(i.href)),
//     )?.label ?? null;

//   // একসাথে একটাই ফোল্ডার খোলা থাকবে
//   const [openGroup, setOpenGroup] = React.useState<string | null>(
//     activeGroupLabel,
//   );

//   // page বদলালে সংশ্লিষ্ট ফোল্ডার auto-open
//   React.useEffect(() => {
//     if (activeGroupLabel) setOpenGroup(activeGroupLabel);
//   }, [activeGroupLabel, pathname]);

//   return (
//     <div className="space-y-1">
//       {groups.map((group, groupIdx) => {
//         /* ---------- সাধারণ group (ফোল্ডার না) ---------- */
//         if (!group.collapsible) {
//           return (
//             <div key={`group-${groupIdx}`} className="pb-3">
//               {group.label && !isCollapsed && (
//                 <p className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
//                   {group.label}
//                 </p>
//               )}
//               <SidebarMenu>
//                 {group.items.map((item, itemIdx) => {
//                   const isActive = isItemActive(item.href);
//                   return (
//                     <SidebarMenuItem key={`${groupIdx}-${itemIdx}`}>
//                       <SidebarMenuButton
//                         asChild
//                         isActive={isActive}
//                         tooltip={item.label}
//                         className={cn(
//                           "gap-2.5 rounded-lg font-normal text-sidebar-foreground/80 transition-colors",
//                           "hover:bg-primary/8 hover:text-sidebar-foreground",
//                           isActive && activeLinkClass,
//                         )}
//                       >
//                         <Link
//                           href={item.href}
//                           onClick={handleNavClick}
//                           title={item.description}
//                         >
//                           <span className="flex-1 truncate">{item.label}</span>
//                           {item.badge && (
//                             <span
//                               className={cn(
//                                 "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
//                                 isActive
//                                   ? "bg-white/20 text-white"
//                                   : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
//                               )}
//                             >
//                               {item.badge}
//                             </span>
//                           )}
//                         </Link>
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   );
//                 })}
//               </SidebarMenu>
//             </div>
//           );
//         }

//         /* ---------- ফোল্ডার group ---------- */
//         const FolderIcon = (group.icon && GROUP_ICONS[group.icon]) || Folder;
//         const isOpen = openGroup === group.label;
//         const hasActiveChild = group.items.some((i) => isItemActive(i.href));

//         return (
//           <SidebarMenu key={`group-${groupIdx}`}>
//             <Collapsible
//               open={isOpen}
//               onOpenChange={(next) => setOpenGroup(next ? group.label : null)}
//               className="group/collapsible"
//             >
//               <SidebarMenuItem>
//                 <CollapsibleTrigger asChild>
//                   <SidebarMenuButton
//                     tooltip={group.label}
//                     className={cn(
//                       "gap-2.5 rounded-lg font-medium text-sidebar-foreground/90 transition-colors",
//                       "hover:bg-primary/8 hover:text-sidebar-foreground",
//                       hasActiveChild && !isOpen && "bg-primary/10",
//                     )}
//                   >
//                     <FolderIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
//                     <span className="flex-1 truncate">{group.label}</span>
//                     <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
//                   </SidebarMenuButton>
//                 </CollapsibleTrigger>

//                 <CollapsibleContent>
//                   <SidebarMenuSub className="border-sidebar-border/60">
//                     {group.items.map((item, itemIdx) => {
//                       const isActive = isItemActive(item.href);
//                       return (
//                         <SidebarMenuSubItem key={`${groupIdx}-${itemIdx}`}>
//                           <SidebarMenuSubButton
//                             asChild
//                             isActive={isActive}
//                             className={cn(
//                               "rounded-lg font-normal text-sidebar-foreground/80 transition-colors",
//                               "hover:bg-primary/8 hover:text-sidebar-foreground",
//                               isActive && activeLinkClass,
//                             )}
//                           >
//                             <Link
//                               href={item.href}
//                               onClick={handleNavClick}
//                               title={item.description}
//                             >
//                               <span className="truncate">{item.label}</span>
//                             </Link>
//                           </SidebarMenuSubButton>
//                         </SidebarMenuSubItem>
//                       );
//                     })}
//                   </SidebarMenuSub>
//                 </CollapsibleContent>
//               </SidebarMenuItem>
//             </Collapsible>
//           </SidebarMenu>
//         );
//       })}
//     </div>
//   );
// }