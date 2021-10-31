import { Button, ButtonGroup, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { AccountBox } from "@material-ui/icons"
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import UserDetails, { CouponClientType } from "../../model/userDetails";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import notify from "../../utils/Notify";
import "./loginPage.css";
import { getUrlByClientType } from "../../utils/common";

function LoginPage(): JSX.Element {

    const { register, handleSubmit, setError, formState: { errors } } = useForm<UserDetails>();

    const history = useHistory();

    function getPageByClientType(clientType: CouponClientType) {
        if (clientType === "ADMINISTRATOR") {
            return "admin";
        }
        if (clientType === "COMPANY") {
            return "company";
        }
        if (clientType === "CUSTOMER") {
            return "customer";
        }
        return "/";
    }

    //once the user press submit button , this method will be run
    function send(userDetails: UserDetails) {
        //using axios data for getting JWT token from the system....
        const url = getUrlByClientType(userDetails.clientType) + "login";
        axios.post<string>(url, userDetails) //"http://localhost:8080/demo/login"
            //after we will send the REST POST command, we will wait for the response
            .then((response) => {
                store.dispatch(loginUserString(response.data));
                notify.success('You have been successfully login!');
                history.push('/' + getPageByClientType(userDetails.clientType));
            })
            // catch any error that we gat, we can know which error by response code:
            //2XX - OK , 4XX - error in client side, 5XX - error in server side      
            .catch(error => {
                // notify to indicate that we have an error
                notify.error(error.response.data.description);
            });
    }

    return (
        <div className="Box loginPage" >
            <form onSubmit={handleSubmit(send)}>
                <Typography variant="h4" className="HeadLine">Login Form</Typography><br />
                <AccountBox style={{ fontSize: 40, margin: 10 }} />
                <TextField label="user" variant="outlined" type="email"
                    {...register("email", {
                        required: {
                            value: true,
                            message: "field is required"
                        }, minLength: { value: 5, message: "minimum length must be 5" },
                    })} />
                <span> {errors.email && <p>{errors.email.message}</p>} </span>
                <br />
                <LockOpenIcon style={{ fontSize: 40, margin: 10 }} />

                <TextField label="password" variant="outlined" type="password" {...register("password", {
                    required:
                        { value: true, message: "field is required" }, minLength: {
                            value: 3,
                            message: "minimum length must be 3"
                        }, maxLength: { value: 20, message: "maximum length is 20" }
                })} />
                <span> {errors.password && <p>{errors.password.message}</p>} </span>
                <br />
                <AccessibilityNewIcon style={{ fontSize: 40, margin: 10 }} />
                <Select style={{ width: 200 }} {...register("clientType", {
                    required: {
                        value: true,
                        message: "field is required"
                    }
                })}>
                    <MenuItem value={"ADMINISTRATOR"}>Administrator</MenuItem>
                    <MenuItem value={"COMPANY"}>Company</MenuItem>
                    <MenuItem value={"CUSTOMER"}>Customer</MenuItem>
                </Select>
                <span> {errors.clientType && <p>{errors.clientType.message}</p>} </span>
                <br /><br />

                <ButtonGroup variant="contained" fullWidth style={{ margin: 10 }}>
                    <Button type="submit" color="primary">Login</Button>
                </ButtonGroup>
                <br />

            </form>
        </div>
    );
}

export default LoginPage;