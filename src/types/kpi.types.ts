export type KpiType = "individual" | "team";
export type KpiStatus = "draft" | "active" | "closed";
export type KpiUnit = "amount" | "count";
export type KpiReportStatus = "draft" | "submitted" | "reviewed";

export interface KpiExtraItem {
  /** Stable id used by reports; generated from the name when the item is created. */
  key: string;
  name: string;
  unit: KpiUnit;
  target: number;
}

export interface KpiUserRef {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: string;
  designation?: string;
}

/** All money values are in BDT. */
export interface IKpi {
  _id: string;
  type: KpiType;
  /** YYYY-MM */
  month: string;
  user?: KpiUserRef | null;
  targetSales: number;
  targetProjects: number;
  budget: number;
  extraItems: KpiExtraItem[];
  status: KpiStatus;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KpiAchievement {
  achievedProjects: number;
  achievedSales: number;
}

/** Null when the target is 0 or missing. */
export interface KpiPercentages {
  sales: number | null;
  projects: number | null;
}

export interface KpiTargetsSummary {
  _id: string;
  status: KpiStatus;
  targetSales: number;
  targetProjects: number;
  budget: number;
  extraItems?: KpiExtraItem[];
}

export interface KpiProgressMember {
  user: KpiUserRef & { isActive?: boolean };
  kpi: KpiTargetsSummary | null;
  achievement: KpiAchievement;
  percentages: KpiPercentages;
}

export interface KpiProgress {
  month: string;
  members: KpiProgressMember[];
  team: {
    kpi: KpiTargetsSummary | null;
    achievement: KpiAchievement;
    percentages: KpiPercentages;
  };
}

export interface KpiTeamContext {
  month: string;
  team: IKpi | null;
  sumOfIndividualTargets: {
    targetSales: number;
    targetProjects: number;
    budget: number;
    individualCount: number;
  };
}

export interface KpiBulkResult {
  created: IKpi[];
  skipped: { user: string; reason: string }[];
}

/** Admin-only: one credited project with its value. */
export interface KpiProjectRow {
  projectId: string;
  name: string;
  status: string;
  createdAt: string;
  client: { _id: string; name: string };
  creditedTo: { _id: string; name: string };
  value: number;
}

export interface KpiProjectBreakdown {
  month: string;
  userId: string | null;
  projects: KpiProjectRow[];
  totals: KpiAchievement;
}

/** Per-person row of the team summary (GET /kpi-reports/summary). Totals only, never project values. */
export interface KpiReportSummaryPerson {
  user: KpiUserRef;
  kpi: KpiTargetsSummary;
  report: {
    status: KpiReportStatus | "none";
    isLate: boolean;
    submittedAt: string | null;
  };
  /** "snapshot" once the report is submitted or reviewed, otherwise "live". */
  achievementSource: "snapshot" | "live";
  achievement: KpiAchievement;
  percentages: KpiPercentages;
  budget: { planned: number; spent: number | null };
}

export interface KpiReportSummary {
  month: string;
  people: KpiReportSummaryPerson[];
  team: {
    kpi: KpiTargetsSummary | null;
    /** Sum of the rows above (snapshots for submitted reports, live values for the rest). */
    achievement: KpiAchievement;
    percentages: KpiPercentages;
    /** Live total over all credited work, for comparison. */
    liveAchievement: KpiAchievement;
  };
}

/** One report as listed for reviewers (GET /kpi-reports): owner and KPI are populated. */
export interface KpiReportRecord extends Omit<IKpiReport, "_id"> {
  _id: string;
  user: KpiUserRef;
  kpi: KpiTargetsSummary & { month: string; extraItems: KpiExtraItem[] };
}

export interface KpiReportListQuery {
  month?: string;
  status?: KpiReportStatus;
  userId?: string;
  page?: number;
  limit?: number;
}

/* ------------------------------- payloads ------------------------------- */

export interface KpiListQuery {
  month?: string;
  userId?: string;
  type?: KpiType;
  status?: KpiStatus;
  page?: number;
  limit?: number;
}

export interface CreateKpiPayload {
  type: KpiType;
  month: string;
  user?: string;
  targetSales: number;
  targetProjects: number;
  budget: number;
  extraItems: KpiExtraItem[];
  status?: "draft" | "active";
  note?: string;
}

export interface UpdateKpiPayload {
  targetSales?: number;
  targetProjects?: number;
  budget?: number;
  extraItems?: KpiExtraItem[];
  note?: string;
}

export interface BulkKpiPayload {
  month: string;
  items: {
    user: string;
    targetSales: number;
    targetProjects: number;
    budget: number;
    extraItems: KpiExtraItem[];
  }[];
}

/* --------------------------- member-facing (own KPI) --------------------------- */

/** One credited project as the member sees it. There is deliberately no value field. */
export interface KpiMyProject {
  _id: string;
  name: string;
  status: string;
  clientName: string;
  createdAt: string;
}

/** GET /kpis/me/progress */
export interface KpiMyProgress {
  month: string;
  individual: {
    kpi: IKpi | null;
    achievement: KpiAchievement;
    percentages: KpiPercentages;
  };
  team: {
    kpi: IKpi | null;
    achievement: KpiAchievement;
    percentages: KpiPercentages;
  };
  creditedProjects: KpiMyProject[];
}

export interface KpiReportPerson {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface KpiReportExtraResult {
  key: string;
  achieved: number;
}

export interface IKpiReport {
  /** Null while the report has never been saved. */
  _id: string | null;
  month: string;
  status: KpiReportStatus;
  /** Frozen at submit time. Absent while the report is a draft. */
  snapshot?: KpiAchievement;
  actualBudgetSpent: number;
  extraItemResults: KpiReportExtraResult[];
  summary?: string;
  challenges?: string;
  isLate: boolean;
  submittedAt?: string;
  reviewedBy?: KpiReportPerson | null;
  reviewedAt?: string;
  reviewComment?: string;
  /** Set when a lead or admin sent the report back to draft. */
  returnedBy?: KpiReportPerson | null;
  returnedAt?: string;
  returnComment?: string;
  updatedAt?: string;
}

/** GET /kpi-reports/me */
export interface KpiMyReport {
  month: string;
  kpi: KpiTargetsSummary & { month: string; extraItems: KpiExtraItem[] };
  report: IKpiReport;
  liveAchievement: KpiAchievement;
  percentages: KpiPercentages;
  timing: {
    submitOpensAt: string;
    deadlineAt: string;
    canSubmit: boolean;
    isPastDeadline: boolean;
  };
}

export interface KpiReportContentPayload {
  actualBudgetSpent: number;
  extraItemResults: KpiReportExtraResult[];
  summary: string;
  challenges: string;
}
