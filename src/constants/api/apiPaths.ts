type PathKeys =
  | 'baseUrl'
  | 'getAllRoles'
  | 'createRole'
  | 'updateRole'
  | 'deleteRole'
  | 'login'
  | 'logout'
  | 'getProfile'
export const apiPaths: Record<PathKeys, string> = {
  baseUrl: '/api/admin',
  // ======= ROLES ======
  getAllRoles: '/role/all',
  createRole: '/role/create',
  updateRole: '/role/update',
  deleteRole: '/role/delete',
  // ======= AUTH ======
  login: '/api/admin/auth/login',
  logout: '/api/admin/auth/logout',
  // ======= PROFILE ======
  getProfile: '/api/admin/user/get_profile'
}
