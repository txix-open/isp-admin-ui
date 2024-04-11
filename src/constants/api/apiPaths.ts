type PathKeys =
  | 'baseUrl'
  | 'baseSystemUrl'
  | 'baseConfigUrl'
  | 'getAllRoles'
  | 'createRole'
  | 'updateRole'
  | 'deleteRole'
  | 'login'
  | 'logout'
  | 'getProfile'
  | 'getSystemTree'
export const apiPaths: Record<PathKeys, string> = {
  baseUrl: '/api/admin',
  baseSystemUrl: '/api/system',
  baseConfigUrl: '/api/config',
  // ======= ROLES ======
  getAllRoles: '/role/all',
  createRole: '/role/create',
  updateRole: '/role/update',
  deleteRole: '/role/delete',
  // ======= AUTH ======
  login: '/api/admin/auth/login',
  logout: '/api/admin/auth/logout',
  // ======= PROFILE ======
  getProfile: '/api/admin/user/get_profile',
  // ======= APPLICATIONS ======
  getSystemTree: '/application/get_system_tree'
}
