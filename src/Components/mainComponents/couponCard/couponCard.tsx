import { Button } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import CouponModel from "../../model/CouponModel";
import { CouponClientType } from "../../model/userDetails";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { getUrlByClientType } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import "./couponCard.css";

interface CouponCardProps {
    id: number;
    title: string;
    image: string;
    company_id_ui?: number;
    category_id?: number;
    price?: number;
    amount?: number;
    description?: string;
    clientType: CouponClientType;
    isAbleToPurchase?: boolean;
    isAbleToEdit?: boolean;
    openEditScreen?: any;
}

function CouponCard(props: CouponCardProps): JSX.Element {

    const size = 150;

    const [purchasedCoupons, updatePurchase] = useState(new Array<CouponModel>());

    // get all coupon customer already purchase
    async function getAllCouponsIpurchased() {
        if (props.clientType !== "CUSTOMER") {
            return;
        }
        const url = globals.urls.customer + "get/coupon/all";
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })
        store.dispatch(loginUserString(response.headers.authorization));
        updatePurchase(response.data);
    }

    useEffect(() => {
        async function fetchMyAPI() {
            await getAllCouponsIpurchased();
        }

        fetchMyAPI()
    }, [])

    async function purchaseMe(couponProp: CouponCardProps) {
        const couponToBuy = { id: couponProp.id, company_id_ui: couponProp.company_id_ui };
        console.log("coupon2buy : " + JSON.stringify(couponToBuy));

        const url = getUrlByClientType(props.clientType) + "coupon/purchase";
        const token = store.getState().authState.loginUser.token;

        axios.post(url, couponToBuy, {
            headers: {
                'Authorization': `${token}`
            }
        })
            .then(async (response) => {
                console.log(`CLAPS!!!!! coupon ${couponToBuy} baught`);
                await getAllCouponsIpurchased();
                store.dispatch(loginUserString(response.headers.authorization));
                notify.success("COUPON HAVE BEEN PURCHASED SUCCESSFULLY!!!");

            })
            .catch(error => {
                notify.error(error.response.data.description);
            });
    }

    function isAlreadyPurchased(couponID: number) {
        const purchasedIds = purchasedCoupons.map(coupon => coupon.id);
        if (purchasedIds.includes(couponID) || props.amount === 0) {
            return true;
        }

        return false;
    }

    return (
        <div className="coupon smallBox" style={{ display: "inline-block" }}>

            <img src={props.image} width={size} height={size} /><br /><br />
            <span><b>ID:</b> {props.id}</span><br /><br />
            <span><b>Title:</b> {props.title}</span><br /><br />
            <span><b>Description:</b> {props.description}</span><br /><br />
            <span><b>Price:</b> {props.price} ₪</span><br /><br />
            <span><b>Amount left:</b> {props.amount}</span><br /><br />

            {props.clientType === "CUSTOMER" && props.isAbleToPurchase &&
                (
                    <Button variant="contained" type="submit" color="primary" onClick={() => purchaseMe(props)} disabled={isAlreadyPurchased(props.id)}>Purchase Coupon</Button>
                )
            }

            {props.clientType === "COMPANY" && props.isAbleToEdit &&
                (
                    <Button variant="contained" type="submit" color="primary" onClick={props.openEditScreen}>Edit Coupon</Button>
                )
            }
        </div>
    );
}

export default CouponCard;
