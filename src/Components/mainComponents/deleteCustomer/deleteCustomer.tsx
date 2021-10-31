import { TextField, ButtonGroup, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import "./deleteCustomer.css";

function DeleteCustomer(): JSX.Element {

    const [open, setOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(Number);

    const history = useHistory();

    function handleChange(event: any) {
        setCustomerToDelete(event.target.value);
    }
    const handleClickOpenClose = () => {
        setOpen(open == false ? true : false);
    };


    async function send() {
        const url = globals.urls.admin + "delete/customer/" + `${customerToDelete}`;
        const token = store.getState().authState.loginUser.token;
        let response = await axios.delete(url, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })
            .then((response) => {
                handleClickOpenClose();
                console.log(`CLAPS!!!!! CUSTOMER ${customerToDelete} DELETED`);
                setCustomerToDelete(0);
                store.dispatch(loginUserString(response.headers.authorization));
                notify.success("CUSTOMER DELETED SUCCESSFULLY!!!");
            })
            .catch(error => {
                handleClickOpenClose();
                notify.error(error.response.data.description);
                noTokenPushToLogin(error.response.data.description, history);
            })
    }

    return (
        <div className="customerDiv smallBox">
            <h3>Delete customer from the system</h3>
            <hr />

            <TextField label="Customer ID" variant="outlined" size="small" value={customerToDelete || ''} onChange={handleChange}
                required />
            <br />
            <br />
            <ButtonGroup variant="contained" fullWidth>
                <Button type="submit" color="secondary" onClick={handleClickOpenClose} disabled={customerToDelete == 0}>Delete Customer</Button>
            </ButtonGroup>
            <Dialog
                open={open}
                onClose={handleClickOpenClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete this Customer?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a customer is not returnable, after you will delete the
                        customer it will be lost forever.
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

export default DeleteCustomer;
