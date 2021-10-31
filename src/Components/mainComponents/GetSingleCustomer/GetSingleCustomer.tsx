import { Button, ButtonGroup, TextField } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import CouponList from "../couponList/couponList";
import CustomerCard from "../CustomerCard/CustomerCard";
import EditCustomer from "../editCustomer/editCustomer";
import "./GetSingleCustomer.css";

function GetSingleCustomer(): JSX.Element {

    const [global_customerID, setCustomerId] = useState(Number);
    const [customer, setCustomer] = useState(undefined);
    const [isEdit, setIsEdit] = useState(false);

    const history = useHistory();

    function handleChange(event: any) {
        setCustomerId(event.target.value);
        setCustomer(undefined);
        setIsEdit(false);
    }

    function handleGetSubmit() {
        setIsEdit(false);
        getCustomerByID(global_customerID);
    }

    function handleEditSubmit() {
        setIsEdit(true);
        getCustomerByID(global_customerID);
    }

    function afterEdit() {
        setCustomer(undefined);
        setIsEdit(false);
    }

    async function getCustomerByID(customerID: number) {
        const url = globals.urls.admin + "get/customer/" + `${customerID}`;
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })
            .then((response) => {
                store.dispatch(loginUserString(response.headers.authorization));
                if (response.data.length === 0) {
                    notify.error("No customer of id: " + `${global_customerID}`);
                    setCustomer(undefined);
                } else {
                    setCustomer(response.data);
                }
            })
            .catch(error => {
                notify.error(error.response.data.description);
                noTokenPushToLogin(error.response.data.description, history);
            })
    }

    return (
        <div>
            <div className="GetSingleCustomer smallBox customerDiv">

                <h3>Get customer by ID from the system</h3>
                <hr />
                <TextField label="Enter customer id" variant="outlined" size="small" onChange={handleChange} />
                <br />
                <br />
                <ButtonGroup variant="contained" fullWidth>
                    <Button style={{ borderRadius: 5, backgroundColor: "#21b6ae", padding: "12px 12px" }} onClick={handleEditSubmit}>Edit Customer</Button>
                    <Button variant="contained" type="submit" style={{ borderRadius: 5 }} color="primary" onClick={handleGetSubmit} >Get Customer</Button>
                </ButtonGroup>

            </div>

            <div>
                {(() => {
                    if (customer != undefined && !isEdit) {
                        return (
                            <div>
                                <CustomerCard id={customer.id} firstName={customer.firstName} lastName={customer.lastName} email={customer.email} />
                                <br />
                                <CouponList coupons={customer.coupons} clientType={"CUSTOMER"} />
                            </div>
                        );
                    }
                    else if (customer != undefined && isEdit) {
                        return <EditCustomer afterEditfunc={afterEdit} id={customer.id} firstName={customer.firstName} lastName={customer.lastName} password={customer.password} email={customer.email} />;
                    }
                })()}
            </div>
        </div>
    );
}

export default GetSingleCustomer;
