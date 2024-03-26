import { Outlet } from 'react-router-dom';
import Header from "../../components/Header/Header.tsx";

function Layout() {
    return (
            <div style={{minHeight: 'calc(100vh - 96px)'}}>
                <Header/>
                <Outlet/>
            </div>
    );
}

export default Layout;