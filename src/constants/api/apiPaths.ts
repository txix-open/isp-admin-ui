type PathKeys = 'baseUrl' | 'login' | 'logout'

export const apiPaths: Record<PathKeys, string> = {
  baseUrl: '/',
  login: '/api/admin/auth/login',
  logout: '/api/admin/auth/logout'
}
