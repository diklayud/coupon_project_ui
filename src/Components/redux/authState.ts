import jwtDecode from "jwt-decode";
import OnlineUser from "../model/onlineUser";
import UserDetails from "../model/userDetails";

// our redux state
export class AuthState {
    public loginUser: OnlineUser = new OnlineUser();
}

// action types
export enum AuthActionType {
    LoginUser = "LoginUser",
    LogoutUser = "LogoutUser",
    RegisterUser = "RegisterUser",
    LoginUserString = "LoginUserString"
}

// action declaration
export interface AuthAction {
    type: AuthActionType,
    payload?: any
}

// action functions
export function loginUser(user: OnlineUser): AuthAction {
    return { type: AuthActionType.LoginUser, payload: user }
}

export function logoutUser(): AuthAction {
    return { type: AuthActionType.LogoutUser, payload: null }
}

export function registerUser(newUser: UserDetails): AuthAction {
    return { type: AuthActionType.RegisterUser, payload: newUser }
}

export function loginUserString(token: string): AuthAction {
    return { type: AuthActionType.LoginUserString, payload: token }
}

// reducer
export function authReducer(currentState: AuthState = new AuthState(), action: AuthAction): AuthState {
    const newState = { ...currentState };

    switch (action.type) {
        case AuthActionType.LoginUser:
            newState.loginUser = action.payload;
            // insert token with value of the token into local storage
            localStorage.setItem("token", action.payload);
            break;
            
        case AuthActionType.LogoutUser:
            newState.loginUser = new OnlineUser();
            // remove the token from the local storage
            localStorage.removeItem("token");
            localStorage.removeItem("clientType");
            break;

        case AuthActionType.LoginUserString:
            // get the string, extract the client type and user id  and update the authState
            newState.loginUser.token = action.payload;
            newState.loginUser.clientType = jwtDecode<OnlineUser>(newState.loginUser.token).clientType;
            newState.loginUser.userId = jwtDecode<OnlineUser>(newState.loginUser.token).userId;
            //save the data to local storage
            localStorage.setItem("token", newState.loginUser.token);
            localStorage.setItem("clientType", newState.loginUser.clientType);
            localStorage.setItem("userId", newState.loginUser.userId.toString());
            break;
    }
    return newState;
}