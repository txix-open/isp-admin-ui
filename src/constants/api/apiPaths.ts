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
  | 'getUsers'
  | 'createUser'
  | 'updateUser'
  | 'blockUser'
  | 'deleteUser'
  | 'getRoles'
  | 'getAllPermissions'
  | 'baseUserUrl'
  | 'baseAdminUrl'
  | 'getAllSession'
  | 'revokeSession'
  | 'getAllLogs'
  | 'getLogEvents'
  | 'setLogEvents'
  | 'getSystemTree'
  | 'getById'
  | 'setList'
  | 'setOne'
  | 'getAllRoutes'

export const apiPaths: Record<PathKeys, string> = {
  baseUrl: '/api/kkd-configuration-service',
  baseAdminUrl: '/api/admin',
  baseUserUrl: '/api/admin/user',
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
  // ======= USERS ======
  getUsers: '/get_users',
  createUser: '/create_user',
  updateUser: '/update_user',
  blockUser: '/block_user',
  deleteUser: '/delete_user',
  getRoles: '/get_roles',
  getAllPermissions: '/get_permissions',
  // ======= SESSIONS ======
  getAllSession: '/session/all',
  revokeSession: '/session/revoke',
  // ======= LOGS ======
  getAllLogs: '/log/all',
  getLogEvents: '/log/events',
  setLogEvents: '/log/set_events',
  // ======= APPLICATIONS ======
  getSystemTree: '/application/get_system_tree',
  // ======= ACCESS_LIST ======
  getById: '/access_list/get_by_id',
  setList: '/access_list/set_list',
  setOne: '/access_list/set_one',
  getAllRoutes: '/routing/get_routes'
}
