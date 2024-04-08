export enum RoleKeys {
  user = 'user',
  admin = 'admin'
}

export enum PermissionKeys {
  user_view = 'user_view', // Просмотр списка пользователей
  admin_view = 'admin_view', // роль суперадмина, требуется для интерфейса
  session_view = 'session_view', // Просмотр списка пользовательских сессий
  security_log_view = 'security_log_view', // Просмотр журналов ИБ
  role_view = 'role_view', // Просмотр экрана ролей
}

export type ConfigRoles = {
  operator: string[]
  supervisor: string[]
  ontologist: string[]
  businessMonitoring: string[]
  technicalMonitoring: string[]
  administratorIS: string[]
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
