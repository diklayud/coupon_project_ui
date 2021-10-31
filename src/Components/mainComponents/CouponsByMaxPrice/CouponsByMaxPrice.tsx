import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import CouponModel from "../../model/CouponModel";
import { CouponClientType } from "../../model/userDetails";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { getUrlByClientType, noTokenPushToLogin } from "../../utils/common";
import notify from "../../utils/Notify";
import CouponList from "../couponList/couponList";
import "./CouponsByMaxPrice.css";

interface CouponsByMaxPriceProps {
    clientType: CouponClientType;
}

function CouponsByMaxPrice(props: CouponsByMaxPriceProps): JSX.Element {

    const [coupons, setCoupons] = useState(new Array<CouponModel>());
    const [global_price, setPrice] = useState(0);

    const history = useHistory();

    function handleChange(event: any) {
        setPrice(event.target.value);
    }

    function handleSubmit() {
        getCouponsByMaxPrice(global_price);
    }

    async function getCouponsByMaxPrice(price: number) {

        if (price === 0) {
            notify.error("No price was entered");
            return;
        }
        const url = getUrlByClientType(props.clientType) + "get/coupon/price/" + `${price}`;
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })
            .then((response) => {
                if (response.data.length === 0) {
                    notify.error("No coupons found");
                }

                store.dispatch(loginUserString(response.headers.authorization));
                setCoupons(response.data);
            })
            .catch(error => {
                notify.error(error.response.data.description);
                noTokenPushToLogin(error.response.data.description, history);
            })
    }

    return (
        <div>
            <div className="CouponsByMaxPrice Box">
                <h3>Get coupons by maximum price from the system</h3>
                <hr />
                <TextField label="Maximum price" variant="outlined" size="small" onChange={handleChange} />
                <br />
                <br />
                <Button variant="contained" type="submit" color="primary" onClick={handleSubmit}>Get Coupons</Button>
            </div>

            <div>
                {(() => {
                    if (coupons.length > 0) {
                        return <CouponList coupons={coupons} clientType={props.clientType} />;
                    }
                })()}
            </div>
        </div>
    );
}

export default CouponsByMaxPrice;


