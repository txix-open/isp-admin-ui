export enum RoleKeys {
    user = 'user',
    admin = 'admin',
}

export enum PermissionKeys {
    user_view = 'user_view', // Просмотр списка пользователей
    admin_view = 'admin_view', // роль суперадмина, требуется для интерфейса
}

export type ConfigRoles = {
    operator: string[];
    supervisor: string[];
    ontologist: string[];
    businessMonitoring: string[];
    technicalMonitoring: string[];
    administratorIS: string[];
};

export type RoleType = {
    changeMessage?: string;
    createdAt: string;
    description: string;
    externalGroup: string;
    id: number;
    name: string;
    permissions: PermissionKeys[];
    updatedAt: string;
    immutable: boolean;
    exclusive: boolean;
};

export type NewRoleType = Omit<RoleType, 'id' | 'createdAt' | 'updatedAt'>;

export type PermissionType = {
    key: PermissionKeys;
    name: string;
};
