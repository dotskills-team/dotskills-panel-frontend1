/**
 * Dashboard configuration - defines navigation structure, colors, and layout
 */

import { PageAccess, UserRole } from "@/lib/permissions";

// import { UserRole, PageAccess } from "./permissions";

export interface NavGroup {
  label: string;
  items: NavItem[];
  collapsible?: boolean;
}

export interface NavItem {
  id: PageAccess;
  label: string;
  href: string;
  icon?: string; 
  badge?: string;
  description?: string;
}

export interface DashboardConfig {
  brand: {
    name: string;
    logo?: string;
  };
  sidebar: {
    width: number;
    collapsedWidth: number;
    theme: "light" | "dark" | "auto";
  };
  header: {
    height: number;
    sticky: boolean;
  };
  colors: {
    primary: string;
    accent: string;
    muted: string;
  };
}

export const dashboardConfig: DashboardConfig = {
  brand: {
    name: "DotSkills Panel",
  },
  sidebar: {
    width: 280,
    collapsedWidth: 80,
    theme: "auto",
  },
  header: {
    height: 64,
    sticky: true,
  },
  colors: {
    primary: "hsl(41 100% 50%)",
    accent: "hsl(41 100% 50%)",
    muted: "hsl(0 0% 64%)",
  },
};

export const navigationConfig: Record<UserRole, NavGroup[]> = {
  SUPER_ADMIN: [
    {
      label: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
          description: "Main dashboard",
        },
      ],
    },
    {
      label: "Management",
      collapsible: true,
      items: [
        {
          id: "team-management",
          label: "Team",
          href: "/dashboard/admin/users",
          description: "Manage team members",
        },
        {
          id: "team-salary",
          label: "Team Salary",
          href: "/dashboard/team-salary",
          description: "Manage salary of team members",
        },
        {
          id: "clients-management",
          label: "Clients",
          href: "/dashboard/admin/clients",
        },
        {
          id: "project-management",
          label: "Projects",
          href: "/dashboard/project",
        },
      ],
    },
    {
      label: "Operations",
      collapsible: true,
      items: [
        {
          id: "leads",
          label: "Leads",
          href: "/dashboard/leads",
        }
      ],
    },
    {
      label: "System",
      collapsible: true,
      items: [
        {
          id: "settings",
          label: "Settings",
          href: "/dashboard/settings",
        },
        {
          id: "security",
          label: "Security",
          href: "/dashboard/security",
        },
      ],
    },
{
  label: "Financial Account",
  collapsible: true,
  items: [
    {
      id: "financial",
      label: "Account",
      href: "/dashboard/financial-account",
    },
    {
      id: "expense",
      label: "Expense",
      href: "/dashboard/expenses",
    },
    {
      id: "expenseCategory",
      label: "Expense Category",
      href: "/dashboard/expense-category",
    },
    {
      id: "payments",
      label: "Payments",
      href: "/dashboard/payments",
    },
  ],
},
  ],
  ADMIN: [
    {
      label: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
        },
      ],
    },
    {
      label: "Management",
      collapsible: true,
      items: [
        {
          id: "team-management",
          label: "Team",
          href: "/dashboard/admin/users",
          description: "Manage team members",
        },
         {
          id: "team-salary",
          label: "Team Salary",
          href: "/dashboard/team-salary",
          description: "Manage salary of team members",
        },
        {
          id: "leads",
          label: "Leads",
          href: "/dashboard/leads",
        },
       {
          id: "clients-management",
          label: "Clients",
          href: "/dashboard/admin/clients",
        },
      ],
    },
  ],
  MANAGER: [
    {
      label: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
        },
      ],
    },
    {
      label: "Operations",

      items: [
        {
          id: "leads",
          label: "Leads",
          href: "/dashboard/leads",
        },
         {
          id: "clients-management",
          label: "Clients",
          href: "/dashboard/clients",
        },
      ],
    },
  ],
  DEVELOPER: [
    {
      label: "Development",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          id: "api-keys",
          label: "API Keys",
          href: "/dashboard/api-keys",
        },
        {
          id: "documentation",
          label: "Documentation",
          href: "/dashboard/documentation",
        },
      ],
    },
  ],
  DESIGNER: [
    {
      label: "Design",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
        },
      ],
    },
  ],
  MARKETER: [
    {
      label: "Marketing",
      items: [
        {
          id: "leads",
          label: "Leads",
          href: "/dashboard/leads",
        },
         {
          id: "team-salary",
          label: "Team Salary",
          href: "/dashboard/team-salary",
          description: "Manage salary of team members",
        },
         {
          id: "clients-management",
          label: "Clients",
          href: "/dashboard/clients",
        },
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          id: "blogs",
          label: "Content",
          href: "/dashboard/blog",
        },
      ],
    },
  ],
  STAFF: [
    {
      label: "Quick Links",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          id: "leads",
          label: "Leads",
          href: "/dashboard/leads",
        },
         {
          id: "team-salary",
          label: "Team Salary",
          href: "/dashboard/team-salary",
          description: "Manage salary of team members",
        },
         {
          id: "clients-management",
          label: "Clients",
          href: "/dashboard/clients",
        },
        
      ],
    },
  ],
};
