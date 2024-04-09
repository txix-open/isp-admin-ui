export enum MenuItemKeysUser {
  logout = 'logout',
  profile = 'profile'
}

type MenuItemUser = {
  key: MenuItemKeysUser
  parent: string[]
}
export const menuKeysUser: Record<MenuItemKeysUser, MenuItemUser> = {
  [MenuItemKeysUser.logout]: {
    key: MenuItemKeysUser.logout,
    parent: ['']
  },
  [MenuItemKeysUser.profile]: {
    key: MenuItemKeysUser.profile,
    parent: ['']
  }
}
