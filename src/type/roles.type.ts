export enum RoleKeys {
  user = 'user',
  admin = 'admin'
}

export enum PermissionKeys {
  read = 'read', // Просмотр страниц
  write = 'write', // Редактирование страниц
}

export type RoleType = {
  changeMessage?: string
  createdAt: string
  description: string
  externalGroup: string
  id: number
  name: string
  permissions: PermissionKeys[]
  updatedAt: string
  immutable: boolean
  exclusive: boolean
}

export type NewRoleType = Omit<RoleType, 'id' | 'createdAt' | 'updatedAt'>

export type PermissionType = {
  key: PermissionKeys
  name: string
}
