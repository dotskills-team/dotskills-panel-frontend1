import { LeadStatsData } from "@/components/dashboard/lead/leads-stats";
import type { ApiResponse } from "@/types";

export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  PROPOSAL_SENT = "PROPOSAL_SENT",
  NEGOTIATION = "NEGOTIATION",
  ON_HOLD = "ON_HOLD",
  CONFIRMED_MEETING = "CONFIRMED_MEETING",
  WON = "WON",
  LOST = "LOST",
}

export enum LeadPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum LeadType {
  WEBSITE = "WEBSITE",
  SOFTWARE = "SOFTWARE"
}

export enum LeadSource {
  WEBSITE = "WEBSITE",
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
  LINKEDIN = "LINKEDIN",
  WHATSAPP = "WHATSAPP",
  EMAIL = "EMAIL",
  PHONE_CALL = "PHONE_CALL",
  REFERRAL = "REFERRAL",
  MANUAL = "MANUAL",
  OTHER = "OTHER",
}

export enum PreferredContactMethod {
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  WHATSAPP = "WHATSAPP",
  SMS = "SMS",
}

export enum AttachmentType {
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
  SPREADSHEET = "SPREADSHEET",
  PDF = "PDF",
  OTHER = "OTHER",
}

export enum LeadContactStatus {
  NO_RESPONSE = "NO_RESPONSE",
  BUSY = "BUSY",
  NEXT_CONTACT = "NEXT_CONTACT",
  PHONE_OFF = "PHONE_OFF",
}

export interface IUserSummary {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  designation?: string;
}

export interface ILeadAttachment {
  _id?: string;
  title: string;
  url: string;
  type: AttachmentType;
  uploadedBy?: IUserSummary;
  uploadedAt?: string;
}

export interface ILeadNote {
  _id?: string;
  message: string;
  createdBy: IUserSummary;
  createdAt?: string;
}

export interface ILead {
  _id: string;

  firstName: string;
  lastName: string;
  fullName?: string;

  email?: string;

  phone: string;
  alternatePhone?: string;

  leadType?: LeadType;

  company?: string;
  website?: string;
  industry?: string;
  jobTitle?: string;
  employeeSize?: string;

  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  address?: string;

  source: LeadSource;
  status: LeadStatus;
  contactStatus?: LeadContactStatus | null;
  nextContactAt?: string | null;
  location?: string;
  priority: LeadPriority;

  pipelineStage?: string;

  estimatedValue?: number;
  expectedCloseDate?: string;

  assignedTo?: IUserSummary;

  createdBy?: IUserSummary;
  updatedBy?: IUserSummary;
  convertedBy?: IUserSummary;

  preferredContactMethod?: PreferredContactMethod;

  tags: string[];
  labels: string[];

  requirementTitle?: string;
  requirementDescription?: string;

  budget?: number;
  timeline?: string;

  technologies: string[];
  services: string[];

  attachments: ILeadAttachment[];
  notes: ILeadNote[];

  customFields?: Record<string, unknown>;

  isConverted: boolean;
  convertedAt?: string;

  clientId?: string;

  isDeleted: boolean;

  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  firstName: string;
  lastName: string;

  email?: string;

  phone: string;
  alternatePhone?: string;

  leadType?: LeadType;
  company?: string;
  website?: string;
  industry?: string;
  jobTitle?: string;
  employeeSize?: string;

  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  address?: string;

  source: LeadSource;

  priority?: LeadPriority;

  pipelineStage?: string;

  estimatedValue?: number;

  expectedCloseDate?: string;

  assignedTo?: string;

  preferredContactMethod?: PreferredContactMethod;

  tags?: string[];
  labels?: string[];

  requirementTitle?: string;
  requirementDescription?: string;

  budget?: number;

  timeline?: string;

  technologies?: string[];
  services?: string[];

  customFields?: Record<string, unknown>;
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export interface UpdateLeadStatusPayload {
  status: LeadStatus;
}

export interface UpdateLeadContactStatusPayload {
  contactStatus: LeadContactStatus;
  nextContactAt?: string;
}

export interface AssignLeadPayload {
  assignedTo: string;
}

export interface ConvertLeadPayload {
  clientId?: string;
}

export interface AddLeadNotePayload {
  message: string;
}

export interface AddLeadAttachmentPayload {
  title: string;
  url: string;
  type?: AttachmentType;
}

export interface LeadFilters {
  searchTerm?: string;

  page?: number;
  limit?: number;

  sort?: string;

  source?: LeadSource;
  status?: LeadStatus;
  priority?: LeadPriority;
  leadType?: LeadType;
  contactStatus?: LeadContactStatus;

  assignedTo?: string;

  isConverted?: boolean;

  "createdAt[gte]"?: string;
  "createdAt[lte]"?: string;
  noteAddedWithin?: "today" | "3d" | "7d";

  dateType?: "created" | "updatedAt" | "nextContact";
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string;   // "YYYY-MM-DD"
}


export interface FollowUpCalendarLead {
  _id: string;
  fullName: string;
  phone: string;
  status: string;
  contactStatus?: string;
  nextContactAt: string;
  notes: { message: string; createdAt?: string }[];
}

export interface FollowUpCalendarEntry {
  date: string;
  leads: FollowUpCalendarLead[];
}
export type GetLeadsResponse = ApiResponse<ILead[], LeadStatsData>;

export type GetLeadResponse = ApiResponse<ILead>;

export type LeadMutationResponse = ApiResponse<ILead>;

export type DeleteLeadResponse = ApiResponse<null>;
