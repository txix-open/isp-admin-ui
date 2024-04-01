import {Route, Routes} from 'react-router-dom';
import {App} from 'antd';
import Layout from "../../pages/Layout";
import HomePages from "../../pages/HomePage";
import Test from "../Test/Test.tsx";
import PrivateRoute from "../PrivateRoute";


function Routers() {

    return (
        <App>
            <Routes>
                <Route element={<PrivateRoute/>}>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<HomePages/>}/>
                        <Route path="/sessions" element={<Test/>}/>
                        <Route path="/error" element={<Test/>}/>
                    </Route>
                </Route>
            </Routes>
        </App>
    )
}

export default Routers

