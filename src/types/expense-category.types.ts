export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IExpenseCategory {
  _id: string;

  name: string;
  description?: string;
  status: CategoryStatus;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}