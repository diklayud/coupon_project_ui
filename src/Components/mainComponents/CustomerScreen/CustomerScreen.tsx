import axios from "axios";
import { useEffect, useState } from "react";
import CouponModel from "../../model/CouponModel";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import globals from "../../utils/Globals";
import CouponList from "../couponList/couponList";
import CouponsByCategory from "../CouponsByCategory/CouponsByCategory";
import CouponsByMaxPrice from "../CouponsByMaxPrice/CouponsByMaxPrice";
import CustomerCard from "../CustomerCard/CustomerCard";
import "./CustomerScreen.css";

function CustomerScreen(): JSX.Element {

    const [screen, setScreen] = useState("allCoupons");
    const [coupons, setCoupons] = useState(new Array<CouponModel>());
    const [systemcoupons, setSystemCoupons] = useState(new Array<CouponModel>());
    const [customerData, setCustomerData] = useState({ id: 0, firstName: "", lastName: "", email: "" });

    function changeScreen(screenName: string) {
        setScreen(screenName);
    }

    // get all coupons customer already purchase
    async function getAllCoupons() {
        const url = globals.urls.customer + "get/coupon/all";
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })

        store.dispatch(loginUserString(response.headers.authorization));
        setCoupons(response.data);
    }

    async function getAllSystemCoupons() {
        const url = globals.urls.guest + "get/coupon/all";
        let response = await axios.post(url, {}, {});
        setSystemCoupons(response.data);
    }


    async function getCustomerDetails() {
        const url = globals.urls.customer + "get/details";
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })

        store.dispatch(loginUserString(response.headers.authorization));
        setCustomerData(response.data);
    }

    useEffect(() => {
        getAllCoupons();
        getAllSystemCoupons();
    }, [screen]);

    useEffect(() => {
        getCustomerDetails();
    }, []);

    return (
        <div className="customerScreen">
            Welcome customer {customerData.firstName}
            <br />
            <br />
            <input type="button" value="my coupons" onClick={() => changeScreen("myCoupons")} />
            <input type="button" value="purchase" onClick={() => changeScreen("purchase")} />
            <input type="button" value="coupons by category" onClick={() => changeScreen("couponsByCategory")} />
            <input type="button" value="coupons by maximum price" onClick={() => changeScreen("couponsByMaxPrice")} />
            <input type="button" value="my details" onClick={() => changeScreen("customerDetails")} />
            {(() => {
                if (screen === "myCoupons") {
                    return <CouponList coupons={coupons} clientType={"CUSTOMER"} />;
                } else if (screen === "couponsByCategory") {
                    return <CouponsByCategory clientType={"CUSTOMER"} />;
                } else if (screen === "couponsByMaxPrice") {
                    return <CouponsByMaxPrice clientType={"CUSTOMER"} />;
                } else if (screen === "purchase") {
                    return <CouponList coupons={systemcoupons} clientType={"CUSTOMER"} isAbleToPurchase={true} />;
                } else {
                    return <CustomerCard id={customerData.id} firstName={customerData.firstName} lastName={customerData.lastName} email={customerData.email} />;
                }
            })()}
        </div>
    );
}

export default CustomerScreen;
