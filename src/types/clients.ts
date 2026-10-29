import { IProject } from "./project.types";
import type { User } from "./user.types";

export enum ClientStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_HOLD = "ON_HOLD",
  BLACKLISTED = "BLACKLISTED",
}


export enum ClientType {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

export enum ClientDocumentType {
  IMAGE = "IMAGE",
  PDF = "PDF",
  DOCUMENT = "DOCUMENT",
  SPREADSHEET = "SPREADSHEET",
  OTHER = "OTHER",
}

export interface IClientNote {
  _id: string;
  client: string;
  message: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface IClientDocument {
  _id: string;
  client: string;
  title: string;
  url: string;
  type: ClientDocumentType;
  uploadedBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface IClient {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  phone?: string;

  leadId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone: string;
  };

  assignedManager?: User;
  accountManager?: User;

  clientType: ClientType;

  clientCode: string;

  alternatePhone?: string;

  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;
  taxId?: string;

  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  address?: string;

  preferredContactMethod?: string;

  estimatedValue?: number;
  budget?: number;
  timeline?: string;

  requirementTitle?: string;
  requirementDescription?: string;

  technologies?: string[];
  services?: string[];

  projects?: IProject[];

  status: ClientStatus;

  joinedAt?: string;
  lastContactAt?: string;
  nextFollowUp?: string;

  totalProjects: number;
  completedProjects: number;
  activeProjects: number;

  totalRevenue: number;
  totalInvoices: number;
  totalPaid: number;
  totalDue: number;

  notes: IClientNote[];
  documents: IClientDocument[];

  tags: string[];
  labels: string[];

  customFields?: Record<string, unknown>;

  isDeleted: boolean;

  deletedAt?: string;
  deletedBy?: User;

  createdBy?: User;
  updatedBy?: User;

  createdAt: string;
  updatedAt: string;
}

export interface ClientFilters {
  searchTerm?: string;

  status?: ClientStatus;

  clientType?: ClientType;

  assignedManager?: string;

  accountManager?: string;

  industry?: string;

  page?: number;

  limit?: number;

  sort?: string;

  fields?: string;

  ["createdAt[gte]"]?: string;

  ["createdAt[lte]"]?: string;
}

export interface CreateClientPayload {
  leadId?: string;

  assignedManager?: string;
  accountManager?: string;

  clientType?: ClientType;

  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;
  taxId?: string;

  clientCode?: string;

  firstName: string;
  lastName: string;

  email?: string;
  phone: string;
  alternatePhone?: string;

  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  address?: string;

  preferredContactMethod?: string;

  estimatedValue?: number;
  budget?: number;
  timeline?: string;

  requirementTitle?: string;
  requirementDescription?: string;

  technologies?: string[];
  services?: string[];

  joinedAt?: string;

  tags?: string[];

  labels?: string[];

  customFields?: Record<string, unknown>;
}

export type UpdateClientPayload = Partial<CreateClientPayload>;

export interface AssignClientManagerPayload {
  accountManager: string;
}

export interface UpdateClientStatusPayload {
  status: ClientStatus;
}

export interface AddClientNotePayload {
  message: string;
}

export interface AddClientDocumentPayload {
  title: string;
  url: string;
  type?: ClientDocumentType;
}

export interface DeleteClientResponse {
  success: boolean;
  message: string;
}

export interface GetClientResponse {
  success: boolean;
  message: string;
  data: IClient;
}

export interface IClientStats {
  total: number;
  Active: number;
  Inactive: number;
  Suspended: number;
  Blacklisted: number;
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalRevenue: number;
  totalInvoices: number;
  totalPaid: number;
  totalDue: number;
}

export interface ClientListResponse {
  data: IClient[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  stats: IClientStats;
}