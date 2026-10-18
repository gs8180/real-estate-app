
export type UserRole =
  | "BUYER"
  | "REAL_ESTATE_AGENT"
  | "LEGAL_REVIEWER"
  | "FINANCIAL_INSTITUTION"
  | "ADMINISTRATOR";

export type Permission =
  | "view"
  | "create"
  | "edit"
  | "delete";

export const rolePermissions: Record<
  UserRole,
  Record<string, Permission[]>
> = {
  BUYER: {
    propertySearch: ["view", "create"],
    propertyDetails: ["view"],
    dueDiligence: ["view", "create"],
    riskAssessment: ["view", "create"],
    comparableProperties: ["view"],
    reports: ["view", "create"],
    profile: ["view", "edit"],
  },

  REAL_ESTATE_AGENT: {
    propertySearch: ["view", "create"],
    propertyDetails: ["view", "create", "edit"],
    propertyHistory: ["view"],
    dueDiligence: ["view", "create"],
    riskAssessment: ["view", "create"],
    comparableProperties: ["view", "create"],
    reports: ["view", "create"],
    profile: ["view", "edit"],
  },

  LEGAL_REVIEWER: {
    propertySearch: ["view", "create"],
    ownershipRecords: ["view", "create", "edit"],
    propertyTax: ["view", "create", "edit"],
    buildingPermits: ["view", "create", "edit"],
    zoning: ["view", "create", "edit"],
    environmentalRecords: ["view", "create", "edit"],
    riskAssessment: ["view", "create", "edit"],
    reports: ["view", "create", "edit"],
    profile: ["view", "edit"],
  },

  FINANCIAL_INSTITUTION: {
    propertySearch: ["view", "create"],
    propertyDetails: ["view"],
    propertyTax: ["view", "create"],
    dueDiligence: ["view", "create"],
    riskAssessment: ["view", "create"],
    comparableProperties: ["view", "create"],
    reports: ["view", "create"],
    financialNotes: ["view", "create", "edit"],
    profile: ["view", "edit"],
  },

  ADMINISTRATOR: {
    propertySearch: ["view", "create", "edit", "delete"],
    propertyDetails: ["view", "create", "edit", "delete"],
    dueDiligence: ["view", "create", "edit", "delete"],
    riskAssessment: ["view", "create", "edit", "delete"],
    comparableProperties: ["view", "create", "edit", "delete"],
    reports: ["view", "create", "edit", "delete"],
    userManagement: ["view", "create", "edit", "delete"],
    roleAssignment: ["view", "create", "edit", "delete"],
    auditLogs: ["view"],
    systemMonitoring: ["view"],
    profile: ["view", "edit"],
  },
};

export function hasPermission(
  role: UserRole,
  module: string,
  permission: Permission
): boolean {
  return rolePermissions[role]?.[module]?.includes(permission) ?? false;
}
