type RoutePaths =
  | 'home'
  | 'notFound'
  | 'error'
  | 'login'
  | 'profile'
  | 'users'
  | 'sessions'
  | 'securityLog'
  | 'roles'
  | 'appAccess'
  | 'modules'
  | 'applications'

export const routePaths: Record<RoutePaths, string> = {
  home: '/',
  error: '/error',
  notFound: '*',
  login: '/login',
  profile: '/profile',
  users: '/users',
  sessions: '/sessions',
  securityLog: '/securityLog',
  roles: '/roles',
  appAccess: '/appAccess',
  modules: '/modules',
  applications: '/applications'
}
