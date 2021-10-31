import { Button, ButtonGroup, TextField } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { CouponClientType } from "../../model/userDetails";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import CompanyCard from "../CompanyCard/CompanyCard";
import CouponList from "../couponList/couponList";
import EditCompany from "../editCompany/editCompany";
import "./GetSingleCompany.css";


interface CompanyListProps {
    clientType?: CouponClientType;
}

function GetSingleCompany(props: CompanyListProps): JSX.Element {

    const [global_companyID, setCompanyId] = useState(Number);
    const [company, setCompany] = useState(undefined);
    const [isEdit, setIsEdit] = useState(false);

    const history = useHistory();

    function handleChange(event: any) {
        setCompanyId(event.target.value);
        setCompany(undefined);
        setIsEdit(false);
    }

    function afterEdit() {
        setCompany(undefined);
        setIsEdit(false);
    }

    function handleGetSubmit() {
        setIsEdit(false);
        getCompanyByID(global_companyID);
    }

    function handleEditSubmit() {
        setIsEdit(true);
        getCompanyByID(global_companyID);
    }

    async function getCompanyByID(companyID: number) {
        const url = globals.urls.admin + "get/company/" + `${companyID}`;
        const token = store.getState().authState.loginUser.token;
        axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        }).then((response) => {
            store.dispatch(loginUserString(response.headers.authorization));
            if (response.data.length === 0) {
                notify.error("No company of id: " + `${global_companyID}`);
                setCompany(undefined);
            } else {
                setCompany(response.data);
            }
        })
        .catch(error => {
            notify.error(error.response.data.description);
            noTokenPushToLogin(error.response.data.description, history);
        })
    }

    return (
        <div>
            <div className="GetSingleCompany smallBox companyDiv">
                <h3>Get company by ID from the system</h3>
                <hr />
                <TextField label="Enter company id" variant="outlined" size="small" onChange={handleChange} />
                <br />
                <br />
                <ButtonGroup variant="contained" fullWidth>
                    <Button style={{ borderRadius: 5, backgroundColor: "#21b6ae", padding: "12px 12px" }} onClick={handleEditSubmit}>Edit Company</Button>
                    <Button variant="contained" type="submit" style={{ borderRadius: 5 }} color="primary" onClick={handleGetSubmit} >Get Company</Button>
                </ButtonGroup>

            </div>

            <div>
                {(() => {
                    if (company != undefined && !isEdit) {
                        return (
                            <div>
                                <CompanyCard id={company.id} name={company.name} email={company.email} />
                                <br />
                                <CouponList clientType={props.clientType} coupons={company.coupons} />
                            </div>
                        );
                    }
                    else if (company != undefined && isEdit) {
                        return <EditCompany afterEditfunc={afterEdit} id={company.id} name={company.name} password={company.password} email={company.email} />;
                    }
                })()}
            </div>
        </div>
    );
}

export default GetSingleCompany;
