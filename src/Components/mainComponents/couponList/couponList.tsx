import axios from "axios";
import { useEffect, useState } from "react";
import CouponModel from "../../model/CouponModel";
import { CouponClientType } from "../../model/userDetails";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import globals from "../../utils/Globals";
import CouponCard from "../couponCard/couponCard";
import EditCoupon from "../editCoupon/editCoupon";
import "./couponList.css";

interface CouponListProps {
    coupons?: CouponModel[];
    clientType?: CouponClientType;
    isAbleToPurchase?: boolean;
    isAbleToEdit?: boolean;
    isEdit?: boolean;
}

export default function CouponList(props: CouponListProps): JSX.Element {

    const [couponsList, setCouponList] = useState(new Array<CouponModel>());
    const [coupon, setCoupon] = useState(undefined);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        setCouponList(props.coupons);
    }, [props.coupons]);

    function startEdit(coupon: CouponModel) {
        setIsEdit(true);
        setCoupon(coupon);
    }

    async function stopEdit() {
        setIsEdit(false);
        setCoupon(undefined);
        await getAllCoupons();
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
        setCouponList(response.data);
    }

    return (
        <div>
            {(() => {
                if (!isEdit) {
                    return (
                        <div className="couponList">
                            {couponsList.map(coupon => <CouponCard key={coupon.id} {...coupon}
                                clientType={props.clientType}
                                isAbleToPurchase={props.isAbleToPurchase} openEditScreen={() => startEdit(coupon)}
                                isAbleToEdit={props.isAbleToEdit} />)}
                        </div>
                    );
                }
                else if (coupon && isEdit) {
                    return <EditCoupon closeEditScreen={stopEdit} couponToEdit={coupon} />;
                }
            })()}
        </div>

    );
}


