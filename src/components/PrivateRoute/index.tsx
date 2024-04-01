import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {LocalStorage} from "../../utils/localStorageUtils.ts";
import {localStorageKeys} from "../../constants/localStorageKeys.ts";
import {routePaths} from "../../constants/routes.ts";

function PrivateRoute() {
    const location = useLocation();

    const userToken = LocalStorage.get(localStorageKeys.USER_TOKEN);

    if (!userToken) {
        LocalStorage.set('prevUrl', location.pathname)
        return (
            <Navigate
                to={routePaths.error}
                // state={{ from: location.pathname }}
                replace
            />
        );
    }

    return <Outlet/>;
}

export default PrivateRoute;
