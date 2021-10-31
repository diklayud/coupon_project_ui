import { Button, ButtonGroup, createStyles, makeStyles, MenuItem, Select, TextField, Theme } from "@material-ui/core";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CouponModel from "../../model/CouponModel";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import "./addCoupon.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 250,
        },
    }),
);

interface AddCouponProps {
    onClose: (arg1: string) => void;
}

function AddCoupon(props: AddCouponProps): JSX.Element {

    const classes = useStyles();
    const { register, handleSubmit, setError, formState: { errors } } = useForm<CouponModel>();

    const history = useHistory();

    async function send(couponDetails: CouponModel) {
        const now = new Date();
        couponDetails.startDate = now;
        couponDetails.company_id_ui = store.getState().authState.loginUser.userId;

        const url = globals.urls.company + "add/coupon";
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, couponDetails, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })
            .then((response) => {
                console.log("CLAPS!!!!! COUPON ADDED");

                store.dispatch(loginUserString(response.headers.authorization));
                notify.success("COUPON ADDED SUCCESSFULLY");
                props.onClose("allCoupons");
            })
            .catch(error => {
                notify.error(error.response.data.description);
                noTokenPushToLogin(error.response.data.description, history);
            })
    }

    return (
        <div className="addCoupon smallBox">
            <h3>Add new coupon to the system</h3>
            <hr />
            <form onSubmit={handleSubmit(send)}>
                <TextField label="Coupon title" variant="outlined" size="small"
                    {...register("title",
                        {
                            required: { value: true, message: "this field is required" },
                            minLength: { value: 1, message: "minimum length is 1" },
                            maxLength: { value: 20, message: "maximum length is 20" }
                        })} />
                <br />
                <span> {errors.title && <p>{errors.title.message}</p>}</span>
                <br />
                <TextField label="Coupon Description" variant="outlined" size="small"
                    {...register("description",
                        {
                            maxLength: { value: 250, message: "max length is 250" }
                        })} />
                <br />
                <span> {errors.description && <p>{errors.description.message}</p>}</span>
                <br />
                <TextField type="number" label="Coupon price" variant="outlined" size="small"
                    {...register("price", {
                        required: { value: true, message: "this field is required" },
                        min: { value: 1, message: "minimum price is 1 NIS" },
                    })} />
                <br />
                <span> {errors.price && <p>{errors.price.message}</p>}</span>
                <br />
                <TextField type="number" label="Coupon QTY" variant="outlined" size="small"
                    {...register("amount", {
                        required: { value: true, message: "this field is required" },
                        min: { value: 1, message: "minimum QTY is 1 Piece" },
                    })} />
                <br />
                <span> {errors.amount && <p>{errors.amount.message}</p>}</span>
                <br />
                Coupon category<br />
                <Select style={{ width: 250 }} {...register("category", {
                    required: { value: true, message: "this field is required" }
                })}>
                    <MenuItem value={"FOOD"}>FOOD</MenuItem>
                    <MenuItem value={"ELECTRICITY"}>ELECTRICITY</MenuItem>
                    <MenuItem value={"RESTAURANT"}>RESTAURANT</MenuItem>
                    <MenuItem value={"VACATION"}>VACATION</MenuItem>
                    <MenuItem value={"FASHION"}>FASHION</MenuItem>
                </Select>
                <br />
                <span> {errors.category && <p>{errors.category.message}</p>}</span>
                <br />
                <TextField
                    {...register("endDate")}
                    id="datetime-local"
                    label="Coupon Expiration date"
                    type="date"
                    defaultValue={new Date().toISOString().substring(0, 10)}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        min: new Date().toISOString().slice(0, 16),
                    }}
                    size="small"
                />
                <br /><br />
                <TextField label="Coupon image" variant="outlined" size="small"
                    {...register("image")} />
                <br />
                <br />
                <ButtonGroup variant="contained" fullWidth>
                    <Button type="submit" color="primary">Add Coupon</Button>
                </ButtonGroup>
            </form>

        </div>
    );
}

export default AddCoupon;

