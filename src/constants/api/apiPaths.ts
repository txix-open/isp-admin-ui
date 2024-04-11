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
  | 'getById'
  | 'setList'
  | 'setOne'
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
  getSystemTree: '/application/get_system_tree',
  // ======= ACCESS_LIST ======
  getById: '/access_list/get_by_id',
  setList: '/access_list/set_list',
  setOne: '/access_list/set_one'
}
