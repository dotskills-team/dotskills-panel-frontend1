import { UserRole, PageAccess } from "./permissions";

export interface NavGroup {
  label: string;
  icon?: string; 
  iconColor?: string; 
  items: NavItem[];
  collapsible?: boolean;
}

export interface NavItem {
  id: PageAccess;
  label: string;
  href: string;
  icon?: string; 
  iconColor?: string; 
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

/* ------------------------------------------------------------------ */
/* Icon colours (light / dark). Full class names so Tailwind detects   */
/* them.                                                               */
/* ------------------------------------------------------------------ */
const COLOR = {
  indigo: "text-indigo-600 dark:text-indigo-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  teal: "text-teal-600 dark:text-teal-400",
  sky: "text-sky-600 dark:text-sky-400",
  blue: "text-blue-600 dark:text-blue-400",
  violet: "text-violet-600 dark:text-violet-400",
  purple: "text-purple-600 dark:text-purple-400",
  amber: "text-amber-600 dark:text-amber-400",
  orange: "text-orange-600 dark:text-orange-400",
  rose: "text-rose-600 dark:text-rose-400",
  pink: "text-pink-600 dark:text-pink-400",
  cyan: "text-cyan-600 dark:text-cyan-400",
  slate: "text-slate-600 dark:text-slate-400",
} as const;

/* ------------------------------------------------------------------ */
/* Icon + colour for every menu item (reused across all roles)         */
/* ------------------------------------------------------------------ */
const NAV_ICON = {
  dashboard: { icon: "LayoutDashboard", iconColor: COLOR.indigo },

  // Accounts
  expenseCategory: { icon: "Tags", iconColor: COLOR.orange },
  expense: { icon: "Receipt", iconColor: COLOR.rose },
  financial: { icon: "Landmark", iconColor: COLOR.emerald },
  fundTransfer: { icon: "ArrowLeftRight", iconColor: COLOR.sky },
  payments: { icon: "CreditCard", iconColor: COLOR.violet },

  // Management
  team: { icon: "Users", iconColor: COLOR.blue },
  teamSalary: { icon: "Banknote", iconColor: COLOR.teal },
  clients: { icon: "Building2", iconColor: COLOR.cyan },
  projects: { icon: "FolderKanban", iconColor: COLOR.purple },
  managerProjectManagement: { icon: "FolderKanban", iconColor: COLOR.purple },
  products: { icon: "Package", iconColor: COLOR.amber },

  // Operations
  leads: { icon: "Target", iconColor: COLOR.pink },
  orders: { icon: "ShoppingCart", iconColor: COLOR.orange },
  myOrders: { icon: "ClipboardList", iconColor: COLOR.amber },

  // System
  settings: { icon: "Settings", iconColor: COLOR.slate },
  security: { icon: "ShieldCheck", iconColor: COLOR.emerald },

  // Developer / Content
  apiKeys: { icon: "KeyRound", iconColor: COLOR.amber },
  myAssignedProjects: { icon: "Package", iconColor: COLOR.blue },
  mySalaries: { icon: "Payment", iconColor: COLOR.emerald },
  documentation: { icon: "BookOpen", iconColor: COLOR.sky },
  content: { icon: "PenSquare", iconColor: COLOR.violet },
} as const;

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
          ...NAV_ICON.dashboard,
        },
      ],
    },

    {
      label: "Accounts",
      icon: "Wallet",
      iconColor: COLOR.emerald,
      collapsible: true,
      items: [
        {
          id: "expenseCategory",
          label: "Expense-category",
          href: "/dashboard/expense-category",
          ...NAV_ICON.expenseCategory,
        },
        {
          id: "expense",
          label: "Expenses",
          href: "/dashboard/expenses",
          ...NAV_ICON.expense,
        },
        {
          id: "financial",
          label: "Financial-account",
          href: "/dashboard/financial-account",
          ...NAV_ICON.financial,
        },
        {
          id: "fundTransfer",
          label: "Fund Transfer",
          href: "/dashboard/fund-transfer",
          ...NAV_ICON.fundTransfer,
        },
        {
          id: "payments",
          label: "Payments",
          href: "/dashboard/payments",
          ...NAV_ICON.payments,
        },
      ],
    },
    {
      label: "Management",
      icon: "Users",
      iconColor: COLOR.blue,
      collapsible: true,
      items: [
        {
          id: "team-management",
          label: "Team",
          href: "/dashboard/admin/users",
          description: "Manage team members",
          ...NAV_ICON.team,
        },
        {
          id: "team-salary",
          label: "Team Salary",
          href: "/dashboard/team-salary",
          description: "Manage salary of team members",
          ...NAV_ICON.teamSalary,
        },
        {
          id: "clients-management",
          label: "Clients",
          href: "/dashboard/admin/clients",
          ...NAV_ICON.clients,
        },
        {
          id: "project-management",
          label: "Projects",
          href: "/dashboard/project",
          ...NAV_ICON.projects,
        },
      ],
    },
    {
      label: "Operations",
      icon: "Briefcase",
      iconColor: COLOR.orange,
      collapsible: true,
      items: [
        {
          id: "leads",
          label: "Leads",
          href: "/dashboard/leads",
          ...NAV_ICON.leads,
        },
      ],
    },
    {
      label: "System",
      icon: "Settings",
      iconColor: COLOR.slate,
      collapsible: true,
      items: [
        {
          id: "settings",
          label: "Settings",
          href: "/dashboard/settings",
          ...NAV_ICON.settings,
        },
        {
          id: "security",
          label: "Security",
          href: "/dashboard/security",
          ...NAV_ICON.security,
        },
      ],
    },
  ],

  ADMIN: [
    {
      label: "Overview",
      icon: "LayoutDashboard",
      iconColor: COLOR.indigo,
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
          ...NAV_ICON.dashboard,
        },
      ],
    },
    {
      label: "Management",
      icon: "Users",
      iconColor: COLOR.blue,
      collapsible: true,
      items: [
        {
          id: "team-management",
          label: "Team",
          href: "/dashboard/admin/users",
          description: "Manage team members",
          ...NAV_ICON.team,
        },
        {
          id: "team-salary",
          label: "Team Salary",
          href: "/dashboard/team-salary",
          description: "Manage salary of team members",
          ...NAV_ICON.teamSalary,
        },
        {
          id: "leads",
          label: "Leads",
          href: "/dashboard/leads",
          ...NAV_ICON.leads,
        },
        {
          id: "clients-management",
          label: "Clients",
          href: "/dashboard/admin/clients",
          ...NAV_ICON.clients,
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
          ...NAV_ICON.dashboard,
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
          ...NAV_ICON.leads,
        },
         
        {
          id: "clients-management",
          label: "Clients",
          href: "/dashboard/clients",
          ...NAV_ICON.clients,
        },
        {
          id: "manager-project-management",
          label: "Projects",
          href: "/dashboard/manager-projects",
          ...NAV_ICON.managerProjectManagement,
        },
        
      ],
    },
     {
      label: "My Account",
      items: [
        {
          id: "my-salaries",
          label: "My Salaries",
          href: "/dashboard/my-salaries",
          ...NAV_ICON.payments,
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
          ...NAV_ICON.dashboard,
        },
        // {
        //   id: "api-keys",
        //   label: "API Keys",
        //   href: "/dashboard/api-keys",
        //   ...NAV_ICON.apiKeys,
        // },
         {
          id: "my-assigned-projects",
          label: "My Assigned Projects",
          href: "/dashboard/my-assigned-projects",
          ...NAV_ICON.myAssignedProjects,
        },
          {
          id: "my-salaries",
          label: "My Salaries",
          href: "/dashboard/my-salaries",
          ...NAV_ICON.payments,
        },
        // {
        //   id: "documentation",
        //   label: "Documentation",
        //   href: "/dashboard/documentation",
        //   ...NAV_ICON.documentation,
        // },
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
          ...NAV_ICON.dashboard,
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
          ...NAV_ICON.leads,
        },
        {
          id: "team-salary",
          label: "Team Salary",
          href: "/dashboard/team-salary",
          description: "Manage salary of team members",
          ...NAV_ICON.teamSalary,
        },
        {
          id: "clients-management",
          label: "Clients",
          href: "/dashboard/clients",
          ...NAV_ICON.clients,
        },
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
          ...NAV_ICON.dashboard,
        },
        {
          id: "blogs",
          label: "Content",
          href: "/dashboard/blog",
          ...NAV_ICON.content,
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
          ...NAV_ICON.dashboard,
        },
        {
          id: "leads",
          label: "Leads",
          href: "/dashboard/leads",
          ...NAV_ICON.leads,
        },
        {
          id: "team-salary",
          label: "Team Salary",
          href: "/dashboard/team-salary",
          description: "Manage salary of team members",
          ...NAV_ICON.teamSalary,
        },
        {
          id: "clients-management",
          label: "Clients",
          href: "/dashboard/clients",
          ...NAV_ICON.clients,
        },
        
      ],
    },
  ],
};