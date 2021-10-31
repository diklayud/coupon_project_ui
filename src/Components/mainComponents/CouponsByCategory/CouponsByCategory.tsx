import { Button, MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import CouponModel from "../../model/CouponModel";
import { CouponClientType } from "../../model/userDetails";
import { loginUserString, logoutUser } from "../../redux/authState";
import store from "../../redux/store";
import { getUrlByClientType } from "../../utils/common";
import notify from "../../utils/Notify";
import CouponList from "../couponList/couponList";
import "./CouponsByCategory.css";

interface CouponsByCategoryProps {
    clientType: CouponClientType;
}

function CouponsByCategory(props: CouponsByCategoryProps): JSX.Element {

    const [coupons, setCoupons] = useState(new Array<CouponModel>());
    const [global_category, setCategory] = useState('');

    const history = useHistory();
    function handleChange(event: any) {
        setCategory(event.target.value);
    }

    function handleSubmit() {
        getAllCouponsByCategory(global_category);
    }

    async function getAllCouponsByCategory(category: string) {

        if (category.length === 0) {
            notify.error("No category was selected");
            return;
        }
        const url = getUrlByClientType(props.clientType) + "get/coupon/category/" + `${category}`;
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })

        .then((response) => {
            if (response.data.length === 0) {
                notify.error("No coupons of category: " + `${global_category}`);
            }

            store.dispatch(loginUserString(response.headers.authorization));
            setCoupons(response.data);
        })
        .catch(error => {
            notify.error(error.response.data.description);
            if (error.response.data.description == "Token is invalid") {
                store.dispatch(logoutUser());
                history.push("/login");
            }
        })
    }

    return (
        <div>
            <div className="CouponsByCategory Box">
                <h3>Get coupons of category from the system</h3>
                <hr />
                <strong>Select category:  </strong>
                <Select style={{ width: 250 }} value={global_category} onChange={handleChange}>
                    <MenuItem value={"FOOD"}>FOOD</MenuItem>
                    <MenuItem value={"ELECTRICITY"}>ELECTRICITY</MenuItem>
                    <MenuItem value={"RESTAURANT"}>RESTAURANT</MenuItem>
                    <MenuItem value={"VACATION"}>VACATION</MenuItem>
                    <MenuItem value={"FASHION"}>FASHION</MenuItem>
                </Select>

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

export default CouponsByCategory;
