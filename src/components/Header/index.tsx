import {useContext} from "react";
import {ThemeAppearance, useTheme} from "antd-style";
import {Segmented} from "antd";
import {Context} from "../../store";
import './header.scss'


const options = [
    {label: 'Light', value: 'light'},
    {label: 'Dark', value: 'dark'},
];

function Header() {
    const theme = useTheme();
    const {setTheme} = useContext(Context)

    return <header className='header' style={{
        background: theme.colorBgLayout
    }}><Segmented onChange={(v) => setTheme(v as ThemeAppearance)} options={options}/></header>;
}

export default Header;