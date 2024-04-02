import {Button, theme} from 'antd';
import {PermissionKeys} from "../../types/roles.type.ts";
import useRole from "../../hooks/useRole.tsx";
import './main.scss'

const Main = () => {
    const {hasPermission} = useRole();
    const { useToken } = theme;
    const { token } = useToken();

    const isPageAvailable = hasPermission(PermissionKeys.user_view);

    return (
        <div className='main' style={{
            backgroundColor: token.colorBgLayout
        }}>
            {isPageAvailable && <Button ghost type='primary'>
                Border
            </Button>}
            <div>Проверка шрифтов</div>
            <Button type='primary'>Primary</Button>
        </div>
    );
};

export default Main;
