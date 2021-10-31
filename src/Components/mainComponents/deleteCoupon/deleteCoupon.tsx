import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import "./deleteCoupon.css";

function DeleteCoupon(): JSX.Element {

    const [open, setOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState(Number);

    const history = useHistory();

    function handleChange(event: any) {
        setCouponToDelete(event.target.value);
    }

    const handleClickOpenClose = () => {
        setOpen(open == false ? true : false);
    };


    async function send() {

        const url = globals.urls.company + "delete/coupon/" + `${couponToDelete}`;
        const token = store.getState().authState.loginUser.token;
        let response = await axios.delete(url, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })
            .then((response) => {
                handleClickOpenClose();
                console.log(`CLAPS!!!!! COUPON ${couponToDelete} DELETED`);
                setCouponToDelete(0);
                store.dispatch(loginUserString(response.headers.authorization));
                notify.success("COUPON DELETED SUCCESSFULLY!!!");
            })
            .catch(error => {
                handleClickOpenClose();
                notify.error(error.response.data.description);
                noTokenPushToLogin(error.response.data.description, history);
            })
    }

    return (
        <div className="deleteCoupon smallBox">
            <h3>Delete coupon from the system</h3>
            <hr />
            <TextField label="Coupon ID" variant="outlined" size="small" value={couponToDelete || ''} onChange={handleChange}
                required />
            <br />
            <br />
            <ButtonGroup variant="contained" fullWidth>
                <Button type="submit" color="secondary" onClick={handleClickOpenClose} disabled={couponToDelete == 0} >Delete Coupon</Button>
            </ButtonGroup>
            <Dialog
                open={open}
                onClose={handleClickOpenClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete this Coupon?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a coupon is not returnable, after you will delete the
                        coupon it will be lost forever.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickOpenClose}>CANCEL</Button>
                    <Button onClick={send} autoFocus>
                        CONTINUE
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeleteCoupon;
