import { useMemo } from 'react'

import { PermissionKeys } from '../types/roles.type.ts'
import { useAppSelector } from './redux.ts'

export const useRole = () => {
  const { profile } = useAppSelector((state: any) => state.profileReducer)
  const role: string = useMemo(() => profile && profile.role, [profile])

  const hasPermission = (permission: PermissionKeys) => {
    const userPermission = profile.permissions || []
    return userPermission.includes(permission)
  }

  return { role, hasPermission }
}

export default useRole
