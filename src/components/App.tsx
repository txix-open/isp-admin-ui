import { Route, Routes } from 'react-router-dom';
import HomePages from '../pages/HomePage/HomePages.tsx';
import './app.scss'

function App() {

    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<HomePages/>}/>
            </Routes>
        </div>

    )
}

export default App
