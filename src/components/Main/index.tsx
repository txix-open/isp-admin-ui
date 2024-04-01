import {Button} from 'antd';
import {useTheme} from 'antd-style';
import {PermissionKeys} from "../../types/roles.type.ts";
import useRole from "../../hooks/useRole.tsx";
import './main.scss'


const Main = () => {
    const theme = useTheme();
    const {hasPermission} = useRole();

    const isPageAvailable = hasPermission(PermissionKeys.user_view);

    return (
        <div className='main' style={{
            background: theme.colorBgLayout
        }}>

            {isPageAvailable && <Button ghost type={'primary'}>
                Border
            </Button>}
            <div>Проверка шрифтов</div>
            <Button type={'primary'}>Primary</Button>
        </div>
    );
};
export default Main;
