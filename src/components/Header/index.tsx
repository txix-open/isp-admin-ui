import {useContext} from "react";
import {Segmented, theme} from "antd";
import {Context} from "../../store";
import {darkTheme, lightTheme} from "../../constants/theme.ts";
import './header.scss'

const options = [
    {label: 'Light', value: 'light' },
    {label: 'Dark', value: 'dark'},
];

function Header() {
    const {setTheme} = useContext(Context)
    const { useToken } = theme;
    const { token } = useToken();

    return <header className='header' style={{
        backgroundColor: token.colorBgLayout
    }}><Segmented onChange={(v) => setTheme(v === 'light' ? lightTheme : darkTheme)} options={options}/></header>;
}

export default Header;