import { App, Button } from 'antd';
import { useTheme } from 'antd-style';



const Layout= () => {
    const theme = useTheme();
    return (
        <App>
            <div style={{
                background: theme.colorBgLayout,
                minHeight: '100vh'
            }}>
                        <Button ghost type={'primary'}>
                            Border
                        </Button>
                        <Button type={'primary'}>Primary</Button>
            </div>
        </App>
    );
};
export default Layout;
