import { useState } from "react";
import { Redirect, Route, RouteProps, Switch } from "react-router-dom";
import AdminScreen from "../../mainComponents/adminScreen/adminScreen";
import AllSystemCoupons from "../../mainComponents/AllSystemCoupons/AllSystemCoupons";
import CompanyScreen from "../../mainComponents/companyScreen/companyScreen";
import CustomerScreen from "../../mainComponents/CustomerScreen/CustomerScreen";
import HomePage from "../../mainComponents/homePage/homePage";
import LoginPage from "../../mainComponents/loginPage/loginPage";
import store from "../../redux/store";
import Page404 from "../page404/page404";
import ProtectedRoute, { ProtectedRouteProps } from "./protectedRoute";
import "./routing.css";

function Routing(): JSX.Element {

    const [loginUserToken, setLoginUserToekn] = useState('');

    store.subscribe(() => {
        setLoginUserToekn(store.getState().authState.loginUser.token);
    });

    function getIsAuthenticated(): boolean {
        return loginUserToken ? true : false
    }

    return (
        <div className="routing">
            <Switch>
                <Route path="/login" component={LoginPage} exact />
                <Route path="/home" component={HomePage} exact />
                <Route path="/allCoupons" component={AllSystemCoupons} exact />
                <ProtectedRoute isAuthenticated={getIsAuthenticated()} path="/admin" component={AdminScreen} exact />
                <ProtectedRoute isAuthenticated={getIsAuthenticated()} path="/company" component={CompanyScreen} exact />
                <ProtectedRoute isAuthenticated={getIsAuthenticated()} path="/customer" component={CustomerScreen} exact />

                {/* for redirecting our pages we will use Redirect*/}
                <Redirect from="/" to="/home" exact />
                {/* handle page 404 , Must be the last one in the order */}
                <Route component={Page404} />
            </Switch>
        </div>
    );
}

export default Routing;