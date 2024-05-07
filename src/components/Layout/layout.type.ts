import { MenuProps } from 'antd'

export enum MenuItemKeysType {
  users = 'users',
  sessions = 'sessions',
  securityLog = 'securityLog',
  appAccess = 'appAccess',
  roles = 'roles',
  logout = 'logout',
  profile = 'profile',
  modules = 'modules',
  applicationsGroup = 'applications_group'
}
export enum MenuItemLabelsType {
  users = 'Пользователи',
  sessions = 'Пользовательские сессии',
  securityLog = 'Просмотр журналов ИБ',
  appAccess = 'Доступы приложений',
  roles = 'Роли',
  profile = 'Профиль',
  modules = 'Модули',
  logout = 'Выход',
  applications_group = 'Группа приложений'
}

interface MenuItem {
  key: MenuItemKeysType
  parent: string[]
}

export const menuKeys: Record<MenuItemKeysType, MenuItem> = {
  [MenuItemKeysType.users]: {
    key: MenuItemKeysType.users,
    parent: ['sessionManagement']
  },
  [MenuItemKeysType.sessions]: {
    key: MenuItemKeysType.sessions,
    parent: ['sessionManagement']
  },
  [MenuItemKeysType.securityLog]: {
    key: MenuItemKeysType.securityLog,
    parent: ['sessionManagement']
  },
  [MenuItemKeysType.appAccess]: {
    key: MenuItemKeysType.appAccess,
    parent: []
  },
  [MenuItemKeysType.roles]: {
    key: MenuItemKeysType.roles,
    parent: ['sessionManagement']
  },
  [MenuItemKeysType.logout]: {
    key: MenuItemKeysType.logout,
    parent: ['']
  },
  [MenuItemKeysType.profile]: {
    key: MenuItemKeysType.profile,
    parent: ['']
  },
  [MenuItemKeysType.modules]: {
    key: MenuItemKeysType.modules,
    parent: []
  },
  [MenuItemKeysType.applicationsGroup]: {
    key: MenuItemKeysType.applicationsGroup,
    parent: ['']
  }
}

export type MenuItemType = Required<MenuProps>['items'][number]
