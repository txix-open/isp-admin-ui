import { MenuProps } from 'antd'

export enum MenuItemKeys {
  users = 'users'
}

type MenuItem = {
  key: MenuItemKeys
  parent: string[]
}
export const menuKeys: Record<MenuItemKeys, MenuItem> = {
  [MenuItemKeys.users]: {
    key: MenuItemKeys.users,
    parent: ['sessionManagement']
  }
}

export type MenuItemType = Required<MenuProps>['items'][number]
