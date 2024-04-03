import {PropsWithChildren} from 'react';
import useRole from '../../hooks/useRole.tsx';
import {PermissionKeys} from '../../types/roles.type.ts';

const AdminPermission = ({children}: PropsWithChildren) => {
    const {hasPermission} = useRole();

    if (hasPermission(PermissionKeys.admin_view)) {
        return <>{children}</>;
    }
    return null;
}

export default AdminPermission;
