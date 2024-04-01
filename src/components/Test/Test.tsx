import {useTheme} from 'antd-style';
import {useEffect} from "react";
import {routePaths} from "../../constants/routes.ts";
import useRole from "../../hooks/useRole.tsx";
import {PermissionKeys} from "../../types/roles.type.ts";
import {useNavigate} from "react-router-dom";


const Test = () => {
    const theme = useTheme();
    const {role, hasPermission} = useRole();
    const navigate = useNavigate();

    const isPageAvailable = hasPermission(PermissionKeys.admin_view);

    useEffect(() => {
        if (!role) {
            navigate(routePaths.home);
        }
    }, [role]);

    useEffect(() => {
        if (!isPageAvailable) {
            navigate(routePaths.home);
        }
    }, [isPageAvailable]);
    return (
        <div style={{
            background: theme.colorBgLayout,
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center'
        }}>

            <div>fgdegjhjflefkegjvhecdhejqhdkefke</div>
        </div>
    );
};
export default Test;
