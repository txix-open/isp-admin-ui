import { PropsWithChildren } from 'react'

import { useRole } from '@hooks/useRole.tsx'

import { PermissionKeys } from '@type/roles.type.ts'

const AdminPermission = ({ children }: PropsWithChildren) => {
  const { hasPermission } = useRole()

  if (hasPermission(PermissionKeys.read)) {
    return <>{children}</>
  }
  return null
}

export default AdminPermission
