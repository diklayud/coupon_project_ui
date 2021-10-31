import axios from "axios";
import { useEffect, useState } from "react";
import CompanyModel from "../../model/CompanyModel";
import CustomerModel from "../../model/CustomerModel";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import globals from "../../utils/Globals";
import AddCompany from "../addCompany/addCompany";
import AddCustomer from "../addCustomer/addCustomer";
import CompanyList from "../CompanyList/CompanyList";
import CustomerList from "../CustomerList/CustomerList";
import DeleteCompany from "../deleteCompany/deleteCompany";
import DeleteCustomer from "../deleteCustomer/deleteCustomer";
import GetSingleCompany from "../GetSingleCompany/GetSingleCompany";
import GetSingleCustomer from "../GetSingleCustomer/GetSingleCustomer";
import "./adminScreen.css";

function AdminScreen(): JSX.Element {

    const [screen, setScreen] = useState("allCompanies");
    const [companies, setCompanies] = useState(new Array<CompanyModel>());
    const [customers, setCustomers] = useState(new Array<CustomerModel>());

    function changeScreen(screenName: string) {
        setScreen(screenName);
    }

    async function getAllCustomers() {
        const url = globals.urls.admin + "get/customer/all";
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })

        store.dispatch(loginUserString(response.headers.authorization));
        setCustomers(response.data);
    }

    async function getAllCompanies() {
        const url = globals.urls.admin + "get/company/all";
        //change the state of the function
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, {}, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })

        store.dispatch(loginUserString(response.headers.authorization));
        setCompanies(response.data);
    }

    useEffect(() => {
        getAllCompanies();
        getAllCustomers();
    }, [screen]);

    return (
        <div className="adminScreen">
            Welcome admin page

            <br />
            <input type="button" value="all companies" onClick={() => changeScreen("allCompanies")} />
            <input type="button" value="get / edit one company" onClick={() => changeScreen("oneCompany")} />
            <input type="button" value="add company" onClick={() => changeScreen("addCompany")} />
            <input type="button" value="delete company" onClick={() => changeScreen("deleteCompany")} />

            <br /><br />

            <input type="button" value="all customers" onClick={() => changeScreen("allCustomers")} />
            <input type="button" value="get / edit one customer" onClick={() => changeScreen("oneCustomer")} />
            <input type="button" value="add customer" onClick={() => changeScreen("addCustomer")} />
            <input type="button" value="delete customer" onClick={() => changeScreen("deleteCustomer")} />

            {(() => {
                if (screen === "allCompanies") {
                    return <CompanyList companies={companies} />;
                } else if (screen === "oneCompany") {
                    return <GetSingleCompany clientType={"ADMINISTRATOR"} />;
                } else if (screen === "addCompany") {
                    return <AddCompany />;
                } else if (screen === "deleteCompany") {
                    return <DeleteCompany />;
                } else if (screen === "allCustomers") {
                    return <CustomerList customers={customers} />;
                } else if (screen === "oneCustomer") {
                    return <GetSingleCustomer />;
                } else if (screen === "addCustomer") {
                    return <AddCustomer />;
                } else {
                    return <DeleteCustomer />;
                }
            })()}

        </div>
    );

}

export default AdminScreen;
