import {Button} from 'antd';
import {useTheme} from 'antd-style';



const Main= () => {
    const theme = useTheme();

    return (
            <div style={{
                background: theme.colorBgLayout,
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center'
            }}>

                        <Button ghost type={'primary'}>
                            Border
                        </Button>
                <div>Проверка шрифтов</div>
                        <Button type={'primary'}>Primary</Button>
            </div>
    );
};
export default Main;
