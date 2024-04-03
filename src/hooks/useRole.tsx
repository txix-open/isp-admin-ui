import {useMemo} from 'react';
import {useAppSelector} from './redux.ts';
import {PermissionKeys} from '../types/roles.type.ts';

export const useRole = () => {
    const {profile} = useAppSelector((state: any) => state.profileReducer);
    const role: string = useMemo(() => profile && profile.role, [profile]);

    const hasPermission = (permission: PermissionKeys) => {
        const userPermission = profile.permissions || [];
        return userPermission.includes(permission);
    };

    return {role, hasPermission};
};

export default useRole;
