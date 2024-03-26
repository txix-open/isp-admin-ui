import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import {App} from 'antd';
import { ThemeAppearance, ThemeProvider } from 'antd-style';
import Layout from "../pages/Layout/Layout.tsx";
import HomePages from '../pages/HomePage/HomePages.tsx';
import {Context} from "../store";
import './app.scss'




function AppDefault() {
    const [appearance, setTheme] = useState<ThemeAppearance>('light');

    return (
        <div className="app">
            <Context.Provider value={{setTheme}}>
            <ThemeProvider appearance={appearance} >
                <App>
            <Routes>
                <Route path="/" element={<Layout />}>
                <Route index  element={<HomePages/>}/>
                </Route>
            </Routes>
                </App>
            </ThemeProvider>
            </Context.Provider>
        </div>

    )
}

export default AppDefault

