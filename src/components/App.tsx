import {useState} from 'react';
import {ConfigProvider} from 'antd';
import {Context} from '../store';
import Routers from './Routers';
import {lightTheme} from '../constants/theme.ts';
import './app.scss'

const App = () => {
    const [themes, setTheme] = useState(lightTheme);

    return (
        <div className="app">
            <Context.Provider value={{setTheme}}>
                <ConfigProvider theme={themes}>
                    <Routers/>
                </ConfigProvider>
            </Context.Provider>
        </div>
    )
}

export default App
