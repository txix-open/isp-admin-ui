import {Route, Routes} from 'react-router-dom';
import {App} from 'antd';
import HomePages from '../../pages/HomePage';
import ErrorPage from '../ErrorPage';
import PrivateRoute from '../PrivateRoute';
import LoginPage from '../../pages/LoginPage';
import Layout from '../Layout';

const Routers = () => {
    return (
        <App>
            <Routes>
                <Route element={<PrivateRoute/>}>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<HomePages/>}/>
                    </Route>
                </Route>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/error" element={<ErrorPage/>}/>
            </Routes>
        </App>
    )
}

export default Routers
