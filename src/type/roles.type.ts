export enum PermissionKeysType {
  read = 'read', // Просмотр страниц
  write = 'write', // Редактирование страниц
}

export interface RoleType {
  changeMessage?: string
  createdAt: string
  description: string
  externalGroup: string
  id: number
  name: string
  permissions: PermissionKeysType[]
  updatedAt: string
  immutable: boolean
  exclusive: boolean
}

export type NewRoleType = Omit<RoleType, 'id' | 'createdAt' | 'updatedAt'>

export interface PermissionType {
  key: PermissionKeysType
  name: string
}
