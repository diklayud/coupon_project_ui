import { Button, ButtonGroup, createStyles, IconButton, makeStyles, MenuItem, Select, TextField, Theme } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import CouponModel from "../../model/CouponModel";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import "./editCoupon.css";

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

interface EditCouponProps {
    closeEditScreen: any;
    couponToEdit: CouponModel;
}

function EditCoupon(props: EditCouponProps): JSX.Element {

    const classes = useStyles();
    const { register, handleSubmit, setError, formState: { errors } } = useForm<CouponModel>();

    const history = useHistory();

    async function send(couponDetails: CouponModel) {

        couponDetails.id = props.couponToEdit.id;
        couponDetails.company_id_ui = store.getState().authState.loginUser.userId;

        const url = globals.urls.company + "update/coupon";
        // get JWT and send the company with JWT
        const token = store.getState().authState.loginUser.token;
        let response = await axios.post(url, couponDetails, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })
        .then((response) => {
            console.log("CLAPS!!!!! COUPON EDITED");
            store.dispatch(loginUserString(response.headers.authorization));
            notify.success("COUPON EDITED!!!");
        })
        .catch(error => {
            notify.error(error.response.data.description);
            noTokenPushToLogin(error.response.data.description, history);
        })
    }

    return (
        <div className="editCoupon smallBox">
            <IconButton onClick={props.closeEditScreen}>
                <CloseIcon />
            </IconButton>
            <h3>Edit coupon</h3><hr />
            <form onSubmit={handleSubmit(send)}>

                <TextField label="Coupon ID" variant="outlined"
                    defaultValue={props.couponToEdit.id}
                    disabled
                    size="small"
                    {...register("id")} />

                <br />
                <span> {errors.id && <p>{errors.id.message}</p>}</span>
                <br />
                <TextField label="Coupon New title"
                    defaultValue={props.couponToEdit.title}
                    variant="outlined" size="small"
                    {...register("title", {
                        maxLength: { value: 100, message: "maximum length is 100" }
                    })} />

                <br />
                <span> {errors.title && <p>{errors.title.message}</p>}</span>
                <br />
                <TextField label="Coupon New Description" variant="outlined"
                    defaultValue={props.couponToEdit.description}
                    size="small" {...register("description", {
                        maxLength: { value: 250, message: "maximum length is 250" }
                    })} />
                <br />
                <span> {errors.description && <p>{errors.description.message}</p>}</span>
                <br />
                <TextField type="number" label="Coupon New price"
                    defaultValue={props.couponToEdit.price}
                    variant="outlined" size="small" {...register("price", {
                        min: { value: 1, message: "minimum price is 1 NIS" },
                    })} />
                <br />
                <span> {errors.price && <p>{errors.price.message}</p>}</span>
                <br />
                <TextField type="number" label="Coupon New QTY"
                    defaultValue={props.couponToEdit.amount}
                    variant="outlined" size="small" {...register("amount", {
                        min: { value: 1, message: "minimum QTY is 1 Piece" },
                    })} />
                <br />
                <span> {errors.amount && <p>{errors.amount.message}</p>}</span>
                <br />
                Coupon category<br />
                <Select defaultValue={props.couponToEdit.category}

                    style={{ width: 250 }} {...register("category",
                    )}>
                    <MenuItem value={"FOOD"}>FOOD</MenuItem>
                    <MenuItem value={"ELECTRICITY"}>ELECTRICITY</MenuItem>
                    <MenuItem value={"RESTAURANT"}>RESTAURANT</MenuItem>
                    <MenuItem value={"VACATION"}>VACATION</MenuItem>
                    <MenuItem value={"FASHION"}>FASHION</MenuItem>
                </Select>
                <br />
                <span> {errors.category && <p>{errors.category.message}</p>}</span>
                <br /><br />
                <TextField label="Coupon New image" variant="outlined" size="small"
                    {...register("image")} />
                <br />
                <br />
                <TextField
                    {...register("endDate")}
                    id="datetime-local"
                    label="Coupon New Expiration date"
                    type="date"
                    defaultValue={props.couponToEdit.endDate}
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
                <ButtonGroup variant="contained" fullWidth>
                    <Button type="submit" color="primary">Edit Coupon</Button>
                </ButtonGroup>
            </form>

        </div>
    );
}

export default EditCoupon;
