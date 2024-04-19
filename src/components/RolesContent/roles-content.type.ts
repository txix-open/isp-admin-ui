import { NewRoleType, PermissionType, RoleType } from '@type/roles.type.ts'

export interface RolesContentPropsType {
  role?: Partial<RoleType>
  title?: string
  immutable?: boolean
  permissions: PermissionType[]
  saveRole: (formValue: RoleType | NewRoleType) => void
}
