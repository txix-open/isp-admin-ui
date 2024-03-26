import {useContext} from "react";
import {ThemeAppearance, useTheme} from "antd-style";
import {Segmented} from "antd";
import {Context} from "../../store";


const options = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
];
function Header() {
    const theme = useTheme();
    const { setTheme } = useContext(Context)
    return <header style={{
        background: theme.colorBgLayout,
        width: '100%',
        border: 'none',
        display: 'flex',
        justifyContent: 'end'
    }}><Segmented onChange={(v) => setTheme(v as ThemeAppearance)} options={options} /></header>;
}

export default Header;