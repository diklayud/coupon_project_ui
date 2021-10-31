import axios from "axios";
import { useEffect, useState } from "react";
import CouponModel from "../../model/CouponModel";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import CouponList from "../couponList/couponList";
import "./AllSystemCoupons.css";


function AllSystemCoupons(): JSX.Element {

    const [coupons, setCoupons] = useState(new Array<CouponModel>());

    async function getAllSystemCoupons() {
        const url = globals.urls.guest + "get/coupon/all";
        let response = await axios.post(url, {}, {});
        if (response.data.length === 0) {
            notify.error("Sorry, no coupons to buy yet");
        }
        setCoupons(response.data);
    }

    useEffect(() => {
        getAllSystemCoupons();
    }, [])

    return (
        <div className="AllSystemCoupons">

            <div>
                {(() => {
                    if (coupons.length > 0) {
                        return <CouponList coupons={coupons} />;
                    } else {
                        <div>Sorry! No coupons here yet.</div>
                    }
                })()}
            </div>

        </div>
    );
}

export default AllSystemCoupons;
