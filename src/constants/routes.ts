type RoutePaths = 'home' | 'notFound' | 'error' | 'login'

export const routePaths: Record<RoutePaths, string> = {
  home: '/',
  error: '/error',
  notFound: '*',
  login: '/login'
}
