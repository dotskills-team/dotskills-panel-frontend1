// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { LogOut, Search } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
// import { navigationConfig } from "@/lib/dashboard-config";
// import type { UserRole } from "@/lib/permissions";
// import { cn } from "@/lib/utils";
// import { authService } from "@/services/auth.service";
// import { useAuthStore } from "@/stores";
// import { useRouter } from "next/navigation";

// import { SidebarNavItems } from "./SidebarNavItems";
// import Image from "next/image";

// type PremiumSidebarProps = React.ComponentProps<typeof Sidebar> & {
//   onSearchClick?: () => void;
// };

// function openCommandMenu() {
//   window.dispatchEvent(new CustomEvent("dotskills:open-command-menu"));
// }

// export function PremiumSidebar({
//   onSearchClick,
//   ...props
// }: PremiumSidebarProps) {
//   const { data: user, isLoading } = useCurrentUser();
//   const { isMobile, setOpenMobile, state } = useSidebar();
//   const router = useRouter();
//   const reset = useAuthStore((s) => s.reset);
//   const [isLoggingOut, setIsLoggingOut] = React.useState(false);

//   const isCollapsed = state === "collapsed";
//   const handleSearch = onSearchClick ?? openCommandMenu;

//   const handleLinkClick = () => {
//     if (isMobile) setOpenMobile(false);
//   };

//   async function handleLogout() {
//     setIsLoggingOut(true);
//     try {
//       await authService.logout();
//     } finally {
//       reset();
//       router.replace("/login");
//     }
//   }

//   if (isLoading) {
//     return (
//       <Sidebar {...props}>
//         <SidebarHeader className="border-b border-border/50 px-4 py-4">
//           <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
//         </SidebarHeader>
//         <SidebarContent className="px-3 py-4">
//           <div className="space-y-2.5">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="h-9 animate-pulse rounded-lg bg-gray-100"
//               />
//             ))}
//           </div>
//         </SidebarContent>
//       </Sidebar>
//     );
//   }

//   if (!user?.role) {
//     return (
//       <Sidebar {...props}>
//         <SidebarHeader className="px-4 py-4">
//           <p className="text-center text-sm text-destructive">
//             Failed to load sidebar
//           </p>
//         </SidebarHeader>
//       </Sidebar>
//     );
//   }

//   const userRole = (user.role as UserRole) || "STAFF";
//   const navGroups = navigationConfig[userRole] || navigationConfig.STAFF;
//   const fullName =
//     [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";
//   const initials =
//     `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase();

//   return (
//     <Sidebar
//       {...props}
//       className={cn(
//         "border-r border-border/60 bg-gray-100 dark:bg-slate-950",
//         props.className,
//       )}
//     >
//       {/* Brand */}
//       <SidebarHeader className="gap-3 border-b border-border/60 bg-gray-100 dark:bg-slate-950 px-3 py-4">
//         <Link
//           href="/dashboard"
//           onClick={handleLinkClick}
//           className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
//         >
// <div className="flex h-20 items-center pl-0 pr-6">
//   <Image
//     src="/assets/dotskills-logo-sidebar-black.png"
//     alt="DotSkills Panel"
//     width={180}
//     height={45}
//     priority
//     className="h-12 w-auto select-none object-contain dark:invert"
//   />
// </div>

//           {/* {!isCollapsed && (
//             <div className="flex flex-col leading-none">
//               <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
//                 DotSkills
//               </span>
//               <span className="text-[11px] font-medium text-muted-foreground">
//                 Panel
//               </span>
//             </div>
//           )} */}
//         </Link>

//         {isCollapsed ? (
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={handleSearch}
//                 className="h-9 w-9 rounded-lg border-border/60 dark:bg-slate-800 bg-gray-100/40 text-muted-foreground hover:bg-gray-100 hover:text-foreground"
//               >
//                 <Search className="h-4 w-4" aria-hidden="true" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent side="right">Search menu (⌘K)</TooltipContent>
//           </Tooltip>
//         ) : (
//           <button
//             type="button"
//             onClick={handleSearch}
//             className="flex w-full items-center gap-2 rounded-lg border border-border/60 bg-gray-100/40 dark:bg-slate-800 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
//           >
//             <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
//             <span className="flex-1 truncate text-left">Search menu...</span>
//             <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-border/60 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
//               ⌘K
//             </kbd>
//           </button>
//         )}
//       </SidebarHeader>

//       {/* Navigation */}
//       <SidebarContent className="flex flex-col bg-gray-100 dark:bg-slate-950">
//         <ScrollArea className="flex-1 px-2 py-3 max-h-[70vh]">
//           <SidebarNavItems groups={navGroups} />
//           <ScrollBar orientation="vertical" />
//         </ScrollArea>
//       </SidebarContent>

//       {/* Footer — user chip + logout */}
//       <SidebarFooter className="z-100 bg-gray-100 dark:bg-slate-950 gap-2 border-t border-border/60 px-3 py-3">
//         {!isCollapsed && (
//           <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
//             <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary ring-1 ring-primary/20">
//               {initials || "U"}
//             </span>
//             <div className="min-w-0 flex-1 leading-none">
//               <p className="truncate text-sm font-medium text-sidebar-foreground">
//                 {fullName}
//               </p>
//               <p className="truncate text-xs text-muted-foreground">
//                 {user.designation || userRole}
//               </p>
//             </div>
//           </div>
//         )}

//         {isCollapsed ? (
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={handleLogout}
//                 disabled={isLoggingOut}
//                 className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
//               >
//                 <LogOut className="h-4 w-4" aria-hidden="true" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent side="right">Log out</TooltipContent>
//           </Tooltip>
//         ) : (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
//           >
//             <LogOut className="h-4 w-4" aria-hidden="true" />
//             {isLoggingOut ? "Logging out..." : "Log out"}
//           </Button>
//         )}
//       </SidebarFooter>

//       <SidebarRail />
//     </Sidebar>
//   );
// }

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { navigationConfig } from "@/lib/dashboard-config";
import type { UserRole } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores";

import { SidebarNavItems } from "./SidebarNavItems";

type PremiumSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onSearchClick?: () => void;
};

function openCommandMenu() {
  window.dispatchEvent(new CustomEvent("dotskills:open-command-menu"));
}

/**
 * Colour system (light / dark)
 * surface : white            / slate-950
 * border  : slate-200        / slate-800
 * text    : slate-900        / slate-100
 * muted   : slate-500        / slate-400
 * field   : slate-50         / slate-900
 */

// Forces the inner shadcn sidebar panel to use our surface colour too
const SURFACE =
  "bg-white dark:bg-slate-950 " +
  "[&_[data-sidebar=sidebar]]:bg-white dark:[&_[data-sidebar=sidebar]]:bg-slate-950";

export function PremiumSidebar({
  onSearchClick,
  ...props
}: PremiumSidebarProps) {
  const { data: user, isLoading } = useCurrentUser();
  const { isMobile, setOpenMobile, state } = useSidebar();
  const router = useRouter();
  const reset = useAuthStore((s) => s.reset);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const isCollapsed = state === "collapsed";
  const handleSearch = onSearchClick ?? openCommandMenu;

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } finally {
      reset();
      router.replace("/login");
    }
  }

  if (isLoading) {
    return (
      <Sidebar
        {...props}
        className={cn(
          "border-r border-slate-200 dark:border-slate-800",
          SURFACE,
          props.className,
        )}
      >
        <SidebarHeader className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        </SidebarHeader>
        <SidebarContent className="px-3 py-4">
          <div className="space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (!user?.role) {
    return (
      <Sidebar
        {...props}
        className={cn(
          "border-r border-slate-200 dark:border-slate-800",
          SURFACE,
          props.className,
        )}
      >
        <SidebarHeader className="px-4 py-4">
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            Failed to load sidebar
          </p>
        </SidebarHeader>
      </Sidebar>
    );
  }

  const userRole = (user.role as UserRole) || "STAFF";
  const navGroups = navigationConfig[userRole] || navigationConfig.STAFF;
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";
  const initials =
    `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <Sidebar
      {...props}
      className={cn(
        "border-r border-slate-200 text-slate-900 dark:border-slate-800 dark:text-slate-100",
        SURFACE,
        props.className,
      )}
    >
      {/* Brand */}
      <SidebarHeader className="gap-3 border-b border-slate-200 bg-white px-3 py-4 dark:border-slate-800 dark:bg-slate-950">
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
        >
          <div className="flex h-8 items-center pl-0 pr-6">
            <Image
              src="/assets/dotskills-logo-sidebar-black.png"
              alt="DotSkills Panel"
              width={180}
              height={45}
              priority
              className="h-12 w-auto select-none object-contain dark:invert"
            />
          </div>
        </Link>

        {/* {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSearch}
                className="h-9 w-9 rounded-lg border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Search menu (⌘K)</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={handleSearch}
            className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate text-left">Search menu...</span>
            <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 sm:flex">
              ⌘K
            </kbd>
          </button>
        )} */} 
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="flex flex-col bg-white dark:bg-slate-950">
        <ScrollArea className="max-h-[70vh] flex-1 px-2 py-3">
          <SidebarNavItems groups={navGroups} />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SidebarContent>

      {/* Footer: user chip + logout */}
      <SidebarFooter className="z-100 gap-2 border-t border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950">
        {/* {!isCollapsed && (
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-900">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600/10 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-600/20 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/25">
              {initials || "U"}
            </span>
            <div className="min-w-0 flex-1 leading-none">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {fullName}
              </p>
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {user.designation || userRole}
              </p>
            </div>
          </div>
        )} */}

        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="h-9 w-9 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}