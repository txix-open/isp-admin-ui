import { MenuProps } from 'antd'

export enum MenuItemKeysType {
  users = 'users',
  sessions = 'sessions',
  securityLog = 'securityLog',
  appAccess = 'appAccess',
  roles = 'roles',
  logout = 'logout',
  profile = 'profile'
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
  }
}

export type MenuItemType = Required<MenuProps>['items'][number]
