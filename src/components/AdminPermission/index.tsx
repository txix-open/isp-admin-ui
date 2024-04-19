import { PropsWithChildren } from 'react'

import { useRole } from '@hooks/useRole.tsx'

import { PermissionKeysType } from '@type/roles.type.ts'

const AdminPermission = ({ children }: PropsWithChildren) => {
  const { hasPermission } = useRole()

  if (hasPermission(PermissionKeysType.read)) {
    return <>{children}</>
  }
  return null
}

export default AdminPermission
