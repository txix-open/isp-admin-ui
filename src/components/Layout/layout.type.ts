import { MenuProps } from 'antd'

export enum MenuItemKeys {
  users = 'users',
  appAccess = 'appAccess'
}

type MenuItem = {
  key: MenuItemKeys
  parent: string[]
}
export const menuKeys: Record<MenuItemKeys, MenuItem> = {
  [MenuItemKeys.users]: {
    key: MenuItemKeys.users,
    parent: ['sessionManagement']
  },
  [MenuItemKeys.appAccess]: {
    key: MenuItemKeys.appAccess,
    parent: []
  }
}

export type MenuItemType = Required<MenuProps>['items'][number]
