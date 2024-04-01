type RoutePaths =
    | 'home'
    | 'notFound'
    | 'error'

export const routePaths: Record<RoutePaths, string> = {
    home: '/',
    error: '/error',
    notFound: '*',
};
