import { MenuProps } from 'antd'

export enum MenuItemKeysType {
  users = 'users',
  appAccess = 'appAccess'
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
  [MenuItemKeysType.appAccess]: {
    key: MenuItemKeysType.appAccess,
    parent: []
  }
}

export type MenuItemType = Required<MenuProps>['items'][number]
