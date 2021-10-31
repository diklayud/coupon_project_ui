import { CouponClientType } from "../model/userDetails";
import { logoutUser } from "../redux/authState";
import store from "../redux/store";
import globals from "./Globals";

export function getUrlByClientType(clientType: CouponClientType) {
    if (clientType === "ADMINISTRATOR") {
        return globals.urls.admin;
    }
    if (clientType === "COMPANY") {
        return globals.urls.company;
    }
    if (clientType === "CUSTOMER") {
        return globals.urls.customer;
    }
    return "/";
}

export function noTokenPushToLogin(msg: string, historyHook: any) {
    const history = historyHook;
    if ("Token is invalid" === msg) {
        store.dispatch(logoutUser());
        history.push("/login");
    }
}