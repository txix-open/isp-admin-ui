import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { localStorageKeys } from '@constants/localStorageKeys.ts'

import { LocalStorage } from '@utils/localStorageUtils.ts'

import useRole from '@hooks/useRole.tsx'

import { routePaths } from '@routes/routePaths.ts'

import { PermissionKeys } from '@type/roles.type.ts'


const PrivateRoute = () => {
  const { hasPermission } = useRole()

  const location = useLocation()
  const userToken = LocalStorage.get(localStorageKeys.USER_TOKEN)

  if (!userToken) {
    LocalStorage.set('redirectUrl', location.pathname)
    return <Navigate to={routePaths.login} replace />
  }

  if ( location.pathname !=='/' && !hasPermission(PermissionKeys.read)) {
    return <Navigate to={routePaths.home} replace />
  }

  return <Outlet />
}

export default PrivateRoute
