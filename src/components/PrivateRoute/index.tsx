import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {LocalStorage} from '../../utils/localStorageUtils.ts';
import {localStorageKeys} from '../../constants/localStorageKeys.ts';
import {routePaths} from '../../constants/routes.ts';

const PrivateRoute = () => {
    const location = useLocation();
    const userToken = LocalStorage.get(localStorageKeys.USER_TOKEN);

    if (!userToken) {
        LocalStorage.set("redirectUrl", location.pathname)
        return (
            <Navigate
                to={routePaths.login}
                replace
            />
        );
    }

    return <Outlet/>;
}

export default PrivateRoute;
