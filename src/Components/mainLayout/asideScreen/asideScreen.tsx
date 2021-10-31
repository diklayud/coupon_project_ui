import { useState } from "react";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../../redux/authState";
import store from "../../redux/store";
import notify from "../../utils/Notify";
import "./asideScreen.css";

function AsideScreen(): JSX.Element {

    const [loginUserToken, setLoginUserToekn] = useState('');
    const [loginUserType, setLoginUserType] = useState('');

    store.subscribe(() => {
        setLoginUserToekn(store.getState().authState.loginUser.token);
        setLoginUserType(store.getState().authState.loginUser.clientType);
    });

    function clearUser() {
        store.dispatch(logoutUser());
        setLoginUserType('');
        notify.success("LOGGED OUT SUCCESSFULLY");
    }

    return (
        <div className="asideScreen">
            <br />
            <nav>
                {loginUserToken === '' &&
                    <NavLink exact to="/login">Login</NavLink>
                }
                {loginUserToken !== '' &&
                    <NavLink exact to="/home" onClick={clearUser}>Logout</NavLink>
                }
                <br /><br />

                <NavLink exact to="/home">Home</NavLink>


                {loginUserType !== '' &&
                    <span> <br /><br /></span>
                }
                {loginUserType === 'ADMINISTRATOR' &&
                    <NavLink exact to="/admin">Admin Menu</NavLink>
                }
                {loginUserType === 'COMPANY' &&
                    <NavLink exact to="/company">Company Menu</NavLink>
                }
                {loginUserType === 'CUSTOMER' &&
                    <NavLink exact to="/customer">Customer Menu</NavLink>
                }

                {(() => {
                    if (store.getState().authState.loginUser.clientType === "ADMINISTRATOR" ||
                        store.getState().authState.loginUser.clientType === undefined ||
                        store.getState().authState.loginUser.clientType === "CUSTOMER") {
                        return (
                            <span>
                                <br /><br />
                                <NavLink exact to="/allCoupons">Available Coupons</NavLink>
                            </span>
                        )
                    }
                })()}
            </nav>
        </div>
    );
}

export default AsideScreen;
