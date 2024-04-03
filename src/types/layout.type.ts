import {MenuProps} from 'antd';

export enum MenuItemKeys {
    users = "users",
    roles = "roles",
}

type MenuItem = {
    key: MenuItemKeys;
    parent: string[];
};
export const menuKeys: Record<MenuItemKeys, MenuItem> = {
    [MenuItemKeys.users]: {
        key: MenuItemKeys.users,
        parent: ["sessionManagement"],
    },
    [MenuItemKeys.roles]: {
        key: MenuItemKeys.roles,
        parent: ["sessionManagement"],
    },
};

export type MenuItemType = Required<MenuProps>["items"][number];
