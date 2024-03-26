import { Route, Routes } from 'react-router-dom';
import HomePages from '../pages/HomePage/HomePages.tsx';
import './app.scss'

import { useState } from 'react';
import { Segmented } from 'antd';
import { ThemeAppearance, ThemeProvider } from 'antd-style';



const options = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
];

function App() {
    const [appearance, setTheme] = useState<ThemeAppearance>('light');
    return (
        <div className="app">
            <Segmented onChange={(v) => setTheme(v as ThemeAppearance)} options={options} />
            <ThemeProvider appearance={appearance} >
            <Routes>
                <Route path="/" element={<HomePages/>}/>
            </Routes>
            </ThemeProvider>
        </div>

    )
}

export default App

