import axios from "axios";
import { useEffect, useState } from "react";
import CouponModel from "../../model/CouponModel";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import globals from "../../utils/Globals";
import AddCoupon from "../addCoupon/addCoupon";
import CompanyCard from "../CompanyCard/CompanyCard";
import CouponList from "../couponList/couponList";
import CouponsByCategory from "../CouponsByCategory/CouponsByCategory";
import CouponsByMaxPrice from "../CouponsByMaxPrice/CouponsByMaxPrice";
import DeleteCoupon from "../deleteCoupon/deleteCoupon";
import "./companyScreen.css";


function CompanyScreen(): JSX.Element {

    const [screen, setScreen] = useState("allCoupons");
    const [coupons, setCoupons] = useState(new Array<CouponModel>());
    const [companyData, setCompanyData] = useState({ id: 0, name: "", email: "" });

    function changeScreen(screenName: string) {
        setScreen(screenName);
    }

    async function getAllCoupons() {
        const url = globals.urls.company + "get/coupon/all";
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })

        store.dispatch(loginUserString(response.headers.authorization));
        setCoupons(response.data);
    }

    async function getCompanyDetails() {
        const url = globals.urls.company + "get/details";
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })

        store.dispatch(loginUserString(response.headers.authorization));
        setCompanyData(response.data);
    }

    useEffect(() => {
        getAllCoupons();
    }, [screen]);

    useEffect(() => {
        getCompanyDetails();
    }, []);


    return (
        <div className="companyScreen" style={{ display: "block" }}>
            Welcome company {companyData.name}
            <br />
            <br />
            <input type="button" value="all coupons" onClick={() => changeScreen("allCoupons")} />
            <input type="button" value="add coupon" onClick={() => changeScreen("addCoupon")} />
            <input type="button" value="delete coupon" onClick={() => changeScreen("deleteCoupon")} />
            <input type="button" value="coupons by category" onClick={() => changeScreen("couponsByCategory")} />
            <input type="button" value="coupons by maximum price" onClick={() => changeScreen("couponsByMaxPrice")} />
            <input type="button" value="my details" onClick={() => changeScreen("companyDetails")} />
            {(() => {
                if (screen === "allCoupons") {
                    return <CouponList coupons={coupons} clientType={"COMPANY"} isAbleToEdit={true} />;
                } else if (screen === "addCoupon") {
                    return <AddCoupon onClose={changeScreen} />;
                } else if (screen === "deleteCoupon") {
                    return <DeleteCoupon />;
                } else if (screen === "couponsByCategory") {
                    return <CouponsByCategory clientType={"COMPANY"} />;
                } else if (screen === "couponsByMaxPrice") {
                    return <CouponsByMaxPrice clientType={"COMPANY"} />;
                } else {
                    return <CompanyCard id={companyData.id} name={companyData.name} email={companyData.email} />;
                }
            })()}

        </div>
    );
}

export default CompanyScreen;
