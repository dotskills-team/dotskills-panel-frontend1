const FINANCIAL_ROLES = ["SUPER_ADMIN", "ADMIN"];
const EDIT_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER"];
const DELETE_ROLES = ["SUPER_ADMIN", "ADMIN"];

export interface ProjectPermissions {
  canViewFinancials: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// Manager can create/edit projects but never sees or changes money data
export const getProjectPermissions = (role?: string): ProjectPermissions => ({
  canViewFinancials: !!role && FINANCIAL_ROLES.includes(role),
  canCreate: !!role && EDIT_ROLES.includes(role),
  canEdit: !!role && EDIT_ROLES.includes(role),
  canDelete: !!role && DELETE_ROLES.includes(role),
});