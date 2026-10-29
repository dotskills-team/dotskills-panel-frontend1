import {
  PaymentStatus,
  ProjectStatus,
  ProjectType,
} from "@/types/project.types";

export const projectSearchableFields = [
  "name",
  "description",
  "technologies",
];

export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  {
    label: string;
    value: ProjectStatus;
    variant:
      | "default"
      | "secondary"
      | "outline"
      | "destructive"
      | "success"
      | "warning"
      | "info";
    className: string;
  }
> = {
  PLANNING: {
    label: "Planning",
    value: ProjectStatus.PLANNING,
    variant: "secondary",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  },

  IN_PROGRESS: {
    label: "In Progress",
    value: ProjectStatus.IN_PROGRESS,
    variant: "info",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },

  ON_HOLD: {
    label: "On Hold",
    value: ProjectStatus.ON_HOLD,
    variant: "warning",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },

  COMPLETED: {
    label: "Completed",
    value: ProjectStatus.COMPLETED,
    variant: "success",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },

  CANCELLED: {
    label: "Cancelled",
    value: ProjectStatus.CANCELLED,
    variant: "destructive",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
    DONE_DUE: {
    label: "Done & Due",
    value: ProjectStatus.DONE_DUE,
    variant: "warning",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
      DELIVERED: {
    label: "Delivered",
    value: ProjectStatus.DELIVERED,
    variant: "success",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  PENDING: {
    label: "Pending",
    value: ProjectStatus.PENDING,
    variant: "warning",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
};

export const PROJECT_TYPE_CONFIG: Record<
  ProjectType,
  {
    label: string;
    value: ProjectType;
    variant:
      | "default"
      | "secondary"
      | "outline"
      | "destructive"
      | "success"
      | "warning"
      | "info";
    className: string;
  }
> = {
  WORDPRESS: {
    label: "WordPress",
    value: ProjectType.WORDPRESS,
    variant: "info",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },

  MERN: {
    label: "MERN",
    value: ProjectType.MERN,
    variant: "success",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },

  PERN: {
    label: "PERN",
    value: ProjectType.PERN,
    variant: "success",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },

  NEXT_JS: {
    label: "Next.js",
    value: ProjectType.NEXT_JS,
    variant: "default",
    className:
      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  },

  SHOPIFY: {
    label: "Shopify",
    value: ProjectType.SHOPIFY,
    variant: "warning",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },

  LARAVEL: {
    label: "Laravel",
    value: ProjectType.LARAVEL,
    variant: "destructive",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },

  PHP: {
    label: "PHP",
    value: ProjectType.PHP,
    variant: "info",
    className:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  },

  MOBILE_APP: {
    label: "Mobile App",
    value: ProjectType.MOBILE_APP,
    variant: "secondary",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },

  UI_UX: {
    label: "UI/UX",
    value: ProjectType.UI_UX,
    variant: "secondary",
    className:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  },
  VIDEO_EDITING: {
    label: "Video Editing",
    value: ProjectType.VIDEO_EDITING,
    variant: "secondary",
    className:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  },

  SEO: {
    label: "SEO",
    value: ProjectType.SEO,
    variant: "secondary",
    className:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  },
  IMAGE_DESIGN: {
    label: "Image Design",
    value: ProjectType.IMAGE_DESIGN,
    variant: "secondary",
    className:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  },
  DIGITAL_MARKETING: {
    label: "Digital Marketing",
    value: ProjectType.DIGITAL_MARKETING,
    variant: "secondary",
    className:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  },
  OTHER: {
    label: "Other",
    value: ProjectType.OTHER,
    variant: "outline",
    className:
      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  },
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  {
    label: string;
    value: PaymentStatus;
    className: string;
  }
> = {
  DUE: {
    label: "Due",
    value: PaymentStatus.DUE,
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
  PARTIAL: {
    label: "Partial",
    value: PaymentStatus.PARTIAL,
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  ADVANCED: {
    label: "Advanced",
    value: PaymentStatus.ADVANCED,
    className:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  },
  COMPLETE: {
    label: "Complete",
    value: PaymentStatus.COMPLETE,
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
};

export const PAYMENT_STATUS_OPTIONS = Object.values(PAYMENT_STATUS_CONFIG);

export const PROJECT_STATUS_OPTIONS = Object.values(
  PROJECT_STATUS_CONFIG,
);

export const PROJECT_TYPE_OPTIONS = Object.values(
  PROJECT_TYPE_CONFIG,
);

export const DEFAULT_PROJECT_FILTERS = {
  page: 1,
  limit: 10,
  searchTerm: "",

  status: undefined,
  type: undefined,
  client: undefined,
  projectManager: undefined,

  sort: "-startDate",
};

export const PROJECT_PAGE_SIZES = [
  10,
  20,
  30,
  50,
  100,
] as const;

export const DEFAULT_PAGE_SIZE = 10;

