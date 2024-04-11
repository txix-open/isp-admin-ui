type RoutePaths =
  | 'home'
  | 'notFound'
  | 'error'
  | 'login'
  | 'profile'
  | 'appAccess'

export const routePaths: Record<RoutePaths, string> = {
  home: '/',
  error: '/error',
  notFound: '*',
  login: '/login',
  profile: '/profile',
  appAccess: '/appAccess'
}
