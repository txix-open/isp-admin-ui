import {useState} from 'react';
import {ThemeAppearance, ThemeProvider} from 'antd-style';
import {Context} from "../store";
import Routers from "./Routers/Routers.tsx";
import './app.scss'


function App() {
    const [theme, setTheme] = useState<ThemeAppearance>('light');

    return (
        <div className="app">
            <Context.Provider value={{setTheme}}>
                <ThemeProvider appearance={theme}>
                    <Routers/>
                </ThemeProvider>
            </Context.Provider>
        </div>

    )
}

export default App

