/**
 * PHÂN QUYỀN CHO DOANH NGHIỆP (ENTERPRISE)
 * Quản lý các quyền cụ thể mà enterprise có thể thực hiện
 */

export enum EnterprisePermission {
  // Quản lý nhân sự
  VIEW_EMPLOYEES = "view:employees",
  CREATE_EMPLOYEE = "create:employee",
  UPDATE_EMPLOYEE = "update:employee",
  DELETE_EMPLOYEE = "delete:employee",

  // Quản lý đánh giá
  CREATE_ASSESSMENT = "create:assessment",
  VIEW_ASSESSMENT_RESULTS = "view:assessment_results",
  EXPORT_ASSESSMENT_REPORT = "export:assessment_report",

  // Quản lý lộ trình
  CREATE_ROADMAP = "create:roadmap",
  VIEW_ROADMAP = "view:roadmap",
  MANAGE_ROADMAP = "manage:roadmap",

  // Quản lý khóa học
  VIEW_COURSES = "view:courses",
  CREATE_CUSTOM_COURSE = "create:custom_course",
  MANAGE_COURSE = "manage:course",

  // Quản lý tư vấn AI
  ACCESS_AI_CONSULTANT = "access:ai_consultant",
  VIEW_AI_CHAT_HISTORY = "view:ai_chat_history",

  // Quản lý báo cáo
  VIEW_REPORTS = "view:reports",
  GENERATE_REPORTS = "generate:reports",
  EXPORT_REPORTS = "export:reports",

  // Cài đặt doanh nghiệp
  MANAGE_COMPANY_SETTINGS = "manage:company_settings",
  MANAGE_TEAM = "manage:team",
  VIEW_BILLING = "view:billing",
}

/**
 * Các quyền mặc định cho enterprise khi đăng ký
 */
export const DEFAULT_ENTERPRISE_PERMISSIONS = [
  EnterprisePermission.VIEW_EMPLOYEES,
  EnterprisePermission.VIEW_ASSESSMENT_RESULTS,
  EnterprisePermission.VIEW_ROADMAP,
  EnterprisePermission.VIEW_COURSES,
  EnterprisePermission.ACCESS_AI_CONSULTANT,
  EnterprisePermission.VIEW_AI_CHAT_HISTORY,
  EnterprisePermission.VIEW_REPORTS,
];

/**
 * Các quyền cao cấp (cần phải kích hoạt thêm)
 */
export const PREMIUM_ENTERPRISE_PERMISSIONS = [
  EnterprisePermission.CREATE_ASSESSMENT,
  EnterprisePermission.EXPORT_ASSESSMENT_REPORT,
  EnterprisePermission.CREATE_ROADMAP,
  EnterprisePermission.CREATE_CUSTOM_COURSE,
  EnterprisePermission.GENERATE_REPORTS,
  EnterprisePermission.EXPORT_REPORTS,
  EnterprisePermission.MANAGE_COMPANY_SETTINGS,
];

/**
 * Các quyền quản trị (chỉ admin hoặc enterprise owner)
 */
export const ADMIN_ONLY_PERMISSIONS = [
  EnterprisePermission.CREATE_EMPLOYEE,
  EnterprisePermission.UPDATE_EMPLOYEE,
  EnterprisePermission.DELETE_EMPLOYEE,
  EnterprisePermission.MANAGE_TEAM,
  EnterprisePermission.VIEW_BILLING,
];

/**
 * Kiểm tra xem enterprise có quyền không
 */
export const hasEnterprisePermission = (
  userPermissions: string[],
  requiredPermission: EnterprisePermission | EnterprisePermission[]
): boolean => {
  const permissions = Array.isArray(requiredPermission)
    ? requiredPermission
    : [requiredPermission];

  return permissions.some(p => userPermissions.includes(p));
};

/**
 * Lấy tất cả quyền của enterprise
 */
export const getEnterpriseAllPermissions = (): EnterprisePermission[] => {
  return [
    ...DEFAULT_ENTERPRISE_PERMISSIONS,
    ...PREMIUM_ENTERPRISE_PERMISSIONS,
    ...ADMIN_ONLY_PERMISSIONS,
  ] as EnterprisePermission[];
};
