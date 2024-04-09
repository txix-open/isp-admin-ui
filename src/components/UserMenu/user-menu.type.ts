export enum MenuItemKeysUser {
  logout = 'logout'
}
type MenuItemUser = {
  key: MenuItemKeysUser
  parent: string[]
}
export const menuKeysUser: Record<MenuItemKeysUser, MenuItemUser> = {
  [MenuItemKeysUser.logout]: {
    key: MenuItemKeysUser.logout,
    parent: ['']
  }
}
